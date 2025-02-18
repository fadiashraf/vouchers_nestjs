import { RedeemVoucherDto } from './dto/redeemVoucher.dto';
import { CustomerService } from './../customer/customer.service';
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOptionsWhere,
  IsNull,
  MoreThan,
  Repository,
} from 'typeorm';
import { customAlphabet } from 'nanoid';
import { Voucher } from './voucher.entity';
import { SpecialOffersService } from 'src/special-offers/special-offers.service';

const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
const CHUNK_SIZE = 100;

@Injectable()
export class VouchersService {
  private readonly logger = new Logger(VouchersService.name);

  constructor(
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
    private customerService: CustomerService,
    private specialOfferService: SpecialOffersService,
    private dataSource: DataSource,
  ) {}

  async getCustomerVouchers(email: string) {
    const customer = await this.customerService.getCustomerByEmail(email);

    const vouchers = this.voucherRepository.find({
      where: {
        customer: customer!,
        usedAt: IsNull(),
        expirationDate: MoreThan(new Date()),
      },
      relations: ['specialOffer'],
      select: {
        code: true,
        expirationDate: true,
        usedAt: true,
        specialOffer: {
          name: true,
          discountPercentage: true,
        },
      },
    });

    return vouchers;
  }

  async generateVouchers({
    offerId,
    expirationDate,
  }: {
    offerId: number;
    expirationDate: Date;
  }): Promise<{ total: number; success: number; errors: string[] }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const specialOffer =
        await this.specialOfferService.getSpecialOfferById(offerId);
      if (!specialOffer) {
        throw new NotFoundException('Special offer not found');
      }

      const totalCustomers = await this.customerService.countCustomers();
      let processed = 0;
      const errors: string[] = [];

      for (let offset = 0; offset < totalCustomers; offset += CHUNK_SIZE) {
        const chunkCustomers = await this.customerService.getCustomers({
          offset,
          limit: CHUNK_SIZE,
        });

        await queryRunner.startTransaction();

        try {
          const vouchers = chunkCustomers.map((customer) => ({
            code: nanoid(),
            customer,
            specialOffer,
            expirationDate,
          }));

          await queryRunner.manager.save(Voucher, vouchers);
          await queryRunner.commitTransaction();
          processed += chunkCustomers.length;
        } catch (chunkError) {
          await queryRunner.rollbackTransaction();
          const errorMessage = `Chunk ${offset}-${offset + CHUNK_SIZE} failed: ${
            (chunkError as Error)?.message || ''
          }`;
          errors.push(errorMessage);
          this.logger.error(errorMessage, (chunkError as Error)?.stack);
        }
      }

      return {
        total: totalCustomers,
        success: processed,
        errors,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async redeemVoucher(redeemVoucherDto: RedeemVoucherDto) {
    const customer = await this.customerService.getCustomerByEmail(
      redeemVoucherDto.email,
    );
    const voucher = await this.getOneVoucherBy({
      code: redeemVoucherDto.code,
      customer: customer!,
      usedAt: IsNull(),
    });
    await this.markVoucherAsUsed(voucher!);
    return { message: 'Voucher redeemed successfully' };
  }

  private async markVoucherAsUsed(voucher: Voucher) {
    await this.voucherRepository.update(
      { code: voucher.code },
      { usedAt: new Date() },
    );
  }

  async getOneVoucherBy(filter: FindOptionsWhere<Voucher>) {
    const voucher = await this.voucherRepository.findOne({
      where: filter,
    });

    if (!voucher) {
      throw new BadRequestException('Invalid or already used voucher code.');
    }
  }
}

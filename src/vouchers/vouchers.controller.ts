import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GenerateVouchersDto } from './dto/generateVouchers.dto';
import { VouchersService } from './vouchers.service';
import { RedeemVoucherDto } from './dto/redeemVoucher.dto';
import { GetVouchersDto } from './dto/getVouchers.dto';

@Controller('vouchers')
export class VouchersController {
  constructor(private vouchersService: VouchersService) {}

  @Get()
  async getCustomerVouchers(@Query() getVouchersDto: GetVouchersDto) {
    const vouchers = await this.vouchersService.getCustomerVouchers(
      getVouchersDto.email,
    );
    return vouchers;
  }

  @Post()
  generateVoucher(@Body() generateVouchersDto: GenerateVouchersDto) {
    void this.vouchersService.generateVouchers(generateVouchersDto);
    return 'vouchers are creating';
  }

  @Post('/redeem')
  async redeemVoucher(@Body() redeemVoucherDto: RedeemVoucherDto) {
    const res = await this.vouchersService.redeemVoucher(redeemVoucherDto);
    return res;
  }
}

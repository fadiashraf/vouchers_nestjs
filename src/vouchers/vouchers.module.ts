import { Module } from '@nestjs/common';

import { VouchersService } from './vouchers.service';
import { VouchersController } from './vouchers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from './voucher.entity';
import { SpecialOffersModule } from 'src/special-offers/special-offers.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  providers: [VouchersService],
  controllers: [VouchersController],
  imports: [
    TypeOrmModule.forFeature([Voucher]),
    SpecialOffersModule,
    CustomerModule,
  ],
})
export class VouchersModule {}

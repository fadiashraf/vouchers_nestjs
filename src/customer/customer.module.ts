import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CustomerController],
  providers: [Customer, CustomerService],
  imports: [TypeOrmModule.forFeature([Customer])],
  exports: [CustomerService],
})
export class CustomerModule {}

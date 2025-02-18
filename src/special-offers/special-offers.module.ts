import { Module } from '@nestjs/common';
import { SpecialOffersService } from './special-offers.service';
import { SpecialOffersController } from './special-offers.controller';
import { SpecialOffer } from './special-offers.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [SpecialOffersService, SpecialOffer],
  controllers: [SpecialOffersController],
  imports: [TypeOrmModule.forFeature([SpecialOffer])],
  exports: [SpecialOffersService],
})
export class SpecialOffersModule {}

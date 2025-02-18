import { Injectable } from '@nestjs/common';
import { CreateSpecialOfferDto } from './dto/createSpecialOffer.dto';
import { SpecialOffer } from './special-offers.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SpecialOffersService {
  constructor(
    @InjectRepository(SpecialOffer)
    private readonly specialOfferRepository: Repository<SpecialOffer>,
  ) {}

  createSpecialOffer(specialOffer: CreateSpecialOfferDto) {
    return this.specialOfferRepository.save(
      this.specialOfferRepository.create(specialOffer),
    );
  }

  getSpecialOfferById(offerId: number) {
    return this.specialOfferRepository.findOneBy({
      id: offerId,
    });
  }
}

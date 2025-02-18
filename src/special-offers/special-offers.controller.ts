import { SpecialOffersService } from './special-offers.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateSpecialOfferDto } from './dto/createSpecialOffer.dto';

@Controller('special-offers')
export class SpecialOffersController {
  constructor(private readonly specialOffersService: SpecialOffersService) {}

  @Post()
  create(@Body() createSpecialOfferDto: CreateSpecialOfferDto) {
    const offer = this.specialOffersService.createSpecialOffer(
      createSpecialOfferDto,
    );
    return offer;
  }
}

import {
  IsString,
  IsNotEmpty,
  Length,
  Min,
  Max,
  IsNumber,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpecialOfferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Transform((params: TransformFnParams) => {
    const value = params.value as string;
    return value.trim();
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number;
}

import {
  IsString,
  IsNotEmpty,
  Length,
  Min,
  Max,
  IsNumber,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateSpecialOfferDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Transform((params: TransformFnParams) => {
    const value = params.value as string;
    return value.trim();
  })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number;
}

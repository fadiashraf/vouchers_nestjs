import { Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class GenerateVouchersDto {
  @IsNotEmpty()
  @IsNumber()
  offerId: number;

  @Transform((params: TransformFnParams) => {
    const value = params.value as string;
    return new Date(value);
  })
  @IsDate()
  @IsNotEmpty()
  expirationDate: Date;
}

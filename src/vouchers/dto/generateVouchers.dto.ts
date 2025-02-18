import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class GenerateVouchersDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  offerId: number;

  @ApiProperty()
  @Transform((params: TransformFnParams) => {
    const value = params.value as string;
    return new Date(value);
  })
  @IsDate()
  @IsNotEmpty()
  expirationDate: Date;
}

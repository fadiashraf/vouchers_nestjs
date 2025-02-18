import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class GetVouchersDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => {
    const value = params.value as string;
    return value.toLowerCase().trim();
  })
  email: string;
}

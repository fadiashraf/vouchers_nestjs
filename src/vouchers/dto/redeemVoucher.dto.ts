import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RedeemVoucherDto {
  @IsNotEmpty()
  @IsString()
  @Length(8, 8)
  code: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => {
    const value = params.value as string;
    return value.toLowerCase().trim();
  })
  email: string;
}

import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class GetVouchersDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => {
    const value = params.value as string;
    return value.toLowerCase().trim();
  })
  email: string;
}

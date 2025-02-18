import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[a-zA-Z ]*$/, {
    message: 'Name must contain only letters and spaces',
  })
  @Transform((params: TransformFnParams) => {
    const value = params.value as string;
    return value.trim();
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => {
    const value = params.value as string;
    return value.toLowerCase().trim();
  })
  email: string;
}

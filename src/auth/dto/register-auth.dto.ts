import { PartialType } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
 /*  @IsEmail()
  email: string; */

  @MinLength(3)
  @MaxLength(20)
  name: string;

 /*  @MinLength(6)
  @MaxLength(20)
  password: string; */
}

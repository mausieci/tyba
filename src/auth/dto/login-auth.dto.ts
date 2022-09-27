import { IsEmail, MinLength, MaxLength } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  @MaxLength(20)
  password: string;
}

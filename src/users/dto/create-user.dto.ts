import { IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(3)
  @MaxLength(20)
  name: string;

  @MinLength(6)
  @MaxLength(20)
  password: string;
}

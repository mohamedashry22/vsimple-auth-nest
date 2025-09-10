import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/[A-Za-z]/, { message: 'password must contain a letter' })
  @Matches(/[0-9]/, { message: 'password must contain a number' })
  @Matches(/[^A-Za-z0-9]/, { message: 'password must contain a special character' })
  password!: string;
}
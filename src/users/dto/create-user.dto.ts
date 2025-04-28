import { IsEmail, IsNotEmpty, MinLength, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  senha: string;

  @IsBoolean()
  acceptTerms: boolean;

  id?: number;
  
}

import { IsString, IsEmail, IsNotEmpty, IsBoolean, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'Nome não pode ser maior que 100 caracteres' })
  @IsOptional()  // O nome pode ser opcional no caso de login
  nome?: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  senha: string;

  @IsBoolean({ message: 'Termos de uso deve ser aceito' })
  @IsOptional()  // O campo de aceitação de termos é opcional no login
  acceptTerms?: boolean;
}

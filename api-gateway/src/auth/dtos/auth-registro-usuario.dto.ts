import { IsString, IsEmail, Matches, IsMobilePhone } from 'class-validator';

export class AuthRegistroUsuarioDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;
  /*
    - Minimo 8 caracteres
    - una letra maiuscula
    - una letra minuscula
    - un numero
  */
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'password inválido',
  })
  password: string;

  @IsMobilePhone('pt-BR')
  celular: string;
}

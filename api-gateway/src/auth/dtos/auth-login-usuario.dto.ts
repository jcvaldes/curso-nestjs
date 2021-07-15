import { IsEmail, Matches } from 'class-validator';

export class AuthLoginUsuarioDto {
  @IsEmail()
  email: string;

  /*
        - Minimo 8 caracteres
        - una letra mayuscula
        - una letra minuscula
        - un numero
    */
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'password inválida',
  })
  password: string;
}

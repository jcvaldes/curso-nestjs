import { IsEmail, IsNotEmpty } from "class-validator";

export class CrearJugadorDto {
  @IsNotEmpty()
  readonly celular: string;

  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly nombre: string;
}

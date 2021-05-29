import { IsEmail, IsNotEmpty } from "class-validator";

export class ActualizarJugadorDto {
  @IsNotEmpty()
  readonly celular: string;
  @IsNotEmpty()
  readonly nombre: string;
}

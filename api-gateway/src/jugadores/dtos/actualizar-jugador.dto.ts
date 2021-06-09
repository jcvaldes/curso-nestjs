import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class ActualizarJugadorDto {
  /*
  @IsNotEmpty()
  readonly celular: string;
  @IsNotEmpty()
  readonly nombre: string;
  */
  @IsOptional()
  categoria?: string;
  @IsOptional()
  urlFotoJugador?: string;
}

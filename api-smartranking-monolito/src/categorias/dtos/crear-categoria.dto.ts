import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Evento } from "../interfaces/categoria.interface";

export class CrearCategoriaDto {
  @IsString()
  @IsNotEmpty()
  readonly categoria: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsArray()
  @ArrayMinSize(1)
  eventos: Evento[];
}

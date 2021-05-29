import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Evento } from "../interfaces/categoria.interface";

export class ActualizarCategoriaDto {
  @IsString()
  @IsOptional()
  descripcion: string;

  @IsArray()
  @ArrayMinSize(1)
  eventos: Evento[]
}

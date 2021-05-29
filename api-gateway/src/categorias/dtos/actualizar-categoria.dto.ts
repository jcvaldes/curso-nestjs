import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ActualizarCategoriaDto {
  @IsString()
  @IsOptional()
  descripcion: string;

  @IsArray()
  @ArrayMinSize(1)
  eventos: Evento[]
}
export interface Evento {
  nombre: string;
  operacion: string;
  valor: number
}
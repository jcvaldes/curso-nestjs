import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

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
export interface Evento {
  nombre: string;
  operacion: string;
  valor: number
}
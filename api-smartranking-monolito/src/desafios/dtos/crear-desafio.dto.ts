import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsEmail, IsNotEmpty } from "class-validator";
import { Jugador } from "src/jugadores/interfaces/jugador.interface";

export class CrearDesafioDto {
  @IsNotEmpty()
  @IsDateString()
  dataHoraDesafio: Date;

  @IsNotEmpty()
  solicitante: String;
  
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  jugadores: Array<Jugador>;
}

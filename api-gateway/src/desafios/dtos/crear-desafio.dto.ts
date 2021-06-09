import {
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsDateString,
} from 'class-validator';
import { Jugador } from 'src/jugadores/interfaces/jugador.interface';

export class CrearDesafioDto {
  @IsNotEmpty()
  @IsDateString()
  dataHoraDesafio: Date;

  @IsNotEmpty()
  solicitante: string;

  @IsNotEmpty()
  categoria: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  jugadores: Jugador[];
}

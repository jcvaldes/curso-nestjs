import { IsNotEmpty } from 'class-validator';
import { Jugador } from 'src/jugadores/interfaces/jugador.interface';
import { Resultado } from '../interfaces/desafio.interface';

export class AtribuirDesafioPartidaDto {
  @IsNotEmpty()
  def: Jugador;

  @IsNotEmpty()
  resultado: Array<Resultado>;
}

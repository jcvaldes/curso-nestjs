import { Jugador } from 'src/jugadores/interfaces/jugador.interface';

export interface Partida {
  categoria?: string;
  desafio?: string;
  jugadores?: Jugador[];
  def?: Jugador;
  resultado?: Resultado[];
}

export interface Resultado {
  set: string;
}

import { Jugador } from 'src/jugadores/interfaces/jugador.interface';
import { DesafioStatus } from '../desafio-status.enum';

export interface Desafio {
  dataHoraDesafio: Date;
  status: DesafioStatus;
  dataHoraSolicitacao: Date;
  dataHoraRespuesta: Date;
  solicitante: Jugador;
  categoria: string;
  partida?: string;
  jugadores: Array<Jugador>;
}

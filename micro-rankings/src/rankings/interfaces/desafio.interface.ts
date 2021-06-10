import { DesafioStatus } from '../desafio-status.enum';

export interface Desafio {
  _id: string;
  dataHoraDesafio: Date;
  status: DesafioStatus;
  dataHoraSolicitud: Date;
  dataHoraRespuesta?: Date;
  solicitante: string;
  categoria: string;
  partida?: string;
  jugadores: string[];
}

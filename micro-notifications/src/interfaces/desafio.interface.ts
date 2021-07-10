import { DesafioStatus } from '../desafio-status.enum';

export interface Desafio {
  dataHoraDesafio: Date;
  status: DesafioStatus;
  dataHoraSolicitacao: Date;
  dataHoraRespuesta?: Date;
  solicitante: string;
  categoria: string;
  partida?: string;
  jugadores: string[];
}

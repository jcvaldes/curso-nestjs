export interface RankingResponse {
  jugador?: string;
  posicion?: number;
  puntuacion?: number;
  historicoPartidas?: Historico;
}

export interface Historico {
  victorias?: number;
  derrotas?: number;
}

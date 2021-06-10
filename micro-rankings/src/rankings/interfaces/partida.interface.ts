export interface Partida {
  categoria: string;
  desafio: string;
  jugadores: string[];
  def: string;
  resultado: Array<Resultado>;
}

export interface Resultado {
  set: string;
}

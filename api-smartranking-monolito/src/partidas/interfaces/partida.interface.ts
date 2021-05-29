import { Document } from "mongoose";
import { Resultado } from "src/desafios/interfaces/desafio.interface";
import { Jugador } from "src/jugadores/interfaces/jugador.interface";

export interface Partida extends Document {
  categoria: string
  jugadores: Array<Jugador>
  def: Jugador
  resultado: Array<Resultado>
}

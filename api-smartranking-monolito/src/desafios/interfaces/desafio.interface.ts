import { Document } from "mongoose";
import { Jugador } from "src/jugadores/interfaces/jugador.interface";
import { DesafioStatus } from "./desafio-status.enum";


export interface Desafio extends Document {
  dataHoraDesafio: Date
  status: DesafioStatus
  dataHoraSolicitacion: Date
  dataHoraRespuesta: Date
  solicitante: Jugador
  categoria: string
  jugadores: Array<Jugador>
  partida: Partida
}

export interface Partida extends Document {
  categoria: string
  jugadores: Array<Jugador>
  def: Jugador
  resultado: Array<Resultado>
}

export interface Resultado {
  set: string
}
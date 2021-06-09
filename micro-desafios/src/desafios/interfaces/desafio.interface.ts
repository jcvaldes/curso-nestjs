import { Document } from 'mongoose';
import { DesafioStatus } from '../desafio-status.enum'

export interface Desafio extends Document {

    dataHoraDesafio: Date
    status: DesafioStatus
    dataHoraSolicitud: Date
    dataHoraRespuesta?: Date
    solicitante: string
    categoria: string
    partida?: string
    jugadores: string[]
    
}
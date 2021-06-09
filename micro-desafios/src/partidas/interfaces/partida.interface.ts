import { Document } from 'mongoose';

export interface Partida extends Document{
    categoria: string
    desafio: string
    jugadores: string[]
    def: string
    resultado: Array<Resultado>  
}

export interface Resultado {
    set: string
}
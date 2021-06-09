import { Document } from 'mongoose';
import { Jugador } from '../../jugadores/interfaces/jugador.interface';

export interface Categoria extends Document {
  readonly categoria: string;
  descripcion: string;
  eventos: Evento[];
  jugadores: Jugador[];
}
export interface Evento {
  nombre: string;
  operacion: string;
  valor: number;
}

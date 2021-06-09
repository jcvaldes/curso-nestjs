import { Document } from 'mongoose';
import { Categoria } from 'src/categorias/interfaces/categoria.interface';

export interface Jugador extends Document {
  readonly _id: string;
  readonly celular: string;
  readonly email: string;
  nombre: string;
  ranking: string;
  posicionRanking: number;
  imagen: string;
  categoria: Categoria;
}

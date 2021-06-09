import * as mongoose from 'mongoose';
export const JugadorSchema = new mongoose.Schema(
  {
    celular: { type: String, unique: true },
    email: { type: String },
    nombre: String,
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
    ranking: String,
    posicionRanking: Number,
    imagen: String,
  },
  { timestamps: true, collection: 'jugadores' },
);

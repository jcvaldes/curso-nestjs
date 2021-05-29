import * as mongoose from 'mongoose';
export const CategoriaSchema = new mongoose.Schema(
  {
    categoria: { type: String, unique: true },
    descripcion: { type: String },
    eventos: [
      { 
        nombre: { type: String },
        operacion: { type: String},
        valor: { type: String}
      }
    ],
    jugadores: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Jugador'
    }]
  },
  { timestamps: true, collection: 'categorias' },
);

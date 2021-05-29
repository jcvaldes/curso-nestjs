import * as mongoose from 'mongoose';
export const DesafioSchema = new mongoose.Schema(
  {
    dataHoraDesafio: { type: Date },
    status: { type: String },
    dataHoraSolicitacion: { type: Date },
    dataHoraRespuesta: { type: Date },
    solicitante: { type: mongoose.Schema.Types.ObjectId, ref: 'Jugador' },
    categoria: { type: String },
    jugadores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jugador' }],
    partida: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partida',
    },
  },
  { timestamps: true, collection: 'jugadores' },
);

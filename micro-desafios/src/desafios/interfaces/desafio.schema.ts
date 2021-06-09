import * as mongoose from 'mongoose';

export const DesafioSchema = new mongoose.Schema({
    dataHoraDesafio: { type: Date },
    status: { type: String },
    dataHoraSolicitud: { type: Date },
    dataHoraRespuesta: { type: Date },
    //solicitante: {type: mongoose.Schema.Types.ObjectId, ref: "Jogador"},
    solicitante: {type: mongoose.Schema.Types.ObjectId},
    //categoria: {type: String },
    categoria: {type: mongoose.Schema.Types.ObjectId},
    jugadores: [{
        type: mongoose.Schema.Types.ObjectId,
        //ref: "Jogador"
    }],
    partida: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Partida" 
    },   
}, {timestamps: true, collection: 'desafios' })




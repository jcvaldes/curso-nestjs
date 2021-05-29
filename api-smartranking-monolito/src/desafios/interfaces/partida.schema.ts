import * as mongoose from 'mongoose';

export const PartidaSchema = new mongoose.Schema({
    categoria: {type: String},
    jugadores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jugador"
    }],
    def: { type: mongoose.Schema.Types.ObjectId, ref: "Jugador" },
    resultado: [
        { set: {type: String} }
    ]        
}, {timestamps: true, collection: 'partidas' })

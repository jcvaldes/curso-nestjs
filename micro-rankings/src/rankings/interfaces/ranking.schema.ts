import * as mongoose from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'rankings' })
export class Ranking extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  desafio: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  jugador: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  partida: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  categoria: string;

  @Prop()
  evento: string;

  @Prop()
  operacion: string;

  @Prop()
  puntos: number;
}

export const RankingSchema = SchemaFactory.createForClass(Ranking);

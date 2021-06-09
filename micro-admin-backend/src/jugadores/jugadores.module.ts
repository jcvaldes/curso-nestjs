import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JugadorSchema } from './interfaces/jugador.schema';
import { JugadoresController } from './jugadores.controller';
import { JugadoresService } from './jugadores.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Jugador',
        schema: JugadorSchema,
      },
    ]),
  ],
  providers: [JugadoresService],
  controllers: [JugadoresController],
})
export class JugadoresModule {}

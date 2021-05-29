import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JugadorSchema } from './interfaces/jugador.schema';
import { JugadoresController } from './jugadores.controller';
import { JugadoresService } from './jugadores.service';

@Module({
  imports: [
    // Registro los modelos de mongoose
    MongooseModule.forFeature([
      {
        name: 'Jugador',
        schema: JugadorSchema,
      },
    ]),
  ],
  controllers: [JugadoresController],
  providers: [JugadoresService],
  exports: [
    JugadoresService
  ]
})
export class JugadoresModule {}

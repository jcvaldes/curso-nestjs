import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JugadoresModule } from './jugadores/jugadores.module';
import { CategoriasModule } from './categorias/categorias.module';
import { DesafiosController } from './desafios/desafios.controller';
import { DesafiosModule } from './desafios/desafios.module';
import { RankingsModule } from './rankings/rankings.module';
import { PartidasModule } from './partidas/partidas.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://jcvaldes:swordfish@cluster0.kgn4b.mongodb.net/smarttranking?retryWrites=true&w=majority',
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false}
    ),
    JugadoresModule,
    CategoriasModule,
    DesafiosModule,
    RankingsModule,
    PartidasModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

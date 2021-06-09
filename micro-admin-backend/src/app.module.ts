import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasModule } from './categorias/categorias.module';
import { JugadoresModule } from './jugadores/jugadores.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://jcvaldes:swordfish@cluster0.kgn4b.mongodb.net/sradmbackend?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    CategoriasModule,
    JugadoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

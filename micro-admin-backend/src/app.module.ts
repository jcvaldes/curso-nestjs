import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    ConfigModule.forRoot({ isGlobal: true }),
    CategoriasModule,
    JugadoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriaSchema } from './interfaces/categorias/categoria.schema';
import { JugadorSchema } from './interfaces/jugadores/jugador.schema';


@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://jcvaldes:swordfish@cluster0.kgn4b.mongodb.net/sradmbackend?retryWrites=true&w=majority',
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false}
    ),
    MongooseModule.forFeature([
      {
        name: 'Categoria',
        schema: CategoriaSchema,
      },
      {
        name: 'Jugador',
        schema: JugadorSchema,
      },
    ]),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
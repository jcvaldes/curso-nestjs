import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JugadoresModule } from 'src/jugadores/jugadores.module';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { CategoriaSchema } from './interfaces/categoria.schema';

@Module({
  imports: [
    // Registro los modelos de mongoose
    MongooseModule.forFeature([
      {
        name: 'Categoria',
        schema: CategoriaSchema,
      },
    ]),
    JugadoresModule,
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService]
})
export class CategoriasModule {}

import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from './interfaces/categoria.interface';
import { CrearCategoriaDto } from './dtos/crear-categoria.dto';
import { ActualizarCategoriaDto } from './dtos/actualizar-categoria.dto';
import { JugadoresService } from 'src/jugadores/jugadores.service';

@Injectable()
export class CategoriasService {
  // injecto el modelo de mongoose
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jugadoresService: JugadoresService,
  ) {}

  async crearCategoria(
    crearCategoriaDto: CrearCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = crearCategoriaDto;
    const categoriaFound = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (categoriaFound) {
      throw new BadRequestException(`La Categoria ${categoria} ya existe`);
    }
    const categoriaCreada = new this.categoriaModel(crearCategoriaDto);
    return await categoriaCreada.save();
  }
  async asignarCategoriaAJugador(params: string[]): Promise<void> {
    const categoria = params['categoria'];
    const idJugador = params['idJugador'];

    const categoriaFound = await this.categoriaModel
      .findOne({ categoria })
      .exec();
    // me fijo si el jugador esta en la categoria
    const jugadorRegistradoEnCategoria = await this.categoriaModel
      .find({ categoria })
      .where('jugadores')
      .in(idJugador)
      .exec();
    await this.jugadoresService.consultarJugadorPorId(idJugador);

    if (!categoriaFound) {
      throw new BadRequestException(`La Categoria ${categoria} no existe`);
    }

    if (jugadorRegistradoEnCategoria.length > 0) {
      throw new BadRequestException(
        `La jugador ${idJugador} ya está en la categoria ${categoria}`,
      );
    }
    categoriaFound.jugadores.push(idJugador);
    await this.categoriaModel
      .findOneAndUpdate(categoria, { $set: categoriaFound })
      .exec();
  }
  async consultarCategoriaDelJogador(jugadorId: any): Promise<Categoria> {

    /*
    Desafio
    Escopo da exceção realocado para o próprio Categorias Service
    Verificar se o jugador informado já se encontra cadastrado
    */

   //await this.jugadoresService.consultarJogadorPeloId(jugadorId)                                   

   const jugadores = await this.jugadoresService.consultarJugadores()

   const jugadorFilter = jugadores.filter( jugador => jugador._id == jugadorId )

   if (jugadorFilter.length == 0) {
       throw new BadRequestException(`El id ${jugadorId} no es un jugador!`)
   }

    return await this.categoriaModel.findOne().where('jugadores').in(jugadorId).exec() 
}

  async actualizarCategoria(
    categoria: string,
    actualizarCategoriaDto: ActualizarCategoriaDto,
  ): Promise<Categoria> {
    const categoriaFound = await this.categoriaModel
      .findOne({ categoria })
      .exec();
    if (!categoriaFound) {
      throw new BadRequestException(`La Categoria ${categoria} no existe`);
    }

    return await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: actualizarCategoriaDto })
      .exec();
  }
  async consultarCategorias(): Promise<Categoria[]> {
    return await this.categoriaModel.find().populate('jugadores').exec();
  }
  async consultarCategoriaPorId(categoria: string): Promise<Categoria> {
    const categoriaFound = await this.categoriaModel
      .findOne({ categoria })
      .exec();
    if (!categoriaFound) {
      throw new NotFoundException(
        `categoria con id ${categoria} no fue encontrado`,
      );
    }
    return categoriaFound;
  }
  async borrarCategoria(_id: string): Promise<any> {
    // const categoriaFound = this.jugadores.find((j) => j.email === email);
    // this.jugadores = this.jugadores.filter((j) => j.email !== email);
    const categoriaFound = await this.categoriaModel.findOne({ _id }).exec();
    if (!categoriaFound) {
      throw new NotFoundException(`categoria con id ${_id} no fue encontrado`);
    }
    return await this.categoriaModel.deleteOne({ _id }).exec();
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from './interfaces/categorias/categoria.interface';
import { Jugador } from './interfaces/jugadores/jugador.interface';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)
    // injecto el modelo de mongoose
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    @InjectModel('Jugador') private readonly jugadorModel: Model<Jugador>,
  ) {}
  async crearCategoria(categoria: Categoria): Promise<Categoria> {
    try {
      const categoriaCreada = new this.categoriaModel(categoria);
      return await categoriaCreada.save();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`)
      throw new RpcException(err.message)
    }   
  }
  async consultarCategorias(): Promise<Categoria[]> {
    try {
      return await this.categoriaModel.find().exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`)
      throw new RpcException(err.message)
    }   
  }
  async consultarCategoriaPorId(_id: string): Promise<Categoria> {
    try {
      return await this.categoriaModel.findOne({_id}).exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`)
      throw new RpcException(err.message)
    }   
  }
  async actualizarCategoria(_id: string, categoria: Categoria): Promise<void> {
    try {
      // const categoriaFound = await this.categoriaModel
      // .findById(_id)
      // .exec();
      // if (!categoriaFound) {
      //   throw new RpcException(`La Categoria ${categoria} no existe`)
      // }

      await this.categoriaModel
        .findOneAndUpdate({ _id }, { $set: categoria })
        .exec();        
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`)
      throw new RpcException(err.message)
    }   
  }
}

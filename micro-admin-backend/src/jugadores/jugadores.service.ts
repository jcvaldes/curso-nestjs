import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jugador } from '../jugadores/interfaces/jugador.interface';

@Injectable()
export class JugadoresService {
  private readonly logger = new Logger(JugadoresService.name);
  // injecto el modelo de mongoose
  constructor(
    @InjectModel('Jugador') private readonly jugadorModel: Model<Jugador>,
  ) {}
  async crearJugador(jugador: Jugador): Promise<Jugador> {
    try {
      const jugadorCreado = new this.jugadorModel(jugador);
      return await jugadorCreado.save();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }
  async consultarJugadores(): Promise<Jugador[]> {
    try {
      return await this.jugadorModel.find().exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }
  async consultarJugadorPorId(_id: string): Promise<Jugador> {
    try {
      return await this.jugadorModel
        .findOne({ _id })
        .populate('categoria')
        .exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }
  async actualizarJugador(_id: string, jugador: Jugador): Promise<void> {
    try {
      await this.jugadorModel
        .findOneAndUpdate({ _id }, { $set: jugador })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deleteJugador(_id): Promise<void> {
    try {
      await this.jugadorModel.deleteOne({ _id }).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}

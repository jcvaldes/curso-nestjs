import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CrearJugadorDto } from './dtos/crear-jugador.dto';
import { Jugador } from './interfaces/jugador.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActualizarJugadorDto } from './dtos/actualizar-jugador.dto';

@Injectable()
export class JugadoresService {
  private readonly logger = new Logger(JugadoresService.name);
  // injecto el modelo de mongoose
  constructor(
    @InjectModel('Jugador') private readonly jugadorModel: Model<Jugador>,
  ) {}
  // async createOrUpdate(crearJugadorDto: CrearJugadorDto): Promise<void> {
  //   const { email } = crearJugadorDto;
  //   //  const jugadorFound = this.jugadores.find((j) => j.email === email);
  //   const jugadorFound = await this.jugadorModel.findOne({ email }).exec();

  //   if (jugadorFound) {
  //     await this.update(crearJugadorDto);
  //   } else {
  //     await this.create(crearJugadorDto);
  //   }
  // }
  async crearJugador(crearJugadorDto: CrearJugadorDto): Promise<Jugador> {
    const { email } = crearJugadorDto;
    //  const jugadorFound = this.jugadores.find((j) => j.email === email);
    const jugadorFound = await this.jugadorModel.findOne({ email }).exec();

    if (jugadorFound) {
      // await this.update(crearJugadorDto);
      throw new BadRequestException(`Jugador con email ${email} ya existe`);
    }
    // await this.create(crearJugadorDto);
    const jugadorCreado = new this.jugadorModel(crearJugadorDto);
    return await jugadorCreado.save();
  }
  async actualizarJugador(
    _id: string,
    actualizarJugadorDto: ActualizarJugadorDto,
  ): Promise<Jugador> {
    // const { email } = crearJugadorDto;
    //  const jugadorFound = this.jugadores.find((j) => j.email === email);
    const jugadorFound = await this.jugadorModel.findOne({ _id }).exec();

    if (!jugadorFound) {
      // await this.update(crearJugadorDto);
      throw new BadRequestException(`Jugador con email ${_id} ya existe`);
    }
    // await this.create(crearJugadorDto);
    return await this.jugadorModel
      .findOneAndUpdate({ _id }, { $set: actualizarJugadorDto })
      .exec();
  }
  async consultarJugadores(): Promise<Jugador[]> {
    return await this.jugadorModel.find().exec();
  }
  async consultarJugadorPorId(_id: string): Promise<Jugador> {
    const jugadorFound = await this.jugadorModel.findOne({ _id }).exec();
    if (!jugadorFound) {
      throw new NotFoundException(
        `jogador con id ${_id} no fue encontrado`,
      );
    }
    return jugadorFound;
  }
  async deleteJugador(_id: string): Promise<any> {
    // const jugadorFound = this.jugadores.find((j) => j.email === email);
    // this.jugadores = this.jugadores.filter((j) => j.email !== email);
    const jugadorFound = await this.jugadorModel.findOne({ _id }).exec();
    if (!jugadorFound) {
      throw new NotFoundException(
        `jogador con id ${_id} no fue encontrado`,
      );
    }
    return await this.jugadorModel.deleteOne({ _id }).exec();
  }
  // private async create(crearJugadorDto: CrearJugadorDto): Promise<Jugador> {
  //   // const { nombre, email, celular } = crearJugadorDto;
  //   // const jugador: Jugador = {
  //   //   _id: uuidv4(),
  //   //   nombre,
  //   //   celular,
  //   //   email,
  //   //   ranking: 'A',
  //   //   posicionRanking: 1,
  //   //   imagen: 'www.gooogle.com/foto.jpg',
  //   // };
  //   // this.logger.log(`crearJugadorDto: ${JSON.stringify(jugador)}`);
  //   // this.jugadores.push(jugador);
  //   const jugadorCreado = new this.jugadorModel(crearJugadorDto);
  //   return await jugadorCreado.save();
  // }
  // private async update(crearJugadorDto: CrearJugadorDto): Promise<Jugador> {
  //   return await this.jugadorModel
  //     .findOneAndUpdate(
  //       { email: crearJugadorDto.email },
  //       { $set: crearJugadorDto },
  //     )
  //     .exec();
  // }
}

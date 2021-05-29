import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Desafio, Partida } from './interfaces/desafio.interface';
import { Model } from 'mongoose';
import { CrearDesafioDto } from './dtos/crear-desafio.dto';
import { JugadoresService } from 'src/jugadores/jugadores.service';
import { ActualizarDesafioDto } from './dtos/actualizar-desafio.dto';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { CategoriasService } from 'src/categorias/categorias.service';
import { Jugador } from 'src/jugadores/interfaces/jugador.interface';

/*
Desafio
*/

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private readonly jugadoresService: JugadoresService,
    private readonly categoriasService: CategoriasService,
  ) {}

  private readonly logger = new Logger(DesafiosService.name);

  async crearDesafio(crearDesafioDto: CrearDesafioDto): Promise<Desafio> {
    /*
    Verificar se os jugadores informados estão cadastrados
    */

    const jugadores = await this.jugadoresService.consultarJugadores();

    crearDesafioDto.jugadores.map((jugadorDto) => {
      const jugadorFilter = jugadores.filter(
        (jugador) => jugador._id == jugadorDto._id,
      );

      if (jugadorFilter.length == 0) {
        throw new BadRequestException(
          `El id ${jugadorDto._id} no es un jugador!`,
        );
      }
    });

    /*
    Verificar se o solicitante é um dos jugadores da partida
    */

    const solicitanteEhJogadorDaPartida = await crearDesafioDto.jugadores.filter(
      (jugador: Jugador) => {
        debugger;
        return jugador._id == crearDesafioDto.solicitante;
      },
    );

    this.logger.log(
      `solicitanteEsJogadorDaPartida: ${solicitanteEhJogadorDaPartida}`,
    );

    if (solicitanteEhJogadorDaPartida.length == 0) {
      throw new BadRequestException(
        `El solicitante debe ser un jugador da partida!`,
      );
    }

    /*
    Descobrimos a categoria com base no ID do jugador solicitante
    */
    const categoriaDeJugador = await this.categoriasService.consultarCategoriaDelJogador(
      crearDesafioDto.solicitante,
    );

    /*
    Para prosseguir o solicitante deve fazer parte de uma categoria
    */
    if (!categoriaDeJugador) {
      throw new BadRequestException(
        `O solicitante precisa estar registrado em uma categoria!`,
      );
    }

    const desafioCreado = new this.desafioModel(crearDesafioDto);
    desafioCreado.categoria = categoriaDeJugador.categoria;
    desafioCreado.dataHoraSolicitacion = new Date();
    /*
    Quando um desafio for criado, definimos o status desafio como pendente
    */
    desafioCreado.status = DesafioStatus.PENDIENTE;
    this.logger.log(`desafioCreado: ${JSON.stringify(desafioCreado)}`);
    return await desafioCreado.save();
  }

  async consultarDesafios(): Promise<Array<Desafio>> {
    return await this.desafioModel
      .find()
      .populate('solicitante')
      .populate('jugadores')
      .populate('partida')
      .exec();
  }

  async consultarDesafiosDeUnJogador(_id: any): Promise<Array<Desafio>> {
    const jugadores = await this.jugadoresService.consultarJugadores();

    const jugadorFilter = jugadores.filter((jugador) => jugador._id == _id);

    if (jugadorFilter.length == 0) {
      throw new BadRequestException(`El id ${_id} no es un jugador!`);
    }

    return await this.desafioModel
      .find()
      .where('jugadores')
      .in(_id)
      .populate('solicitante')
      .populate('jugadores')
      .populate('partida')
      .exec();
  }

  async atualizarDesafio(
    _id: string,
    atualizarDesafioDto: ActualizarDesafioDto,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();

    if (!desafioEncontrado) {
      throw new NotFoundException(`Desafio ${_id} não cadastrado!`);
    }

    /*
    Atualizaremos a data da resposta quando o status do desafio vier preenchido 
    */
    if (atualizarDesafioDto.status) {
      desafioEncontrado.dataHoraRespuesta = new Date();
    }
    desafioEncontrado.status = atualizarDesafioDto.status;
    desafioEncontrado.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio;

    await this.desafioModel
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }

  async atribuirDesafioPartida(
    _id: string,
    atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();

    if (!desafioEncontrado) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
    }

    /*
    Verificar se o jugador vencedor faz parte do desafio
    */
    const jugadorFilter = desafioEncontrado.jugadores.filter(
      (jugador: any) => jugador._id == atribuirDesafioPartidaDto.def,
    );

    this.logger.log(`desafioEncontrado: ${desafioEncontrado}`);
    this.logger.log(`jugadorFilter: ${jugadorFilter}`);

    if (jugadorFilter.length == 0) {
      throw new BadRequestException(
        `El jugador vencedor no hace parte del desafio!`,
      );
    }

    /*
    Primeiro vamos criar e persistir o objeto partida
    */
    const partidaCreada = new this.partidaModel(atribuirDesafioPartidaDto);

    /*
    Atribuir ao objeto partida a categoria recuperada no desafio
    */
    partidaCreada.categoria = desafioEncontrado.categoria;

    /*
    Atribuir ao objeto partida os jugadores que fizeram parte do desafio
    */
    partidaCreada.jugadores = desafioEncontrado.jugadores;

    const resultado = await partidaCreada.save();

    /*
    Quando uma partida for registrada por um usuário, mudaremos o 
    status do desafio para realizado
    */
    desafioEncontrado.status = DesafioStatus.REALIZADO;

    /*  
    Recuperamos o ID da partida e atribuimos ao desafio
    */
    desafioEncontrado.partida = resultado._id;

    try {
      await this.desafioModel
        .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
        .exec();
    } catch (error) {
      /*
      Se a atualização do desafio falhar excluímos a partida 
      gravada anteriormente
      */
      await this.partidaModel.deleteOne({ _id: resultado._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async deletarDesafio(_id: string): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();

    if (!desafioEncontrado) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
    }

    /*
    Realizaremos a deleção lógica do desafio, modificando seu status para
    CANCELADO
    */
    desafioEncontrado.status = DesafioStatus.CANCELADO;

    await this.desafioModel
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }
}

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CrearDesafioDto } from './dtos/crear-desafio.dto';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { ActualizarDesafioDto } from './dtos/actualizar-desafio.dto';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import { Jugador } from '../jugadores/interfaces/jugador.interface';
import { Desafio } from '../desafios/interfaces/desafio.interface';
import { DesafioStatus } from './desafio-status.enum';
import { Partida } from './interfaces/partida.interface';

@Injectable()
export class DesafiosService {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private readonly logger = new Logger(DesafiosService.name);

  /*
      Creamos un proxy específico para lidiar con el microservice
      desafios
  */
  private clientDesafios =
    this.clientProxySmartRanking.getClientProxyDesafiosInstance();

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  async crearDesafio(crearDesafioDto: CrearDesafioDto) {
    this.logger.log(`crearDesafioDto: ${JSON.stringify(crearDesafioDto)}`);

    /*
      Validaciones relacionadas array de jugadores que participam
      do desafio
    */
    const jugadores: Jugador[] = await this.clientAdminBackend
      .send('consultar-jugadores', '')
      .toPromise();

    crearDesafioDto.jugadores.map((jugadorDto) => {
      const jugadorFilter: Jugador[] = jugadores.filter(
        (jugador) => jugador._id == jugadorDto._id,
      );
      this.logger.log(`jugadorFilter: ${JSON.stringify(jugadorFilter)}`);
      /*
          Verificamos si los jugadores do desafio estão registrados
      */
      if (jugadorFilter.length == 0) {
        throw new BadRequestException(
          `El id ${jugadorDto._id} no es un jugador!`,
        );
      }

      /*
        Verificar si los jugadores hacen parte de la categoria informada no
        desafio
      */
      if (jugadorFilter[0].categoria != crearDesafioDto.categoria) {
        throw new BadRequestException(
          `El jugador ${jugadorFilter[0]._id} no hacen parte de la categoria informada!`,
        );
      }
    });

    /*
        Verificamos si el solicitante é um jugador de la partida
    */
    const solicitanteEsJugadorDeLaPartida: Jugador[] =
      crearDesafioDto.jugadores.filter(
        (jugador) => jugador._id == crearDesafioDto.solicitante,
      );

    this.logger.log(
      `solicitanteEsJugadorDeLaPartida: ${JSON.stringify(
        solicitanteEsJugadorDeLaPartida,
      )}`,
    );

    if (solicitanteEsJugadorDeLaPartida.length == 0) {
      throw new BadRequestException(
        `O solicitante deve ser um jugador de la partida!`,
      );
    }

    /*
      Verificamos se a categoria está cadastrada
    */
    const categoria = await this.clientAdminBackend
      .send('consultar-categorias', crearDesafioDto.categoria)
      .toPromise();

    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    if (!categoria) {
      throw new BadRequestException(`Categoria informada no existe!`);
    }

    await this.clientDesafios.emit('crear-desafio', crearDesafioDto);
  }

  async consultarDesafios(idJugador: string) {
    /*
      Verificamos si el jugador informado está cadastrado
    */
    if (idJugador) {
      const jugador: Jugador = await this.clientAdminBackend
        .send('consultar-jugadores', idJugador)
        .toPromise();
      this.logger.log(`jugador: ${JSON.stringify(jugador)}`);
      if (!jugador) {
        throw new BadRequestException(`Jugador no registrado!`);
      }
    }
    /*
      En el microservice desafios, el método responsável por consultar os desafios
      espera a estrutura abaixo, onde:
      - Si preenchermos el idJugador a consulta de desafios será pelo id do
      jugador informado
      - Si preenchermos el campo _id a consulta será pelo iEl do desafio
      - Si no preenchermos nenhum de los dos campos la consulta irá retornar
      todos os desafios registrados
    */
    return this.clientDesafios
      .send('consultar-desafios', { idJugador: idJugador, _id: '' })
      .toPromise();
  }

  async actualizarDesafio(
    actualizarDesafioDto: ActualizarDesafioDto,
    _id: string,
  ) {
    /*
      validaciones en relacion al desafio
    */

    const desafio: Desafio = await this.clientDesafios
      .send('consultar-desafios', { idJugador: '', _id: _id })
      .toPromise();

    this.logger.log(`desafio: ${JSON.stringify(desafio)}`);

    /*
      Verificamos si el desafio está cadastrado
    */
    if (!desafio) {
      throw new BadRequestException(`Desafio no registrado!`);
    }
    /* Somente podem ser atualizados desafios com status PENDENTE */
    if (desafio.status != DesafioStatus.PENDENTE) {
      throw new BadRequestException(
        'Somente desafios com status PENDENTE podem ser atualizados!',
      );
    }

    await this.clientDesafios.emit('actualizar-desafio', {
      id: _id,
      desafio: actualizarDesafioDto,
    });
  }

  async atribuirDesafioPartida(
    atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
    _id: string,
  ) {
    const desafio: Desafio = await this.clientDesafios
      .send('consultar-desafios', { idJugador: '', _id: _id })
      .toPromise();
    this.logger.log(`desafio: ${JSON.stringify(desafio)}`);
    /*
      Verificamos si el desafio está cadastrado
    */
    if (!desafio) {
      throw new BadRequestException(`Desafio no registrado!`);
    }
    /*
      Verificamos si el desafio ya fue realizado
    */
    if (desafio.status == DesafioStatus.REALIZADO) {
      throw new BadRequestException(`Desafio ya realizado!`);
    }
    /*
      Solamente debe ser posible lanzar una partida para un desafio
      com status ACEITO
    */

    if (desafio.status != DesafioStatus.ACEITO) {
      throw new BadRequestException(
        `Las Partidas solamente puede ser lanzadas en desafios aceitos por los adversários!`,
      );
    }
    /*
      Verificamos si el jugador informado hace parte del desafio
    */
    if (!desafio.jugadores.includes(atribuirDesafioPartidaDto.def)) {
      throw new BadRequestException(
        `El jugador vencedor de la partida debe hacer parte del desafio!`,
      );
    }
    /*
      Criamos nosso objeto partida, que é formado pelas
      informações presentes no Dto que recebemos e por informações
      presentes no objeto desafio que recuperamos
    */
    const partida: Partida = {};
    partida.categoria = desafio.categoria;
    // jugador que ganó a partida
    partida.def = atribuirDesafioPartidaDto.def;
    partida.desafio = _id;
    partida.jugadores = desafio.jugadores;
    partida.resultado = atribuirDesafioPartidaDto.resultado;

    /*
      Enviamos a partida para o tópico 'crear-partida'
      Este tópico é responsável por persitir a partida na
      collection Partidas
    */
    await this.clientDesafios.emit('crear-partida', partida);
  }

  async deleteDesafio(_id: string) {
    const desafio: Desafio = await this.clientDesafios
      .send('consultar-desafios', { idJugador: '', _id: _id })
      .toPromise();
    this.logger.log(`desafio: ${JSON.stringify(desafio)}`);
    /* Verificamos se o desafio está registrado */
    if (!desafio) {
      throw new BadRequestException(`Desafio no registrado!`);
    }
    await this.clientDesafios.emit('delete-desafio', desafio);
  }
}

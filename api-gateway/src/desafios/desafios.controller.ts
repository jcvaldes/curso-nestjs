import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
  Query,
  Put,
  Param,
  Delete,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { CrearDesafioDto } from './dtos/crear-desafio.dto';
import { DesafioStatusValidacaoPipe } from './pipes/desafio-status-validation.pipe';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';

import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';

import { Desafio } from '../desafios/interfaces/desafio.interface';
import { DesafioStatus } from './desafio-status.enum';
import { Partida } from './interfaces/partida.interface';
import { Jugador } from 'src/jugadores/interfaces/jugador.interface';
import { ActualizarDesafioDto } from './dtos/actualizar-desafio.dto';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private readonly logger = new Logger(DesafiosController.name);

  /*
        Criamos um proxy específico para lidar com o microservice
        desafios
    */
  private clientDesafios =
    this.clientProxySmartRanking.getClientProxyDesafiosInstance();

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async crearDesafio(@Body() crearDesafioDto: CrearDesafioDto) {
    this.logger.log(`crearDesafioDto: ${JSON.stringify(crearDesafioDto)}`);

    /*
                Validações relacionadas ao array de jugadores que participam
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
        Verificamos se os jugadores do desafio estan registrados
      */
      if (jugadorFilter.length == 0) {
        throw new BadRequestException(
          `O id ${jugadorDto._id} não é um jugador!`,
        );
      }

      /*
        Verificar se os jugadores hacen parte de lacategoria informada en el
        desafio
      */

      if (jugadorFilter[0].categoria != crearDesafioDto.categoria) {
        throw new BadRequestException(
          `O jugador ${jugadorFilter[0]._id} não faz parte da categoria informada!`,
        );
      }
    });

    /*
      Verificamos se o solicitante es un jugador de la partida
    */
    const solicitanteEhjugadorDaPartida: Jugador[] =
      crearDesafioDto.jugadores.filter(
        (jugador) => jugador._id == crearDesafioDto.solicitante,
      );

    this.logger.log(
      `solicitanteEhjugadorDaPartida: ${JSON.stringify(
        solicitanteEhjugadorDaPartida,
      )}`,
    );

    if (solicitanteEhjugadorDaPartida.length == 0) {
      throw new BadRequestException(
        `O solicitante deve ser um jugador da partida!`,
      );
    }

    /*
      Verificamos si la categoria está registrada
    */
    const categoria = await this.clientAdminBackend
      .send('consultar-categorias', crearDesafioDto.categoria)
      .toPromise();

    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    if (!categoria) {
      throw new BadRequestException(`Categoria informada não existe!`);
    }

    await this.clientDesafios.emit('crear-desafio', crearDesafioDto);
  }

  @Get()
  async consultarDesafios(@Query('idJugador') idJugador: string): Promise<any> {
    /*
      Verificamos se o jugador informado está registrado
    */
    if (idJugador) {
      const jugador: Jugador = await this.clientAdminBackend
        .send('consultar-jugadores', idJugador)
        .toPromise();
      this.logger.log(`jugador: ${JSON.stringify(jugador)}`);
      if (!jugador) {
        throw new BadRequestException(`jugador no registrado!`);
      }
    }
    /*
      No microservice desafios, o método responsável por consultar os desafios
      espera a estrutura abaixo, onde:
      - Se preenchermos o idJugador a consulta de desafios será pelo id do
      jugador informado
      - Se preenchermos o campo _id a consulta será pelo id do desafio
      - Se não preenchermos nenhum dos dois campos a consulta irá retornar
      todos os desafios registrados
    */
    return this.clientDesafios
      .send('consultar-desafios', { idJugador: idJugador, _id: '' })
      .toPromise();
  }

  @Put('/:desafio')
  async actualizarDesafio(
    @Body(DesafioStatusValidacaoPipe)
    actualizarDesafioDto: ActualizarDesafioDto,
    @Param('desafio') _id: string,
  ) {
    /*
      Validações em relação ao desafio
    */
    const desafio: Desafio = await this.clientDesafios
      .send('consultar-desafios', { idJugador: '', _id: _id })
      .toPromise();

    this.logger.log(`desafio: ${JSON.stringify(desafio)}`);

    /*
      Verificamos se o desafio está registrado
    */
    if (!desafio) {
      throw new BadRequestException(`Desafio não registrado!`);
    }

    /*
        Somente podem ser atualizados desafios com status PENDENTE
    */
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

  @Post('/:desafio/partida/')
  async atribuirDesafioPartida(
    @Body(ValidationPipe) atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
    @Param('desafio') _id: string,
  ) {
    const desafio: Desafio = await this.clientDesafios
      .send('consultar-desafios', { idJugador: '', _id: _id })
      .toPromise();

    this.logger.log(`desafio: ${JSON.stringify(desafio)}`);

    /*
      Verificamos se o desafio está registrado
    */
    if (!desafio) {
      throw new BadRequestException(`Desafio não registrado!`);
    }

    /*
      Verificamos se o desafio já foi realizado
    */

    if (desafio.status == DesafioStatus.REALIZADO) {
      throw new BadRequestException(`Desafio ya realizado!`);
    }

    /*
      Somente deve ser possível lançar uma partida para um desafio
      com status ACEITO
    */

    if (desafio.status != DesafioStatus.ACEITO) {
      throw new BadRequestException(
        `Partidas somente podem ser lançadas em desafios aceitos pelos adversários!`,
      );
    }

    /*
      Verificamos se o jugador informado faz parte do desafio
    */
    if (!desafio.jugadores.includes(atribuirDesafioPartidaDto.def)) {
      throw new BadRequestException(
        `O jugador vencedor da partida deve fazer parte do desafio!`,
      );
    }

    /*
      Criamos nosso objeto partida, que é formado pelas
      informações presentes no Dto que recebemos e por informações
      presentes no objeto desafio que recuperamos
    */
    const partida: Partida = {};
    partida.categoria = desafio.categoria;
    // jugador que ganó
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

  @Delete('/:_id')
  async deleteDesafio(@Param('_id') _id: string) {
    const desafio: Desafio = await this.clientDesafios
      .send('consultar-desafios', { idJugador: '', _id: _id })
      .toPromise();

    this.logger.log(`desafio: ${JSON.stringify(desafio)}`);

    /*
            Verificamos se o desafio está registrado
        */
    if (!desafio) {
      throw new BadRequestException(`Desafio não registrado!`);
    }

    await this.clientDesafios.emit('delete-desafio', desafio);
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { AwsService } from 'src/aws/aws.service';
import { ValidationParamsPipe } from 'src/common/pipes/validation-params.pipe';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';

import { ActualizarJugadorDto } from './dtos/actualizar-jugador.dto';
import { CrearJugadorDto } from './dtos/crear-jugador.dto';

@Controller('api/v1/jugadores')
export class JugadoresController {
  private logger = new Logger(JugadoresController.name);
  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private awsService: AwsService,
  ) {}

  @Get()
  consultarJugadores(@Query('jugadorId') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-jugadores', _id ? _id : '');
  }

  @Post()
  @UsePipes(ValidationPipe)
  async crearJugador(@Body() crearJugadorDto: CrearJugadorDto) {
    this.logger.log(`crearJugadorDto: ${JSON.stringify(crearJugadorDto)}`);
    const categoria = await this.clientAdminBackend
      .send('consultar-categorias', crearJugadorDto.categoria)
      .toPromise();
    if (categoria) {
      await this.clientAdminBackend.emit('crear-jugador', crearJugadorDto);
    } else {
      throw new BadRequestException('Categoria no registrada');
    }
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async actualizarJugador(
    @Body() actualizarJugadorDto: ActualizarJugadorDto,
    @Param('_id', ValidationParamsPipe) _id: string,
  ) {
    const categoria = await this.clientAdminBackend
      .send('consultar-categorias', actualizarJugadorDto.categoria)
      .toPromise();

    if (categoria) {
      this.clientAdminBackend.emit('actualizar-jugador', {
        id: _id,
        jugador: actualizarJugadorDto,
      });
    } else {
      throw new BadRequestException(`Categoria no registrada!`);
    }
  }

  @Delete(':_id')
  async deleteJugador(@Param('_id', ValidationParamsPipe) _id: string) {
    await this.clientAdminBackend.emit('delete-jugador', { _id });
  }

  @Post(':_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file, @Param('_id') _id: string) {
    // this.logger.log(file)
    // Verificar que el jugador exista
    const jugador = await this.clientAdminBackend
      .send('consultar-jugadores', _id)
      .toPromise();
    if (!jugador) {
      throw new BadRequestException('Jugador no encontrado');
    }
    // Enviar archivo para S3 y recuperar la url de acceso
    const urlFotoJugador: any = this.awsService.upload(file, _id);
    // return urlFotoJugador

    // Actualizar el atributo url de la entidad jugador

    const actualizarJugadorDto: ActualizarJugadorDto = {};

    actualizarJugadorDto.urlFotoJugador = urlFotoJugador.url;
    await this.clientAdminBackend.emit('actualizar-jugador', {
      id: _id,
      jugador: actualizarJugadorDto,
    });

    // Retornar el jugador actualizado para el cliente
    return this.clientAdminBackend.send('consultar-jugadores', _id);
  }
}

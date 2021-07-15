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
} from '@nestjs/common';
import { CrearDesafioDto } from './dtos/crear-desafio.dto';
import { DesafioStatusValidacaoPipe } from './pipes/desafio-status-validation.pipe';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';

import { ActualizarDesafioDto } from './dtos/actualizar-desafio.dto';
import { DesafiosService } from './desafios.service';

@Controller('api/v1/desafios')
export class DesafiosController {
  private readonly logger = new Logger(DesafiosController.name);
  constructor(private desafiosService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async crearDesafio(@Body() crearDesafioDto: CrearDesafioDto) {
    this.logger.log(`crearDesafioDto: ${JSON.stringify(crearDesafioDto)}`);
    await this.desafiosService.crearDesafio(crearDesafioDto);
  }

  @Get()
  async consultarDesafios(@Query('idJugador') idJugador: string){
    return await this.desafiosService.consultarDesafios(idJugador);
  }

  @Put('/:desafio')
  async actualizarDesafio(
    @Body(DesafioStatusValidacaoPipe)
    actualizarDesafioDto: ActualizarDesafioDto,
    @Param('desafio') _id: string,
  ) {
    this.desafiosService.actualizarDesafio(actualizarDesafioDto, _id);
  }

  @Post('/:desafio/partida/')
  async atribuirDesafioPartida(
    @Body(ValidationPipe) atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
    @Param('desafio') _id: string,
  ) {
    await this.desafiosService.atribuirDesafioPartida(
      atribuirDesafioPartidaDto,
      _id,
    );
  }

  @Delete('/:_id')
  async deleteDesafio(@Param('_id') _id: string) {
    await this.desafiosService.deleteDesafio(_id);
  }
}

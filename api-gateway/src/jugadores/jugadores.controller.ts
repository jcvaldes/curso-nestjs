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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ValidationParamsPipe } from 'src/common/pipes/validation-params.pipe';

import { ActualizarJugadorDto } from './dtos/actualizar-jugador.dto';
import { CrearJugadorDto } from './dtos/crear-jugador.dto';
import { JugadoresService } from './jugadores.service';
import { Observable } from 'rxjs';

@Controller('api/v1/jugadores')
export class JugadoresController {
  private logger = new Logger(JugadoresController.name);
  constructor(private jugadoresService: JugadoresService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  consultarJugadores(
    @Req() req: Request,
    @Query('jugadorId') _id: string,
  ): Observable<any> {
    this.logger.log(`req: ${JSON.stringify(req.user)}`);
    return this.jugadoresService.consultarJugadores(_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UsePipes(ValidationPipe)
  async crearJugador(@Body() crearJugadorDto: CrearJugadorDto) {
    this.logger.log(`crearJugadorDto: ${JSON.stringify(crearJugadorDto)}`);
    await this.jugadoresService.crearJugador(crearJugadorDto);
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async actualizarJugador(
    @Body() actualizarJugadorDto: ActualizarJugadorDto,
    @Param('_id', ValidationParamsPipe) _id: string,
  ) {
    await this.jugadoresService.actualizarJugador(actualizarJugadorDto, _id);
  }

  @Delete(':_id')
  deleteJugador(@Param('_id', ValidationParamsPipe) _id: string) {
    this.jugadoresService.deleteJugador(_id);
  }

  @Post(':_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file, @Param('_id') _id: string): Promise<any> {
    //Retornar o jogador atualizado para o cliente
    return await this.jugadoresService.upload(file, _id);
  }
}

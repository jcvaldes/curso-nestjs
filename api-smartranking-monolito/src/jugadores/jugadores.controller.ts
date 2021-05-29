import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationParamsPipe } from 'src/common/pipes/validation-params.pipe';
import { ActualizarJugadorDto } from './dtos/actualizar-jugador.dto';
import { CrearJugadorDto } from './dtos/crear-jugador.dto';
import { Jugador } from './interfaces/jugador.interface';
import { JugadoresService } from './jugadores.service';

@Controller('api/v1/jugadores')
export class JugadoresController {
  constructor(private readonly jugadoresService: JugadoresService) {}
  // @Post()
  // @UsePipes(ValidationPipe)
  // async createOrUpdate(@Body() crearJugadorDto: CrearJugadorDto) {
  //   // const { email } = crearJugadorDto;

  //   // return JSON.stringify(`{
  //   //   "email": ${email}
  //   // }`);
  //   await this.jugadoresService.createOrUpdate(crearJugadorDto);
  // }
  @Post()
  @UsePipes(ValidationPipe)
  async crearJugador(@Body() crearJugadorDto: CrearJugadorDto): Promise<Jugador> {
    return await this.jugadoresService.crearJugador(crearJugadorDto);
  }
  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async actualizarJugador(
    @Body() actualizarJugadorDto: ActualizarJugadorDto,
    @Param('_id', ValidationParamsPipe) _id: string
  ): Promise<Jugador> {
    return await this.jugadoresService.actualizarJugador(_id, actualizarJugadorDto);
  }
  @Get()
  async consultarJugadores(): Promise<Jugador[]> {
    return await this.jugadoresService.consultarJugadores();
  }

  // @Get()
  // async getJugadores(
  //   @Query('email', ValidationParamsPipe) email: string,
  // ): Promise<Jugador[] | Jugador> {
  //   if (email) {
  //     return await this.jugadoresService.getByEmail(email);
  //   } else {
  //     return await this.jugadoresService.getAll();
  //   }
  // }
  @Get('/:_id')
  async getJugadorById(
    @Param('_id', ValidationParamsPipe) _id: string
  ): Promise<Jugador> {
    return await this.jugadoresService.consultarJugadorPorId(_id)
  }
  // @Delete()
  // async deleteJugador(
  //   @Query('email', ValidationParamsPipe) email: string,
  // ): Promise<void> {
  //   await this.jugadoresService.delete(email);
  // }
  @Delete('/:_id')
  async deleteJugador(
    @Param('_id', ValidationParamsPipe) _id: string,
  ): Promise<void> {
    await this.jugadoresService.deleteJugador(_id);
  }
}

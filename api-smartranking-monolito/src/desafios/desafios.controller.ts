import { Controller, Post, UsePipes, ValidationPipe, Body, Get, Query, Put, Param, Delete, Logger } from '@nestjs/common';
import { DesafiosService } from './desafios.service'
import { CrearDesafioDto } from './dtos/crear-desafio.dto'
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatusValidationPipe } from './pipes/desafio-status-validation.pipe';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { ActualizarDesafioDto } from './dtos/actualizar-desafio.dto';

/*
Desafio
*/

@Controller('api/v1/desafios')
export class DesafiosController {

    constructor(private readonly desafiosService: DesafiosService){}

    private readonly logger = new Logger(DesafiosController.name)

    @Post()
    @UsePipes(ValidationPipe)
    async crearDesafio(
        @Body() crearDesafioDto: CrearDesafioDto): Promise<Desafio> {
            this.logger.log(`crearDesafioDto: ${JSON.stringify(crearDesafioDto)}`)
            return await this.desafiosService.crearDesafio(crearDesafioDto)
    }
    
    @Get()
    async consultarDesafios(
        @Query('jugadorId') _id: string): Promise<Array<Desafio>> {
        return _id ? await this.desafiosService.consultarDesafiosDeUnJogador(_id) 
        : await this.desafiosService.consultarDesafios()
    }

    @Put('/:desafio')
    async atualizarDesafio(
        @Body(DesafioStatusValidationPipe) atualizarDesafioDto: ActualizarDesafioDto,
        @Param('desafio') _id: string): Promise<void> {
            await this.desafiosService.atualizarDesafio(_id, atualizarDesafioDto)

        }    

   @Post('/:desafio/partida')
   async atribuirDesafioPartida(
       @Body(ValidationPipe) atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
       @Param('desafio') _id: string): Promise<void> {
        return await this.desafiosService.atribuirDesafioPartida(_id, atribuirDesafioPartidaDto)           
   }

   @Delete('/:_id')
   async deleteDesafio(
       @Param('_id') _id: string): Promise<void> {
           await this.desafiosService.deletarDesafio(_id)
    }

}

import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ActualizarCategoriaDto } from './dtos/actualizar-categoria.dto';
import { CrearCategoriaDto } from './dtos/crear-categoria.dto';
import { CategoriasService } from './categorias.service';

@Controller('api/v1/categorias')
export class CategoriasController {
  private logger = new Logger(CategoriasController.name);

  constructor(private categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  crearCategorias(@Body() crearCategoriaDto: CrearCategoriaDto) {
    // envia el mensaje (publica) a nuestro message broker
    this.categoriasService.crearCategoria(crearCategoriaDto);
  }

  @Get()
  async consultarCategorias(@Query('categoriaId') _id: string) {
    // envia el mensaje (publica) a nuestro message broker
    return await this.categoriasService.consultarCategorias(_id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  actualizarCategoria(
    @Body() actualizarCategoriaDto: ActualizarCategoriaDto,
    @Param('_id') _id: string,
  ) {
    this.categoriasService.actualizarCategoria(actualizarCategoriaDto, _id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { ActualizarCategoriaDto } from './dtos/actualizar-categoria.dto';
import { CrearCategoriaDto } from './dtos/crear-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { CategoriasValidationParamsPipe } from './pipes/categorias-validation-params.pipe';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async crearCategoria(
    @Body() crearCategoriaDto: CrearCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriasService.crearCategoria(crearCategoriaDto);
  }
  @Put('/:categoria')
  @UsePipes(ValidationPipe)
  async actualizarCategoria(
    @Body() actualizarCategoriaDto: ActualizarCategoriaDto,
    @Param('categoria', CategoriasValidationParamsPipe) categoria: string
  ): Promise<Categoria> {
    return await this.categoriasService.actualizarCategoria(categoria, actualizarCategoriaDto);
  }
  @Post('/:categoria/jugadores/:idJugador')
  async asignarCategoriaAJugador(
    @Param() params: string[]
  ): Promise<void> {
    return await this.categoriasService.asignarCategoriaAJugador(params);
  }
  @Get()
  async consultarCategorias(): Promise<Categoria[]> {
    return await this.categoriasService.consultarCategorias();
  }
  @Get('/:categoria')
  async consultarCategoriaPorId(
    @Param('categoria', CategoriasValidationParamsPipe) categoria: string
  ): Promise<Categoria> {
    return await this.categoriasService.consultarCategoriaPorId(categoria)
  }
  @Delete('/:categoria')
  async borrarCategoria(
    @Param('categoria', CategoriasValidationParamsPipe) categoria: string,
  ): Promise<void> {
    debugger
    return await this.categoriasService.borrarCategoria(categoria);
  }
}

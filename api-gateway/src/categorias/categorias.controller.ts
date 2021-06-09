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
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { ActualizarCategoriaDto } from './dtos/actualizar-categoria.dto';
import { CrearCategoriaDto } from './dtos/crear-categoria.dto';

@Controller('api/v1/categorias')
export class CategoriasController {
  private logger = new Logger(CategoriasController.name);
  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();
  //private clientAdminBackend: ClientProxy;
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {
    // this.clientAdminBackend = ClientProxyFactory.create({
    //   transport: Transport.RMQ,
    //   options: {
    //     //virtualhost
    //     urls: ['amqp://guest:guest@localhost:5672/smartracking'],
    //     // fila
    //     queue: 'admin-backend',
    //   },
    // });
  }

  @Post()
  @UsePipes(ValidationPipe)
  crearCategorias(@Body() crearCategoriaDto: CrearCategoriaDto) {
    // envia el mensaje (publica) a nuestro message broker
    this.clientAdminBackend.emit('crear-categoria', crearCategoriaDto);
  }

  @Get()
  consultarCategorias(@Query('categoriaId') _id: string): Observable<any> {
    // envia el mensaje (publica) a nuestro message broker
    return this.clientAdminBackend.send('consultar-categorias', _id ? _id : '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  actualizarCategoria(
    @Body() actualizarCategoriaDto: ActualizarCategoriaDto,
    @Param('_id') _id: string,
  ) {
    this.clientAdminBackend.send('actualizar-categorias', {
      id: _id,
      categoria: actualizarCategoriaDto,
    });
  }
}

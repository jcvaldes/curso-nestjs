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
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ActualizarCategoriaDto } from './categorias/dtos/actualizar-categoria.dto';
import { CrearCategoriaDto } from './categorias/dtos/crear-categoria.dto';

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);
  private clientAdminBackend: ClientProxy;
  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        //virtualhost
        urls: ['amqp://guest:guest@localhost:5672/smartracking'],
        // fila
        queue: 'admin-backend',
      },
    });
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  crearCategorias(@Body() crearCategoriaDto: CrearCategoriaDto) {
    // envia el mensaje (publica) a nuestro message broker
    this.clientAdminBackend.emit('crear-categoria', crearCategoriaDto);
  }

  @Get('categorias')
  consultarCategorias(@Query('categoriaId') _id: string): Observable<any> {
    // envia el mensaje (publica) a nuestro message broker
    return this.clientAdminBackend.send('consultar-categorias', _id ? _id : '');
  }

  @Put('categorias/:_id')
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

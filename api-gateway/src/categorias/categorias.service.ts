import { Injectable } from '@nestjs/common';
import { CrearCategoriaDto } from './dtos/crear-categoria.dto';
import { ActualizarCategoriaDto } from './dtos/actualizar-categoria.dto';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';

@Injectable()
export class CategoriasService {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  crearCategoria(crearCategoriaDto: CrearCategoriaDto) {
    this.clientAdminBackend.emit('crear-categoria', crearCategoriaDto);
  }

  async consultarCategorias(_id: string): Promise<any> {
    return await this.clientAdminBackend
      .send('consultar-categorias', _id ? _id : '')
      .toPromise();
  }

  actualizarCategoria(
    actualizarCategoriaDto: ActualizarCategoriaDto,
    _id: string,
  ) {
    this.clientAdminBackend.emit('actualizar-categoria', {
      id: _id,
      categoria: actualizarCategoriaDto,
    });
  }
}

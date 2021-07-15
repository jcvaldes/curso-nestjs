import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';

@Injectable()
export class RankingsService {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientRankingsBackend =
    this.clientProxySmartRanking.getClientProxyRankingsInstance();

  async consultarRankings(idCategoria: string, dataRef: string): Promise<any> {
    if (!idCategoria) {
      throw new BadRequestException('El id de la categoria es obligatorio!');
    }

    return await this.clientRankingsBackend
      .send('consultar-rankings', {
        idCategoria: idCategoria,
        dataRef: dataRef ? dataRef : '',
      })
      .toPromise();
  }
}

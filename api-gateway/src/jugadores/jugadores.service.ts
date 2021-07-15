import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CrearJugadorDto } from './dtos/crear-jugador.dto';
import { ActualizarJugadorDto } from './dtos/actualizar-jugador.dto';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import { AwsS3Service } from '../aws/aws-s3.service';
import { Jugador } from '../jugadores/interfaces/jugador.interface';
import { Categoria } from '../categorias/interfaces/categoria.interface';

@Injectable()
export class JugadoresService {
  private logger = new Logger(JugadoresService.name);

  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private awsS3Service: AwsS3Service,
  ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  async crearJugador(crearJugadorDto: CrearJugadorDto) {
    this.logger.log(`crearJugadorDto: ${JSON.stringify(crearJugadorDto)}`);

    const categoria: Categoria = await this.clientAdminBackend
      .send('consultar-categorias', crearJugadorDto.categoria)
      .toPromise();

    if (categoria) {
      await this.clientAdminBackend.emit('crear-jugador', crearJugadorDto);
    } else {
      throw new BadRequestException('Categoria no registrada');
    }
  }

  async upload(file, _id: string): Promise<any> {
    //Verificar se el jugador está cadastrado
    const jugador: Jugador = await this.clientAdminBackend
      .send('consultar-jugadores', _id)
      .toPromise();

    if (!jugador) {
      throw new BadRequestException(`Jugador no encontrado!`);
    }

    //Enviar el archivo para el S3 e recuperar a URL de acesso
    const urlFotoJugador: { url: string } = await this.awsS3Service.upload(
      file,
      _id,
    );

    //Actualizar el atributo URL da entidade jugador
    const actualizarJugadorDto: ActualizarJugadorDto = {};
    actualizarJugadorDto.urlFotoJugador = urlFotoJugador.url;

    await this.clientAdminBackend.emit('actualizar-jugador', {
      id: _id,
      jugador: actualizarJugadorDto,
    });

    // Retornar el jugador atualizado para el cliente
    return await this.clientAdminBackend
      .send('consultar-jugadores', _id)
      .toPromise();
  }

  consultarJugadores(_id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-jugadores', _id ? _id : '');
  }

  async actualizarJugador(
    actualizarJugadorDto: ActualizarJugadorDto,
    _id: string,
  ) {
    const categoria: Categoria = await this.clientAdminBackend
      .send('consultar-categorias', actualizarJugadorDto.categoria)
      .toPromise();

    if (categoria) {
      await this.clientAdminBackend.emit('actualizar-jugador', {
        id: _id,
        jugador: actualizarJugadorDto,
      });
    } else {
      throw new BadRequestException(`Categoria no registrada!`);
    }
  }

  deleteJugador(_id: string) {
    this.clientAdminBackend.emit('delete-jugador', { _id });
  }
}

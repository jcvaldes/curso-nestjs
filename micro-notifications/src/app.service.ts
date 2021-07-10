import { Injectable, Logger } from '@nestjs/common';
import { Desafio } from './interfaces/desafio.interface';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import { Jugador } from './interfaces/jugador.interface';
import { RpcException } from '@nestjs/microservices';
import { MailerService } from '@nestjs-modules/mailer';
import HTML_NOTIFICACION_ADVERSARIO from './static/html-notificacion-adversario';

@Injectable()
export class AppService {
  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private readonly mailService: MailerService,
  ) {}

  private readonly logger = new Logger(AppService.name);

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  async enviarEmailParaAdversario(desafio: Desafio): Promise<void> {
    try {
      /*
        Identificar o ID do adversario
      */

      let idAdversario = '';

      desafio.jugadores.map((jugador: any) => {
        if (jugador._id != desafio.solicitante) {
          idAdversario = jugador;
        }
      });

      //Consultar as informações adicionais dos jugadores

      const adversario: Jugador = await this.clientAdminBackend
        .send('consultar-jugadores', idAdversario)
        .toPromise();

      const solicitante: Jugador = await this.clientAdminBackend
        .send('consultar-jugadores', desafio.solicitante)
        .toPromise();

      let markup = '';

      markup = HTML_NOTIFICACION_ADVERSARIO;
      markup = markup.replace(/#NOMBRE_ADVERSARIO/g, adversario.nombre);
      markup = markup.replace(/#NOMBRE_SOLICITANTE/g, solicitante.nombre);

      this.mailService
        .sendMail({
          to: adversario.email,
          from: `"SMART RANKING" <idevkingos@gmail.com>`,
          subject: 'Notificacion de Desafio',
          html: markup,
        })
        .then((success) => {
          this.logger.log(success);
        })
        .catch((err) => {
          this.logger.error(err);
        });
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}

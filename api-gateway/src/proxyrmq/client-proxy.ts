import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxySmartRanking {
  readonly RABBITMQ_USER = this.configService.get<string>('RABBITMQ_USER');
  readonly RABBITMQ_PASSWORD =
    this.configService.get<string>('RABBITMQ_PASSWORD');
  readonly RABBITMQ_URL = this.configService.get<string>('RABBITMQ_URL');

  constructor(private configService: ConfigService) {}
  getClientProxyAdminBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        //virtualhost
        urls: [
          `amqp://${this.RABBITMQ_USER}:${this.RABBITMQ_PASSWORD}@${this.RABBITMQ_URL}`,
        ],
        // fila
        queue: 'admin-backend',
      },
    });
  }
  getClientProxyDesafiosInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${this.RABBITMQ_USER}:${this.RABBITMQ_PASSWORD}@${this.RABBITMQ_URL}`,
        ],
        queue: 'desafios',
      },
    });
  }
}

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

const logger = new Logger('Main')

async function bootstrap() {
  // va a actuar como un listener
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      //virtualhost
      urls: ['amqp://guest:guest@localhost:5672/smartracking'],
      noAck: false,
      // fila
      queue: 'admin-backend',
    },
  });
  await app.listen(() => logger.log('Microservice is listening'));
}
bootstrap();

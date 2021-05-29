import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import * as momentTimezone from 'moment-timezone';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Jugadores')
    .setDescription('API para apuestas')
    .setVersion('1.0')
    .addTag('jugadores')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });
  // Configuro el http exception handling global
  app.useGlobalFilters(new AllExceptionsFilter());
  /*
    Desafio
    Sobrescrevemos a função toJSON do Date passando um objeto moment. Deste modo 
    quando o objeto for serializado, ele utilizará o formato de data definido por nós.
    Todos os objetos Date serão afetados com esta implementação 
  */
  Date.prototype.toJSON = function (): any {
    return momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen(3000);
}
bootstrap();

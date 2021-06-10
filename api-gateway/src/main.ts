import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as momentTimezone from 'moment-timezone';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // timeout interceptor cuando hace un get espera 10 segundos y si no obtinee datos cancela el request
  app.useGlobalInterceptors(new LoggingInterceptor(), new TimeoutInterceptor());

  // Configuro el http exception handling global
  app.useGlobalFilters(new AllExceptionsFilter());
  // Date.prototype.toJSON = function (): any {
  //   return momentTimezone(this)
  //     .tz('America/Sao_Paulo')
  //     .format('YYYY-MM-DD HH:mm:ss.SSS');
  // };
  await app.listen(3000);
}
bootstrap();

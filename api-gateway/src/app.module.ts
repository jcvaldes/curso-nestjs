import { Module } from '@nestjs/common';

import { CategoriasModule } from './categorias/categorias.module';
import { JugadoresModule } from './jugadores/jugadores.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { DesafiosModule } from './desafios/desafios.module';

@Module({
  imports: [
    CategoriasModule,
    JugadoresModule,
    DesafiosModule,
    ProxyRMQModule,
    AwsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [ProxyRMQModule],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AwsModule } from 'src/aws/aws.module';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';

import { JugadoresController } from './jugadores.controller';

@Module({
  imports: [ProxyRMQModule, AwsModule],
  controllers: [JugadoresController],
  providers: [],
})
export class JugadoresModule {}

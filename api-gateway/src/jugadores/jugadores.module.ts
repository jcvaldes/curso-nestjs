import { Module } from '@nestjs/common';
import { AwsModule } from 'src/aws/aws.module';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';

import { JugadoresController } from './jugadores.controller';
import { JugadoresService } from './jugadores.service';

@Module({
  imports: [ProxyRMQModule, AwsModule],
  controllers: [JugadoresController],
  providers: [JugadoresService],
})
export class JugadoresModule {}

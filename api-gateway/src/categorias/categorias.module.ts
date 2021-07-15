import { Module } from '@nestjs/common';
import { ProxyRMQModule } from '../proxyrmq/proxyrmq.module';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
@Module({
  imports: [ProxyRMQModule],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}

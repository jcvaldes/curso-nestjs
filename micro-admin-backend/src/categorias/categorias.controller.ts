import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CategoriasService } from './categorias.service';
import { Categoria } from './interfaces/categoria.interface';
const ackErrors: string[] = ['E11000'];
@Controller()
export class CategoriasController {
  private readonly logger = new Logger(CategoriasController.name);
  constructor(private readonly categoriasService: CategoriasService) {}

  @EventPattern('crear-categoria')
  async crearCategoria(
    @Payload() categoria: Categoria,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);
    try {
      await this.categoriasService.crearCategoria(categoria);
      await channel.ack(originalMsg);
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      // ackErrors.map(async ackError => {
      //   if (err.message.includes(ackError)) {
      //     await channel.ack(originalMsg)
      //   }
      // })
      const filterAckError = ackErrors.filter((ackError) =>
        err.message.includes(ackError),
      );
      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(@Payload() _id: string, @Ctx() context: RmqContext,) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (_id) {
        return await this.categoriasService.consultarCategoriaPorId(_id);
      } else {
        return await this.categoriasService.consultarCategorias();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('actualizar-categoria')
  async actualizarCategoria(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.log(`categoria: ${JSON.stringify(data)}`);
    try {
      const _id: string = data.id
      const categoria: Categoria = data.categoria
      await this.categoriasService.actualizarCategoria(_id, categoria);
      await channel.ack(originalMsg);
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        err.message.includes(ackError),
      );
      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }
}

import { Controller, Logger } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { Desafio } from './interfaces/desafio.interface';
import {
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
  MessagePattern,
} from '@nestjs/microservices';

const ackErrors: string[] = ['E11000'];

@Controller()
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  private readonly logger = new Logger(DesafiosController.name);

  @EventPattern('crear-desafio')
  async crearDesafio(@Payload() desafio: Desafio, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`desafio: ${JSON.stringify(desafio)}`);
      await this.desafiosService.crearDesafio(desafio);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('consultar-desafios')
  async consultarDesafios(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<Desafio[] | Desafio> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const { idJugador, _id } = data;
      this.logger.log(`data: ${JSON.stringify(data)}`);
      if (idJugador) {
        return await this.desafiosService.consultarDesafiosDeUnJugador(
          idJugador,
        );
      } else if (_id) {
        return await this.desafiosService.consultarDesafioPorId(_id);
      } else {
        return await this.desafiosService.consultarTodosDesafios();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('actualizar-desafio')
  async actualizarDesafio(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`data: ${JSON.stringify(data)}`);
      const _id: string = data.id;
      const desafio: Desafio = data.desafio;
      await this.desafiosService.atualizarDesafio(_id, desafio);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('actualizar-desafio-partida')
  async actualizarDesafioPartida(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`idPartida: ${data}`);
      const idPartida: string = data.idPartida;
      const desafio: Desafio = data.desafio;
      await this.desafiosService.atualizarDesafioPartida(idPartida, desafio);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('delete-desafio')
  async deleteDesafio(
    @Payload() desafio: Desafio,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.desafiosService.deletarDesafio(desafio);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }
}

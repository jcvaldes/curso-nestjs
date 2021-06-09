import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Jugador } from './interfaces/jugador.interface';
import { JugadoresService } from './jugadores.service';

const ackErrors: string[] = ['E11000'];
@Controller()
export class JugadoresController {
  private readonly logger = new Logger(JugadoresController.name);
  constructor(private readonly jugadoresService: JugadoresService) {}

  @EventPattern('crear-jugador')
  async crearJugador(@Payload() jugador: Jugador, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`jugador: ${JSON.stringify(jugador)}`);
      await this.jugadoresService.crearJugador(jugador);
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

  @MessagePattern('consultar-jugadores')
  async consultarJugadores(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (_id) {
        return await this.jugadoresService.consultarJugadorPorId(_id);
      } else {
        return await this.jugadoresService.consultarJugadores();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  // @EventPattern('actualizar-jugador')
  // async actualizarJugador(@Payload() data: any, @Ctx() context: RmqContext) {
  //   const channel = context.getChannelRef();
  //   const originalMsg = context.getMessage();
  //   this.logger.log(`jugador: ${JSON.stringify(data)}`);
  //   try {
  //     const _id: string = data.id;
  //     const jugador: Jugador = data.jugador;
  //     await this.jugadoresService.actualizarJugador(_id, jugador);
  //     await channel.ack(originalMsg);
  //   } catch (err) {
  //     this.logger.error(`error: ${JSON.stringify(err.message)}`);
  //     const filterAckError = ackErrors.filter((ackError) =>
  //       err.message.includes(ackError),
  //     );
  //     if (filterAckError) {
  //       await channel.ack(originalMsg);
  //     }
  //   }
  // }
  @EventPattern('actualizar-jugador')
  async atualizarJugador(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      console.log(`data: ${JSON.stringify(data)}`);
      const _id: string = data.id;
      const jugador: Jugador = data.jugador;
      await this.jugadoresService.actualizarJugador(_id, jugador);
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

  @EventPattern('delete-jugador')
  async deleteJugador(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.jugadoresService.deleteJugador(_id);
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
}

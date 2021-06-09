import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Partida } from './interfaces/partida.interface'
import { Desafio } from '../desafios/interfaces/desafio.interface'
import { RpcException } from '@nestjs/microservices';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy'

@Injectable()
export class PartidasService {

    constructor(
        @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
        private clientProxySmartRanking: ClientProxySmartRanking
       ) {}

    private readonly logger = new Logger(PartidasService.name)

    private clientDesafios = 
        this.clientProxySmartRanking.getClientProxyDesafiosInstance()

    async crearPartida(partida: Partida): Promise<Partida> {
        try {
            /*
                Iremos persistir a partida e logo em seguida actualizaremos o
                desafio. O desafio irá receber o ID da partida e seu status
                será modificado para REALIZADO.
            */
            const partidaCreada = new this.partidaModel(partida)
            this.logger.log(`partidaCreada: ${JSON.stringify(partidaCreada)}`)
            /*
                Recuperamos o ID da partida
            */
            const result = await partidaCreada.save()
            this.logger.log(`result: ${JSON.stringify(result)}`)
            const idPartida = result._id
            /*
              Com o ID do desafio que recebemos na requisição, recuperamos o 
              desafio.
            */     
            const desafio: Desafio = await this.clientDesafios
                                        .send('consultar-desafios', 
                                        { idJugador: '', _id: partida.desafio })
                                        .toPromise()
            /*
              Acionamos o tópico 'actualizar-desafio-partida' que será
              responsável por actualizar o desafio.
            */
            return await this.clientDesafios
                                    .emit('actualizar-desafio-partida', 
                                    { idPartida: idPartida, desafio: desafio })
                                    .toPromise()
            
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }

    }
}

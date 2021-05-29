import { DesafioStatus } from '../interfaces/desafio-status.enum';
import { IsOptional } from 'class-validator';

export class ActualizarDesafioDto {

  @IsOptional()
  //@IsDate()
  dataHoraDesafio: Date;

  @IsOptional()
  status: DesafioStatus;

}

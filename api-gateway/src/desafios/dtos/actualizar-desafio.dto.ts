import { DesafioStatus } from '../desafio-status.enum';
import { IsOptional } from 'class-validator';

export class ActualizarDesafioDto {
  @IsOptional()
  status: DesafioStatus;
}

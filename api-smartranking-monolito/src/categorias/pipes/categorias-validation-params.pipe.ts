import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
@Injectable()
export class CategoriasValidationParamsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    debugger
    if (!value) {
      throw new BadRequestException(
        `El valor del parametro ${metadata.data} debe ser informado`,
      );
    }  
    console.log(`value: ${value}, metadata: ${metadata.type}`);
    return value;
  }
}

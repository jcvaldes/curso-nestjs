import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';


@Injectable()
export class AwsService {
  private logger = new Logger(AwsService.name);
  constructor(private configService: ConfigService) {}
  async upload(file: any, id: string) {
    const AWS_S3_BUCKET_NAME = this.configService.get<string>('AWS_S3_BUCKET_NAME')
    const AWS_REGION = this.configService.get<string>('AWS_REGION')
    const AWS_ACCESS_KEY_ID = this.configService.get<string>('AWS_ACCESS_KEY_ID')
    const AWS_SECRET_ACCESS_KEY = this.configService.get<string>('AWS_SECRET_ACCESS_KEY')
    
    const s3 = new AWS.S3({
      region: AWS_REGION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    });

    const fileExt = file.originalname.split('.')[1];
    const urlKey = `${id}.${fileExt}`;

    this.logger.log(`urlKey: ${urlKey}`);
    const params = {
      Body: file.buffer,
      Bucket: AWS_S3_BUCKET_NAME, //bucket name de aws
      Key: urlKey,
    };

    const data = s3
      .putObject(params)
      .promise()
      .then(
        (data) => {
          return {
            // https://{NamBucket}.s3-{region}.amazonaws.com/{NombreArchivo}
            url: `https://smartranking12.s3.amazonaws.com/${urlKey}`,
          };
        },
        (err) => {
          this.logger.error(err);
          return err;
        },
      );

    return data;
  }
}

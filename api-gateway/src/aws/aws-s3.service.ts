import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AwsS3Config } from './aws-s3.config';
@Injectable()
export class AwsS3Service {
  private logger = new Logger(AwsS3Service.name);
  constructor(private awsS3Config: AwsS3Config) {}
  async upload(file: any, id: string) {
    try {
      const s3 = new AWS.S3({
        region: this.awsS3Config.AWS_REGION,
        accessKeyId: this.awsS3Config.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.awsS3Config.AWS_SECRET_ACCESS_KEY,
      });

      const fileExt = file.originalname.split('.')[1];
      const urlKey = `${id}.${fileExt}`;

      this.logger.log(`urlKey: ${urlKey}`);
      const params = {
        Body: file.buffer,
        Bucket: this.awsS3Config.AWS_S3_BUCKET_NAME, //bucket name de aws
        Key: urlKey,
      };

      // const data = s3
      //   .putObject(params)
      //   .promise()
      //   .then(
      //     (data) => {
      //       return {
      //         // https://{NamBucket}.s3-{region}.amazonaws.com/{NombreArchivo}
      //         url: `https://${this.awsS3Config.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${urlKey}`,
      //       };
      //     },
      //     (err) => {
      //       this.logger.error(err);
      //       return err;
      //     },
      //   );

      // return data;

      const result = await s3.putObject(params).promise();
      this.logger.log(result);
      return {
        // https://{NamBucket}.s3-{region}.amazonaws.com/{NombreArchivo}
        url: `https://${this.awsS3Config.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${urlKey}`,
      };
    } catch (err) {
      this.logger.error(err.message);
      throw new Error(err.message);
    }
  }
}

import { Module } from '@nestjs/common';
import { AwsCognitoConfig } from './aws-cognito.config';
import { AwsS3Service } from './aws-s3.service';
import { AwsCognitoService } from './aws-cognito.service';
import { AwsS3Config } from './aws-s3.config';

@Module({
  providers: [AwsS3Config, AwsS3Service, AwsCognitoConfig, AwsCognitoService],
  exports: [AwsS3Config, AwsS3Service, AwsCognitoConfig, AwsCognitoService],
})
export class AwsModule {}

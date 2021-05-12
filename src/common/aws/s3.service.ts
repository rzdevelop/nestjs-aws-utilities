import * as AWS from 'aws-sdk';
import { CustomLogger } from 'nestjs-utilities';

import { Inject, Injectable } from '@nestjs/common';
import { AwsOptions, AWS_OPTIONS } from './aws.interface';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  constructor(private readonly logger: CustomLogger, @Inject(AWS_OPTIONS) awsOptions?: AwsOptions) {
    logger.setContext(S3Service.name);
    logger.info('aws opts', awsOptions || {});
  }
}

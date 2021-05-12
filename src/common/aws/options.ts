import * as AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

import { AwsOptions } from './aws.interface';

export class OptionsFactory {
  static create(awsOptions: AwsOptions = {}) {
    const { localstack, accessKeyId = '', secretAccessKey = '', region } = awsOptions;
    const options: ServiceConfigurationOptions = {
      signatureVersion: 'v4',
      region: region || 'us-east-1',
    };

    if (localstack) {
      options.endpoint = localstack.endpoint || 'http://localstack:4566';
      options.credentials = new AWS.Credentials({
        accessKeyId: 'TEST',
        secretAccessKey: 'SECRET',
      });
      options.s3ForcePathStyle = true;
    } else if (accessKeyId && secretAccessKey) {
      options.credentials = new AWS.Credentials({
        accessKeyId,
        secretAccessKey,
      });
    }

    return options;
  }
}

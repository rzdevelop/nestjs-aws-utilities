import * as AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

import { AwsOptions } from './aws.interface';

export class OptionsFactory {
  static create(awsOptions: AwsOptions = {}): ServiceConfigurationOptions {
    const { localstack, credentials, region } = awsOptions;

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
    } else if (credentials) {
      options.credentials = new AWS.Credentials({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      });
    }

    return options;
  }
}

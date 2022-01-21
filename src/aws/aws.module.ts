import { DynamicModule, Module } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AwsOptions } from '.';
import { AwsModuleOptions } from './aws.interface';

import { S3Service } from './s3.service';

const validateAwsCredentials = (credentials: AwsOptions['credentials']): void => {
  if (credentials) {
    if (Object.values(credentials).filter((c) => c).length !== 2) {
      throw new Error('accessKeyId and/or secretKey cannot be empty strings');
    }
  }
};

@Module({})
export class AwsModule {
  static register({ awsOptions, optInProviders }: AwsModuleOptions): DynamicModule {
    validateAwsCredentials(awsOptions?.credentials);

    const module: DynamicModule = {
      module: AwsModule,
      imports: [],
      providers: [],
      exports: [],
    };

    if (optInProviders?.s3) {
      module.providers?.push({
        provide: S3Service,
        useFactory: (logger: PinoLogger) => new S3Service(logger, awsOptions),
        inject: [PinoLogger],
      });
      module.exports?.push(S3Service);
    }

    return module;
  }
}

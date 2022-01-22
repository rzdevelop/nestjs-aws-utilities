import { DynamicModule, Module } from '@nestjs/common';

import { AwsOptions } from './';
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
        useFactory: () => new S3Service(awsOptions),
        inject: [],
      });
      module.exports?.push(S3Service);
    }

    return module;
  }
}

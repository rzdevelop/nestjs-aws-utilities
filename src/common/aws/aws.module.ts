import { DynamicModule, Module } from '@nestjs/common';
import { CustomLoggerModule } from 'nestjs-utilities';
import { AwsModuleOptions, AWS_OPTIONS } from './aws.interface';

import { S3Service } from './s3.service';

@Module({})
export class AwsModule {
  static register({ awsOptions, optInProviders = { s3: true } }: AwsModuleOptions): DynamicModule {
    if (awsOptions) {
      if (Object.values(awsOptions).filter((c) => c).length !== 2) {
        throw new Error('accessKeyId and/or secretKey cannot be empty strings');
      }
    }
    const module: DynamicModule = {
      module: AwsModule,
      imports: [CustomLoggerModule.register()],
      providers: [{ provide: AWS_OPTIONS, useValue: awsOptions }],
      exports: [],
    };

    if (optInProviders.s3) {
      module.providers?.push(S3Service);
      module.exports?.push(S3Service);
    }

    return module;
  }
}

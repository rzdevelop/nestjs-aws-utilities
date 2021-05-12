import { DynamicModule, Module } from '@nestjs/common';
import { CustomLogger, CustomLoggerModule } from 'nestjs-utilities';
import { AwsModuleOptions } from './aws.interface';

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
      providers: [],
      exports: [],
    };

    if (optInProviders.s3) {
      module.providers?.push({
        provide: S3Service,
        useFactory: (logger: CustomLogger) => new S3Service(logger, awsOptions),
        inject: [CustomLogger],
      });
      module.exports?.push(S3Service);
    }

    return module;
  }
}

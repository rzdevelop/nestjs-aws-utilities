import { AWSError, S3 } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { PinoLogger } from 'nestjs-pino';

import { Injectable } from '@nestjs/common';

import { AwsOptions } from './aws.interface';
import { OptionsFactory } from './options';

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor(private readonly logger: PinoLogger, awsOptions?: AwsOptions) {
    this.logger.setContext(S3Service.name);

    const options = OptionsFactory.create(awsOptions);

    this.s3 = new S3(options);
  }

  public async getObject(
    params: AWS.S3.GetObjectRequest,
  ): Promise<PromiseResult<AWS.S3.GetObjectOutput, AWS.AWSError>> {
    return this.s3.getObject(params).promise();
  }

  public async deleteFile(
    params: AWS.S3.DeleteObjectRequest,
  ): Promise<PromiseResult<AWS.S3.DeleteObjectOutput, AWS.AWSError>> {
    return this.s3.deleteObject(params).promise();
  }

  public async putObject(
    params: AWS.S3.PutObjectRequest,
  ): Promise<PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>> {
    return this.s3.deleteObject(params).promise();
  }

  public async listAllObject(initialParams: AWS.S3.ListObjectsV2Request): Promise<AWS.S3.ObjectList> {
    const params: AWS.S3.ListObjectsV2Request = { ...initialParams };
    let content: AWS.S3.ObjectList = [];
    let response: PromiseResult<AWS.S3.ListObjectsV2Output, AWS.AWSError>;
    do {
      response = await this.s3.listObjectsV2(params).promise();
      content = content.concat(response.Contents || []);
      params.ContinuationToken = response.NextContinuationToken;
    } while (response.IsTruncated);

    return content;
  }

  public async copyObject(
    params: AWS.S3.CopyObjectRequest,
  ): Promise<PromiseResult<AWS.S3.CopyObjectOutput, AWS.AWSError>> {
    return this.s3.copyObject(params).promise();
  }

  public async exists(params: AWS.S3.HeadObjectRequest): Promise<boolean> {
    return this.s3
      .headObject(params)
      .promise()
      .then(
        () => true,
        (e) => {
          const err = e as AWSError;
          if (err.code === 'NotFound') {
            return false;
          }
          throw err;
        },
      );
  }
}

import { AWSError, S3 } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

import { Injectable } from '@nestjs/common';

import { AwsOptions } from './aws.interface';
import { OptionsFactory } from './options';
import {
  CopyObjectOutput,
  CopyObjectRequest,
  DeleteObjectOutput,
  DeleteObjectRequest,
  GetObjectOutput,
  GetObjectRequest,
  HeadObjectRequest,
  ListObjectsV2Output,
  ListObjectsV2Request,
  ObjectList,
  PutObjectOutput,
  PutObjectRequest,
} from 'aws-sdk/clients/s3';

@Injectable()
export class S3Service {
  protected s3: S3;

  constructor(awsOptions?: AwsOptions) {
    const options = OptionsFactory.create(awsOptions);

    this.s3 = new S3(options);
  }

  public async getObject(params: GetObjectRequest): Promise<PromiseResult<GetObjectOutput, AWSError>> {
    return this.s3.getObject(params).promise();
  }

  public async deleteFile(params: DeleteObjectRequest): Promise<PromiseResult<DeleteObjectOutput, AWSError>> {
    return this.s3.deleteObject(params).promise();
  }

  public async putObject(params: PutObjectRequest): Promise<PromiseResult<PutObjectOutput, AWSError>> {
    return this.s3.deleteObject(params).promise();
  }

  public async listAllObject(initialParams: ListObjectsV2Request): Promise<ObjectList> {
    const params: ListObjectsV2Request = { ...initialParams };
    let content: ObjectList = [];
    let response: PromiseResult<ListObjectsV2Output, AWSError>;
    do {
      response = await this.s3.listObjectsV2(params).promise();
      content = content.concat(response.Contents || []);
      params.ContinuationToken = response.NextContinuationToken;
    } while (response.IsTruncated);

    return content;
  }

  public async copyObject(params: CopyObjectRequest): Promise<PromiseResult<CopyObjectOutput, AWSError>> {
    return this.s3.copyObject(params).promise();
  }

  public async exists(params: HeadObjectRequest): Promise<boolean> {
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

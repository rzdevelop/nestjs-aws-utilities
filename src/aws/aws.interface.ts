export interface AwsOptions {
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  region?: string;
  localstack?: LocalstackOptions;
}

export interface LocalstackOptions {
  endpoint?: string;
}

export interface AwsModuleOptions {
  awsOptions?: AwsOptions;
  optInProviders?: {
    s3?: boolean;
  };
}

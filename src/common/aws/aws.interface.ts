export interface AwsOptions {
  accessKeyId?: string;
  secretKey?: string;
  region?: string;
}

export interface AwsModuleOptions {
  awsOptions?: AwsOptions;
  optInProviders?: {
    s3?: boolean;
  };
}

export const AWS_OPTIONS = 'AWS_OPTIONS';

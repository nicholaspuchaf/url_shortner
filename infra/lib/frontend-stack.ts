import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import { resolve } from 'node:path';
import { Construct } from 'constructs';

export interface FrontendStackProps extends cdk.StackProps {
  stage: 'dev' | 'prod'
  frontendDir?: string
  enableWaf?: boolean
}

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    const frontendDir = props.frontendDir ?? resolve(__dirname, '../../frontend/dist');
    const isProd = props.stage === 'prod';

    const siteBucket = new s3.Bucket(this, 'FrontendSiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: false,
      removalPolicy: isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: !isProd,
    });

    const distribution = new cloudfront.Distribution(this, 'FrontendDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
    });

    if (props.enableWaf) {
      const webAcl = new wafv2.CfnWebACL(this, 'FrontendWebAcl', {
        defaultAction: { allow: {} },
        scope: 'CLOUDFRONT',
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: `${id}-web-acl`,
          sampledRequestsEnabled: true,
        },
        rules: [
          {
            name: 'AWSManagedCommonRules',
            priority: 1,
            overrideAction: { none: {} },
            statement: {
              managedRuleGroupStatement: {
                vendorName: 'AWS',
                name: 'AWSManagedRulesCommonRuleSet',
              },
            },
            visibilityConfig: {
              cloudWatchMetricsEnabled: true,
              metricName: `${id}-common-rules`,
              sampledRequestsEnabled: true,
            },
          },
        ],
      });

      distribution.attachWebAclId(webAcl.attrArn);
    }

    new s3deploy.BucketDeployment(this, 'FrontendAssetDeployment', {
      sources: [s3deploy.Source.asset(frontendDir)],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    new cdk.CfnOutput(this, 'FrontendDistributionUrl', {
      value: `https://${distribution.distributionDomainName}`,
    });

    new ssm.StringParameter(this, 'FrontendUrlParameter', {
      parameterName: `/url-shortner/${props.stage}/frontend-url`,
      stringValue: `https://${distribution.distributionDomainName}`,
    });

    new cdk.CfnOutput(this, 'FrontendUrlParameterName', {
      value: `/url-shortner/${props.stage}/frontend-url`,
    });
  }
}

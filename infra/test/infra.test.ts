import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { InfraStack } from '../lib/infra-stack';

test('stack defines lambda and dynamodb', () => {
  const app = new cdk.App();
  const stack = new InfraStack(app, 'MyTestStack', {
    stage: 'dev',
  });
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::DynamoDB::Table', 1);
  template.resourceCountIs('AWS::Lambda::Function', 1);
  template.resourceCountIs('AWS::ApiGatewayV2::Api', 1);
  template.hasResourceProperties('AWS::ApiGatewayV2::Api', {
    CorsConfiguration: {
      AllowHeaders: ['content-type'],
      AllowMethods: ['GET', 'POST', 'OPTIONS'],
      MaxAge: 86400,
    },
  });
  template.hasResourceProperties('AWS::Lambda::Function', {
    ReservedConcurrentExecutions: 2,
  });
  template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: Match.arrayWith([
        Match.objectLike({
          Action: ['dynamodb:DescribeTable', 'dynamodb:GetItem', 'dynamodb:PutItem'],
          Effect: 'Allow',
        }),
      ]),
    },
  });
  template.hasResourceProperties('AWS::DynamoDB::Table', {
    TimeToLiveSpecification: {
      AttributeName: 'expiresAt',
      Enabled: true,
    },
  });
  template.hasResourceProperties('AWS::ApiGatewayV2::Stage', {
    StageName: '$default',
    RouteSettings: {
      'POST /shorten': {
        ThrottlingBurstLimit: 5,
        ThrottlingRateLimit: 1,
      },
    },
  });
});

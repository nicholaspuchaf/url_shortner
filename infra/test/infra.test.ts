import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
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
});

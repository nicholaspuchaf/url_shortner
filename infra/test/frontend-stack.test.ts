import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { FrontendStack } from '../lib/frontend-stack';

const makeFrontendDist = () => {
  const dir = mkdtempSync(join(tmpdir(), 'frontend-dist-'));
  writeFileSync(join(dir, 'index.html'), '<!doctype html><html><body>test</body></html>');
  return dir;
};

test('frontend stack creates s3, cloudfront and ssm parameter', () => {
  const app = new cdk.App();
  const stack = new FrontendStack(app, 'FrontendStack', {
    stage: 'dev',
    frontendDir: makeFrontendDist(),
  });
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::S3::Bucket', 1);
  template.resourceCountIs('AWS::CloudFront::Distribution', 1);
  template.resourceCountIs('AWS::SSM::Parameter', 1);
});

test('frontend stack can enable waf', () => {
  const app = new cdk.App();
  const stack = new FrontendStack(app, 'FrontendStackWithWaf', {
    stage: 'dev',
    frontendDir: makeFrontendDist(),
    enableWaf: true,
  });
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::WAFv2::WebACL', 1);
});

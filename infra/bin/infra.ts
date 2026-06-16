#!/usr/bin/env node
import "../lib/Config";
import * as cdk from "aws-cdk-lib";
import { InfraStack } from "../lib/infra-stack";

const app = new cdk.App();

const customDomainName = process.env.API_DOMAIN_NAME;
const hostedZoneName = process.env.HOSTED_ZONE_NAME;

new InfraStack(app, "url-shortner-infra-stack", {
  stage: 'dev',
  customDomain:
    customDomainName && hostedZoneName
      ? {
          domainName: customDomainName,
          hostedZoneName,
        }
      : undefined,
});

#!/usr/bin/env node
import "../lib/Config";
import * as cdk from "aws-cdk-lib";
import { InfraStack } from "../lib/infra-stack";

const app = new cdk.App();
const stage = process.env.CDK_ENV === "prod" ? "prod" : "dev";

const customDomainName = process.env.API_DOMAIN_NAME;
const hostedZoneName = process.env.HOSTED_ZONE_NAME;

new InfraStack(app, "InfraStack", {
  stage,
  customDomain:
    customDomainName && hostedZoneName
      ? {
          domainName: customDomainName,
          hostedZoneName,
        }
      : undefined,
});

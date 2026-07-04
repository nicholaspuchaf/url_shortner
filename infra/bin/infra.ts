#!/usr/bin/env node
import "../lib/Config";
import * as cdk from "aws-cdk-lib";
import { InfraStack } from "../lib/infra-stack";
import { FrontendStack } from "../lib/frontend-stack";

const app = new cdk.App();

const stage = "dev";
const customDomainName = process.env.API_DOMAIN_NAME;
const hostedZoneName = process.env.HOSTED_ZONE_NAME;
const enableFrontendWaf = process.env.ENABLE_FRONTEND_WAF === "true";
const frontendUrlParameterName = `/url-shortner/${stage}/frontend-url`;

const frontendStack = new FrontendStack(app, "url-shortner-frontend-stack", {
  stage,
  enableWaf: enableFrontendWaf,
});

const infraStack = new InfraStack(app, "url-shortner-infra-stack", {
  stage,
  frontendUrlParameterName,
  customDomain:
    customDomainName && hostedZoneName
      ? {
          domainName: customDomainName,
          hostedZoneName,
        }
      : undefined,
});

infraStack.addDependency(frontendStack);

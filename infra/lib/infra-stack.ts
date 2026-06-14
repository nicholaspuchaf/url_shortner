import * as cdk from "aws-cdk-lib";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as certmgr from "aws-cdk-lib/aws-certificatemanager";
import * as dynamo from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import { resolve } from "node:path";
import { Construct } from "constructs";

export type InfraStage = "dev" | "prod";

export interface InfraStackProps extends cdk.StackProps {
  stage: InfraStage;
  backendDir?: string;
  customDomain?: {
    domainName: string;
    hostedZoneName: string;
  };
}

const toRecordName = (domainName: string, zoneName: string): string => {
  if (domainName === zoneName) {
    return "";
  }

  if (!domainName.endsWith(zoneName)) {
    return domainName;
  }

  const relative = domainName.slice(0, -(zoneName.length + 1));
  return relative.endsWith(".") ? relative.slice(0, -1) : relative;
};

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: InfraStackProps) {
    super(scope, id, props);

    const backendDir = props.backendDir ?? resolve(__dirname, "../../backend");
    const isProd = props.stage === "prod";

    const linksTable = new dynamo.Table(this, "LinksTable", {
      partitionKey: {
        name: "code",
        type: dynamo.AttributeType.STRING,
      },
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
      removalPolicy: isProd ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: isProd,
      },
    });

    const urlShortener = new lambda.Function(this, "UrlShortenerFunction", {
      code: lambda.Code.fromAsset(backendDir),
      handler: "handler.lambda_handler",
      runtime: lambda.Runtime.PYTHON_3_12,
      timeout: cdk.Duration.seconds(1),
      memorySize: 256,
      environment: {
        STAGE: props.stage,
        LINKS_TABLE_NAME: linksTable.tableName,
      },
      architecture: lambda.Architecture.ARM_64,
    });

    linksTable.grantReadWriteData(urlShortener);

    const httpApi = new apigwv2.HttpApi(this, "UrlShortenerApi", {
      apiName: "url-shortener",
    });
    const integration = new HttpLambdaIntegration("UrlShortenerIntegration", urlShortener);

    httpApi.addRoutes({
      path: "/",
      methods: [apigwv2.HttpMethod.GET],
      integration,
    });

    httpApi.addRoutes({
      path: "/shorten",
      methods: [apigwv2.HttpMethod.POST],
      integration,
    });

    httpApi.addRoutes({
      path: "/{code}",
      methods: [apigwv2.HttpMethod.GET],
      integration,
    });

    if (props.customDomain) {
      const hostedZone = new route53.PublicHostedZone(this, "HostedZone", {
        zoneName: props.customDomain.hostedZoneName,
      });

      const certificate = new certmgr.Certificate(this, "ApiCertificate", {
        domainName: props.customDomain.domainName,
        validation: certmgr.CertificateValidation.fromDns(hostedZone),
      });

      const domainName = new apigwv2.DomainName(this, "ApiDomainName", {
        domainName: props.customDomain.domainName,
        certificate,
      });

      new apigwv2.ApiMapping(this, "ApiMapping", {
        api: httpApi,
        domainName,
        stage: httpApi.defaultStage!,
      });

      const recordName = toRecordName(props.customDomain.domainName, props.customDomain.hostedZoneName);

      new route53.ARecord(this, "ApiAliasRecord", {
        zone: hostedZone,
        ...(recordName ? { recordName } : {}),
        target: route53.RecordTarget.fromAlias(
          new route53Targets.ApiGatewayv2DomainProperties(
            domainName.regionalDomainName,
            domainName.regionalHostedZoneId,
          ),
        ),
      });

      new cdk.CfnOutput(this, "CustomDomainUrl", {
        value: `https://${props.customDomain.domainName}`,
      });
    }

    new cdk.CfnOutput(this, "LinksTableName", {
      value: linksTable.tableName,
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: httpApi.apiEndpoint,
    });
  }
}

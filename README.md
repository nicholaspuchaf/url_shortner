# URL Shortener

Projeto serverless para encurtar URLs na AWS.

O fluxo principal é:
- o usuário envia uma URL longa para `POST /shorten`
- o backend gera um código curto determinístico a partir do hash da URL
- o código e a URL original são salvos no DynamoDB
- `GET /{code}` faz o redirect para a URL original

## Tech Stack

- `AWS CDK` para infraestrutura como código
- `TypeScript` para a stack da infraestrutura
- `Python 3.12` para a Lambda
- `boto3` para acesso ao DynamoDB na Lambda
- `API Gateway HTTP API` como camada HTTP
- `DynamoDB` como banco NoSQL
- `Route 53` para DNS do domínio customizado
- `ACM` para certificado TLS do domínio
- `uv` para testes Python no backend
- `Jest` para testes da stack CDK
- `pnpm` para gerenciamento de pacotes do projeto raiz

## Recursos AWS

- `AWS Lambda`
  - executa o handler Python
  - responde `POST /shorten`, `GET /{code}` e `GET /`
- `Amazon API Gateway HTTP API`
  - expõe a Lambda via HTTP
  - é a borda pública da API
- `Amazon DynamoDB`
  - armazena `code`, `url` e `createdAt`
  - usa chave primária simples em `code`
- `Amazon Route 53`
  - cria o alias DNS do domínio customizado
- `AWS Certificate Manager`
  - emite o certificado TLS para o domínio
- `CloudWatch Logs`
  - recebe os logs da Lambda e do API Gateway

## Arquitetura Atual

- A infraestrutura está em [`infra/`](./infra)
- O backend Python está em [`backend/`](./backend)
- A stack principal está em [`infra/lib/infra-stack.ts`](./infra/lib/infra-stack.ts)

## Estimativa De Custo

Premissas usadas nesta estimativa:
- região: `us-east-1`
- preços públicos, sem desconto e sem Savings Plan
- sem considerar free tier, exceto quando explicitado
- Lambda com `256 MB` e `100 ms` médios por requisição
- tráfego com `10%` de `POST /shorten` e `90%` de `GET /{code}`
- logs da Lambda em torno de `1 KB` por requisição
- item médio do DynamoDB em torno de `300 bytes`
- domínio customizado ativo com `Route 53` + `ACM`

Observação:
- `ACM` para certificado público padrão não adiciona custo
- `Route 53` tem custo fixo da hosted zone e custo por consulta DNS
- `CloudWatch Logs` pode ficar barato ou até zero em cenários pequenos por causa do free tier de logs

### Custos Por Recurso

| Recurso | Baixo | Médio | Alto |
| --- | ---: | ---: | ---: |
| Lambda | $0.05 | $0.53 | $5.33 |
| API Gateway HTTP API | $0.10 | $1.00 | $10.00 |
| DynamoDB requests | $0.04 | $0.35 | $3.50 |
| DynamoDB storage | $0.00 | $0.01 | $0.07 |
| CloudWatch Logs | $0.00 | $0.00 | $2.50 |
| Route 53 hosted zone + DNS | $0.50 | $0.54 | $0.90 |
| ACM certificado público | $0.00 | $0.00 | $0.00 |
| **Total estimado** | **$0.69** | **$2.43** | **$22.30** |

### Definição Dos Cenários

- Baixo: `100k` requisições/mês
- Médio: `1M` requisições/mês
- Alto: `10M` requisições/mês

Distribuição considerada:
- `10%` criação de links
- `90%` redirecionamentos

### Notas Importantes

- Se o domínio customizado não for usado, `Route 53` e `ACM` deixam de existir no custo mensal do projeto.
- Se o volume de logs crescer, `CloudWatch Logs` pode subir rapidamente.
- Se o padrão de uso tiver mais `POST /shorten` do que `GET /{code}`, o custo do DynamoDB aumenta.
- O custo da Lambda tende a ser baixo neste caso; a maior parte do valor vem de API Gateway e, em volume alto, de CloudWatch Logs e DynamoDB.

## Fontes De Preço

- AWS Lambda Pricing: https://aws.amazon.com/lambda/pricing/
- API Gateway Pricing: https://aws.amazon.com/api-gateway/pricing/
- DynamoDB Pricing: https://aws.amazon.com/dynamodb/pricing/
- Route 53 Pricing: https://aws.amazon.com/route53/pricing/
- ACM Pricing: https://aws.amazon.com/certificate-manager/pricing/
- CloudWatch Pricing: https://aws.amazon.com/cloudwatch/pricing/


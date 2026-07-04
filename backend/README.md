# Backend security and cost controls

This backend is a small AWS Lambda URL shortener API backed by DynamoDB. It is intended for low-traffic portfolio/demo usage, so the controls below focus on keeping abuse and monthly cost bounded.

## Cost controls

- API Gateway throttles `POST /shorten` at 1 request per second with a burst of 5. Redirect reads are not throttled with that strict limit.
- Lambda reserved concurrency is capped at 2 concurrent executions.
- DynamoDB uses on-demand billing, so there is no provisioned capacity running while idle.
- DynamoDB TTL is enabled on `expiresAt`; new links expire after 30 days.
- Lambda timeout is 1 second and memory is 256 MB on ARM64.
- The stack does not require Route 53, ACM, WAF, NAT Gateway, load balancers, RDS, or EC2 for the default no-custom-domain deployment.

## Request and URL validation

- `POST /shorten` requires a JSON body with a non-empty string `url`.
- URLs are capped at 2048 characters.
- Only `http` and `https` schemes are accepted.
- `localhost`, `*.localhost`, `*.local`, and `metadata.google.internal` are blocked.
- Private, loopback, link-local, multicast, reserved, and unspecified IP addresses are blocked.
- The AWS metadata IP `169.254.169.254` is blocked through the link-local IP check.
- ASCII control characters, including CR and LF, are rejected to prevent header injection in redirect responses.

## CORS

- The Lambda includes CORS headers in JSON and redirect responses.
- API Gateway HTTP API also has CORS preflight configured for `GET`, `POST`, and `OPTIONS`.
- Allowed origin is the deployed frontend URL stored in SSM and passed to the Lambda as `CORS_ORIGIN`.
- CORS is not an anti-bot or authentication mechanism; scripts can call the API directly.

## Injection notes

- Classic SQL injection does not apply because the backend does not use SQL.
- DynamoDB calls use structured `get_item` and `put_item` operations rather than string-built expressions from user input.
- XSS risk is low in the handler because URLs are treated as data and `javascript:` URLs are rejected. The frontend should continue rendering user-controlled values through Svelte bindings, not `{@html}`.

## Remaining recommended controls

- Add a create-token or simple auth gate before `POST /shorten` if this API is exposed publicly for long periods.
- Configure AWS Budgets with a low alert threshold, such as USD 1 or USD 5.
- Keep CloudWatch logs minimal and avoid logging full submitted URLs.

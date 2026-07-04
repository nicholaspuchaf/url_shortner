import json
import hashlib
import os
from datetime import datetime, timezone
from urllib.parse import urlparse

import boto3
from botocore.exceptions import ClientError

TABLE_NAME = os.environ["LINKS_TABLE_NAME"]
CORS_ORIGIN = os.environ.get("CORS_ORIGIN", "*")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


def _cors_headers():
    return {
        "Access-Control-Allow-Origin": CORS_ORIGIN,
        "Access-Control-Allow-Headers": "content-type",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    }


def _response(status_code, body=None, headers=None):
    payload = "" if body is None else json.dumps(body)
    response_headers = {"content-type": "application/json", **_cors_headers()}
    if headers:
        response_headers.update(headers)

    return {
        "statusCode": status_code,
        "headers": response_headers,
        "body": payload,
    }


def _redirect(location):
    return {
        "statusCode": 302,
        "headers": {"Location": location, **_cors_headers()},
        "body": "",
    }


def _short_code(url, length=7):
    return hashlib.blake2s(url.encode("utf-8")).hexdigest()[:length]


def _short_url(event, code):
    protocol = event.get("headers", {}).get("x-forwarded-proto", "https")
    host = event["requestContext"]["domainName"]
    return f"{protocol}://{host}/{code}"


def _is_valid_url(value):
    parsed = urlparse(value)
    return bool(parsed.scheme and parsed.netloc)


def _save_link(url):
    code = _short_code(url)
    existing = table.get_item(Key={"code": code}).get("Item")

    if existing:
        if existing.get("url") != url:
            raise ValueError("Hash collision detected for a different URL")
        return code, False

    table.put_item(
        Item={
            "code": code,
            "url": url,
            "createdAt": datetime.now(timezone.utc).isoformat(),
        },
        ConditionExpression="attribute_not_exists(code)",
    )
    return code, True


def lambda_handler(event, context):
    method = event["requestContext"]["http"]["method"].upper()
    raw_path = event.get("rawPath", "/")
    path = raw_path.lstrip("/")

    if method == "OPTIONS":
        return {
            "statusCode": 204,
            "headers": _cors_headers(),
            "body": "",
        }

    if method == "GET" and path and path != "shorten":
        code = path.split("/", 1)[0]
        result = table.get_item(Key={"code": code})
        item = result.get("Item")

        if not item:
            return _response(404, {"message": "Short URL not found"})

        return _redirect(item["url"])

    if method == "POST" and path == "shorten":
        if not event.get("body"):
            return _response(400, {"message": "Request body is required"})

        try:
            payload = json.loads(event["body"])
        except json.JSONDecodeError:
            return _response(400, {"message": "Invalid JSON body"})

        url = payload.get("url")
        if not isinstance(url, str) or not url:
            return _response(400, {"message": "Field 'url' must be a non-empty string"})

        if not _is_valid_url(url):
            return _response(400, {"message": "Field 'url' must be a valid URL"})

        try:
            code, created = _save_link(url)
        except ValueError as error:
            return _response(409, {"message": str(error)})
        return _response(
            201 if created else 200,
            {
                "code": code,
                "url": url,
                "shortUrl": _short_url(event, code),
            },
        )

    if method == "GET" and raw_path == "/":
        return _response(
            200,
            {
                "message": "URL shortener API",
                "routes": {
                    "create": "POST /shorten",
                    "redirect": "GET /{code}",
                },
            },
        )

    return _response(404, {"message": "Route not found"})

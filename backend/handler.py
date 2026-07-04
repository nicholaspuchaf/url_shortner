import json
import hashlib
import ipaddress
import os
import re
from datetime import datetime, timedelta, timezone
from urllib.parse import urlparse

import boto3
from botocore.exceptions import ClientError

TABLE_NAME = os.environ["LINKS_TABLE_NAME"]
CORS_ORIGIN = os.environ.get("CORS_ORIGIN", "*")
MAX_URL_LENGTH = 2048
LINK_TTL_DAYS = 30
BLOCKED_HOSTS = {"localhost", "metadata.google.internal"}
BLOCKED_SUFFIXES = (".localhost", ".local")
BLOCKED_URL_CHARACTERS = frozenset("<>\"'`{}")
HOSTNAME_LABEL_PATTERN = re.compile(r"^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$")
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


def _has_control_characters(value):
    return any(ord(character) < 32 or ord(character) == 127 for character in value)


def _has_blocked_url_characters(value):
    return any(character in BLOCKED_URL_CHARACTERS for character in value)


def _parse_url(value):
    parsed = urlparse(value)
    if parsed.scheme:
        return parsed

    return urlparse(f"https://{value}")


def _normalize_url(value):
    parsed = urlparse(value)
    if parsed.scheme:
        return value

    return f"https://{value}"


def _is_valid_hostname(hostname):
    if "." not in hostname:
        return False

    if all(character.isdigit() or character == "." for character in hostname):
        return False

    labels = hostname.split(".")
    return all(HOSTNAME_LABEL_PATTERN.match(label) for label in labels)


def _is_valid_url(value):
    if len(value) > MAX_URL_LENGTH or _has_control_characters(value) or _has_blocked_url_characters(value):
        return False

    try:
        parsed = _parse_url(value)
        hostname = parsed.hostname
    except ValueError:
        return False

    if parsed.scheme not in {"http", "https"} or not parsed.netloc or not hostname:
        return False

    if parsed.username or parsed.password:
        return False

    hostname = hostname.rstrip(".").lower()
    if hostname in BLOCKED_HOSTS or hostname.endswith(BLOCKED_SUFFIXES):
        return False

    try:
        address = ipaddress.ip_address(hostname)
    except ValueError:
        return _is_valid_hostname(hostname)

    return not (
        address.is_private
        or address.is_loopback
        or address.is_link_local
        or address.is_multicast
        or address.is_reserved
        or address.is_unspecified
    )


def _save_link(url):
    code = _short_code(url)
    existing = table.get_item(Key={"code": code}).get("Item")

    if existing:
        if existing.get("url") != url:
            raise ValueError("Hash collision detected for a different URL")
        return code, False

    now = datetime.now(timezone.utc)
    table.put_item(
        Item={
            "code": code,
            "url": url,
            "createdAt": now.isoformat(),
            "expiresAt": int((now + timedelta(days=LINK_TTL_DAYS)).timestamp()),
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

        url = _normalize_url(url)

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

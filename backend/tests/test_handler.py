import importlib
import json
import os
import sys
import types
import unittest
from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock
from unittest.mock import patch


class FakeClientError(Exception):
    def __init__(self, code: str):
        super().__init__(code)
        self.response = {"Error": {"Code": code}}


class FakeTable:
    def __init__(self):
        self.items = {}
        self.put_item = MagicMock(side_effect=self._put_item)
        self.get_item = MagicMock(side_effect=self._get_item)

    def _put_item(self, Item, **kwargs):
        code = Item["code"]
        if kwargs.get("ConditionExpression") == "attribute_not_exists(code)" and code in self.items:
            raise FakeClientError("ConditionalCheckFailedException")
        self.items[code] = Item
        return {"ResponseMetadata": {"HTTPStatusCode": 200}}

    def _get_item(self, Key):
        item = self.items.get(Key["code"])
        return {"Item": item} if item else {}


def load_handler(fake_table):
    sys.modules.pop("handler", None)
    sys.modules.pop("boto3", None)
    sys.modules.pop("botocore", None)
    sys.modules.pop("botocore.exceptions", None)

    boto3_module = types.ModuleType("boto3")
    boto3_module.resource = MagicMock(return_value=MagicMock(Table=MagicMock(return_value=fake_table)))

    botocore_module = types.ModuleType("botocore")
    exceptions_module = types.ModuleType("botocore.exceptions")
    exceptions_module.ClientError = FakeClientError
    botocore_module.exceptions = exceptions_module

    sys.modules["boto3"] = boto3_module
    sys.modules["botocore"] = botocore_module
    sys.modules["botocore.exceptions"] = exceptions_module

    os.environ["LINKS_TABLE_NAME"] = "links"
    return importlib.import_module("handler")


class HandlerTests(unittest.TestCase):
    def test_short_code_is_deterministic(self):
        handler = load_handler(FakeTable())

        self.assertEqual(handler._short_code("https://example.com"), handler._short_code("https://example.com"))
        self.assertEqual(len(handler._short_code("https://example.com")), 7)

    def test_post_shorten_reuses_existing_link(self):
        fake_table = FakeTable()
        handler = load_handler(fake_table)
        url = "https://example.com/docs"
        code = handler._short_code(url)
        fake_table.items[code] = {
            "code": code,
            "url": url,
            "createdAt": "2026-01-01T00:00:00+00:00",
        }

        event = {
            "requestContext": {"http": {"method": "POST"}, "domainName": "abc.lambda-url.us-east-1.on.aws"},
            "rawPath": "/shorten",
            "headers": {"x-forwarded-proto": "https"},
            "body": json.dumps({"url": url}),
        }

        response = handler.lambda_handler(event, None)

        self.assertEqual(response["statusCode"], 200)
        self.assertEqual(json.loads(response["body"])["code"], code)
        self.assertEqual(fake_table.put_item.call_count, 0)

    def test_post_shorten_sets_expiration_30_days_ahead(self):
        fake_table = FakeTable()
        handler = load_handler(fake_table)
        now = datetime(2026, 1, 1, 12, 0, tzinfo=timezone.utc)
        url = "https://example.com/docs"

        with patch.object(handler, "datetime") as datetime_mock:
            datetime_mock.now.return_value = now
            datetime_mock.side_effect = lambda *args, **kwargs: datetime(*args, **kwargs)
            code, created = handler._save_link(url)

        self.assertTrue(created)
        expected_expiration = int((now + timedelta(days=30)).timestamp())
        self.assertEqual(fake_table.items[code]["expiresAt"], expected_expiration)

    def test_get_redirects_existing_code(self):
        fake_table = FakeTable()
        handler = load_handler(fake_table)
        fake_table.items["abc1234"] = {
            "code": "abc1234",
            "url": "https://example.com",
            "createdAt": "2026-01-01T00:00:00+00:00",
        }

        event = {
            "requestContext": {"http": {"method": "GET"}, "domainName": "abc.lambda-url.us-east-1.on.aws"},
            "rawPath": "/abc1234",
            "headers": {},
        }

        response = handler.lambda_handler(event, None)

        self.assertEqual(response["statusCode"], 302)
        self.assertEqual(response["headers"]["Location"], "https://example.com")
        self.assertEqual(response["headers"]["Access-Control-Allow-Origin"], "*")

    def test_options_returns_cors_headers(self):
        handler = load_handler(FakeTable())

        event = {
            "requestContext": {"http": {"method": "OPTIONS"}, "domainName": "abc.lambda-url.us-east-1.on.aws"},
            "rawPath": "/shorten",
            "headers": {},
        }

        response = handler.lambda_handler(event, None)

        self.assertEqual(response["statusCode"], 204)
        self.assertEqual(response["headers"]["Access-Control-Allow-Origin"], "*")
        self.assertIn("POST", response["headers"]["Access-Control-Allow-Methods"])

    def test_rejects_unsupported_url_schemes(self):
        handler = load_handler(FakeTable())

        self.assertFalse(handler._is_valid_url("ftp://example.com/file"))
        self.assertFalse(handler._is_valid_url("javascript:alert(1)"))

    def test_rejects_local_and_private_hosts(self):
        handler = load_handler(FakeTable())

        self.assertFalse(handler._is_valid_url("http://localhost:3000"))
        self.assertFalse(handler._is_valid_url("http://app.local"))
        self.assertFalse(handler._is_valid_url("http://127.0.0.1"))
        self.assertFalse(handler._is_valid_url("http://10.0.0.1"))
        self.assertFalse(handler._is_valid_url("http://172.16.0.1"))
        self.assertFalse(handler._is_valid_url("http://192.168.1.1"))
        self.assertFalse(handler._is_valid_url("http://169.254.169.254/latest/meta-data"))

    def test_accepts_public_http_and_https_urls(self):
        handler = load_handler(FakeTable())

        self.assertTrue(handler._is_valid_url("https://example.com/docs"))
        self.assertTrue(handler._is_valid_url("http://example.com/path?utm_source=cv"))

    def test_rejects_urls_longer_than_limit(self):
        handler = load_handler(FakeTable())

        self.assertFalse(handler._is_valid_url(f"https://example.com/{'a' * 2048}"))

    def test_rejects_header_injection_control_characters(self):
        handler = load_handler(FakeTable())

        self.assertFalse(handler._is_valid_url("https://example.com\r\nLocation: https://evil.test"))
        self.assertFalse(handler._is_valid_url("https://example.com/path\nSet-Cookie: injected=true"))
        self.assertFalse(handler._is_valid_url("https://example.com/\x7f"))


if __name__ == "__main__":
    unittest.main()

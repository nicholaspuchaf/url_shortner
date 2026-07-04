import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function readEnvFile() {
  try {
    return readFileSync(resolve(process.cwd(), ".env"), "utf8");
  } catch {
    return "";
  }
}

function getEnvValue(name) {
  if (process.env[name]) {
    return process.env[name];
  }

  for (const line of readEnvFile().split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match?.[1] === name) {
      return match[2].replace(/^['"]|['"]$/g, "");
    }
  }

  return undefined;
}

const backendUrl = getEnvValue("VITE_BACKEND_URL");

if (!backendUrl) {
  console.error("VITE_BACKEND_URL is required for production builds.");
  console.error("Example: VITE_BACKEND_URL=https://abc123.execute-api.us-east-1.amazonaws.com pnpm build");
  process.exit(1);
}

try {
  new URL(backendUrl);
} catch {
  console.error(`VITE_BACKEND_URL must be a valid absolute URL. Received: ${backendUrl}`);
  process.exit(1);
}

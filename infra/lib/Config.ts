import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';

const envName = process.env.CDK_ENV === 'prod' ? 'prod' : 'dev';
const envFile = resolve(process.cwd(), `.env.${envName}`);

if (existsSync(envFile)) {
  loadEnv({ path: envFile, override: true });
}

export const loadedEnvFile = envFile;

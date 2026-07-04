import type { ShortenLinkResponse } from './api';

export const linkHistoryStorageKey = 'url-shortener:generated-links';

export type GeneratedLink = ShortenLinkResponse & {
  createdAt: string
}

export function isGeneratedLink(value: unknown): value is GeneratedLink {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const link = value as Record<string, unknown>;
  return (
    typeof link.code === 'string' &&
    typeof link.url === 'string' &&
    typeof link.shortUrl === 'string' &&
    typeof link.createdAt === 'string'
  );
}

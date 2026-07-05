import environment from './environment';

const backendBaseUrl = environment.backendUrl.replace(/\/$/, '');

export function getBackendDomain() {
  try {
    return new URL(backendBaseUrl).host;
  } catch {
    return backendBaseUrl.replace(/^https?:\/\//, '');
  }
}

export type ShortenLinkInput = {
  url: string
}

export type ShortenLinkResponse = {
  code: string
  url: string
  shortUrl: string
}

type ErrorResponse = {
  message?: string
}

export async function shortenLink(input: ShortenLinkInput): Promise<ShortenLinkResponse> {
  const response = await fetch(`${backendBaseUrl}/shorten`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as ErrorResponse;
      if (typeof errorBody.message === 'string' && errorBody.message.trim()) {
        message = errorBody.message;
      }
    } catch {
      // Ignore invalid error payloads and keep the default message.
    }

    throw new Error(message);
  }

  return (await response.json()) as ShortenLinkResponse;
}

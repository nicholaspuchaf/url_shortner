import { describe, expect, it, vi, afterEach } from 'vitest';
import { shortenLink } from './api';
import environment from './environment';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('shortenLink', () => {
  it('posts the url to the backend and returns the shortened link', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        code: 'abc1234',
        url: 'https://example.com',
        shortUrl: 'http://localhost:3000/abc1234',
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(shortenLink({ url: 'https://example.com' })).resolves.toEqual({
      code: 'abc1234',
      url: 'https://example.com',
      shortUrl: 'http://localhost:3000/abc1234',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${environment.backendUrl.replace(/\/$/, '')}/shorten`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      }),
    );
  });

  it('throws the backend error message on failure', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: "Field 'url' must be a valid URL" }),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(shortenLink({ url: 'invalid' })).rejects.toThrow("Field 'url' must be a valid URL");
  });
});

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ToolPanel from './ToolPanel.svelte';
import { stringsPtBr } from '../strings-ptbr';

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe('ToolPanel', () => {
  it('shows the shortener form by default', () => {
    render(ToolPanel, {
      props: {
        accessibility: stringsPtBr.accessibility,
        shortenerCard: stringsPtBr.shortenerCard,
      },
    });

    expect(screen.getByRole('tab', { name: stringsPtBr.shortenerCard.shortenerTab })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByLabelText(`${stringsPtBr.shortenerCard.longUrlLabel} *`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: stringsPtBr.shortenerCard.submit })).toBeInTheDocument();
  });

  it('switches to the QR mode when the QR tab is clicked', async () => {
    render(ToolPanel, {
      props: {
        accessibility: stringsPtBr.accessibility,
        shortenerCard: stringsPtBr.shortenerCard,
      },
    });

    await fireEvent.click(screen.getByRole('tab', { name: stringsPtBr.shortenerCard.qrTab }));

    expect(screen.getByRole('heading', { level: 3, name: stringsPtBr.shortenerCard.qrTitle })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: stringsPtBr.shortenerCard.qrSubmit })).toBeInTheDocument();
    expect(screen.getByText(stringsPtBr.shortenerCard.qrPreviewHint)).toBeInTheDocument();
  });

  it('calls the backend when shortening a link', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        code: 'abc1234',
        url: 'https://example.com',
        shortUrl: 'http://localhost:3000/abc1234',
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    render(ToolPanel, {
      props: {
        accessibility: stringsPtBr.accessibility,
        shortenerCard: stringsPtBr.shortenerCard,
      },
    });

    const urlInput = screen.getByPlaceholderText(stringsPtBr.shortenerCard.longUrlPlaceholder);
    await fireEvent.input(urlInput, { target: { value: 'https://example.com' } });
    await fireEvent.click(screen.getByRole('button', { name: stringsPtBr.shortenerCard.submit }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const generatedLinks = await screen.findAllByRole('link', { name: 'http://localhost:3000/abc1234' });
    expect(generatedLinks[0]).toHaveAttribute(
      'href',
      'http://localhost:3000/abc1234',
    );
  });

  it('notifies when a link is generated', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        code: 'abc1234',
        url: 'https://example.com',
        shortUrl: 'http://localhost:3000/abc1234',
      }),
    });

    vi.stubGlobal('fetch', fetchMock);
    const onLinkGenerated = vi.fn();

    render(ToolPanel, {
      props: {
        accessibility: stringsPtBr.accessibility,
        shortenerCard: stringsPtBr.shortenerCard,
        onLinkGenerated,
      },
    });

    const urlInput = screen.getByPlaceholderText(stringsPtBr.shortenerCard.longUrlPlaceholder);
    await fireEvent.input(urlInput, { target: { value: 'https://example.com' } });
    await fireEvent.click(screen.getByRole('button', { name: stringsPtBr.shortenerCard.submit }));

    await screen.findAllByRole('link', { name: 'http://localhost:3000/abc1234' });

    expect(onLinkGenerated).toHaveBeenCalledTimes(1);
    expect(onLinkGenerated).toHaveBeenCalledWith(expect.objectContaining({
      code: 'abc1234',
      url: 'https://example.com',
      shortUrl: 'http://localhost:3000/abc1234',
      createdAt: expect.any(String),
    }));
  });

  it('copies the generated short url', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        code: 'abc1234',
        url: 'https://example.com',
        shortUrl: 'http://localhost:3000/abc1234',
      }),
    });
    const writeTextMock = vi.fn().mockResolvedValue(undefined);

    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('navigator', { clipboard: { writeText: writeTextMock } });

    render(ToolPanel, {
      props: {
        accessibility: stringsPtBr.accessibility,
        shortenerCard: stringsPtBr.shortenerCard,
      },
    });

    const urlInput = screen.getByPlaceholderText(stringsPtBr.shortenerCard.longUrlPlaceholder);
    await fireEvent.input(urlInput, { target: { value: 'https://example.com' } });
    await fireEvent.click(screen.getByRole('button', { name: stringsPtBr.shortenerCard.submit }));

    await screen.findAllByRole('link', { name: 'http://localhost:3000/abc1234' });
    await fireEvent.click(screen.getByRole('button', { name: stringsPtBr.shortenerCard.copyShortUrl }));

    expect(writeTextMock).toHaveBeenCalledWith('http://localhost:3000/abc1234');
    expect(screen.getByText(stringsPtBr.shortenerCard.copiedShortUrl)).toBeInTheDocument();
  });
});

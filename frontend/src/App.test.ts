import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App.svelte';
import { stringsPtBr } from './lib/strings-ptbr';
import { locale, stringsEn } from './lib/i18n';

describe('App', () => {
  afterEach(() => {
    locale.set('pt-BR');
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it('renders the complete landing page', () => {
    render(App);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: stringsPtBr.shortenerCard.shortenerTab })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: stringsPtBr.recentLinks.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: stringsPtBr.plansSection.heading })).toBeInTheDocument();
    expect(screen.getByText(stringsPtBr.footer.email)).toBeInTheDocument();
  });

  it('switches the visible copy when the locale changes', async () => {
    render(App);

    await fireEvent.change(screen.getByRole('combobox', { name: stringsPtBr.accessibility.languageSelector }), {
      target: { value: 'en' },
    });

    expect(screen.getByRole('tab', { name: stringsEn.shortenerCard.shortenerTab })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: stringsEn.plansSection.heading })).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('lang', 'en');
  });

  it('moves generated localStorage links to the recent links section', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        code: 'abc1234',
        url: 'https://example.com',
        shortUrl: 'http://localhost:3000/abc1234',
      }),
    });

    vi.stubGlobal('fetch', fetchMock);
    render(App);

    await fireEvent.input(screen.getByPlaceholderText(stringsPtBr.shortenerCard.longUrlPlaceholder), {
      target: { value: 'https://example.com' },
    });
    await fireEvent.click(screen.getByRole('button', { name: stringsPtBr.shortenerCard.submit }));

    const recentLinksSection = screen.getByRole('heading', { name: stringsPtBr.recentLinks.title }).closest('section');

    await waitFor(() => {
      expect(recentLinksSection).toHaveTextContent('http://localhost:3000/abc1234');
    });
    expect(recentLinksSection).toHaveTextContent('https://example.com');
    expect(JSON.parse(localStorage.getItem('url-shortener:generated-links') ?? '[]')).toHaveLength(1);
  });
});

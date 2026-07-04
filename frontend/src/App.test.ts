import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App.svelte';
import { stringsPtBr } from './lib/strings-ptbr';
import { locale, stringsEn } from './lib/i18n';

describe('App', () => {
  afterEach(() => {
    locale.set('pt-BR');
  });

  it('renders the complete landing page', () => {
    render(App);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: stringsPtBr.shortenerCard.shortenerTab })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: stringsPtBr.recentLinks.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: stringsPtBr.plansSection.heading })).toBeInTheDocument();
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
});

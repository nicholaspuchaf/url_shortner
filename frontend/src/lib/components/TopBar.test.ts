import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import TopBar from './TopBar.svelte';
import { stringsPtBr } from '../strings-ptbr';
import { localeOptions } from '../i18n';

describe('TopBar', () => {
  it('renders navigation and auth links', () => {
    render(TopBar, {
      props: {
        brand: stringsPtBr.brand,
        accessibility: stringsPtBr.accessibility,
        navigation: stringsPtBr.navigation,
        currentLocale: 'pt-BR',
        localeOptions,
        onLocaleChange: vi.fn(),
      },
    });

    expect(screen.getByText(stringsPtBr.brand)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: stringsPtBr.navigation.plans })).toHaveAttribute('href', '#plans');
    expect(screen.getByRole('link', { name: stringsPtBr.navigation.login })).toHaveAttribute('href', '#login');
    expect(screen.getByRole('link', { name: stringsPtBr.navigation.signUp })).toHaveAttribute('href', '#signup');
  });

  it('calls the locale handler when selecting another language', async () => {
    const onLocaleChange = vi.fn();

    render(TopBar, {
      props: {
        brand: stringsPtBr.brand,
        accessibility: stringsPtBr.accessibility,
        navigation: stringsPtBr.navigation,
        currentLocale: 'pt-BR',
        localeOptions,
        onLocaleChange,
      },
    });

    await fireEvent.change(screen.getByRole('combobox', { name: stringsPtBr.accessibility.languageSelector }), {
      target: { value: 'en' },
    });

    expect(onLocaleChange).toHaveBeenCalledWith('en');
  });
});

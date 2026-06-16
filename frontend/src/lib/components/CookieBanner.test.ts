import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import CookieBanner from './CookieBanner.svelte';
import { stringsPtBr } from '../strings-ptbr';

describe('CookieBanner', () => {
  it('renders the cookie actions', () => {
    render(CookieBanner, {
      props: {
        cookieConsent: stringsPtBr.cookieConsent,
        accessibility: stringsPtBr.accessibility,
      },
    });

    expect(screen.getByRole('button', { name: stringsPtBr.accessibility.closeCookieBanner })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: stringsPtBr.cookieConsent.necessary })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: stringsPtBr.cookieConsent.all })).toBeInTheDocument();
  });
});

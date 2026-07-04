import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import CookieBanner from './CookieBanner.svelte';
import { stringsPtBr } from '../strings-ptbr';

const cookieConsentStorageKey = 'url-shortener:cookie-consent';
const cookieConsentCookieName = 'url_shortener_cookie_consent';

afterEach(() => {
  localStorage.clear();
  document.cookie = `${cookieConsentCookieName}=; Max-Age=0; Path=/`;
});

describe('CookieBanner', () => {
  it('renders the cookie actions and selectable categories', async () => {
    render(CookieBanner, {
      props: {
        cookieConsent: stringsPtBr.cookieConsent,
        accessibility: stringsPtBr.accessibility,
      },
    });

    expect(await screen.findByRole('button', { name: stringsPtBr.accessibility.closeCookieBanner })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: stringsPtBr.cookieConsent.necessary })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: stringsPtBr.cookieConsent.save })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: stringsPtBr.cookieConsent.all })).toBeInTheDocument();
    expect(screen.getByLabelText(stringsPtBr.cookieConsent.categories.necessary.label)).toBeChecked();
    expect(screen.getByLabelText(stringsPtBr.cookieConsent.categories.analytics.label)).not.toBeChecked();
    expect(screen.getByLabelText(stringsPtBr.cookieConsent.categories.marketing.label)).not.toBeChecked();
  });

  it('stores all cookie preferences when accepting all cookies', async () => {
    render(CookieBanner, {
      props: {
        cookieConsent: stringsPtBr.cookieConsent,
        accessibility: stringsPtBr.accessibility,
      },
    });

    await fireEvent.click(await screen.findByRole('button', { name: stringsPtBr.cookieConsent.all }));

    const storedConsent = JSON.parse(localStorage.getItem(cookieConsentStorageKey) ?? '{}');
    expect(storedConsent).toMatchObject({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    expect(document.cookie).toContain(`${cookieConsentCookieName}=`);
    expect(screen.queryByLabelText(stringsPtBr.cookieConsent.title)).not.toBeInTheDocument();
  });

  it('stores selected cookie preferences', async () => {
    render(CookieBanner, {
      props: {
        cookieConsent: stringsPtBr.cookieConsent,
        accessibility: stringsPtBr.accessibility,
      },
    });

    await fireEvent.click(await screen.findByLabelText(stringsPtBr.cookieConsent.categories.analytics.label));
    await fireEvent.click(screen.getByRole('button', { name: stringsPtBr.cookieConsent.save }));

    const storedConsent = JSON.parse(localStorage.getItem(cookieConsentStorageKey) ?? '{}');
    expect(storedConsent).toMatchObject({
      necessary: true,
      analytics: true,
      marketing: false,
    });
  });

  it('closes the banner with necessary cookies only', async () => {
    render(CookieBanner, {
      props: {
        cookieConsent: stringsPtBr.cookieConsent,
        accessibility: stringsPtBr.accessibility,
      },
    });

    await fireEvent.click(await screen.findByRole('button', { name: stringsPtBr.accessibility.closeCookieBanner }));

    const storedConsent = JSON.parse(localStorage.getItem(cookieConsentStorageKey) ?? '{}');
    expect(storedConsent).toMatchObject({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    expect(screen.queryByLabelText(stringsPtBr.cookieConsent.title)).not.toBeInTheDocument();
  });

  it('stays hidden when cookie consent is already saved', () => {
    localStorage.setItem(
      cookieConsentStorageKey,
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        savedAt: '2026-01-01T00:00:00.000Z',
      }),
    );

    render(CookieBanner, {
      props: {
        cookieConsent: stringsPtBr.cookieConsent,
        accessibility: stringsPtBr.accessibility,
      },
    });

    expect(screen.queryByLabelText(stringsPtBr.cookieConsent.title)).not.toBeInTheDocument();
  });
});

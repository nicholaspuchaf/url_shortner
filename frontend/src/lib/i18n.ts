import { derived, writable } from 'svelte/store';
import { stringsPtBr } from './strings-ptbr';

type WidenMessages<T> = T extends string
  ? string
  : T extends readonly (infer Item)[]
    ? readonly WidenMessages<Item>[]
    : { readonly [Key in keyof T]: WidenMessages<T[Key]> }

export type AppMessages = WidenMessages<typeof stringsPtBr>

export const stringsEn = {
  meta: {
    title: 'TinyURL',
    description: 'TinyURL-inspired landing page for link shortening with multilingual support.',
  },
  brand: 'TINYURL',
  accessibility: {
    mainNavigation: 'Main navigation',
    toolPanel: 'Link shortening tool',
    mainMetrics: 'Main metrics',
    languageSelector: 'Language',
    closeCookieBanner: 'Close cookie notice',
  },
  navigation: {
    plans: 'Plans',
    features: 'Features',
    domains: 'Domains',
    resources: 'Resources',
    login: 'Log in',
    signUp: 'Sign up',
  },
  hero: {
    eyebrow: 'URL shortener, branded links and click analytics',
    titleLine1: 'URL Shortener, Branded',
    titleLine2: 'Short Links & Analytics',
    description: 'Welcome to the original link shortener, simplifying the internet with URLs since 2002.',
    descriptionSecondary: 'Use custom domains, track statistics and create more memorable links with paid plans.',
    primaryCta: 'View plans',
    secondaryCta: 'Create free account',
  },
  shortenerCard: {
    shortenerTab: 'Shorten link',
    qrTab: 'Generate QR Code',
    shortenerTitle: 'Shorten link',
    qrTitle: 'Generate QR Code',
    longUrlLabel: 'Long URL',
    longUrlPlaceholder: 'Paste the long URL here',
    domainLabel: 'Domain',
    domainValue: 'tinyurl.com',
    aliasLabel: 'Alias (optional)',
    aliasPlaceholder: 'Enter the alias',
    aliasHint: 'Must be at least 5 characters',
    submit: 'Shorten link',
    disclaimer:
      'By clicking Shorten link, you agree to our Terms of Service, Privacy Policy and Cookie Use.',
    qrDescription: 'Create a QR Code from any link and share it in print materials, packaging or campaigns.',
    qrPreviewLabel: 'Preview',
    qrPreviewHint: 'The QR Code will be generated with your domain identity.',
    qrSubmit: 'Generate QR Code',
    loading: 'Shortening link...',
    resultTitle: 'Link shortened successfully',
    resultShortUrlLabel: 'Short URL',
    resultCopyHint: 'Copy and share this link.',
    copyShortUrl: 'Copy short URL',
    copiedShortUrl: 'URL copied',
    copyFailed: 'Could not copy the short URL.',
    errorPrefix: 'Could not shorten the link:',
    requiredUrl: 'Enter a valid URL to continue.',
  },
  recentLinks: {
    title: 'Your recent links:',
    emptyState: 'No links in your history yet',
    items: [
      {
        title: 'tinyurl.com/launch',
        subtitle: 'https://www.example.com/product/new-launch',
        meta: 'Today, 09:42',
      },
      {
        title: 'tinyurl.com/april-campaign',
        subtitle: 'https://site.com/campaign?utm_source=home',
        meta: 'Yesterday, 18:15',
      },
    ],
  },
  plansSection: {
    title: 'TinyURL plans include:',
    heading: 'Everything ready to scale branded links',
    items: ['Custom domains', 'Detailed statistics', 'Dynamic QR Codes'],
  },
  cookieConsent: {
    title: 'Cookie consent',
    description:
      'We use cookies to improve your experience, analyze traffic and enhance our services. Read our Cookie Policy to learn more.',
    necessary: 'Allow necessary only',
    all: 'Allow all cookies',
  },
  formSections: {
    urlType: 'Link type',
    freeBadge: 'Free',
    brandedBadge: 'Branded',
  },
  metrics: [
    { value: '3.2M+', label: 'links created' },
    { value: '99.9%', label: 'uptime' },
    { value: '120+', label: 'countries served' },
  ],
} satisfies AppMessages;

export const translations = {
  'pt-BR': stringsPtBr,
  en: stringsEn,
} as const;

export type Locale = keyof typeof translations

export const defaultLocale: Locale = 'pt-BR';

export const localeOptions = [
  { value: 'pt-BR', label: 'Português' },
  { value: 'en', label: 'English' },
] as const satisfies readonly { value: Locale; label: string }[];

export type LocaleOption = (typeof localeOptions)[number]

export const locale = writable<Locale>(defaultLocale);
export const messages = derived(locale, ($locale) => translations[$locale]);

export function setLocale(nextLocale: Locale) {
  if (nextLocale in translations) {
    locale.set(nextLocale);
  }
}

<script lang="ts">
  import { onMount } from 'svelte'
  import type { AppMessages } from '../i18n'

  export let cookieConsent: AppMessages['cookieConsent']
  export let accessibility: AppMessages['accessibility']

  const cookieConsentStorageKey = 'url-shortener:cookie-consent'
  const cookieConsentCookieName = 'url_shortener_cookie_consent'

  type CookiePreferences = {
    necessary: true
    analytics: boolean
    marketing: boolean
    savedAt: string
  }

  let isVisible = false
  let analytics = false
  let marketing = false

  onMount(() => {
    isVisible = !hasSavedCookieConsent()
  })

  function hasSavedCookieConsent() {
    try {
      const storedConsent = localStorage.getItem(cookieConsentStorageKey)
      if (!storedConsent) {
        return false
      }

      const parsedConsent = JSON.parse(storedConsent) as Partial<CookiePreferences>
      return parsedConsent.necessary === true && typeof parsedConsent.savedAt === 'string'
    } catch {
      return false
    }
  }

  function saveCookieConsent(preferences: Omit<CookiePreferences, 'necessary' | 'savedAt'>) {
    const consent: CookiePreferences = {
      necessary: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      savedAt: new Date().toISOString(),
    }

    try {
      localStorage.setItem(cookieConsentStorageKey, JSON.stringify(consent))
    } catch {
      // A blocked localStorage should not prevent the user from closing the banner.
    }

    document.cookie = `${cookieConsentCookieName}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=31536000; Path=/; SameSite=Lax`
    isVisible = false
  }

  function handleNecessaryOnly() {
    analytics = false
    marketing = false
    saveCookieConsent({ analytics, marketing })
  }

  function handleAllowAll() {
    analytics = true
    marketing = true
    saveCookieConsent({ analytics, marketing })
  }

  function handleSavePreferences() {
    saveCookieConsent({ analytics, marketing })
  }

  function handleClose() {
    handleNecessaryOnly()
  }
</script>

{#if isVisible}
  <div class="cookie-banner" aria-label={cookieConsent.title}>
    <div class="cookie-head">
      <strong>{cookieConsent.title}</strong>
      <button type="button" aria-label={accessibility.closeCookieBanner} onclick={handleClose}>×</button>
    </div>
    <p>{cookieConsent.description}</p>

    <div class="cookie-options">
      <label>
        <input type="checkbox" aria-label={cookieConsent.categories.necessary.label} checked disabled />
        <span>
          <strong>{cookieConsent.categories.necessary.label}</strong>
          <small>{cookieConsent.categories.necessary.description}</small>
        </span>
      </label>

      <label>
        <input type="checkbox" aria-label={cookieConsent.categories.analytics.label} bind:checked={analytics} />
        <span>
          <strong>{cookieConsent.categories.analytics.label}</strong>
          <small>{cookieConsent.categories.analytics.description}</small>
        </span>
      </label>

      <label>
        <input type="checkbox" aria-label={cookieConsent.categories.marketing.label} bind:checked={marketing} />
        <span>
          <strong>{cookieConsent.categories.marketing.label}</strong>
          <small>{cookieConsent.categories.marketing.description}</small>
        </span>
      </label>
    </div>

    <div class="cookie-actions">
      <button type="button" class="ghost-button" onclick={handleNecessaryOnly}>{cookieConsent.necessary}</button>
      <button type="button" class="ghost-button" onclick={handleSavePreferences}>{cookieConsent.save}</button>
      <button type="button" class="solid-button" onclick={handleAllowAll}>{cookieConsent.all}</button>
    </div>
  </div>
{/if}

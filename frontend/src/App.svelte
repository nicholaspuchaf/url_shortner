<script lang="ts">
  import { onMount } from 'svelte'
  import { locale, localeOptions, messages, setLocale } from './lib/i18n'
  import TopBar from './lib/components/TopBar.svelte'
  import HeroSection from './lib/components/HeroSection.svelte'
  import ToolPanel from './lib/components/ToolPanel.svelte'
  import RecentLinksSection from './lib/components/RecentLinksSection.svelte'
  import PlansSection from './lib/components/PlansSection.svelte'
  import CookieBanner from './lib/components/CookieBanner.svelte'
  import SiteFooter from './lib/components/SiteFooter.svelte'
  import { isGeneratedLink, linkHistoryStorageKey } from './lib/generated-link'
  import type { GeneratedLink } from './lib/generated-link'

  let generatedLinks: GeneratedLink[] = []

  $: if (typeof document !== 'undefined') {
    document.documentElement.lang = $locale
  }

  onMount(() => {
    generatedLinks = loadGeneratedLinks()
  })

  function loadGeneratedLinks() {
    try {
      const storedLinks = localStorage.getItem(linkHistoryStorageKey)
      if (!storedLinks) {
        return []
      }

      const parsedLinks = JSON.parse(storedLinks)
      if (!Array.isArray(parsedLinks)) {
        return []
      }

      return parsedLinks.filter(isGeneratedLink)
    } catch {
      return []
    }
  }

  function handleLinkGenerated(link: GeneratedLink) {
    const nextLinks = [link, ...generatedLinks]
    generatedLinks = nextLinks

    try {
      localStorage.setItem(linkHistoryStorageKey, JSON.stringify(nextLinks))
    } catch {
      // Keep the in-memory history available even when localStorage is blocked or full.
    }
  }
</script>

<svelte:head>
  <title>{$messages.meta.title}</title>
  <meta name="description" content={$messages.meta.description} />
</svelte:head>

<div class="page-shell">
  <TopBar
    brand={$messages.brand}
    accessibility={$messages.accessibility}
    navigation={$messages.navigation}
    currentLocale={$locale}
    {localeOptions}
    onLocaleChange={setLocale}
  />

  <main class="hero-layout">
    <HeroSection accessibility={$messages.accessibility} hero={$messages.hero} metrics={$messages.metrics} />
    <ToolPanel
      accessibility={$messages.accessibility}
      shortenerCard={$messages.shortenerCard}
      onLinkGenerated={handleLinkGenerated}
    />
  </main>

  <RecentLinksSection recentLinks={$messages.recentLinks} generatedLinks={generatedLinks} />
  <PlansSection plansSection={$messages.plansSection} formSections={$messages.formSections} />
  <SiteFooter footer={$messages.footer} />
  <CookieBanner cookieConsent={$messages.cookieConsent} accessibility={$messages.accessibility} />
</div>

<script lang="ts">
  import { locale, localeOptions, messages, setLocale } from './lib/i18n'
  import TopBar from './lib/components/TopBar.svelte'
  import HeroSection from './lib/components/HeroSection.svelte'
  import ToolPanel from './lib/components/ToolPanel.svelte'
  import RecentLinksSection from './lib/components/RecentLinksSection.svelte'
  import PlansSection from './lib/components/PlansSection.svelte'
  import CookieBanner from './lib/components/CookieBanner.svelte'

  $: if (typeof document !== 'undefined') {
    document.documentElement.lang = $locale
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
    <ToolPanel accessibility={$messages.accessibility} shortenerCard={$messages.shortenerCard} />
  </main>

  <RecentLinksSection recentLinks={$messages.recentLinks} />
  <PlansSection plansSection={$messages.plansSection} formSections={$messages.formSections} />
  <CookieBanner cookieConsent={$messages.cookieConsent} accessibility={$messages.accessibility} />
</div>

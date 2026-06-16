<script lang="ts">
  import { stringsPtBr } from './lib/strings-ptbr'
  import TopBar from './lib/components/TopBar.svelte'
  import HeroSection from './lib/components/HeroSection.svelte'
  import ToolPanel from './lib/components/ToolPanel.svelte'
  import RecentLinksSection from './lib/components/RecentLinksSection.svelte'
  import PlansSection from './lib/components/PlansSection.svelte'
  import CookieBanner from './lib/components/CookieBanner.svelte'

  const {
    meta,
    brand,
    accessibility,
    navigation,
    hero,
    shortenerCard,
    recentLinks,
    plansSection,
    cookieConsent,
    formSections,
    metrics,
  } = stringsPtBr
</script>

<svelte:head>
  <title>{meta.title}</title>
  <meta name="description" content={meta.description} />
</svelte:head>

<div class="page-shell">
  <TopBar {brand} {accessibility} {navigation} />

  <main class="hero-layout">
    <HeroSection {accessibility} {hero} {metrics} />
    <ToolPanel {accessibility} {shortenerCard} />
  </main>

  <RecentLinksSection {recentLinks} />
  <PlansSection {plansSection} {formSections} />
  <CookieBanner {cookieConsent} {accessibility} />
</div>

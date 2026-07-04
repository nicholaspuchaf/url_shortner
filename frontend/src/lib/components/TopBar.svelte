<script lang="ts">
  import type { AppMessages, Locale, LocaleOption } from '../i18n'

  export let brand: AppMessages['brand']
  export let accessibility: AppMessages['accessibility']
  export let navigation: AppMessages['navigation']
  export let currentLocale: Locale
  export let localeOptions: readonly LocaleOption[]
  export let onLocaleChange: (locale: Locale) => void

  function handleLocaleChange(event: Event) {
    onLocaleChange((event.currentTarget as HTMLSelectElement).value as Locale)
  }
</script>

<header class="topbar">
  <div class="brand-mark" aria-label={brand}>{brand}</div>

  <nav class="nav" aria-label={accessibility.mainNavigation}>
    <a href="#plans">{navigation.plans}</a>
    <a href="#features">{navigation.features}</a>
    <a href="#domains">{navigation.domains}</a>
    <a href="#resources">{navigation.resources}</a>
  </nav>

  <div class="auth">
    <label class="locale-select">
      <span class="sr-only">{accessibility.languageSelector}</span>
      <select value={currentLocale} onchange={handleLocaleChange} aria-label={accessibility.languageSelector}>
        {#each localeOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </label>
    <a href="#login" class="auth-link">{navigation.login}</a>
    <a href="#signup" class="auth-button">{navigation.signUp}</a>
  </div>
</header>

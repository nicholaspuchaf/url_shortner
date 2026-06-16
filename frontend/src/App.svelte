<script lang="ts">
  import { stringsPtBr } from './lib/strings-ptbr'

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

  const tabs = [
    { label: shortenerCard.shortenerTab, active: true, icon: 'link' },
    { label: shortenerCard.qrTab, active: false, icon: 'qr' },
  ] as const

</script>

<svelte:head>
  <title>{meta.title}</title>
  <meta name="description" content={meta.description} />
</svelte:head>

<div class="page-shell">
  <header class="topbar">
    <div class="brand-mark" aria-label={brand}>{brand}</div>

    <nav class="nav" aria-label={accessibility.mainNavigation}>
      <a href="#plans">{navigation.plans}</a>
      <a href="#features">{navigation.features}</a>
      <a href="#domains">{navigation.domains}</a>
      <a href="#resources">{navigation.resources}</a>
    </nav>

    <div class="auth">
      <a href="#login" class="auth-link">{navigation.login}</a>
      <a href="#signup" class="auth-button">{navigation.signUp}</a>
    </div>
  </header>

  <main class="hero-layout">
    <section class="hero-copy" aria-labelledby="hero-title">
      <p class="eyebrow">{hero.eyebrow}</p>
      <h1 id="hero-title">
        <span>{hero.titleLine1}</span>
        <span>{hero.titleLine2}</span>
      </h1>
      <p class="lede">{hero.description}</p>
      <p class="lede secondary">{hero.descriptionSecondary}</p>

      <div class="cta-row">
        <a href="#plans" class="primary-cta">{hero.primaryCta}</a>
        <a href="#signup" class="secondary-cta">{hero.secondaryCta}</a>
      </div>

      <div class="metrics" aria-label={accessibility.mainMetrics}>
        {#each metrics as metric}
          <div class="metric-card">
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        {/each}
      </div>
    </section>

    <section class="tool-panel" aria-label={accessibility.toolPanel}>
      <div class="panel-tabs" role="tablist" aria-label={accessibility.toolPanel}>
        {#each tabs as tab}
          <button class:active={tab.active} type="button" role="tab" aria-selected={tab.active}>
            {#if tab.icon === 'link'}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M10.6 13.4a4 4 0 0 1 0-5.7l2.1-2.1a4 4 0 1 1 5.7 5.7l-1.1 1.1"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                />
                <path
                  d="M13.4 10.6a4 4 0 0 1 0 5.7l-2.1 2.1a4 4 0 1 1-5.7-5.7l1.1-1.1"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                />
              </svg>
            {:else}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8" />
                <rect x="14" y="4" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8" />
                <rect x="4" y="14" width="6" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8" />
                <path d="M16 14h4v4h-4z" fill="currentColor" opacity="0.85" />
              </svg>
            {/if}
            <span>{tab.label}</span>
          </button>
        {/each}
      </div>

      <form class="shorten-form">
        <label>
          <span>{shortenerCard.longUrlLabel} *</span>
          <input type="url" placeholder={shortenerCard.longUrlPlaceholder} />
        </label>

        <div class="split-fields">
          <label for="domain-select">
            <span>{shortenerCard.domainLabel}</span>
            <div class="select-like">
              <select id="domain-select" name="domain">
                <option>{shortenerCard.domainValue}</option>
              </select>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </label>

          <label>
            <span>{shortenerCard.aliasLabel}</span>
            <input type="text" placeholder={shortenerCard.aliasPlaceholder} />
            <small>{shortenerCard.aliasHint}</small>
          </label>
        </div>

        <button type="button" class="submit-button">{shortenerCard.submit}</button>

        <p class="disclaimer">{shortenerCard.disclaimer}</p>
      </form>
    </section>
  </main>

  <section class="recent-links" id="resources" aria-labelledby="recent-links-title">
    <h2 id="recent-links-title">{recentLinks.title}</h2>

    <div class="recent-card">
      <div class="recent-empty">
        <div class="status-dot" aria-hidden="true">!</div>
        <p>{recentLinks.emptyState}</p>
      </div>

      <div class="recent-list">
        {#each recentLinks.items as item}
          <article class="recent-item">
            <div>
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </div>
            <small>{item.meta}</small>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section class="plans" id="plans" aria-labelledby="plans-title">
    <div class="plans-visual" aria-hidden="true">
      <div class="orbit orbit-one"></div>
      <div class="orbit orbit-two"></div>
      <div class="orbit-card">
        <span>{formSections.urlType}</span>
        <strong>{formSections.freeBadge}</strong>
        <strong>{formSections.brandedBadge}</strong>
      </div>
    </div>

    <div class="plans-copy">
      <p class="eyebrow">{plansSection.title}</p>
      <h2 id="plans-title">{plansSection.heading}</h2>
      <ul>
        {#each plansSection.items as item}
          <li>{item}</li>
        {/each}
      </ul>
    </div>
  </section>

  <div class="cookie-banner" aria-label={cookieConsent.title}>
    <div class="cookie-head">
      <strong>{cookieConsent.title}</strong>
      <button type="button" aria-label={accessibility.closeCookieBanner}>×</button>
    </div>
    <p>{cookieConsent.description}</p>
    <div class="cookie-actions">
      <button type="button" class="ghost-button">{cookieConsent.necessary}</button>
      <button type="button" class="solid-button">{cookieConsent.all}</button>
    </div>
  </div>
</div>

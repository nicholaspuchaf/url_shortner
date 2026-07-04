<script lang="ts">
  import type { AppMessages } from '../i18n'

  export let accessibility: AppMessages['accessibility']
  export let hero: AppMessages['hero']
  export let metrics: AppMessages['metrics']
</script>

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

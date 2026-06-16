<script lang="ts">
  import type { StringsPtBr } from '../strings-ptbr'

  export let cookieConsent: StringsPtBr['cookieConsent']
  export let accessibility: StringsPtBr['accessibility']
</script>

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

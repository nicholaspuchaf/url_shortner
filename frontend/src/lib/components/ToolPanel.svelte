<script lang="ts">
  import { shortenLink } from '../api'
  import type { StringsPtBr } from '../strings-ptbr'

  export let accessibility: StringsPtBr['accessibility']
  export let shortenerCard: StringsPtBr['shortenerCard']

  const tabs = [
    { label: shortenerCard.shortenerTab, mode: 'shortener', icon: 'link' },
    { label: shortenerCard.qrTab, mode: 'qr', icon: 'qr' },
  ] as const

  let currentTab: 'shortener' | 'qr' = 'shortener'
  let longUrl = ''
  let isSubmitting = false
  let errorMessage = ''
  let successShortUrl = ''
  let copyMessage = ''

  async function handleAction() {
    errorMessage = ''
    successShortUrl = ''
    copyMessage = ''

    if (currentTab === 'qr') {
      return
    }

    const value = longUrl.trim()

    if (!value) {
      errorMessage = shortenerCard.requiredUrl
      return
    }

    isSubmitting = true

    try {
      const result = await shortenLink({ url: value })
      successShortUrl = result.shortUrl
      longUrl = ''
    } catch (error) {
      errorMessage = `${shortenerCard.errorPrefix} ${(error as Error).message}`
    } finally {
      isSubmitting = false
    }
  }

  async function handleCopy() {
    if (!successShortUrl) {
      return
    }

    try {
      await navigator.clipboard.writeText(successShortUrl)
      copyMessage = shortenerCard.copiedShortUrl
    } catch {
      copyMessage = shortenerCard.copyFailed
    }
  }
</script>

<section class="tool-panel" aria-label={accessibility.toolPanel}>
  <div class="panel-tabs" role="tablist" aria-label={accessibility.toolPanel}>
    {#each tabs as tab}
      <button
        class:active={currentTab === tab.mode}
        type="button"
        role="tab"
        aria-selected={currentTab === tab.mode}
        onclick={() => (currentTab = tab.mode)}
      >
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
    {#if currentTab === 'qr'}
      <div class="panel-copy">
        <h3>{shortenerCard.qrTitle}</h3>
        <p>{shortenerCard.qrDescription}</p>
      </div>
    {/if}

    <label>
      <span>{shortenerCard.longUrlLabel} *</span>
      <input bind:value={longUrl} type="url" placeholder={shortenerCard.longUrlPlaceholder} />
    </label>

    <div class="split-fields">
      <label for="domain-select" class="field-group">
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

      <label class="field-group">
        <span>{shortenerCard.aliasLabel}</span>
        <input type="text" placeholder={shortenerCard.aliasPlaceholder} />
        <small>{shortenerCard.aliasHint}</small>
      </label>
    </div>

    <button type="button" class="submit-button" disabled={isSubmitting} onclick={handleAction}>
      {#if currentTab === 'qr'}
        {shortenerCard.qrSubmit}
      {:else}
        {isSubmitting ? shortenerCard.loading : shortenerCard.submit}
      {/if}
    </button>

    {#if currentTab === 'shortener'}
      <p class="disclaimer">{shortenerCard.disclaimer}</p>
    {:else}
      <p class="disclaimer">{shortenerCard.qrPreviewHint}</p>
    {/if}

    {#if errorMessage}
      <p class="result-message error" role="alert">{errorMessage}</p>
    {/if}

    {#if successShortUrl}
      <div class="result-box" aria-live="polite">
        <strong>{shortenerCard.resultTitle}</strong>
        <span>{shortenerCard.resultShortUrlLabel}</span>
        <a href={successShortUrl} target="_blank" rel="noreferrer">{successShortUrl}</a>
        <div class="result-actions">
          <small>{shortenerCard.resultCopyHint}</small>
          <button type="button" class="copy-button" onclick={handleCopy}>{shortenerCard.copyShortUrl}</button>
        </div>
        {#if copyMessage}
          <small class="copy-feedback">{copyMessage}</small>
        {/if}
      </div>
    {/if}
  </form>
</section>

<script lang="ts">
  import type { GeneratedLink } from '../generated-link'
  import type { AppMessages } from '../i18n'

  export let recentLinks: AppMessages['recentLinks']
  export let generatedLinks: GeneratedLink[] = []
</script>

<section class="recent-links" id="resources" aria-labelledby="recent-links-title">
  <h2 id="recent-links-title">{recentLinks.title}</h2>

  <div class="recent-card">
    {#if generatedLinks.length === 0}
      <div class="recent-empty">
        <div class="status-dot" aria-hidden="true">!</div>
        <p>{recentLinks.emptyState}</p>
      </div>
    {/if}

    <div class="recent-list">
      {#each generatedLinks as link}
        <article class="recent-item">
          <div>
            <strong>
              <a href={link.shortUrl} target="_blank" rel="noreferrer">{link.shortUrl}</a>
            </strong>
            <span>{link.url}</span>
          </div>
          <small>{new Date(link.createdAt).toLocaleDateString()}</small>
        </article>
      {:else}
        {#each recentLinks.items as item}
        <article class="recent-item">
          <div>
            <strong>{item.title}</strong>
            <span>{item.subtitle}</span>
          </div>
          <small>{item.meta}</small>
        </article>
        {/each}
      {/each}
    </div>
  </div>
</section>

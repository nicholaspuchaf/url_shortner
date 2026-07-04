<script lang="ts">
  import type { AppMessages } from '../i18n'

  export let recentLinks: AppMessages['recentLinks']
</script>

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

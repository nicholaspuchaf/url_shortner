<script lang="ts">
  import type { StringsPtBr } from '../strings-ptbr'

  export let plansSection: StringsPtBr['plansSection']
  export let formSections: StringsPtBr['formSections']
</script>

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

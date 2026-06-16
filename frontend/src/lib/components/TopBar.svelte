<script lang="ts">
  import type { StringsPtBr } from '../strings-ptbr'

  export let brand: StringsPtBr['brand']
  export let accessibility: StringsPtBr['accessibility']
  export let navigation: StringsPtBr['navigation']
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
    <a href="#login" class="auth-link">{navigation.login}</a>
    <a href="#signup" class="auth-button">{navigation.signUp}</a>
  </div>
</header>

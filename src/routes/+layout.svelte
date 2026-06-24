<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { isLight } from '$lib/stores/theme';

  // 1. Define the 'children' prop using the $props rune
  let { children } = $props();

  onMount(() => {
    document.fonts.ready.then(() => {
      document.body.classList.add('font-loaded');
    });
  });

  let themeClass = $derived($isLight ? 'light-mode' : 'dark-mode');
</script>

<svelte:head>
  <link
    rel="preload"
    href="/fonts/FunnelDisplay-VariableFont_wght.ttf"
    as="font"
    type="font/ttf"
    crossorigin="anonymous"
  />
  <meta name="theme-color" content="#000000" />
</svelte:head>

<div class={themeClass}>
  {@render children()}
</div>
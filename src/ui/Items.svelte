<script lang="ts">
  import { productStore } from '$lib/data/products.svelte';
  import { isLight } from '$lib/stores/theme';
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  // Lokaler State für die Eingangs-Animation
  let visible = $state(false);

  onMount(() => {
    visible = true;
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  });

  // Hilfsfunktion für Bilder
  function handleImageError(event: Event, title: string) {
    const target = event.target as HTMLImageElement | null;
    if (!target) return;
    target.src = `https://via.placeholder.com/400x500/111111/ff9500?text=${encodeURIComponent(title)}`;
  }
</script>

<div class="page-wrapper" class:light-mode={$isLight}>
  <div class="background-blobs">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
  </div>

  <main class="content-container">
    {#if visible}
      <header class="header" in:fly={{ y: -20, duration: 1000 }}>
        <h1 class="headline">Unsere <span class="highlight">Collection</span></h1>
        <p class="subtitle">Exklusives Design für das Barnim Gymnasium</p>
      </header>

      {#if productStore.all.length > 0}
        <section class="grid-layout">
          {#each productStore.all as product, i (product.id)}
            <a 
              href="/produkte/{product.slug}" 
              class="product-card"
              in:fly={{ y: 30, duration: 800, delay: 100 + (i * 50) }}
            >
              <div class="image-box">
                {#if product.image}
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    onerror={(e) => handleImageError(e, product.title)}
                  />
                {:else}
                  <div class="img-fallback">Kein Bild</div>
                {/if}
                <div class="card-badge">Original</div>
                <div class="hover-action">
                  <span>Details ansehen</span>
                </div>
              </div>
              <div class="info-box">
                <h3 class="title">{product.title}</h3>
                <p class="price-tag">
                  {product.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                </p>
              </div>
            </a>
          {/each}
        </section>
      {:else if productStore.isLoaded}
        <section class="empty-state" in:fade={{ duration: 800 }}>
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 8V21H3V8M1 3H23V8H1V3ZM10 12H14" stroke-linecap="round"/>
            </svg>
          </div>
          <h2>Die Schränke sind leer</h2>
          <p>Aktuell sind keine Produkte verfügbar. Bitte schau später wieder vorbei oder kontaktiere den Support.</p>
          <button class="retry-btn" onclick={() => window.location.reload()}>Aktualisieren</button>
        </section>
      {/if}

      <footer class="footer" in:fade={{ delay: 1000 }}>
        <p>© {new Date().getFullYear()} Barnim Gymnasium Merch</p>
      </footer>
    {/if}
  </main>
</div>

<style>
  :root {
    --brand-orange: #ff9500;
  }

  .page-wrapper {
    min-height: 100vh;
    background-color: #050505;
    color: #ffffff;
    overflow-x: hidden;
    position: relative;
  }

  .page-wrapper.light-mode {
    background-color: #fcfcfc;
    color: #111111;
  }

  /* Hintergrund-Blobs */
  .background-blobs {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    filter: blur(100px);
    opacity: 0.2;
  }

  .blob { position: absolute; background: var(--brand-orange); border-radius: 50%; }
  .blob-1 { width: 50vw; height: 50vw; top: -20%; left: -10%; opacity: 0.3; }
  .blob-2 { width: 40vw; height: 40vw; bottom: -10%; right: -5%; opacity: 0.2; }

  /* Content Container - Padding oben stark reduziert, um alles anzuheben */
  .content-container {
    position: relative;
    z-index: 1;
    max-width: 1300px;
    margin: 0 auto;
    padding: 50px 24px; /* Von 100px auf 50px reduziert */
  }

  /* Header - Engere Abstände */
  .header { 
    text-align: center; 
    margin-bottom: 40px; /* Von 80px auf 40px halbiert */
  }

  /* Headline - Skaliert jetzt perfekt von Mobile (1.8rem) bis Desktop (3.5rem) */
  .headline { 
    font-size: clamp(1.8rem, 5vw, 3.5rem); 
    font-weight: 900; 
    margin-bottom: 8px; /* Von 16px auf 8px reduziert */
    letter-spacing: -0.02em;
    line-height: 1.1;
  }
  
  .highlight { color: var(--brand-orange); }
  
  /* Subtitle - Kompakter und mobil-freundlicher */
  .subtitle { 
    font-size: clamp(0.9rem, 2vw, 1.1rem); 
    opacity: 0.6; 
    line-height: 1.4;
  }

  /* Grid Layout */
  .grid-layout {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 40px;
    justify-content: center;
  }

  .product-card {
    text-decoration: none;
    color: inherit;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .light-mode .product-card { background: #fff; border-color: #eee; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }

  .product-card:hover {
    transform: translateY(-10px);
    border-color: var(--brand-orange);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  }

  .image-box { position: relative; aspect-ratio: 4/5; overflow: hidden; background: #111; }
  .image-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
  .product-card:hover img { transform: scale(1.08); }

  .card-badge {
    position: absolute; top: 20px; left: 20px;
    background: var(--brand-orange); color: black;
    padding: 6px 14px; border-radius: 10px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase;
  }

  .hover-action {
    position: absolute; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.3s ease; backdrop-filter: blur(4px);
  }
  .product-card:hover .hover-action { opacity: 1; }
  .hover-action span { background: white; color: black; padding: 12px 24px; border-radius: 40px; font-weight: 800; }

  .info-box { padding: 28px; }
  .title { font-size: 1.4rem; margin: 0 0 10px 0; }
  .price-tag { font-size: 1.2rem; font-weight: 800; color: var(--brand-orange); }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 80px 20px;
    background: rgba(255,255,255,0.02);
    border-radius: 40px;
    border: 1px dashed rgba(255,255,255,0.1);
    max-width: 600px;
    margin: 0 auto;
  }

  .empty-icon svg { width: 80px; height: 80px; margin-bottom: 24px; color: var(--brand-orange); opacity: 0.5; }
  .empty-state h2 { font-size: 2rem; margin-bottom: 12px; }
  .empty-state p { opacity: 0.6; margin-bottom: 32px; line-height: 1.6; }

  .retry-btn {
    background: transparent; border: 1px solid var(--brand-orange); color: var(--brand-orange);
    padding: 12px 32px; border-radius: 30px; cursor: pointer; font-weight: 700;
    transition: all 0.3s;
  }
  .retry-btn:hover { background: var(--brand-orange); color: black; }

  .footer { margin-top: 80px; text-align: center; opacity: 0.3; }

  /* Mobile Breakpoints */
  @media (max-width: 600px) {
    .content-container { 
      padding: 30px 16px; /* Auf Smartphones noch weiter nach oben rücken */
    }
    .header {
      margin-bottom: 30px;
    }
    .grid-layout { 
      grid-template-columns: 1fr; 
      gap: 24px; /* Karten rücken auf Mobile etwas enger zusammen */
    }
  }
</style>
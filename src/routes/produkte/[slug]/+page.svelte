<script lang="ts">
  import { productStore, type Product } from '$lib/data/products.svelte';
  import { isLight } from '$lib/stores/theme';
  import NavigationBar from '../../../ui/NavigationBar.svelte';
  import { addToCart } from '$lib/stores/cart.svelte';

  let { data } = $props<{ data: { slug: string } }>();

  // KORREKTUR: Der Fallback muss exakt dem Typ 'Product' entsprechen
  const emptyProduct: Product = {
    id: 0,
    slug: '',
    title: 'Lädt...',
    price: 0,
    description: '',
    sizes: [],
    colors: [],
    image: '',
    category: 'all',
    active: 1
  };

  // Reaktiv das Produkt holen
  let product = $derived(productStore.getBySlug(data.slug) || emptyProduct);

  const defaultDesc = "Ein exklusives Stück aus unserer neuesten Kollektion.";

  let quantity = $state(1);
  let selectedSize = $state("none");

  // Synchronisation der Größe
  $effect(() => {
    if (product.sizes && product.sizes.length > 0) {
      if (selectedSize === "none") selectedSize = product.sizes[0];
    }
  });

  // KORREKTUR: Bild-Fehler-Handling Funktion hinzufügen
  function handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://via.placeholder.com/600x600?text=Bild+nicht+verfügbar';
    }
  }

  // KORREKTUR: Tastatur-Navigation für Größen hinzufügen
  function handleSizeKeydown(e: KeyboardEvent, index: number) {
    if (!product.sizes) return;
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (index + 1) % product.sizes.length;
      selectedSize = product.sizes[next];
      document.getElementById("size-btn-" + next)?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (index - 1 + product.sizes.length) % product.sizes.length;
      selectedSize = product.sizes[prev];
      document.getElementById("size-btn-" + prev)?.focus();
    }
  }

  function handleAddToCart() {
    // Da product.id jetzt immer existiert (0 beim Fallback), prüfen wir auf > 0
    if (product.id !== 0) {
      addToCart(product, quantity, selectedSize);
      quantity = 1;
    }
  }

  const increase = () => quantity++;
  const decrease = () => { if (quantity > 1) quantity--; };
</script>

<NavigationBar />

<div class="page-wrapper" class:light-mode={$isLight}>
  <main class="product-container">
    <div class="grid">
      <div class="viewer-section" aria-hidden="true">
        <div class="placeholder-frame">
          <p>Bilder folgen…</p>
        </div>
      </div>

      <div class="info-section">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="/shop">Kollektion</a> / <span aria-current="page">{product.title}</span>
        </nav>

        <h1 class="title">{product.title}</h1>
        
        <div class="price-box">
          <span class="price">
            {product.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </span>
          <span class="status">Vorrätig</span>
        </div>

        <div class="description">
          <h3>Beschreibung</h3>
          <p>{product.description || defaultDesc}</p>
        </div>

        <div class="image-preview" aria-hidden={product.image ? "false" : "true"}>
           <img 
             src={product.image} 
             alt={product.title} 
             onerror={handleImageError}
             loading="lazy"
           />
        </div>

        {#if product.sizes && product.sizes.length > 0}
          <div class="size-selector">
            <span id="size-label" class="size-label">Größe</span>

            <div class="size-buttons" role="radiogroup" aria-labelledby="size-label">
              {#each product.sizes as size, i}
                <button
                  id={"size-btn-" + i}
                  type="button"
                  role="radio"
                  aria-checked={selectedSize === size}
                  tabindex={selectedSize === size ? 0 : -1}
                  class:selected={selectedSize === size}
                  onclick={() => selectedSize = size}
                  onkeydown={(e) => handleSizeKeydown(e, i)}
                >
                  {size}
                </button>
              {/each}
            </div>
          </div>
        {/if}

        <div class="actions">
          <div class="quantity-selector" role="group" aria-label="Menge">
            <button onclick={decrease} aria-label="Menge verringern">-</button>
            <span class="quantity" aria-live="polite">{quantity}</span>
            <button onclick={increase} aria-label="Menge erhöhen">+</button>
          </div>

          <button class="buy-button" onclick={handleAddToCart} aria-label="In den Warenkorb legen">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            In den Warenkorb
          </button>
        </div>

        <div class="features">
          <div class="feature">
            <span class="icon">✓</span>
            <span>Versandkostenfrei ab 50€</span>
          </div>
          <div class="feature">
            <span class="icon">✓</span>
            <span>Nachhaltige Materialien</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<style>
  .page-wrapper {
    --primary-orange: #ff9500;
    --bg-dark: #000;
    --bg-light: #fcfcfc;
    --text-dark: #fff;
    --text-light: #1a1a1a;
    --glass-dark: rgba(255, 255, 255, 0.05);
    --glass-light: rgba(0, 0, 0, 0.03);
    
    min-height: 100vh;
    background-color: var(--bg-dark);
    color: var(--text-dark);
    transition: background-color 0.4s ease, color 0.4s ease;
  }

  .page-wrapper.light-mode {
    background-color: var(--bg-light);
    color: var(--text-light);
  }

  .product-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 4rem;
    align-items: center;
  }

  .placeholder-frame {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    border: 3px dashed var(--primary-orange);
    border-radius: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .viewer-section {
    position: relative;
    background: var(--glass-dark);
    border-radius: 32px;
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(255, 149, 0, 0.1);
  }

  .light-mode .viewer-section {
    background: var(--glass-light);
  }

  .info-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .breadcrumb {
    font-size: 0.9rem;
    opacity: 0.6;
  }

  .breadcrumb a {
    color: inherit;
    text-decoration: none;
  }

  .title {
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 900;
    margin: 0;
    line-height: 1.1;
  }

  .price-box {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .price {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--primary-orange);
  }

  .status {
    background: rgba(34, 197, 94, 0.2);
    color: #4ade80;
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .description h3 {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
    opacity: 0.8;
  }

  .description p {
    line-height: 1.6;
    opacity: 0.7;
  }

  .image-preview {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 149, 0, 0.2);
  }

  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .size-selector {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .size-label {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .size-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .size-buttons button {
    padding: 0.45rem 0.9rem;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.12);
    background: var(--glass-dark);
    color: inherit;
    cursor: pointer;
    transition: transform 0.12s ease, background-color 0.12s ease;
    font-weight: 600;
  }

  .light-mode .size-buttons button {
    background: var(--glass-light);
    border-color: rgba(0,0,0,0.08);
  }

  .size-buttons button:hover {
    transform: translateY(-2px);
  }

  .size-buttons button.selected {
    background: var(--primary-orange);
    border-color: var(--primary-orange);
    color: white;
    font-weight: 800;
  }

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    align-items: center;
  }

  .quantity-selector {
    display: flex;
    align-items: center;
    background: var(--glass-dark);
    border-radius: 12px;
    padding: 0.5rem;
    gap: 1rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .light-mode .quantity-selector {
    background: var(--glass-light);
    border-color: rgba(0,0,0,0.1);
  }

  .quantity-selector button {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.2rem;
    cursor: pointer;
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
  }

  .quantity {
    min-width: 28px;
    text-align: center;
    font-weight: 700;
  }

  .buy-button {
    flex-grow: 1;
    background: var(--primary-orange);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 1rem;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    transition: transform 0.2s, background-color 0.2s;
  }

  .buy-button:hover {
    transform: scale(1.02);
    background: #e68600;
  }

  /* Fixed unused selector warnings */
  .features {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .feature {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .feature .icon {
    color: var(--primary-orange);
    font-weight: 900;
  }

  @media (max-width: 968px) {
    .grid {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
    .viewer-section {
      max-width: 500px;
      margin: 0 auto;
      width: 100%;
    }
    .info-section {
      text-align: center;
      align-items: center;
    }
    .size-buttons {
      justify-content: center;
      flex-wrap: wrap;
    }
  }
</style>
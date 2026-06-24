<script lang="ts">
  import { cartStore, removeFromCart, decreaseQuantity, addToCart, clearCart } from '$lib/stores/cart.svelte';
  import { isLight } from '$lib/stores/theme';
  import NavigationBar from '../../ui/NavigationBar.svelte';
  import { fade, fly } from 'svelte/transition';

  const formatPrice = (price: number) => {
    return price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  };

  const shippingCost = 4.95;
  const freeShippingThreshold = 50;
</script>

<NavigationBar />

<div class="page-wrapper" class:light-mode={$isLight}>
  <main class="cart-container">
    {#if cartStore.totalCount > 0}
      <header class="cart-header" in:fade>
        <h1 class="glitch-text">Dein Warenkorb</h1>
        <div class="header-meta">
          <span class="count-badge">{cartStore.totalCount} Artikel</span>
          <button class="text-clear" onclick={clearCart}>Warenkorb leeren</button>
        </div>
      </header>

      <div class="cart-grid">
        <section class="items-list">
          {#each cartStore.items as item (item.product.id + item.size)}
            <div class="cart-item" in:fly={{ y: 20, duration: 400 }}>
              <div class="item-image-wrapper">
                {#if item.product.image}
                  <img src={item.product.image} alt={item.product.title} />
                {:else}
                  <div class="img-placeholder"></div>
                {/if}
              </div>

              <div class="item-info">
                <div class="item-header">
                  <h3>{item.product.title}</h3>
                  <p class="item-price-single">{formatPrice(item.product.price)}</p>
                </div>
                
                <div class="item-meta">
                  <div class="spec-tag">Größe: <span>{item.size}</span></div>
                </div>

                <div class="item-actions">
                  <div class="modern-stepper">
                    <button onclick={() => decreaseQuantity(item.product.id, item.size)}>−</button>
                    <span class="qty">{item.quantity}</span>
                    <button onclick={() => addToCart(item.product, 1, item.size)}>+</button>
                  </div>
                  
                  <button class="icon-remove" onclick={() => removeFromCart(item.product.id, item.size)} aria-label="Entfernen">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
                  </button>
                </div>
              </div>

              <div class="item-total-price">
                {formatPrice(item.product.price * item.quantity)}
              </div>
            </div>
          {/each}
        </section>

        <aside class="summary-section">
          <div class="summary-card">
            <h2>Bestellübersicht</h2>
            
            <div class="summary-details">
              <div class="row">
                <span>Zwischensumme</span>
                <span>{formatPrice(cartStore.totalPrice)}</span>
              </div>
              <div class="row shipping">
                <span>Versand</span>
                {#if cartStore.totalPrice >= freeShippingThreshold}
                  <span class="free">Kostenlos</span>
                {:else}
                  <span>{formatPrice(shippingCost)}</span>
                {/if}
              </div>
              
              {#if cartStore.totalPrice < freeShippingThreshold}
                <div class="shipping-info-box">
                  <div class="progress-bar">
                    <div class="progress" style="width: {(cartStore.totalPrice / freeShippingThreshold) * 100}%"></div>
                  </div>
                  <p>Noch <strong>{formatPrice(freeShippingThreshold - cartStore.totalPrice)}</strong> bis zum kostenlosen Versand!</p>
                </div>
              {/if}
            </div>

            <div class="total-row">
              <div class="total-label">
                <span>Gesamtbetrag</span>
                <small>inkl. MwSt.</small>
              </div>
              <span class="final-amount">
                {formatPrice(cartStore.totalPrice >= freeShippingThreshold ? cartStore.totalPrice : cartStore.totalPrice + shippingCost)}
              </span>
            </div>

            <button class="checkout-btn">
              <span>Sicher zur Kasse</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </aside>
      </div>
    {:else}
      <section class="empty-state-v2" in:fade>
        <div class="empty-icon">
          <div class="circle-bg"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <h2>Dein Schrank braucht Futter.</h2>
        <p>Dein Warenkorb fühlt sich momentan ziemlich einsam.</p>
        <a href="/shop" class="primary-cta">Kollektion entdecken</a>
      </section>
    {/if}
  </main>
</div>

<style>
  .page-wrapper {
    --primary-orange: #ff9500;
    --bg-dark: #0a0a0a;
    --bg-light: #f8f8f8;
    --card-dark: rgba(255, 255, 255, 0.03);
    --card-light: #ffffff;
    --border-dark: rgba(255, 255, 255, 0.08);
    --border-light: rgba(0, 0, 0, 0.06);
    
    min-height: 100vh;
    background-color: var(--bg-dark);
    color: #fff;
    transition: background-color 0.4s ease;
    font-family: 'Inter', system-ui, sans-serif;
  }

  .page-wrapper.light-mode {
    background-color: var(--bg-light);
    color: #1a1a1a;
  }

  .cart-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  /* Header Styles */
  .cart-header {
    margin-bottom: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .cart-header h1 {
    font-size: 4rem;
    font-weight: 900;
    letter-spacing: -2px;
    margin: 0;
  }

  .header-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .count-badge {
    background: var(--primary-orange);
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 100px;
    font-weight: 700;
    font-size: 0.9rem;
  }

  .text-clear {
    background: none;
    border: none;
    color: inherit;
    opacity: 0.4;
    cursor: pointer;
    font-size: 0.85rem;
    text-decoration: underline;
  }

  /* Grid & Items */
  .cart-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 4rem;
  }

  .cart-item {
    display: grid;
    grid-template-columns: 140px 1fr auto;
    gap: 2rem;
    padding: 2rem;
    background: var(--card-dark);
    border: 1px solid var(--border-dark);
    border-radius: 32px;
    margin-bottom: 1.5rem;
    align-items: center;
    transition: transform 0.3s ease, border-color 0.3s ease;
  }

  .light-mode .cart-item {
    background: var(--card-light);
    border-color: var(--border-light);
    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  }

  .item-image-wrapper {
    aspect-ratio: 1;
    border-radius: 20px;
    overflow: hidden;
    background: #1a1a1a;
  }

  .item-image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .item-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .item-header h3 {
    font-size: 1.5rem;
    margin: 0 0 0.2rem 0;
    font-weight: 700;
  }

  .item-price-single {
    opacity: 0.5;
    font-size: 0.9rem;
  }

  .spec-tag {
    display: inline-block;
    padding: 0.3rem 0.8rem;
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
    font-size: 0.85rem;
  }

  .light-mode .spec-tag { background: rgba(0,0,0,0.05); }

  .item-actions {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .modern-stepper {
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.05);
    padding: 0.5rem;
    border-radius: 14px;
    gap: 1.5rem;
  }

  .light-mode .modern-stepper { background: rgba(0,0,0,0.03); }

  .modern-stepper button {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.2rem;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: background 0.2s;
  }

  .modern-stepper button:hover { background: rgba(255,149,0,0.2); }

  .qty { font-weight: 700; min-width: 20px; text-align: center; }

  .icon-remove {
    background: none;
    border: none;
    color: #ff4444;
    cursor: pointer;
    opacity: 0.4;
    transition: opacity 0.2s, transform 0.2s;
  }

  .icon-remove:hover { opacity: 1; transform: scale(1.1); }

  .item-total-price {
    font-size: 1.5rem;
    font-weight: 900;
    color: var(--primary-orange);
  }

  /* Summary Section */
  .summary-card {
    position: sticky;
    top: 100px;
    background: var(--card-dark);
    border: 1px solid var(--border-dark);
    padding: 2.5rem;
    border-radius: 40px;
  }

  .light-mode .summary-card {
    background: white;
    border-color: var(--border-light);
    box-shadow: 0 20px 50px rgba(0,0,0,0.05);
  }

  .summary-card h2 {
    font-size: 1.8rem;
    margin-top: 0;
    margin-bottom: 2rem;
  }

  .summary-details .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    opacity: 0.7;
  }

  .row.shipping .free { color: #4ade80; font-weight: 700; }

  .shipping-info-box {
    margin: 2rem 0;
    padding: 1.2rem;
    background: rgba(255,149,0,0.05);
    border-radius: 16px;
    font-size: 0.85rem;
  }

  .progress-bar {
    height: 6px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    margin-bottom: 0.8rem;
    overflow: hidden;
  }

  .light-mode .progress-bar { background: rgba(0,0,0,0.05); }

  .progress {
    height: 100%;
    background: var(--primary-orange);
    transition: width 0.5s ease;
  }

  .total-row {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px dashed var(--border-dark);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .total-label { display: flex; flex-direction: column; }
  .total-label span { font-size: 1.2rem; font-weight: 700; }
  .total-label small { opacity: 0.5; }

  .final-amount {
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--primary-orange);
    line-height: 1;
  }

  .checkout-btn {
    width: 100%;
    margin-top: 2.5rem;
    padding: 1.5rem;
    background: var(--primary-orange);
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 1.2rem;
    font-weight: 800;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .checkout-btn:hover { transform: translateY(-5px); background: #ffaa33; }

  /* Empty State v2 */
  .empty-state-v2 {
    text-align: center;
    padding: 8rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .empty-icon {
    position: relative;
    margin-bottom: 2rem;
    color: var(--primary-orange);
  }

  .circle-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background: var(--primary-orange);
    filter: blur(40px);
    opacity: 0.15;
  }

  .empty-state-v2 h2 { font-size: 3rem; font-weight: 900; margin-bottom: 1rem; }
  .empty-state-v2 p { font-size: 1.2rem; opacity: 0.5; margin-bottom: 3rem; }

  .primary-cta {
    background: white;
    color: black;
    padding: 1.2rem 3rem;
    border-radius: 100px;
    text-decoration: none;
    font-weight: 800;
    transition: transform 0.2s;
  }

  .light-mode .primary-cta { background: #000; color: #fff; }

  .primary-cta:hover { transform: scale(1.05); }

  /* Tablet / Smaller Desktop Breakpoint */
  @media (max-width: 968px) {
    .cart-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .cart-header h1 { font-size: 2.5rem; }
    .cart-item { grid-template-columns: 100px 1fr; padding: 1.5rem; gap: 1.5rem; }
    .item-total-price { grid-column: span 2; text-align: right; }
  }

  /* ==========================================================================
     NEUE MOBILE OPTIMIERUNGEN (Smartphones)
     ========================================================================== */
  @media (max-width: 600px) {
    .cart-container {
      padding: 1.5rem 1rem; /* Engere Außenabstände am Rand */
    }

    /* Header kleiner und kompakter */
    .cart-header {
      margin-bottom: 2rem;
      align-items: center;
    }

    .cart-header h1 {
      font-size: 1.8rem; /* Drastisch verkleinert für Mobile */
      letter-spacing: -0.5px;
    }

    .count-badge {
      padding: 0.25rem 0.75rem;
      font-size: 0.8rem;
    }

    /* Items schrumpfen */
    .cart-item {
      grid-template-columns: 75px 1fr; /* Weniger Platz für das Bild */
      gap: 1rem;
      padding: 1rem;
      border-radius: 20px; /* Runder Radius passt besser auf Mobile */
      margin-bottom: 1rem;
    }

    .item-image-wrapper {
      border-radius: 12px;
    }

    .item-header h3 {
      font-size: 1.1rem; /* Kleinerer Produkttitel */
    }

    .item-price-single {
      font-size: 0.8rem;
    }

    .spec-tag {
      padding: 0.2rem 0.5rem;
      font-size: 0.75rem;
    }

    .item-actions {
      gap: 1rem; /* Engere Buttons */
    }

    .modern-stepper {
      padding: 0.3rem;
      gap: 0.8rem;
      border-radius: 10px;
    }

    .modern-stepper button {
      width: 26px;
      height: 26px;
      font-size: 1rem;
    }

    .qty {
      font-size: 0.9rem;
      min-width: 15px;
    }

    .item-total-price {
      font-size: 1.1rem; /* Kompakterer Preis unten rechts */
      margin-top: -0.5rem;
    }

    /* Summary Card verkleinern */
    .summary-card {
      padding: 1.5rem;
      border-radius: 24px;
    }

    .summary-card h2 {
      font-size: 1.4rem;
      margin-bottom: 1.2rem;
    }

    .summary-details .row {
      font-size: 0.95rem;
    }

    .final-amount {
      font-size: 1.8rem; /* Verkleinerte Summe */
    }

    .checkout-btn {
      padding: 1rem;
      font-size: 1rem;
      border-radius: 14px;
      margin-top: 1.5rem;
    }

    /* EMPTY STATE NACH OBEN VERSCHIEBEN UND VERKLEINERN */
    .empty-state-v2 {
      padding: 0;
      margin-top: 12vh; /* Nutzt Viewport-Height, um es sauber im oberen Drittel zu platzieren */
    }

    .empty-icon svg {
      width: 48px;
      height: 48px;
    }

    .circle-bg {
      width: 90px;
      height: 90px;
    }

    .empty-state-v2 h2 {
      font-size: 1.6rem; /* Stark verkleinerte Überschrift */
      margin-bottom: 0.75rem;
    }

    .empty-state-v2 p {
      font-size: 0.95rem;
      margin-bottom: 2rem;
      padding: 0 1rem;
    }

    .primary-cta {
      padding: 1rem 2rem;
      font-size: 0.95rem;
    }
  }
</style>
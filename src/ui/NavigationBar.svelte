<script lang="ts">
  import { isLight } from '$lib/stores/theme';
  import { cartStore } from '$lib/stores/cart.svelte'; 

  type Item = { label: string; href: string };
  const items: Item[] = [
    { label: 'Home',     href: '/' },
    { label: 'About',    href: '/about' },
    { label: 'Contact',  href: '/contact' },
    { label: 'Shop',     href: '/shop' }, 
    { label: 'Cart',     href: '/cart' }
  ];

  // Filtert alle Links außer Cart für das Hauptmenü
  const mainItems: Item[] = items.filter(i => i.label !== 'Cart');
  
  // Der dedizierte Cart-Link für die rechte Seite
  const cartLink: Item = { label: 'Cart', href: '/cart' };

  function toggleTheme() {
    isLight.update(v => !v);
  }

  const maxBadge = 99;

  // SVELTE 5 RUNES: Reagiert automatisch auf Änderungen im cartStore
  const displayBadge = $derived(cartStore.totalCount > 0);
  const badgeText = $derived(cartStore.totalCount > maxBadge ? `${maxBadge}+` : String(cartStore.totalCount));
</script>

<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden;">
  <symbol id="icon-cart" viewBox="0 0 24 24" stroke="currentColor" fill="none" vector-effect="non-scaling-stroke">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
  </symbol>
</svg>

<header class="header-wrapper" class:light-mode={$isLight}>
  <div class="header-content">
    <button
      class="theme-btn"
      onclick={toggleTheme}
      aria-label="Toggle Light/Dark Mode"
      aria-pressed={$isLight}
    >
      <div class="icon-container">
        {#if $isLight}
          <svg class="sun" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 2V4M12 20V22M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M2 12H4M20 12H22M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        {:else}
          <svg class="moon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        {/if}
      </div>
    </button>

    <nav class="navbar" aria-label="Main">
      <ul class="menu">
        {#each mainItems as item}
          <li>
            <a class="nav-link" href={item.href}>
              {item.label}
              <span class="indicator"></span>
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    <div class="actions">
      <a class="cart-link" href={cartLink.href} aria-label={`Warenkorb, ${cartStore.totalCount} Artikel`}>
        <div class="cart-icon-wrapper">
          <svg class="icon-cart-svg" aria-hidden="true">
            <use href="#icon-cart" />
          </svg>

          {#if displayBadge}
            <span class="badge" aria-live="polite" aria-atomic="true">{badgeText}</span>
          {/if}
        </div>
      </a>
    </div>
  </div>
</header>

<a 
  href="/ImpressumUndDatenschutz" 
  class="rotated-side-link" 
  class:light-mode={$isLight}
>
  Impressum & Datenschutz
</a>

<style>
  .header-wrapper {
    --primary-orange: #ff9500;
    --primary-orange-hover: #e68600;
    --bg-glass-dark: rgba(0, 0, 0, 0.75);
    --bg-glass-light: rgba(255, 255, 255, 0.85);
    --text-dark: #ffffff;
    --text-light: #1a1a1a;
    
    position: sticky;
    top: 0;
    z-index: 1000;
    width: 100%;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    background: var(--bg-glass-dark);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.4s ease;
  }

  .header-wrapper.light-mode {
    background: var(--bg-glass-light);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0.75rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .theme-btn {
    all: unset;
    cursor: pointer;
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    transition: all 0.3s ease;
    color: var(--text-dark);
  }

  .light-mode .theme-btn {
    background: rgba(0, 0, 0, 0.05);
    color: var(--text-light);
  }

  .theme-btn:hover {
    background: var(--primary-orange);
    color: white;
    transform: translateY(-2px);
  }

  .icon-container svg {
    width: 20px;
    height: 20px;
  }

  .menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 0.75rem;
  }

  .nav-link {
    position: relative;
    text-decoration: none;
    color: var(--text-dark);
    font-size: 0.95rem;
    font-weight: 500;
    padding: 0.5rem 0.8rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .light-mode .nav-link {
    color: var(--text-light);
  }

  .nav-link:hover {
    color: var(--primary-orange);
    background: rgba(255, 149, 0, 0.12);
  }

  .indicator {
    position: absolute;
    bottom: 4px;
    width: 0;
    height: 2px;
    background: var(--primary-orange);
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  .nav-link:hover .indicator {
    width: 16px;
  }

  .cart-link {
    text-decoration: none;
    color: var(--text-dark);
  }

  .light-mode .cart-link {
    color: var(--text-light);
  }

  .cart-icon-wrapper {
    position: relative;
    padding: 8px;
    background: rgba(255, 149, 0, 0.1);
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  .cart-icon-wrapper:hover {
    background: var(--primary-orange);
    color: white;
    transform: scale(1.05);
  }

  .icon-cart-svg {
    width: 22px;
    height: 22px;
    stroke-width: 2;
  }

  .badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: var(--primary-orange);
    color: white;
    font-size: 0.65rem;
    font-weight: 800;
    min-width: 16px;
    height: 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #000;
  }

  .light-mode .badge {
    border-color: #fff;
  }

  /* Stylischer, rotierter Seiten-Link */
  .rotated-side-link {
    position: fixed;
    left: 0;
    top: 30vh; /* Etwas weiter nach unten gesetzt, um Abstand zur Navbar zu wahren */
    z-index: 999;
    
    /* Typografie passend zum Clean-Look */
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-decoration: none;
    white-space: nowrap;
    
    /* Standard-Farbe (Dezent im Hintergrund integriert) */
    color: #ffffff;
    opacity: 0.4;
    
    /* Padding sorgt für eine größere, angenehmere Klickfläche */
    padding: 0.5rem 1rem 0.5rem 0.5rem; 
    
    /* Rotation & Ursprung */
    transform-origin: left top;
    transform: translateY(100%) rotate(-90deg);
    
    /* Flüssige Transition beim Hovern */
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                color 0.3s ease, 
                opacity 0.3s ease;
  }

  .rotated-side-link.light-mode {
    color: #1a1a1a;
  }

  /* Edel-Hover-Effekt */
  .rotated-side-link:hover {
    opacity: 1;
    color: #ff9500; /* Verwendet dein Marken-Orange */
    
    /* Schiebt den Text beim Hovern leicht nach rechts aus dem Bildschirmrand heraus */
    transform: translateY(100%) rotate(-90deg) translateY(-4px);
  }

  @media (max-width: 640px) {
    .header-content {
      padding: 0.5rem 0.75rem;
    }
    .menu {
      gap: 0.1rem;
    }
    .nav-link {
      padding: 0.4rem 0.5rem;
      font-size: 0.85rem;
    }
    
    /* Auf sehr kleinen Mobile-Geräten etwas höher schieben oder kleiner machen, falls nötig */
    .rotated-side-link {
      font-size: 0.5em; /* Kleinerer Text für Mobile */
      letter-spacing: 0.02em;
      top: 25vh; /* Etwas höher, damit er nicht mit Inhalten kollidiert */
      padding: 0.3rem 0.6rem 0.3rem 0.3rem; /* Kompakteres Padding */
    }
  }
</style>
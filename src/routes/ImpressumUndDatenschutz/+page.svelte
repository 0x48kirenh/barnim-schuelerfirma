<script lang="ts">
  import NavigationBar from '../../ui/NavigationBar.svelte';
  import { isLight } from '$lib/stores/theme';
  import { fade, fly } from 'svelte/transition';
  import { browser } from '$app/environment';
  import { onDestroy } from 'svelte';

  // Temporäre Klasse für die Scroll-Ausnahme
  const scrollClass = 'allow-scroll-exception';

  if (browser) {
    document.documentElement.classList.add(scrollClass);
    document.body.classList.add(scrollClass);
    const svelteEl = document.getElementById('svelte');
    if (svelteEl) svelteEl.classList.add(scrollClass);
  }

  onDestroy(() => {
    if (browser) {
      document.documentElement.classList.remove(scrollClass);
      document.body.classList.remove(scrollClass);
      const svelteEl = document.getElementById('svelte');
      if (svelteEl) svelteEl.classList.remove(scrollClass);
    }
  });
</script>

<NavigationBar />

<div class="page-wrapper" class:light-mode={$isLight}>
  <div class="background-blobs" aria-hidden="true">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
  </div>

  <main class="container">
    <header class="header" in:fade={{ delay: 200, duration: 800 }}>
      <h1 class="headline">Impressum <span class="highlight">&</span> Datenschutz</h1>
      <p class="subtitle">Alles, was du rechtlich nicht wissen wolltest – aber musst.</p>
    </header>

    <section class="content-card" in:fly={{ y: 20, duration: 800, delay: 400 }}>
      
      <!-- Sektion 1: Impressum -->
      <div class="content-section">
        <h2 class="section-headline">Impressum</h2>
        
        <div class="info-block">
          <h3 class="sub-heading">Verantwortlich für den Inhalt</h3>
          <div class="contact-info">
            <p>Dr. Egon Kowalski</p>
            <p>Außerirdischer Beauftragter für intergalaktische Kommunikation</p>
            <p>Adresse: Neptun, Ring 7, 12345 Universum</p>
            <p>Kontakt: <a href="mailto:egon.kowalski@milkyway.space">egon.kowalski@milkyway.space</a></p>
          </div>
        </div>

        <div class="info-block">
          <h3 class="sub-heading">Haftungsausschluss</h3>
          <p>
            Wir übernehmen keine Haftung für verlorene Socken in der Waschmaschine.
            Sollte dir beim Lesen dieser Seite ein Schaden entstehen (z. B. Lachkrampf),
            wende dich bitte an deinen interstellaren Hausarzt.
          </p>
        </div>

        <div class="info-block">
          <p class="lorem-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>

      <!-- Trennlinie (nur auf Mobile sichtbar) -->
      <hr class="divider" />

      <!-- Sektion 2: Datenschutz -->
      <div class="content-section">
        <h2 class="section-headline">Datenschutzerklärung</h2>
        
        <div class="info-block">
          <h3 class="sub-heading">1. Datenerfassung</h3>
          <p>
            Wir sammeln keine Daten – außer du liest diesen Text. In dem Fall speichern wir
            deine IP-Adresse in einem Glas Honig und vergraben sie auf einem Regenbogen.
            Deine Cookie-Vorlieben werden mit Sternenstaub analysiert.
          </p>
        </div>

        <div class="info-block">
          <h3 class="sub-heading">2. Deine Rechte</h3>
          <p>
            Du hast das Recht, jederzeit die Löschung deiner Daten zu verlangen. Dazu musst
            du nur dreimal rückwärts um den Block laufen und dabei "Privatsphäre" rufen.
            Wir kommen dann mit einem Besen vorbei und wischen deine Daten aus der Cloud.
          </p>
        </div>

        <div class="info-block">
          <h3 class="sub-heading">3. Kontakt</h3>
          <div class="contact-info">
            <p>Datenschutzbeauftragter: Max Mustermann</p>
            <p>Musterstraße 42, 12345 Musterstadt</p>
            <p>Oder ruf einfach die Datenschutz-Hotline an: <a href="tel:08007748229">0800-PRIVACY (0800-7748229)</a></p>
          </div>
        </div>

        <div class="info-block">
          <p class="lorem-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </section>
  </main>
</div>

<style>
  /* === SCROLL-AUSNAHME (Gilt nur für diese Seite) === */
  :global(html.allow-scroll-exception),
  :global(body.allow-scroll-exception),
  :global(#svelte.allow-scroll-exception) {
    overflow-y: auto !important;
    height: auto !important;
    min-height: 100vh !important;
  }

  /* === LAYOUT === */
  * {
    box-sizing: border-box;
  }

  :root {
    --primary-orange: #ff9500;
    --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    --radius-lg: 24px;
    --radius-md: 14px;
  }

  .page-wrapper {
    min-height: 100vh;
    background-color: #050505;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: relative;
    overflow-x: hidden; 
    padding: 1.25rem;
    padding-top: 5.5rem; 
    padding-bottom: 4rem; 
    transition: var(--transition);
  }

  .page-wrapper.light-mode {
    background-color: #fafafa;
    color: #111111;
  }

  /* Hintergrund-Blobs */
  .background-blobs {
    position: fixed; /* fixed statt absolute, damit es beim Scrollen im Hintergrund bleibt */
    inset: 0;
    z-index: 0;
    filter: blur(100px);
    opacity: 0.35;
    pointer-events: none;
  }

  .blob {
    position: absolute;
    border-radius: 50%;
    background: var(--primary-orange);
    will-change: transform;
  }

  .blob-1 {
    width: clamp(200px, 40vw, 400px);
    height: clamp(200px, 40vw, 400px);
    top: -10%;
    left: -10%;
    animation: move 25s infinite alternate ease-in-out;
  }

  .blob-2 {
    width: clamp(180px, 35vw, 320px);
    height: clamp(180px, 35vw, 320px);
    bottom: -5%;
    right: -5%;
    animation: move 20s infinite alternate-reverse ease-in-out;
  }

  @keyframes move {
    from { transform: translate(0, 0) scale(1); }
    to { transform: translate(50px, 25px) scale(1.05); }
  }

  /* Container */
  .container {
    position: relative;
    z-index: 1;
    width: 100%;
    /* Mobile first: schmal, wächst auf Desktop */
    max-width: 1100px; 
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 4vh;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .header {
    text-align: center;
    padding: 0 0.5rem;
  }

  .headline {
    font-size: clamp(2rem, 6vw, 3.5rem);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin: 0;
  }

  .highlight {
    color: var(--primary-orange);
  }

  .subtitle {
    margin-top: 0.8rem;
    font-size: clamp(0.9rem, 2.5vw, 1.15rem);
    opacity: 0.7;
    line-height: 1.4;
  }

  /* Inhaltskarte (Grid für Desktop, Stack für Mobile) */
  .content-card {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 149, 0, 0.15);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    padding: clamp(1.5rem, 5vw, 3rem);
    border-radius: var(--radius-lg);
    display: grid;
    grid-template-columns: 1fr; /* Mobile: 1 Spalte */
    gap: 1.5rem;
    box-shadow: 0 25px 50px -15px rgba(0, 0, 0, 0.5);
  }

  .light-mode .content-card {
    background: rgba(255, 255, 255, 0.75);
    border-color: rgba(255, 149, 0, 0.2);
    box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.05);
  }

  /* Desktop: Zwei Spalten nebeneinander, viel Platz */
  @media (min-width: 768px) {
    .content-card {
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
    }
    /* Trennlinie auf Desktop ausblenden */
    .divider {
      display: none;
    }
  }

  /* Textabschnitte */
  .content-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .section-headline {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--primary-orange);
    margin: 0 0 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 149, 0, 0.2);
  }

  .info-block {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .sub-heading {
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0;
    color: inherit;
  }

  .content-section p {
    margin: 0;
    line-height: 1.7;
    font-size: 0.95rem;
    opacity: 0.85;
  }

  .contact-info p {
    margin: 0;
    line-height: 1.6;
  }

  .contact-info a {
    color: var(--primary-orange);
    text-decoration: none;
    font-weight: 600;
  }

  .contact-info a:hover {
    text-decoration: underline;
  }

  .lorem-text {
    font-style: italic;
    opacity: 0.5 !important;
  }

  .light-mode .content-section p {
    opacity: 0.8;
  }

  /* Trennlinie (Mobile only) */
  .divider {
    border: none;
    height: 1px;
    background: rgba(255, 149, 0, 0.2);
    margin: 1rem 0;
  }

  .light-mode .divider {
    background: rgba(255, 149, 0, 0.3);
  }

  /* Mobile Optimierung */
  @media (max-width: 480px) {
    .page-wrapper {
      padding: 0.75rem;
      padding-top: 5rem;
      padding-bottom: 3rem;
    }

    .container {
      gap: 1.4rem;
      margin-top: 1vh;
    }

    .content-card {
      padding: 1.25rem;
    }
  }
</style>
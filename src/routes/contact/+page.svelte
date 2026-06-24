<script lang="ts">
  import NavigationBar from '../../ui/NavigationBar.svelte';
  import { isLight } from '$lib/stores/theme';
  import { fade, fly } from 'svelte/transition';

  // Svelte 5 Runes (Logik-Dummies)
  let email = $state('');
  let text = $state('');
  let isSubmitted = $state(false);
  let isSending = $state(false);

  async function submitForm() {
    if (!email || !text) return;
    
    isSending = true;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log({ email, text });
    isSending = false;
    isSubmitted = true;

    setTimeout(() => {
      isSubmitted = false;
      email = '';
      text = '';
    }, 3000);
  }
</script>

<NavigationBar />

<div class="page-wrapper" class:light-mode={$isLight}>
  <div class="background-blobs" aria-hidden="true">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
  </div>

  <main class="container">
    <header class="header" in:fade={{ delay: 200, duration: 800 }}>
      <h1 class="headline">Get in <span class="highlight">Touch</span></h1>
      <p class="subtitle">Hast du Fragen zur Collection? Schreib uns einfach.</p>
    </header>

    <section class="form-card" in:fly={{ y: 20, duration: 800, delay: 400 }}>
      {#if isSubmitted}
        <div class="success-message" in:fade>
          <div class="success-icon">✓</div>
          <h2>Nachricht gesendet!</h2>
          <p>Vielen Dank, wir melden uns bald bei dir.</p>
        </div>
      {:else}
        <div class="form-group">
          <label for="email" class="form-label">E-Mail Adresse</label>
          <input
            id="email"
            type="email"
            bind:value={email}
            placeholder="name@beispiel.de"
            class="email-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="message" class="form-label">Deine Nachricht</label>
          <textarea
            id="message"
            bind:value={text}
            placeholder="Wie können wir dir helfen?"
            class="textarea"
            required
          ></textarea>
        </div>

        <button
          class="submit-btn"
          disabled={!email || !text || isSending}
          onclick={submitForm}
        >
          {#if isSending}
            <span class="loader" aria-hidden="true"></span>
            <span>Wird gesendet...</span>
          {:else}
            <span>Nachricht abschicken</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="send-icon"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          {/if}
        </button>
      {/if}
    </section>
  </main>
</div>

<style>
  /* Globale Absicherung gegen Layout-Sprengung */
  * {
    box-sizing: border-box;
  }

  :root {
    --primary-orange: #ff9500;
    --primary-hover: #e68600;
    --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    --radius-lg: 24px;
    --radius-md: 14px;
  }

  /* Basis-Layout */
  .page-wrapper {
    min-height: 100vh;
    background-color: #050505;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: flex-start; /* Ausrichtung oben */
    position: relative;
    overflow-x: hidden; /* Verhindert horizontales Scrollen der gesamten Seite */
    padding: 1.25rem;
    padding-top: 5.5rem; /* Platz für die Navbar */
    transition: var(--transition);
  }

  .page-wrapper.light-mode {
    background-color: #fafafa;
    color: #111111;
  }

  /* Hintergrund-Blobs */
  .background-blobs {
    position: absolute;
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

  /* Container & Header - Ausgewogene Desktop-Breite */
  .container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 560px; /* Perfekte Desktop-Größe: Nicht zu wuchtig, nicht verloren */
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    margin-top: 4vh; /* Schiebt alles leicht und elegant nach oben */
    word-break: break-word; /* Schützt Container-Inhalte vor Overflow */
    overflow-wrap: anywhere;
  }

  .header {
    text-align: center;
    padding: 0 0.5rem;
  }

  .headline {
    font-size: clamp(2rem, 6vw, 3rem);
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
    margin-top: 0.6rem;
    font-size: clamp(0.9rem, 2.5vw, 1.05rem);
    opacity: 0.7;
    line-height: 1.4;
  }

  /* Formular-Karte */
  .form-card {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 149, 0, 0.15);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    padding: clamp(1.5rem, 5vw, 2.2rem);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
    box-shadow: 0 25px 50px -15px rgba(0, 0, 0, 0.5);
  }

  .light-mode .form-card {
    background: rgba(255, 255, 255, 0.75);
    border-color: rgba(255, 149, 0, 0.2);
    box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.05);
  }

  /* Inputs & Labels */
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    width: 100%;
  }

  .form-label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.6;
    margin-left: 0.1rem;
  }

  .textarea,
  .email-input {
    width: 100%;
    max-width: 100%; /* Verhindert das Herausragen */
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    padding: 0.95rem 1.1rem;
    color: inherit;
    font-size: 1rem;
    font-family: inherit;
    transition: var(--transition);
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    
    /* WICHTIG: Verhindert horizontales Herausrutschen bei extrem langen Wörtern */
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .light-mode .textarea,
  .light-mode .email-input {
    background: rgba(0, 0, 0, 0.04);
  }

  .textarea::placeholder,
  .email-input::placeholder {
    opacity: 0.4;
  }
  
  .light-mode .textarea::placeholder,
  .light-mode .email-input::placeholder {
    color: #111;
    opacity: 0.35;
  }

  .textarea {
    min-height: 130px;
    max-height: 250px;
    resize: vertical; /* Erlaubt nur vertikales Ziehen, kein horizontales Zerstören */
  }

  .textarea:focus,
  .email-input:focus {
    border-color: var(--primary-orange);
    background: rgba(255, 149, 0, 0.02);
    box-shadow: 0 0 0 4px rgba(255, 149, 0, 0.12);
  }

  /* Senden Button */
  .submit-btn {
    background: var(--primary-orange);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    padding: 1rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    transition: var(--transition);
    margin-top: 0.2rem;
    width: 100%;
  }

  .submit-btn:hover:not(:disabled) {
    background: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 8px 16px -5px rgba(255, 149, 0, 0.35);
  }

  .submit-btn:active:not(:disabled) {
    transform: translateY(1px);
  }

  .submit-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  .send-icon {
    flex-shrink: 0; /* Verhindert das Verquetschen des Icons */
    transition: transform 0.25s ease;
  }

  .submit-btn:hover:not(:disabled) .send-icon {
    transform: translate(2px, -2px);
  }

  /* Success-State */
  .success-message {
    text-align: center;
    padding: 1.5rem 0.5rem;
  }

  .success-icon {
    width: 54px;
    height: 54px;
    background: var(--primary-orange);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-weight: bold;
    margin: 0 auto 1rem;
    box-shadow: 0 8px 16px rgba(255, 149, 0, 0.2);
  }

  .success-message h2 {
    font-size: 1.4rem;
    margin-bottom: 0.4rem;
  }

  /* Loading Spinner */
  .loader {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 0.6s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Mobile-Anpassungen */
  @media (max-width: 480px) {
    .page-wrapper {
      padding: 0.75rem; /* Etwas engerer Rand für maximalen Platz */
      padding-top: 5rem;
    }

    .container {
      gap: 1.4rem;
      margin-top: 1vh; /* Auf Mobile noch ein Stückchen höher */
    }

    .form-card {
      padding: 1.25rem; /* Kompakt, aber lesbar */
    }

    .textarea {
      min-height: 110px;
    }
  }
</style>
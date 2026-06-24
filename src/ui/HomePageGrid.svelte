<script lang="ts">
  import { onMount } from 'svelte';
  import { isLight } from '$lib/stores/theme';
  import { browser } from '$app/environment';

  // Props
  const { barnimOpacity = 1 } = $props<{ idPrefix?: string; barnimOpacity?: number }>();

  // DOM & Contexts
  let container = $state<HTMLDivElement>();
  let canvas = $state<HTMLCanvasElement>();
  let ctx: CanvasRenderingContext2D | null = null;
  let offscreen: HTMLCanvasElement;
  let offCtx: CanvasRenderingContext2D | null = null;

  let containerRect = { left: 0, top: 0, width: 0, height: 0 };

  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  // Fast internal variables
  let cellSize = 0;
  let physCellSize = 0;
  let cols = 0;
  let rows = 0;
  let flatGrid: string[] = [];
  let dpr = 1;
  let initialized = false;
  
  // Template-bound state
  let viewBox = $state('0 0 100 100');
  let isDesktop = $state(false);
  
  // Derive light mode directly from the store
  let lightMode = $derived(!!$isLight);
  
  // Animation & Trail
  let animating = false;
  let dirtyBackground = false;
  const trailCells = new Map<number, { alpha: number; scale: number }>();
  let hoveredIndex: number | null = null;

  // Input Batching
  let pendingX = -1;
  let pendingY = -1;

  // Asset Caches (Reused to prevent GC)
  const atlasDefault = new Map<string, HTMLCanvasElement>();
  const atlasHighlight = new Map<string, HTMLCanvasElement>();

  const colors = $derived({
    accent: '#ff9500', 
    letter: lightMode ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)',
    bg: lightMode ? '#ffffff' : '#0a0a0a'
  });

  function createAtlases() {
    const physSize = physCellSize;
    const fontSize = cellSize * 0.7 * dpr;

    for (const L of LETTERS) {
      // Reuse existing canvases to avoid memory allocation / GC
      let base = atlasDefault.get(L);
      if (!base) {
        base = document.createElement('canvas');
        atlasDefault.set(L, base);
      }
      base.width = physSize; 
      base.height = physSize;
      const bctx = base.getContext('2d');
      if (bctx) {
        // Verwende 1:1 Pixel-Mapping ohne Skalierung
        bctx.setTransform(1, 0, 0, 1, 0, 0);
        bctx.font = `900 ${fontSize}px "Inter", sans-serif`;
        bctx.textAlign = 'center';
        bctx.textBaseline = 'middle';
        bctx.fillStyle = colors.letter;
        // Exakt im Zentrum der physischen Zelle zeichnen
        bctx.fillText(L, physSize / 2, physSize / 2);
      }

      let high = atlasHighlight.get(L);
      if (!high) {
        high = document.createElement('canvas');
        atlasHighlight.set(L, high);
      }
      high.width = physSize; 
      high.height = physSize;
      const hctx = high.getContext('2d');
      if (hctx) {
        // Verwende 1:1 Pixel-Mapping ohne Skalierung
        hctx.setTransform(1, 0, 0, 1, 0, 0);
        hctx.font = `900 ${fontSize}px "Inter", sans-serif`;
        hctx.textAlign = 'center';
        hctx.textBaseline = 'middle';
        hctx.fillStyle = colors.accent;
        hctx.shadowBlur = 4 * dpr; 
        hctx.shadowColor = colors.accent;
        // Exakt im Zentrum der physischen Zelle zeichnen
        hctx.fillText(L, physSize / 2, physSize / 2);
      }
    }
  }

  function preRenderBackground() {
    if (!offCtx) return;
    // Use 1:1 pixel blitting (no scaling) for massive speedup
    offCtx.setTransform(1, 0, 0, 1, 0, 0);
    offCtx.fillStyle = colors.bg;
    offCtx.fillRect(0, 0, offscreen.width, offscreen.height);

    for (let i = 0; i < flatGrid.length; i++) {
      const r = (i / cols) | 0;
      const c = i % cols;
      const img = atlasDefault.get(flatGrid[i]);
      if (img) offCtx.drawImage(img, c * physCellSize, r * physCellSize);
    }

    // Mark the background as dirty so the animation loop copies it to the main canvas
    dirtyBackground = true;
  }

  function updateMetrics() {
    if (!browser || !container || !canvas || !offscreen) return;
    dpr = window.devicePixelRatio || 1;
    
    containerRect = container.getBoundingClientRect();
    const w = containerRect.width;
    const h = containerRect.height;
    
    isDesktop = w > 768;
    cellSize = (isDesktop ? w / 45 : w / 15) | 0;
    physCellSize = (cellSize * dpr) | 0; // Pre-calculate physical size
    cols = Math.ceil(w / cellSize);
    rows = Math.ceil(h / cellSize);
    viewBox = `0 0 ${w} ${h}`;
    
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    offscreen.width = w * dpr;
    offscreen.height = h * dpr;

    flatGrid = Array.from({ length: cols * rows }, () => LETTERS[(Math.random() * LETTERS.length) | 0]);

    createAtlases();
    preRenderBackground();
    startAnimation();
  }

  function startAnimation() {
    if (animating) return;
    animating = true;
    requestAnimationFrame(animate);
  }

  function animate() {
    if (!ctx || !offscreen) return;

    let needsRedraw = false;
    let hasFadingCells = false;

    // Force redraw if the background was recently updated (e.g., on mount, resize, or theme change)
    if (dirtyBackground) {
      needsRedraw = true;
      dirtyBackground = false;
    }

    // 1. Process pending mouse movement
    if (pendingX !== -1 && pendingY !== -1) {
      const c = ((pendingX - containerRect.left) / cellSize) | 0;
      const r = ((pendingY - containerRect.top) / cellSize) | 0;
      const idx = r * cols + c;

      if (idx >= 0 && idx < flatGrid.length && idx !== hoveredIndex) {
        hoveredIndex = idx;
        if (!trailCells.has(idx)) {
          trailCells.set(idx, { alpha: 1, scale: 1.25 });
        }
        needsRedraw = true;
      }
      pendingX = -1; 
    }

    // 2. Trail Processing
    const FADE_SPEED = 0.035;

    trailCells.forEach((data, idx) => {
      if (idx === hoveredIndex) {
        if (data.alpha < 1 || data.scale < 1.25) {
          data.alpha = 1;
          data.scale = 1.25;
          needsRedraw = true;
        }
      } else {
        hasFadingCells = true; 
        data.alpha -= FADE_SPEED;
        data.scale = 1 + (data.alpha * 0.25);
        needsRedraw = true;
      }

      if (data.alpha <= 0) {
        trailCells.delete(idx);
        needsRedraw = true;
      }
    });

    // 3. Drawing Logic (Only executed if something changed!)
    if (needsRedraw) {
      // 1:1 Blit des Hintergrunds
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(offscreen, 0, 0);
      
      // Zeichne Highlights ebenfalls in 1:1 Pixeln, um Subpixel-Rendering zu vermeiden
      trailCells.forEach((data, idx) => {
        if (data.alpha > 0) {
          const r = (idx / cols) | 0;
          const c = idx % cols;
          const img = atlasHighlight.get(flatGrid[idx]);
          if (img) {
            ctx!.globalAlpha = data.alpha;
            
            // Berechne Größen und Positionen in physischen Pixeln
            const physS = physCellSize * data.scale;
            const physOffset = (physS - physCellSize) * 0.5;
            
            // Runden auf ganzzahlige Pixel, um exakte Deckung mit dem Raster zu erzwingen
            const destX = Math.round(c * physCellSize - physOffset);
            const destY = Math.round(r * physCellSize - physOffset);
            
            ctx!.drawImage(img, destX, destY, physS, physS);
          }
        }
      });
      ctx!.globalAlpha = 1;
    }

    // 4. Loop continuation
    if (hasFadingCells || pendingX !== -1 || (hoveredIndex !== null && needsRedraw)) {
      requestAnimationFrame(animate);
    } else {
      animating = false;
    }
  }

  function handleMove(e: PointerEvent) {
    pendingX = e.clientX;
    pendingY = e.clientY;
    if (!animating) startAnimation();
  }

  function handleLeave() {
    hoveredIndex = null;
    if (!animating) startAnimation();
  }

  // THEME REACTIVITY FIX:
  // Explicitly read the derived values here so Svelte 5 tracks them.
  $effect(() => {
    const mode = lightMode;
    const currentColors = colors; 
    
    if (browser && ctx && offscreen && initialized) {
      createAtlases();
      preRenderBackground();
      startAnimation();
    }
  });

  onMount(() => {
    offscreen = document.createElement('canvas');
    offCtx = offscreen.getContext('2d', { alpha: false });
    ctx = canvas!.getContext('2d', { alpha: false, desynchronized: true });
    
    updateMetrics();
    initialized = true; 
    
    const handleResize = () => updateMetrics();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      animating = false;
    };
  });
</script>

<div 
  class="hero-root" 
  class:light={lightMode} 
  bind:this={container}
  onpointermove={handleMove}
  onpointerleave={handleLeave}
  role="presentation"
>
  <canvas bind:this={canvas} class="grid-layer"></canvas>

  <svg class="svg-overlay" {viewBox} preserveAspectRatio="xMidYMid slice">
    <defs>
      <g id="text-group" class="main-text">
        {#if !isDesktop}
          <text x="50%" y="25%" text-anchor="middle">BARNIM -</text>
          <text x="50%" y="34%" text-anchor="middle">GYMNASIUM</text>
          <text x="50%" y="43%" text-anchor="middle" class="sub">EST. 2024 SHOP</text>
        {:else}
          <text x="50%" y="45%" text-anchor="middle">BARNIM - GYMNASIUM</text>
          <text x="50%" y="58%" text-anchor="middle" class="sub">OFFICIAL MERCHANDISE SHOP</text>
        {/if}
      </g>

      <clipPath id="text-clip">
        <use href="#text-group" />
      </clipPath>
      
      <filter id="soft-glow">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <rect width="100%" height="100%" class="glass-fill" clip-path="url(#text-clip)" />

    <use 
      href="#text-group" 
      fill="#ff9500" 
      fill-opacity={barnimOpacity}
      filter="url(#soft-glow)"
      class="floating-text"
    />
  </svg>
  
  <div class="vignette"></div>
</div>

<style>
  .hero-root {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #0a0a0a;
    transition: background 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: default;
    --glow-strength: 5;
  }

  .hero-root.light { 
    background: #ffffff; 
  }

  .grid-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }

  .svg-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
  }

  .main-text text {
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 900;
    font-size: clamp(2.5rem, 10vw, 8.5rem);
    letter-spacing: -0.05em;
    text-transform: uppercase;
  }

  .main-text .sub {
    font-weight: 300;
    font-size: clamp(0.7rem, 1.5vw, 1.2rem);
    letter-spacing: 0.5em;
    opacity: 0.7;
  }

  .glass-fill {
    fill: rgba(0, 0, 0, 0.88);
    backdrop-filter: blur(8px);
    transition: fill 0.6s ease;
  }

  .light .glass-fill {
    fill: rgba(255, 255, 255, 0.9);
  }

  .floating-text {
    animation: floating 6s ease-in-out infinite;
    fill-opacity: 1;
  }

  @keyframes floating {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }

  .vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle, transparent 30%, rgba(0,0,0,0.6) 100%);
    z-index: 5;
  }

  .light .vignette {
    background: radial-gradient(circle, transparent 40%, rgba(255,149,0,0.05) 100%);
  }

  @media (max-width: 768px) {
    .hero-root {
      --glow-strength: 2;
    }

    .floating-text {
      fill-opacity: 0.6;
    }

    @keyframes floating {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
  }
</style>
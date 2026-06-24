// src/lib/stores/theme.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// 1. Lese gespeicherten Wert aus localStorage
const saved = browser ? localStorage.getItem('barnim-theme') : null;
const initial = saved === 'light' ? true : false; // true = Light Mode, false = Dark Mode

// 2. Erstelle Store
export const isLight = writable(initial);

// 3. Reagiere auf Änderungen und speichere + setze Klassen
isLight.subscribe(value => {
  if (browser) {
    // Speichere neuen Wert
    localStorage.setItem('barnim-theme', value ? 'light' : 'dark');

    // Setze Klasse am <html> eindeutig
    document.documentElement.classList.remove('light-mode', 'dark-mode');
    document.documentElement.classList.add(value ? 'light-mode' : 'dark-mode');
  }
});
// src/lib/stores/cart.ts
import type { Product } from '$lib/data/products.svelte';

/** CartItem Typ */
export type CartItem = {
    product: Product;
    quantity: number;
    size: string;
};

/** LocalStorage sicher lesen (SSR-safe) */
function readLocalStorageCart(): CartItem[] {
    if (typeof localStorage === 'undefined') return [];
    try {
        const raw = localStorage.getItem('cart');
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

// --- Der reaktive State (Svelte 5) ---
let _items = $state<CartItem[]>(readLocalStorageCart());

/**
 * Der CartStore als zentrales Objekt
 */
export const cartStore = {
    get items() { return _items; },
    
    // Berechnete Werte (Derived)
    get totalPrice() {
        return _items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    },
    
    get totalCount() {
        return _items.reduce((sum, item) => sum + item.quantity, 0);
    }
};

// --- Synchronisation mit LocalStorage ---
// Dies läuft automatisch, sobald sich _items ändert
if (typeof localStorage !== 'undefined') {
    $effect.root(() => {
        $effect(() => {
            localStorage.setItem('cart', JSON.stringify(_items));
        });
    });
}

// --- Hilfsfunktionen (Logik) ---

export function addToCart(product: Product, quantity = 1, size = 'none') {
    const existingIdx = _items.findIndex(i => i.product.id === product.id && i.size === size);

    if (existingIdx >= 0) {
        _items[existingIdx].quantity += quantity;
    } else {
        _items.push({ product, quantity, size });
    }
}

export function decreaseQuantity(productId: number, size: string) {
    const idx = _items.findIndex(i => i.product.id === productId && i.size === size);
    
    if (idx >= 0) {
        if (_items[idx].quantity > 1) {
            _items[idx].quantity -= 1;
        } else {
            removeFromCart(productId, size);
        }
    }
}

export function removeFromCart(productId: number, size: string) {
    _items = _items.filter(i => !(i.product.id === productId && i.size === size));
}

export function clearCart() {
    _items = [];
}
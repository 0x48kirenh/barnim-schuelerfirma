// src/lib/data/products.ts

/**
 * Interface für ein einzelnes Produkt.
 * Entspricht exakt der Struktur deiner SQLite-Tabelle nach der Transformation.
 */
export interface Product {
    id: number;
    slug: string;
    title: string;
    price: number;
    image: string;
    description: string | null;
    sizes: string[];
    colors: string[];
    category: string;
    active: number;
}

/**
 * Interner, reaktiver State (Svelte 5 Runes)
 * Wir initialisieren mit sicheren Standardwerten.
 */
let _allProducts = $state<Product[]>([]);
let _error = $state<string | null>(null);
let _isLoaded = $state(false);

/**
 * Der productStore als zentrale Schnittstelle für das Frontend.
 * Er wird einmalig im Layout befüllt und dient danach als RAM-Speicher.
 */
export const productStore = {
    // Getter für die Liste aller Produkte
    get all() {
        return _allProducts;
    },

    // Getter für Fehlermeldungen (falls die DB streikt)
    get error() {
        return _error;
    },

    // Gibt zurück, ob die Daten erfolgreich vom Server "gehydriert" wurden
    get isLoaded() {
        return _isLoaded;
    },

    /**
     * setProducts wird vom +layout.svelte aufgerufen.
     * Es überschreibt den RAM-Speicher und fängt ungültige Daten ab.
     * * @param newData - Das Array vom Server
     * @param errorMessage - Ein optionaler Fehler-String vom Server-Load
     */
    setProducts(newData: any, errorMessage: string | null = null) {
        // Sicherheitsschaltung: Falls der Server 'null' schickt, machen wir ein leeres Array daraus
        if (Array.isArray(newData)) {
            _allProducts = newData;
            _error = errorMessage;
        } else {
            // Falls etwas völlig Unerwartetes kommt
            _allProducts = [];
            _error = errorMessage ?? "Unerwartetes Datenformat empfangen.";
        }
        
        _isLoaded = true;
    },

    /**
     * Schnelle Suche im RAM-Speicher. 
     * Da die Daten schon da sind, erfolgt die Antwort ohne Verzögerung.
     * * @param slug - Der eindeutige URL-Name des Produkts
     */
    getBySlug(slug: string): Product | null {
        if (!_isLoaded) return null;
        return _allProducts.find(p => p.slug === slug) ?? null;
    },

    /**
     * Optional: Filtert Produkte nach Kategorien im RAM
     */
    getByCategory(category: string): Product[] {
        if (category === 'all') return _allProducts;
        return _allProducts.filter(p => p.category === category);
    }
};
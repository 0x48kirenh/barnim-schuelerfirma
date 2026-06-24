// src/routes/+layout.server.ts
import { getAllProducts } from '$lib/databases/products/queries';

export const load = async () => {
    try {
        const produkte = getAllProducts();
        
        // Wir geben explizit zurück, dass alles okay ist
        return {
            initialProducts: produkte || [],
            error: null
        };
    } catch (err) {
        console.error("Kritischer Datenbank-Fehler:", err);
        
        // Wir senden eine klare Fehlermeldung mit
        return {
            initialProducts: [],
            error: "Datenbank konnte nicht geladen werden."
        };
    }
};
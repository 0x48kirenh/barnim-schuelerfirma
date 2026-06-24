// src/lib/databases/products/products.server.ts
import { Database } from "bun:sqlite";

export const db = new Database("products.sqlite");

// Tabelle erstellen und erweitern
db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- wird automatisch generiert
    slug TEXT NOT NULL UNIQUE, -- Speicherformat: ex. TShirtBlau[Logobeispiel]
    title TEXT NOT NULL,
    price REAL NOT NULL, -- Bitte in Dezimalzahl ohne Eurozeichen
    image TEXT NOT NULL, -- Speicherformat immer in statische Adresse des Bildes im static Ordner
    description TEXT,
    sizes TEXT,   -- Speicherformat: JSON-Array ["S", "M", "L"]
    colors TEXT,  -- Speicherformat: JSON-Array ["#ff0000", "blue"]
    category TEXT DEFAULT 'all', --meistens non oder TShirt, Hose, Cap etc
    active INTEGER DEFAULT 1
  );
`);
// src/lib/databases/buchhaltung/database.ts
import { Database } from "bun:sqlite";

/**
 * DATENBANK-VERBINDUNG
 * Erstellt oder öffnet die Datei 'buchhaltung.sqlite'.
 */
export const db = new Database("buchhaltung.sqlite");

/**
 * SCHEMA-INITIALISIERUNG
 * Hier wird die Tabellenstruktur definiert.
 */
db.run(`
  CREATE TABLE IF NOT EXISTS rechnungen (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    typ TEXT NOT NULL CHECK(typ IN ('Einnahme', 'Ausgabe')),
    partner_name TEXT NOT NULL,
    rechnungsdatum TEXT NOT NULL,
    leistungsdatum TEXT NOT NULL,
    zahlungsdatum TEXT,

    -- Geldbeträge als INTEGER (Cents) zur Vermeidung von Rundungsfehlern
    brutto_cents INTEGER NOT NULL,
    netto_cents INTEGER NOT NULL,
    steuer_cents INTEGER NOT NULL,
    steuer_prozent INTEGER NOT NULL,

    rechnungsnummer TEXT NOT NULL UNIQUE,
    beschreibung TEXT,
    zahlungsart TEXT,
    zahlungsstatus TEXT NOT NULL DEFAULT 'offen' CHECK(zahlungsstatus IN ('offen', 'bezahlt', 'storniert', 'gemahnt')),
    transaktions_id TEXT,

    partner_adresse TEXT,
    unsere_adresse TEXT,
    partner_ust_id TEXT,
    datei_pfad TEXT,

    -- Storno-Felder für Revisionssicherheit
    storniert_am TEXT,
    storno_grund TEXT,

    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);
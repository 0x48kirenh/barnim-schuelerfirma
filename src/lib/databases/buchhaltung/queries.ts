// src/lib/databases/buchhaltung/rechnungen.service.ts
import { db } from "./buchhaltung.server";

/**
 * INTERFACE FÜR DIE DATENSTRUKTUR
 */
export interface RechnungData {
  id?: number;
  typ: 'Einnahme' | 'Ausgabe';
  partner_name: string;
  rechnungsdatum: string; 
  leistungsdatum: string;
  brutto_cents: number;
  netto_cents: number;
  steuer_cents: number;
  steuer_prozent: number;
  rechnungsnummer: string;
  beschreibung?: string;
  zahlungsart?: string;
  zahlungsstatus: 'offen' | 'bezahlt' | 'storniert' | 'gemahnt';
  transaktions_id?: string;
  partner_adresse?: string;
  unsere_adresse?: string;
  partner_ust_id?: string;
  datei_pfad?: string;
  storniert_am?: string;
  storno_grund?: string;
}

/**
 * NEUE RECHNUNG ERSTELLEN
 * Speichert eine Rechnung in der Datenbank. Beträge müssen in Cents übergeben werden.
 */
export function createRechnung(data: RechnungData) {
  const stmt = db.prepare(`
    INSERT INTO rechnungen (
      typ, partner_name, rechnungsdatum, leistungsdatum,
      brutto_cents, netto_cents, steuer_cents, steuer_prozent,
      rechnungsnummer, beschreibung, zahlungsart, zahlungsstatus,
      transaktions_id, partner_adresse, unsere_adresse, partner_ust_id, datei_pfad
    ) VALUES ($typ, $partner_name, $rechnungsdatum, $leistungsdatum, 
              $brutto_cents, $netto_cents, $steuer_cents, $steuer_prozent,
              $rechnungsnummer, $beschreibung, $zahlungsart, $zahlungsstatus,
              $transaktions_id, $partner_adresse, $unsere_adresse, $partner_ust_id, $datei_pfad)
  `);

  return stmt.run({
    $typ: data.typ,
    $partner_name: data.partner_name,
    $rechnungsdatum: data.rechnungsdatum,
    $leistungsdatum: data.leistungsdatum,
    $brutto_cents: data.brutto_cents,
    $netto_cents: data.netto_cents,
    $steuer_cents: data.steuer_cents,
    $steuer_prozent: data.steuer_prozent,
    $rechnungsnummer: data.rechnungsnummer,
    $beschreibung: data.beschreibung ?? null,
    $zahlungsart: data.zahlungsart ?? null,
    $zahlungsstatus: data.zahlungsstatus,
    $transaktions_id: data.transaktions_id ?? null,
    $partner_adresse: data.partner_adresse ?? null,
    $unsere_adresse: data.unsere_adresse ?? null,
    $partner_ust_id: data.partner_ust_id ?? null,
    $datei_pfad: data.datei_pfad ?? null
  });
}

/**
 * RECHNUNG STORNIEREN
 * Setzt den Status auf 'storniert' und hinterlegt einen Grund (GoBD-konform).
 */
export function storniereRechnung(id: number, grund: string) {
  const stmt = db.prepare(`
    UPDATE rechnungen 
    SET zahlungsstatus = 'storniert',
        storniert_am = datetime('now'),
        storno_grund = ?,
        updated_at = datetime('now')
    WHERE id = ?
  `);
  return stmt.run(grund, id);
}

/**
 * ZAHLUNGSMARKIERUNG
 * Aktualisiert den Status einer Rechnung, wenn das Geld eingegangen (oder ausgegangen) ist.
 */
export function markiereAlsBezahlt(id: number, zahlungsdatum: string, transaktionsId?: string) {
  const stmt = db.prepare(`
    UPDATE rechnungen 
    SET zahlungsstatus = 'bezahlt',
        zahlungsdatum = ?,
        transaktions_id = ?,
        updated_at = datetime('now')
    WHERE id = ?
  `);
  return stmt.run(zahlungsdatum, transaktionsId ?? null, id);
}

/**
 * ALLE RECHNUNGEN LADEN
 * Gibt die komplette Liste zurück, sortiert nach dem Rechnungsdatum.
 */
export function getAllRechnungen() {
  return db.prepare("SELECT * FROM rechnungen ORDER BY rechnungsdatum DESC").all() as RechnungData[];
}

/**
 * FINANZ-STATISTIK
 * Summiert Netto, Brutto und Steuern pro Typ, ignoriert dabei stornierte Einträge.
 */
export function getStats() {
  return db.prepare(`
    SELECT 
      typ,
      SUM(brutto_cents) as gesamt_brutto,
      SUM(netto_cents) as gesamt_netto,
      SUM(steuer_cents) as gesamt_steuer
    FROM rechnungen
    WHERE zahlungsstatus != 'storniert'
    GROUP BY typ
  `).all();
}

/**
 * VOLLTEXTSUCHE
 * Sucht in Partnername, Rechnungsnummer und Beschreibung.
 */
export function searchRechnungen(query: string) {
  const like = `%${query}%`;
  return db.prepare(`
    SELECT * FROM rechnungen
    WHERE partner_name LIKE ? 
       OR rechnungsnummer LIKE ? 
       OR beschreibung LIKE ?
    ORDER BY rechnungsdatum DESC
  `).all(like, like, like) as RechnungData[];
}

/**
 * DATENSATZ LÖSCHEN
 * Nur verwenden, wenn ein Eintrag wirklich physisch entfernt werden muss (Vorsicht bei Buchhaltung!).
 */
export function deleteRechnungHard(id: number) {
  return db.prepare("DELETE FROM rechnungen WHERE id = ?").run(id);
}
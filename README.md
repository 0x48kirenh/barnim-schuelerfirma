# 🛍️ Barnim – E-Commerce Plattform der Schülerfirma

Das ist die Online-Verkaufsplattform für unsere Schülerfirma! Mit Barnim können wir unsere Produkte online verkaufen, der Warenkorb funktioniert reibungslos und das Wichtigste: Alle Verkäufe und Transaktionen werden automatisch in unserem Buchhaltungssystem erfasst – perfekt für den Schülerfirma-Betrieb und die Finanzkontrolle.

**Kurz gesagt**: Shop-Website + integrierte Buchhaltung = weniger Aufwand, mehr Überblick! 📊

## 🎯 Kernfeatures

- **Produktkatalog**: Browsbar, filterbar und searchbar mit detaillierten Produktseiten
- **Warenkorb-System**: Persistenter Warenkorb mit Add-to-Cart und Checkout-Funktionalität
- **Buchhaltungsintegration**: Automatische Erfassung aller Transaktionen und Daten
- **Responsive Design**: Mobile-first UI mit modernem Interface
- **Server-Side Rendering**: Optimierte Performance durch SSR mit SvelteKit
- **Themenverwaltung**: Unterstützung für Light/Dark Mode
- **Produktverwaltung**: Datengesteuerte Produktdatenbank mit Abfragen

## 🛠 Was wir dafür verwenden

| Component | Technologie | Warum? |
|-----------|-------------|--------|
| **Framework** | Svelte 5 + SvelteKit | Schnell zu verstehen, modernes Web-Framework |
| **Sprache** | TypeScript | Weniger Fehler, bessere IDE-Unterstützung |
| **Build** | Vite 8 + Bun | Blitzschnell, keine Wartezeiten |
| **Styling** | CSS | Einfach und direkt, keine Abhängigkeiten |
| **Runtime** | Bun 1.3+ | Super performant, native Anbindungen |

## 🚀 Schnellstart

### Voraussetzungen

- **Bun 1.3+** (erforderlich – wir nutzen native Bun-Anbindungen für Performance und spezielle Funktionen)

### Installation

```bash
# Mit Bun installieren
bun install
```

### Entwicklung

```bash
# Entwicklungs-Server starten
bun run dev

# Server mit automatischem Browser-Öffnen
bun run dev -- --open
```

Der Dev-Server läuft dann unter `http://localhost:5173` und aktualisiert live, wenn du Code änderst. 🔄

### Type-Checking

```bash
# Schnell alle TypeScript-Fehler checken
bun run check

# Oder im Watch-Modus, wenn du gerade entwickelst
bun run check:watch
```

### Production Build

```bash
# Für den Live-Betrieb optimiert bauen
bun run build

# Die fertige Version lokal testen
bun run preview
```

## 📁 So ist das Projekt aufgebaut

```
src/
├── routes/           # Die verschiedenen Seiten (Shop, Warenkorb, Infoseiten...)
├── lib/
│   ├── data/        # Wo die Produkte gespeichert sind
│   ├── databases/   # Buchhaltung & Produktverwaltung
│   ├── stores/      # Warenkorb und Design-Einstellungen
│   └── index.ts     # Zentrale Anlaufstelle
├── ui/              # Wiederverwendbare Komponenten (Navigation, Grid, etc.)
└── app.html         # Einstiegspunkt
```

## 💡 Was du wissen solltest

- **Für die Schülerfirma optimiert**: Alles ist auf einfache Verwaltbarkeit ausgelegt – Produkte hinzufügen, Verkäufe verfolgen, Buchhaltung im Griff
- **Bun ist Pflicht**: Wir nutzen native Bun-Features für bessere Performance und spezielle Funktionen – deshalb läuft das Projekt nur mit Bun
- **TypeScript überall**: Weniger Bugs, bessere Entwicklungserfahrung – der Code warnt dich, bevor es Probleme gibt
- **Schnelle Entwicklung**: Dank Vite und Svelte siehst du Änderungen sofort beim Speichern

## � Fragen oder Probleme?

Bei Fragen zur Schülerfirma oder zum Projekt einfach ask – wir helfen gerne! 😊

---

**Made for our Schülerfirma** 🏫

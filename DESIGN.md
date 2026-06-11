# KlassenHub – Premium Design System & UI/UX-Konzept

> Dieses Dokument ist die verbindliche Design-Spezifikation für das bestehende Repo.
> Es baut auf der vorhandenen Struktur auf (Tailwind v4 + CSS-Variablen in `src/app/globals.css`,
> shadcn-artige Komponenten in `src/components/ui/`, `motion/react` bereits installiert,
> Geist-Fonts bereits geladen). **Nichts neu bauen – bestehende Komponenten upgraden.**

Claim: **„Deine Klasse. Ein Hub."**
Subline: „Organisiere Termine, Aufgaben, Dateien, Ankündigungen und Abstimmungen an einem Ort – ohne Chat-Chaos."

---

## 1. Design Audit (Ist-Zustand)

### 1.1 Landingpage (`src/components/landing/landing-page.tsx`)
| Befund | Problem | Maßnahme |
|---|---|---|
| Hero = Vollbild-Foto + Gradient-Overlay | Wirkt wie Stock-Template, Foto dominiert statt Produkt | Hero auf dunklen Gradient-Canvas umstellen, echtes App-Preview-Mockup (Dashboard-Screenshot in Browser-/Phone-Frame) rechts bzw. unterhalb |
| Nur 1 Motion-Variante (`fadeUp`) | Kein durchgängiges Motion-System | Zentrale Motion-Presets (`src/lib/motion.ts`), gestaffelte Reveals |
| FAQ mit nativen `<details>` ohne Animation | Springt hart auf/zu | Animierte Accordion-Höhe + Chevron-Rotation |
| Kein „Warum kein Chat?"-, kein „So funktioniert's"-, kein finaler CTA-Block | Conversion-Lücke | Sektionen ergänzen (siehe Kap. 4) |
| FAQ-Texte teils technisch („Supabase Keys") | Spricht Endnutzer nicht an | Copy auf Schüler/Klassensprecher-Sprache umschreiben |
| Footer 2-zeilig | Zu dünn für Premium-Eindruck | Strukturierter Footer (Logo, Claim, Links, Theme) |

### 1.2 Login/Register (`src/components/auth/auth-shell.tsx`)
- Zentrierte Karte auf flachem Background → funktional, aber generisch.
- **Maßnahme:** Dunkler Auth-Hintergrund mit dezentem Radial-Glow hinter der Karte, Karte als Glass-Panel, Logo-Mark mit Brand-Gradient, Eingangs-Animation (fade + 12 px rise). Formularfehler inline statt nur als Block.

### 1.3 App Shell (`src/components/layout/app-shell.tsx`)
| Befund | Maßnahme |
|---|---|
| Aktiver Nav-Punkt = voll gefüllter Primary-Block | Zu laut. Stattdessen: dezente Tint-Fläche + animierter Indikator-Balken (`layoutId`) links |
| Topbar zeigt statisch „KlassenHub / Organizer" | Kontextbezogener Seitentitel + aktive Klasse anzeigen |
| Bottom-Nav: 5 Items inkl. Dashboard, aktiver Zustand nur Farbfläche | Animierter Active-Pill (`layoutId`), Icon-Mikrobewegung, „Mehr"-Punkt statt abgeschnittener Navigation |
| Sidebar-Footer mischt Supabase-Status + Theme + Logout | Status nur bei Problem zeigen; Footer aufräumen (User-Zeile, Theme, Logout) |

### 1.4 Dashboard (`src/components/dashboard/dashboard-overview.tsx`)
- 4 Stat-Cards sind reine Zahl + Badge → kein Trend, keine Aktion, kein Deep-Link.
- Loading = Text „Dashboard wird geladen..." → **Skeletons** verwenden.
- „In-App-Hinweise"-Karte ist dauerhaft leer → entfernen oder durch „Heute"-Agenda ersetzen.
- Listenelemente (Termine, Ankündigungen, Ressourcen) sind nackte `<p>`/`<div>` → einheitliche List-Row-Komponente mit Fachfarb-Akzent, Datum, Chevron, Hover.
- **Maßnahme:** Stat-Cards klickbar (Link zum Modul), animierter Zahlen-Count-up, Stagger-Entrance, Wochenübersicht mit Tagesgruppierung.

### 1.5 Termine / Aufgaben / Ressourcen / Ankündigungen (`data-module-page.tsx`)
- Layout „Formular links, Liste rechts" ist auf Desktop ok, auf Mobile steht das Create-Formular **vor** der Liste → Inhalt zuerst, Erstellen per Button/Sheet.
- 6 Filter-Controls in einer Reihe → auf Mobile unübersichtlich. **Maßnahme:** Suchfeld + horizontale Filter-Chips (scrollbar), Detail-Filter in Sheet.
- Rows zeigen rohe Werte (`due_date`, `priority` als Rohstring) → formatierte Datumsanzeige („Fr, 13. Jun"), Prioritäts-Dot, Fachfarbe.
- Kein Edit/Delete in der UI sichtbar (nur Insert) → mindestens visuell vorbereiten (Row-Hover-Aktionen).

### 1.6 Abstimmungen (`polls-workspace.tsx`)
- Ergebnisbalken = statisches `div` ohne Animation, ohne Gewinner-Hervorhebung.
- Voting-Optionen = kleine native Radios/Checkboxen → ganze Option-Card als Touch-Target.
- Typ-Badge zeigt Rohwert (`yes_no`) → deutsche Labels.
- Beteiligung nur als Text-Badge → Progress-Ring oder Balken.

### 1.7 Empty States (`src/components/ui/empty-state.tsx`)
- Solide Basis (Icon, Titel, Text, CTA) – aber generisches Icon-Quadrat, keine Visuals, keine Animation, CTA oft nicht gesetzt.
- **Maßnahme:** Pro Modul ein eigenes Mini-Visual (CSS/SVG, siehe Kap. 8), sanfte Entrance-Animation, immer ein CTA wenn die Rolle es erlaubt.

---

## 2. Designsystem

### 2.1 Prinzipien
1. **Dark-first.** Dark Mode ist der Hauptlook; Light Mode ist die saubere Ableitung.
2. **Fläche durch Ebenen, nicht durch Schatten.** Im Dark Mode trennen Hintergrund-Ebenen + 1px-Borders; Schatten nur für schwebende Elemente (Popover, Modal, FAB).
3. **Eine Akzentfarbe (Teal), ein Gradient-Partner (Indigo).** Glow & Gradient sparsam: Hero, primäre CTAs, aktive Zustände.
4. **Farbcodierung mit System:** Status = semantisch, Fächer = dekorativ-funktional, Rollen = identitätsstiftend. Nie mischen.

### 2.2 Farbpalette – Dark Mode (Hauptlook)

Ersetzt die Werte in `.dark` in `src/app/globals.css` (Variablennamen bleiben kompatibel, neue kommen dazu):

```css
.dark {
  /* Background-Ebenen */
  --background: #0a0e1a;        /* Ebene 0: Seite */
  --surface: #0e1422;           /* Ebene 1: Sidebar, Topbar */
  --card: #121829;              /* Ebene 2: Cards */
  --card-elevated: #18203a;     /* Ebene 3: Hover, Popover, Modals */
  --card-foreground: #f2f5fa;
  --popover: #18203a;
  --popover-foreground: #f2f5fa;

  /* Text */
  --foreground: #f2f5fa;        /* Primärtext */
  --muted-foreground: #8b95ab;  /* Sekundärtext */
  --faint-foreground: #5d6880;  /* Tertiärtext: Timestamps, Meta */

  /* Brand */
  --primary: #2dd8c6;           /* Hub Teal */
  --primary-foreground: #04201d;
  --brand-indigo: #6e7cff;      /* Gradient-Partner */
  --gradient-brand: linear-gradient(135deg, #2dd8c6 0%, #6e7cff 100%);
  --glow-brand: 0 0 32px rgba(45, 216, 198, 0.22);

  /* Flächen & Linien */
  --secondary: #1a2236;
  --secondary-foreground: #e2e8f0;
  --muted: #1a2236;
  --border: #232c44;            /* 1px Standard-Border */
  --border-strong: #2e3a58;     /* Hover-Border */
  --input: #232c44;
  --ring: #2dd8c6;

  /* Status */
  --success: #34d399;
  --warning: #fbbf24;
  --destructive: #f87171;
  --destructive-foreground: #2b0909;
  --info: #60a5fa;
  --accent: #fbbf24;
  --accent-foreground: #241a05;

  --radius: 0.75rem;
}
```

### 2.3 Farbpalette – Light Mode

```css
:root {
  --background: #f6f8fb;
  --surface: #ffffff;
  --card: #ffffff;
  --card-elevated: #ffffff;
  --card-foreground: #0e1525;
  --popover: #ffffff;
  --popover-foreground: #0e1525;

  --foreground: #0e1525;
  --muted-foreground: #5c6678;
  --faint-foreground: #8a93a6;

  --primary: #0d9488;           /* Teal-600: AA-Kontrast auf Weiß */
  --primary-foreground: #f0fdfa;
  --brand-indigo: #5560e8;
  --gradient-brand: linear-gradient(135deg, #0d9488 0%, #5560e8 100%);
  --glow-brand: 0 0 32px rgba(13, 148, 136, 0.14);

  --secondary: #eef2f7;
  --secondary-foreground: #0e1525;
  --muted: #eef2f7;
  --border: #e3e9f1;
  --border-strong: #cbd5e1;
  --input: #e3e9f1;
  --ring: #0d9488;

  --success: #059669;
  --warning: #d97706;
  --destructive: #dc2626;
  --destructive-foreground: #fff7f7;
  --info: #2563eb;
  --accent: #d97706;
  --accent-foreground: #1f2937;

  --radius: 0.75rem;
}
```

`@theme inline` ergänzen:

```css
@theme inline {
  /* …bestehende Zeilen behalten… */
  --color-surface: var(--surface);
  --color-card-elevated: var(--card-elevated);
  --color-border-strong: var(--border-strong);
  --color-faint-foreground: var(--faint-foreground);
  --color-brand-indigo: var(--brand-indigo);
}
```

### 2.4 Statusfarben (Mapping bleibt in `status-badge.tsx`)
| Status | Dark | Light | Verwendung |
|---|---|---|---|
| Erledigt / Aktiv | `#34d399` | `#059669` | done, active, Verbunden |
| Bald fällig / Wichtig | `#fbbf24` | `#d97706` | soon, important, in_progress |
| Überfällig / Dringend | `#f87171` | `#dc2626` | overdue, urgent, missed |
| Geplant / Offen | `#60a5fa` | `#2563eb` | planned, open |
| Beendet / Neutral | `#8b95ab` | `#5c6678` | ended, normal |

Badge-Stil: Tint-Hintergrund 12–15 % + Textfarbe + **Status-Dot** (6 px Kreis) links – kein Vollflächen-Badge.

### 2.5 Rollenfarben
| Rolle | Farbe (Dark) | Farbe (Light) |
|---|---|---|
| Schüler:in (`student`) | `#60a5fa` | `#2563eb` |
| Klassensprecher (`class_rep`) | `#a78bfa` | `#7c3aed` |
| Lehrkraft (`teacher`) | `#2dd8c6` | `#0d9488` |
| Admin (`admin`) | `#fbbf24` | `#d97706` |

Verwendung: Avatar-Ring, Rollen-Badge (Tint + Dot), Mitgliederliste.

### 2.6 Fachfarben (deterministisch)
Neue Datei `src/lib/constants/subject-colors.ts`:

```ts
export const SUBJECT_COLORS = [
  { name: "indigo", base: "#6e7cff" },
  { name: "sky",    base: "#38bdf8" },
  { name: "teal",   base: "#2dd8c6" },
  { name: "green",  base: "#34d399" },
  { name: "amber",  base: "#fbbf24" },
  { name: "orange", base: "#fb923c" },
  { name: "rose",   base: "#fb7185" },
  { name: "pink",   base: "#f472b6" },
  { name: "violet", base: "#a78bfa" },
  { name: "blue",   base: "#60a5fa" },
] as const;

export function subjectColor(subject: string) {
  let hash = 0;
  for (const char of subject.toLowerCase().trim()) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }
  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
}
```

Verwendung: 3 px Akzentleiste links an Event-/Task-Cards, Fach-Chip (Tint 12 % + Textfarbe), Kalender-Punkte. Gleiches Fach = immer gleiche Farbe, ohne Konfiguration.

### 2.7 Card-, Border-, Shadow-, Radius-, Spacing-System

**Cards (3 Stufen, als Varianten in `src/components/ui/card.tsx`):**
| Variante | Stil |
|---|---|
| `default` | `bg-card border border-border rounded-xl` – Standard für alles |
| `elevated` | wie default + `shadow-md` + Hover: `border-border-strong` + `-translate-y-0.5` – für klickbare Cards |
| `glass` | `bg-card/60 backdrop-blur-xl border border-white/10 dark:border-white/8` – **nur** Hero-Mockup, Auth-Card, Modals, Bottom-Nav |

**Borders:** Standard 1 px `--border`; Hover/Fokus `--border-strong`; Fokus-Ring 2 px `--ring` mit 2 px Offset. Niemals 2 px-Borders als Dekoration.

**Shadows:**
```css
/* dark */
--shadow-sm: 0 1px 2px rgba(0,0,0,.4);
--shadow-md: 0 4px 16px rgba(0,0,0,.35);
--shadow-lg: 0 12px 40px rgba(0,0,0,.45);
/* light */
--shadow-sm: 0 1px 2px rgba(16,24,40,.06);
--shadow-md: 0 4px 16px rgba(16,24,40,.08);
--shadow-lg: 0 12px 40px rgba(16,24,40,.12);
```
Glow (`--glow-brand`) ausschließlich für: primärer Hero-CTA, aktives Logo-Mark, Poll-Gewinnerbalken.

**Radius:**
| Token | Wert | Verwendung |
|---|---|---|
| `rounded-md` | 8 px | Inputs, Chips, kleine Buttons |
| `rounded-lg` | 10 px | Buttons, Selects |
| `rounded-xl` | 12 px | Cards, List-Rows |
| `rounded-2xl` | 16 px | Modals, Hero-Mockup, Auth-Card |
| `rounded-full` | – | Badges-Dots, Avatare, FAB, Progress |

**Spacing (4-pt-Grid):**
- Card-Padding: `p-5` (20 px) mobil, `p-6` (24 px) Desktop
- Abstand zwischen Cards: `gap-4` (16 px) mobil, `gap-5` Desktop
- Sektionsabstand App: `space-y-8`; Landing: `py-20 sm:py-28`
- Seitenränder: `px-4 sm:px-6 lg:px-8` (bestehend, beibehalten)

---

## 3. Typografie

**Keine neuen Fonts nötig** – Geist ist bereits geladen und auf Premium-SaaS-Niveau (Vercel-Ästhetik). Einsatz schärfen:

| Rolle | Font | Verwendung |
|---|---|---|
| Headline & UI | **Geist Sans** | alles |
| Label/Meta/Zahlen | **Geist Mono** | Datums-Chips, Einladungscodes, Statistik-Zahlen, Badge-Labels in Caps |

**Größenhierarchie:**
| Token | Größe / Zeilenhöhe | Gewicht | Tracking | Verwendung |
|---|---|---|---|---|
| Display | `text-5xl sm:text-6xl lg:text-7xl` | 600 | `tracking-tight` (-0.02em) | Hero H1 |
| H1 | `text-2xl sm:text-3xl` | 600 | tight | Seitentitel (`PageHeading`) |
| H2 | `text-xl` | 600 | tight | Sektions-/Card-Gruppen |
| H3 | `text-base` | 600 | normal | Card-Titel |
| Body | `text-sm` (14/22) | 400 | normal | Fließtext, Listen |
| Label | `text-xs` | 500 | `tracking-wide` + uppercase nur für Eyebrows | Form-Labels, Eyebrow |
| Mono-Meta | `font-mono text-xs` | 500 | normal | Datum, Code, Zähler |
| Stat | `font-mono text-3xl sm:text-4xl` | 600 | tight | Dashboard-Zahlen, Beteiligungsquote |

Regeln: max. 2 Gewichte pro Screen-Bereich (400/600, punktuell 500). Sekundärtext immer `text-muted-foreground`, Tertiär (`--faint-foreground`) für Timestamps. Keine reinen Grauwerte unter 4.5:1 für Lesetext.

---

## 4. Landingpage Redesign (`src/components/landing/landing-page.tsx`)

Sektionen-Reihenfolge (baut auf bestehender Struktur auf, ★ = neu):

1. **Header (sticky):** transparent über Hero, ab 24 px Scroll `bg-background/80 backdrop-blur-xl border-b border-border`. Logo-Mark mit Brand-Gradient statt `bg-white/12`.
2. **Hero:** Foto-Hintergrund entfernen. Stattdessen:
   - Hintergrund: `#0a0e1a` + 2 Radial-Glows (`radial-gradient(600px at 20% 0%, rgba(45,216,198,.12), transparent)`, `radial-gradient(800px at 80% 30%, rgba(110,124,255,.10), transparent)`) + dezentes Grid-Pattern (1px-Linien `rgba(255,255,255,.03)`, 64 px Raster, mit Radial-Mask ausgeblendet).
   - Eyebrow-Pill: „Für Schulklassen, FOS, Berufsschule & Azubi-Gruppen" mit Status-Dot.
   - H1 „Deine Klasse. **Ein Hub.**" – „Ein Hub." mit `bg-gradient-to-r from-[#2dd8c6] to-[#6e7cff] bg-clip-text text-transparent`.
   - Subline (die offizielle), darunter CTAs: Primary „Kostenlos starten" (mit Glow), Ghost „Einloggen".
   - ★ **App-Preview-Mockup** unterhalb (Desktop: rechts versetzt): Screenshot des echten Dashboards (Dark Mode) in Browser-Frame (`rounded-2xl border border-white/10 shadow-lg`, oben 3 Fenster-Dots), leicht perspektivisch (`rotateX(4deg)`), davor überlappend ein Phone-Frame mit Mobile-Dashboard. Glow hinter dem Mockup. Wenn kein Screenshot: nachgebautes Mini-Dashboard aus echten Card-Komponenten rendern (keine Fake-Bilder).
3. **Feature Cards (bestehend, upgraden):** 4 Cards → `elevated`-Variante, Icon-Container mit Fach-/Brandfarb-Tint pro Feature (Termine=sky, Aufgaben=green, Dateien=violet, Abstimmungen=teal), Stagger-Entrance, Hover-Lift.
4. ★ **„So funktioniert KlassenHub"** – 3 Schritte als horizontale Cards mit Mono-Nummern `01/02/03` + verbindender Gradient-Linie:
   1. „Klasse erstellen" – Name, Schulart, fertig.
   2. „Code teilen" – Mitschüler treten mit Einladungscode bei.
   3. „Organisiert bleiben" – Termine, Aufgaben & Abstimmungen an einem Ort.
5. **„Für Klassensprecher" (bestehend, ausbauen):** Links Copy + 3 Checkmarks (Abstimmungen anlegen, Ankündigungen pinnen, Beteiligung sehen). Rechts statt 3 Icon-Tiles: **funktionsfähig aussehende Poll-Card** (echte Komponente mit animierten Ergebnisbalken, die im Viewport einlaufen) – das Produkt zeigt sich selbst.
6. ★ **„Warum kein Chat?"** – dunkle Vollbreiten-Sektion, 2 Spalten als Kontrast:
   - Links („Im Klassenchat"): gedimmte, chaotische Chat-Bubbles (CSS, blur-leicht, `opacity-60`), Label „87 Nachrichten. Die Hausaufgabe? Irgendwo da drin."
   - Rechts („In KlassenHub"): eine aufgeräumte Task-Card mit Fälligkeit + Status-Badge, Label „Eine Karte. Alles drauf."
   - Headline: „Kein Chat. Absicht." Subtext: Infos statt Nachrichtenflut; nichts geht unter; keine Ablenkung.
7. **FAQ (bestehend, upgraden):** Copy nutzerorientiert umschreiben (Rollen, Beitritt per Code, kostenlos?, Datenschutz/„Wer sieht meine Daten?"). Accordion animiert (Kap. 9).
8. ★ **Finaler CTA-Block:** Gradient-Border-Card, zentriert: „Bring deine Klasse auf einen Stand." + Primary-CTA + Hinweis „Kostenlos · Kein Chat · In 2 Minuten startklar".
9. **Footer:** 2 Zeilen → strukturiert: Logo + Claim links; Spalten „Produkt" (Features, FAQ, Login) / „Rechtliches" (Impressum, Datenschutz – Platzhalter-Routes ok); unten Copyright + ThemeToggle.

Landingpage erzwingt Dark-Look im Hero unabhängig vom Theme (Sektion 1–2 hart auf Dark-Tokens), ab Sektion 3 Theme-abhängig.

---

## 5. App Dashboard Redesign (`/app`)

### 5.1 App Shell (`src/components/layout/app-shell.tsx`)
**Sidebar (Desktop):**
- Hintergrund `bg-surface` (neue Ebene 1) statt `bg-card`, rechter Rand `border-border`.
- Logo-Mark: `rounded-lg` mit `--gradient-brand`-Fläche, Glow nur bei Hover.
- Nav-Item Ruhezustand: `text-muted-foreground`, Hover `bg-secondary/60 text-foreground`.
- **Aktiv:** `bg-primary/10 text-primary` + 3×20 px Indikator-Balken links (`rounded-full bg-primary`), animiert via `motion` `layoutId="sidebar-indicator"` → gleitet zwischen Items.
- Sektionierung: „Übersicht" (Dashboard, Meine Klasse) / „Organisation" (Termine, Aufgaben, Abstimmungen, Dateien, Ankündigungen) / unten Einstellungen. Sektions-Label `font-mono text-[10px] uppercase tracking-widest text-faint-foreground`.
- Footer: Supabase-Badge **nur wenn nicht verbunden** anzeigen; sonst User-E-Mail-Zeile + ThemeToggle + Logout-Icon-Button.

**Topbar:**
- `bg-background/80 backdrop-blur-xl`, Höhe 56 px.
- Links: aktueller Seitentitel (aus Navigation abgeleitet) statt statisch „Organizer"; darunter entfällt das Eyebrow.
- Rechts: ClassPicker (von den Seiten in die Topbar wandern lassen – ein Ort, immer sichtbar), Bell, mobile ThemeToggle.

**Mobile Bottom Nav:** siehe Kap. 10.

### 5.2 Dashboard-Inhalt (`dashboard-overview.tsx`)
Reihenfolge (mobile-first, eine Spalte → Desktop-Grid):

1. **Begrüßung:** `PageHeading` mit tageszeitabhängigem Gruß („Guten Morgen, {Vorname}" – ohne Emojis) + heutigem Datum in Mono (`Fr · 13. Juni`).
2. **Stat-Cards (4):** klickbar (`Link` zum Modul), `elevated`-Variante, Inhalt: Icon-Tint oben links, Mono-Zahl mit Count-up (Kap. 9), Label, Delta-Hinweis („2 diese Woche") in `text-xs text-faint-foreground`. Grid `grid-cols-2 xl:grid-cols-4` (auf Mobile 2×2 statt 1-spaltig).
3. **Wochenübersicht (Hauptcard):** Termine + fällige Aufgaben der nächsten 7 Tage, **nach Tag gruppiert** (Sticky-Tag-Label in Mono: „MO 16.06."), jede Zeile: 3px-Fachfarb-Leiste, Titel, Uhrzeit/Raum, Status-Dot, Chevron. Heute-Gruppe mit `bg-primary/5`-Hinterlegung.
4. **Aktive Abstimmungen:** kompakte Poll-Rows mit Mini-Beteiligungsbalken + „Jetzt abstimmen"-Ghost-CTA, Link zu `/app/polls`.
5. **Ankündigungen:** gepinnte zuerst (Pin-Icon, `border-l-2 border-warning`), max. 3, „Alle ansehen →".
6. **Letzte Dateien & Links:** Rows mit Typ-Icon (Link/Datei/Notiz) + Fach-Chip.
7. „In-App-Hinweise"-Karte **entfernen**.

**Loading:** Skeleton-Komponente (`src/components/ui/skeleton.tsx`, `animate-pulse bg-secondary rounded-md`) – Stat-Cards: 4 Skeleton-Blöcke; Listen: 3 Zeilen-Skeletons. Nie Text „wird geladen...".

---

## 6. Abstimmungen Screen (`polls-workspace.tsx`)

**Layout:** Mobile: Liste zuerst, „Abstimmung erstellen" als Primary-Button im `PageHeading` → öffnet Sheet/Modal (Formular bleibt 1:1 erhalten, zieht nur um). Desktop: Formular darf als Modal oder rechte Spalte bleiben – Modal bevorzugt, damit die Liste volle Breite bekommt.

**Poll-Card:**
- Header: Titel (H3) + Status-Badge mit deutschem Label (Aktiv/Geplant/Beendet) und Dot; bei aktiv: Restzeit in Mono („endet in 2 Tagen") statt nur Badge.
- Meta-Zeile: Typ-Chip mit deutschem Label (Ja/Nein, Einzelauswahl, Mehrfachauswahl, Rating, Terminfindung), anonym-Chip falls gesetzt.
- **Beteiligung:** statt Text-Badge ein 28 px Progress-Ring (SVG, `stroke-primary`, Hintergrund `stroke-secondary`) + `xx %` in Mono daneben; <50 % = warning-Farbe.

**Voting (Mobile UX):**
- Jede Option = **ganze Card als Target**: `rounded-xl border border-border p-4 min-h-12`, Tap → `border-primary bg-primary/8`, Custom-Radio/Checkbox rechts (20 px Kreis/Quadrat mit animiertem Check).
- „Stimme speichern" full-width auf Mobile, disabled bis Auswahl; nach Erfolg morpht Button kurz zu Check + „Gespeichert" (Kap. 9).
- Bereits abgestimmt: Optionen zeigen eigene Wahl mit Teal-Border + Check, Button wird „Stimme ändern" (Upsert existiert schon).

**Ergebnisbalken:**
- Höhe 8 px, `rounded-full`, Track `bg-secondary`.
- Füllung: Gewinner = `--gradient-brand` + dezenter Glow; übrige = `bg-primary/35`.
- Balken animieren beim Sichtbarwerden: `initial={{ width: 0 }}` → Zielbreite, 600 ms, stagger 80 ms (Kap. 9).
- Zeile: Label links, `n Stimmen · xx %` in Mono rechts; Gewinner-Label `font-semibold`.
- Verdeckte Ergebnisse („nach Ende"): Balken als gesperrter Zustand mit Schloss-Icon + „Ergebnis ab {Datum}" – kein nackter Erklärtext.

**CTA „Abstimmung erstellen":** im `PageHeading` rechts, Primary mit Plus-Icon; für Rollen ohne Recht ausgeblendet (nicht disabled).

---

## 7. Aufgaben & Termine (`data-module-page.tsx`, `tasks-workspace.tsx`, `events-workspace.tsx`)

**Generelles Layout der Modul-Seiten:** Mobile: Liste zuerst, Create per Button → Sheet (wie Polls). Desktop: Liste 100 % Breite, Create-Modal. Damit verschwindet das `xl:grid-cols-[0.95fr_1.05fr]`-Korsett.

**Task-Card (List-Row):**
```
[3px Fachfarb-Leiste] [Checkbox-Kreis] Titel                    [Prio-Dot] [Status-Badge]
                       Fach-Chip · „Fällig Fr, 13. Jun" (Mono)
```
- Checkbox-Kreis (24 px, Border) links: Klick → done-Animation (Kap. 9). (Status-Update via Supabase `update` – kleiner neuer Handler in `DataModulePage` oder Task-spezifisch.)
- Fälligkeit relativ formatieren: „Heute fällig" (warning), „Morgen", „Fr, 13. Jun", „3 Tage überfällig" (destructive). Helper in `src/lib/calculations/dates.ts` ergänzen.
- Prioritäts-Dot: high=`--destructive`, medium=`--warning`, low=`--muted-foreground`; Tooltip/Label nur in Detailansicht.

**Event-Card:**
```
[Datums-Block: „13" groß / „JUN" Mono klein] Titel                [Status-Badge]
                                             Fach-Chip · 10:15 · Raum B204
```
- Klausuren (`type: exam`): Datums-Block mit `bg-destructive/10 text-destructive`, sonst `bg-secondary`.
- Vergangene Termine gedimmt (`opacity-60`), unter Trenner „Vergangen".

**Filter:**
- Suchfeld bleibt oben, volle Breite auf Mobile.
- Darunter **horizontale Chip-Reihe** (scrollbar, `overflow-x-auto`, `scrollbar-width: none`): Status-Chips (Alle/Offen/Bald/Überfällig/Erledigt) als Segmented-Pills; aktiver Chip `bg-primary/12 text-primary border-primary/30`.
- Fach/Typ/Prio/Datum in „Filter"-Button → Sheet (Mobile) bzw. Popover (Desktop) mit Badge-Zähler für aktive Filter.
- Keine Tabellen – die bestehende Card-Liste bleibt, wird nur reicher.

---

## 8. Empty States

Erweiterung von `src/components/ui/empty-state.tsx`: neues Prop `visual?: React.ReactNode`, gerendert über dem Titel; Visuals als kleine CSS/SVG-Kompositionen in `src/components/ui/empty-visuals.tsx` (ca. 160×100 px, nur Design-Tokens, keine Illustrations-Assets). Alle Visuals: `aria-hidden`, Entrance siehe Kap. 9.

| Kontext | Headline | Beschreibung | CTA | Visual (CSS/SVG) |
|---|---|---|---|---|
| **Keine Klasse** | „Noch keine Klasse" | „Erstelle eine Klasse oder tritt mit einem Einladungscode bei – dauert keine zwei Minuten." | „Klasse erstellen" + Sekundär „Mit Code beitreten" | 3 überlappende Avatar-Kreise (Tints aus Rollenfarben) + gestricheltes Plus-Badge, das sanft pulsiert |
| **Keine Aufgaben** | „Alles erledigt" | „Gerade keine offenen Aufgaben. Neue Hausaufgaben und Abgaben erscheinen hier." | „Aufgabe erstellen" (nur Lehrkraft/Admin) | Stilisiertes Karten-Stack-SVG: 3 Zeilen mit Check-Kreisen, oberster Check in `--success`, zeichnet sich per `stroke-dashoffset` |
| **Keine Termine** | „Frei – nichts geplant" | „Sobald Klausuren oder Termine eingetragen sind, siehst du sie hier sortiert nach Datum." | „Termin erstellen" | Mini-Kalenderblatt (Mono-„13"), daneben 2 leere Zeilen-Slots mit gestrichelter Border, ein Slot mit Teal-Dot |
| **Keine Abstimmungen** | „Noch nichts zu entscheiden" | „Klassensprecher können hier Abstimmungen starten – von Terminfindung bis Kursfahrt." | „Abstimmung erstellen" (nur berechtigte Rollen) | 3 horizontale Balken (35 %/60 %/20 %) in `bg-primary/30`, der mittlere füllt sich in Loop langsam auf `--gradient-brand` |
| **Keine Dateien** | „Noch keine Materialien" | „Lege Links, Notizen und Unterlagen ab, damit niemand mehr danach fragen muss." | „Ressource hinzufügen" | Ordner-Silhouette (Border-Style) mit herausschauender Karte + Link-Icon, Karte hebt sich 4 px bei Hover |
| **Keine Ankündigungen** | „Alles ruhig" | „Wichtige Infos von Klassensprechern und Lehrkräften landen hier – gepinnt und unübersehbar." | „Ankündigung schreiben" (nur berechtigte Rollen) | Megafon-Icon in Tint-Kreis, davon ausgehend 3 konzentrische Ringe (`border-primary/20`), die einmalig nach außen faden |

Regeln: CTA nur zeigen, wenn die Rolle die Aktion ausführen darf – sonst nur Headline + Beschreibung (z. B. „Dein Klassensprecher kann Abstimmungen starten."). Beschreibung max. 2 Zeilen. Kein Grau-in-Grau: Visual nutzt immer mind. einen Brand-/Statusfarbton.

---

## 9. Motion-Spezifikation

Zentrale Presets in **`src/lib/motion.ts`** (neue Datei):

```ts
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;     // Standard
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;  // Modals
export const SPRING_SOFT = { type: "spring", stiffness: 260, damping: 30 } as const;

export const DURATION = { fast: 0.15, base: 0.25, slow: 0.45 } as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
```

| Interaktion | Spezifikation |
|---|---|
| **Hero Load** | Sequenz: Eyebrow → H1 → Subline → CTAs → Mockup. Jeweils `fadeUp` (14 px, 450 ms, EASE_OUT), `delayChildren` 0.1 s, Stagger 0.08 s. Mockup zusätzlich `scale: 0.97→1`. Einmalig, nie bei Navigation wiederholen |
| **Staggered Cards** | Container `staggerContainer`, Kinder `fadeUp` mit `whileInView` + `viewport={{ once: true, amount: 0.2 }}`. Max. 6 Kinder staggern, Rest sofort |
| **Card Hover** | Nur `elevated`: `transition-[transform,border-color,box-shadow] duration-200` via CSS (`hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md`). Kein motion-JS nötig. Kein Scale |
| **Button Hover/Press** | CSS: Hover `bg`-Shift (besteht), Press `active:scale-[0.98]` 100 ms. Primary-CTA auf Landing zusätzlich Glow-Verstärkung via `hover:shadow-[var(--glow-brand)]` |
| **Active Route Indicator** | Sidebar-Balken & Bottom-Nav-Pill als `motion.span` mit `layoutId` (`sidebar-indicator` / `bottomnav-pill`), `transition={SPRING_SOFT}` – gleitet zwischen Items statt zu springen |
| **Bottom Nav Transition** | Aktives Icon: `motion.div animate={{ scale: active ? 1 : 0.92, y: active ? -1 : 0 }}` 200 ms; Pill via layoutId (s. o.). Kein Bounce |
| **Poll Result Bars** | `motion.div initial={{ width: 0 }} whileInView={{ width: pct + "%" }} transition={{ duration: 0.6, ease: EASE_OUT, delay: index * 0.08 }}` `viewport={{ once: true }}`. Prozentzahl optional per Count-up parallel |
| **Task Completion** | Checkbox-Kreis: Check-Pfad zeichnet via `pathLength 0→1` (250 ms), Kreis füllt `bg-success`; Titel bekommt `line-through` + `opacity-60` (200 ms); Row saust nicht weg – erst bei Filterwechsel via `AnimatePresence` (`exit={{ opacity: 0, height: 0 }}`, 250 ms) |
| **Modal/Sheet Open/Close** | Overlay: `opacity 0→1` 200 ms. Desktop-Modal: `opacity 0→1` + `scale 0.96→1` + `y 8→0`, 250 ms EASE_OUT; Close invers 150 ms. Mobile-Sheet: `y: 100%→0`, 300 ms EASE_OUT, Drag-to-dismiss optional. Mit `AnimatePresence` |
| **Page Transitions** | Dezent: `template.tsx` unter `/app` mit `fade 0→1` + `y 6→0`, 200 ms. **Kein** Exit (Next streamt), keine Slides |
| **Empty State** | Container `fadeUp`; Visual mit 100 ms Delay + `scale 0.95→1`; Loop-Animationen (Pulse/Ringe) max. 2 Wiederholungen oder ≥3 s Periode, CSS-basiert |
| **Count-up Zahlen** | Dashboard-Stats: `useMotionValue` + `animate(value, target, { duration: 0.8, ease: EASE_OUT })`, gerundet rendern |

**`prefers-reduced-motion` (verpflichtend):**
- Global in `globals.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  html { scroll-behavior: auto; }
}
```
- In motion-Komponenten `useReducedMotion()` aus `motion/react`: bei `true` → keine y/scale/width-Animationen, nur Opacity oder Endzustand direkt.

Verboten: Bounce-Easings, Rotationen als Dekoration, Parallax, Animationen >600 ms, Dauer-Loops auf Inhaltsflächen.

---

## 10. Mobile UX

**Referenzgrößen:** iPhone SE/13 mini (375×667 / 375×812) als Mindestmaß, kleine Androids 360×640. Alles muss bei **360 px Breite ohne horizontales Scrollen** funktionieren (`overflow-x` prüfen: lange Titel `truncate`/`break-words`, Chips-Reihe ist die einzige erlaubte horizontale Scrollfläche).

**Touch Targets:**
- Interaktive Elemente min. **44×44 px** (Buttons `h-11` auf Mobile, Bottom-Nav-Items `min-h-14` besteht bereits ✓).
- Poll-Optionen, List-Rows, Filter-Chips: gesamte Fläche tappbar, min. `min-h-12`.
- Abstand zwischen benachbarten Targets min. 8 px.

**Bottom Navigation:**
- 5 Slots: Dashboard, Termine, Aufgaben, Abstimmungen, **„Mehr"** (öffnet Sheet mit Meine Klasse, Dateien & Links, Ankündigungen, Einstellungen, Logout) – ersetzt das aktuelle `slice(0, 5)`, das Dateien/Ankündigungen/Einstellungen unerreichbar macht.
- Stil: `bg-surface/85 backdrop-blur-xl border-t border-border`, `pb-[env(safe-area-inset-bottom)]` (besteht ✓), Active-Pill animiert (Kap. 9), Label `text-[11px]`.
- Versteckt sich **nicht** beim Scrollen (Verlässlichkeit > Platz).

**Floating Action Button (optional, empfohlen):**
- Auf Termine/Aufgaben/Abstimmungen/Ressourcen/Ankündigungen: FAB `size-14 rounded-full bg-primary shadow-lg` rechts unten, `bottom: calc(env(safe-area-inset-bottom) + 80px)` (über der Bottom-Nav), Plus-Icon, öffnet Create-Sheet. Nur zeigen, wenn Rolle erstellen darf. Press: `active:scale-95`.

**Mobile Forms:**
- Create-Formulare in Bottom-Sheets (`rounded-t-2xl`, Grabber-Handle, max-h `85svh`, innen scrollbar).
- Inputs `h-12` und `text-base` (16 px) → verhindert iOS-Auto-Zoom.
- Submit-Button sticky am Sheet-Boden, full-width.
- Richtige Keyboards: `type="date"/"time"/"url"`, `inputMode` wo passend (besteht teilweise ✓).
- Fehler inline unter dem Feld, nicht nur als Sammelblock.

**Mobile Dashboard:**
- Stat-Cards als 2×2-Grid (nicht 1-spaltig untereinander), kompaktere Variante (`p-4`, Zahl `text-2xl`).
- Reihenfolge: Stats → Wochenübersicht → Abstimmungen → Ankündigungen → Dateien.
- Wochenübersicht-Rows: einzeilig mit `truncate`, Uhrzeit rechts in Mono.

**Sonstiges:**
- `main` Bottom-Padding `pb-24` wegen Bottom-Nav (besteht ✓), mit FAB `pb-28`.
- Sticky-Topbar bleibt, schrumpft nicht.
- Keine Hover-only-Funktionen: alles per Tap erreichbar.

---

## 11. Entwickler-Handoff (Next.js + Tailwind v4 + shadcn-Pattern + motion/react)

### 11.1 Neue/zu ändernde Dateien

| Datei | Aktion |
|---|---|
| `src/app/globals.css` | Token-Blöcke aus Kap. 2.2/2.3 einsetzen, `@theme inline` erweitern, Shadow-Variablen + reduced-motion-Block ergänzen |
| `src/lib/motion.ts` | **neu** – Presets aus Kap. 9 |
| `src/lib/constants/subject-colors.ts` | **neu** – Kap. 2.6 |
| `src/components/ui/card.tsx` | `variant`-Prop (`default/elevated/glass`) via `cva` (Pattern wie `button.tsx`) |
| `src/components/ui/skeleton.tsx` | **neu** – `animate-pulse rounded-md bg-secondary` |
| `src/components/ui/badge.tsx` | Status-Dot-Option (`withDot`), Mono-Label-Stil |
| `src/components/ui/empty-state.tsx` | `visual`-Prop + motion-Entrance |
| `src/components/ui/empty-visuals.tsx` | **neu** – 6 Visuals aus Kap. 8 |
| `src/components/ui/sheet.tsx` / `dialog.tsx` | **neu** – Bottom-Sheet (mobile) / Modal (Desktop) mit `AnimatePresence`; Radix `@radix-ui/react-dialog` ergänzen oder leichtgewichtig selbst (Fokus-Trap beachten) |
| `src/components/layout/app-shell.tsx` | Sidebar-Sektionen, layoutId-Indikator, Topbar-Titel, Bottom-Nav „Mehr", FAB-Slot |
| `src/app/app/template.tsx` | **neu** – Page-Transition (Kap. 9) |
| `src/components/dashboard/dashboard-overview.tsx` | Stat-Links, Count-up, Tagesgruppierung, Skeletons, Hinweis-Karte raus |
| `src/components/layout/data-module-page.tsx` | Liste zuerst, Create im Sheet/Modal, Chip-Filter, reichere Rows (Fachfarbe, Datum formatiert) |
| `src/components/polls/polls-workspace.tsx` | Option-Cards, animierte Result-Bars, Progress-Ring, deutsche Labels, Create im Sheet |
| `src/components/landing/landing-page.tsx` | Sektionen aus Kap. 4 |
| `src/lib/calculations/dates.ts` | `formatRelativeDueDate()`-Helper |

### 11.2 Verbindliche Snippets

**Card-Varianten:**
```tsx
const cardVariants = cva("rounded-xl border text-card-foreground", {
  variants: {
    variant: {
      default: "border-border bg-card",
      elevated:
        "border-border bg-card shadow-sm transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md",
      glass: "border-white/10 bg-card/60 backdrop-blur-xl",
    },
  },
  defaultVariants: { variant: "default" },
});
```

**Sidebar-Active-Indicator:**
```tsx
{active && (
  <motion.span
    layoutId="sidebar-indicator"
    className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary"
    transition={SPRING_SOFT}
  />
)}
```

**Poll-Result-Bar:**
```tsx
<div className="h-2 overflow-hidden rounded-full bg-secondary">
  <motion.div
    className={cn("h-full rounded-full", isWinner ? "bg-[image:var(--gradient-brand)]" : "bg-primary/35")}
    initial={{ width: 0 }}
    whileInView={{ width: `${row.percentage}%` }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: EASE_OUT, delay: index * 0.08 }}
  />
</div>
```

**Reduced Motion in Komponenten:**
```tsx
const reduce = useReducedMotion();
const variants = reduce ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : fadeUp;
```

### 11.3 Regeln für die Umsetzung
- Tailwind v4: neue Farben **nur** über CSS-Variablen + `@theme inline` (bestehendes Muster), keine `tailwind.config`-Erweiterung.
- `motion/react` importieren (nicht `framer-motion`); `"use client"` nur wo nötig – Landing-Sektionen ggf. in kleinere Client-Komponenten splitten, statt die ganze Page client-seitig zu halten.
- Bestehende Funktionalität (Supabase-Queries, Permissions, Form-Logik) **nicht anfassen** – nur Präsentationsschicht.
- Lucide-Icons beibehalten, Stroke 1.75–2, Größen 16/20 px.
- Jede Card-Liste braucht: Loading-Skeleton, Empty State, Error-Zeile (bestehende `error`-States visuell vereinheitlichen: `rounded-md bg-destructive/10 p-3 text-sm text-destructive` ✓).
- Nach jedem Schritt: `npm run lint && npm run typecheck && npm run build`.

### 11.4 Umsetzungs-Prioritäten

| Prio | Paket | Inhalt |
|---|---|---|
| **P0 – Fundament** | Tokens & Basis | `globals.css` (Kap. 2), `motion.ts`, Card-Varianten, Skeleton, Badge-Dots, `subject-colors.ts`, reduced-motion |
| **P1 – App Shell & Dashboard** | Täglich sichtbar | Sidebar/Topbar/Bottom-Nav (inkl. „Mehr"), layoutId-Indikatoren, Dashboard-Redesign, Page-Transition |
| **P2 – Module** | Kernflows | `data-module-page` (Liste zuerst, Sheets, Chips, Rows), Polls-Screen, Task-Completion, FAB, Empty States + Visuals |
| **P3 – Landing & Auth** | Conversion | Hero + Mockup, neue Sektionen (Kein Chat / So funktioniert's / CTA), FAQ-Accordion, Footer, Auth-Glass |

---

*Stand: Juni 2026 · Dieses Dokument bei Designentscheidungen fortschreiben.*

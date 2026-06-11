# KlassenHub

KlassenHub ist ein digitaler Organizer für Schulklassen, FOS-Klassen, Berufsschulklassen und Azubi-Gruppen. Der MVP bündelt Termine, Klausuren, Aufgaben, Dateien, Links, Ankündigungen und Abstimmungen an einem Ort.

Kein Chat ist Teil des MVP. KlassenHub ist bewusst kein WhatsApp-Klon.

## Features

- Öffentliche Landingpage mit Light/Dark Mode
- Registrierung, Login und Logout über Supabase Auth
- Geschützter `/app`-Bereich mit Middleware
- Klasse erstellen oder per Einladungscode beitreten
- Dashboard mit Kennzahlen, Wochenübersicht und Empty States
- Supabase Create/List-Flows für Termine, Aufgaben, Abstimmungen, Ressourcen und Ankündigungen
- Rollenmodell: `student`, `class_representative`, `teacher`, `admin`
- TypeScript Types und Zod Schemas für alle Kernmodelle
- Ausgelagerte Businesslogik für Status, Rechte, Einladungscodes und Abstimmungen
- Vitest-Tests für Kernregeln
- Supabase-Schema und RLS-Konzept in `docs/`

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-kompatible Komponenten
- Motion aus `motion/react`
- Supabase Auth und Datenbank
- React Hook Form
- Zod
- Zustand
- Vitest
- ESLint
- Prettier

## Setup

```bash
npm install
npm run dev
```

Die App läuft lokal unter `http://localhost:3000`.

## Environment Variables

Lege lokal eine `.env.local` an:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Keine echten API Keys in das Repo committen. Ohne Supabase-Keys baut die App trotzdem und zeigt klare Setup-Hinweise.

## Supabase Setup

1. Neues Supabase-Projekt erstellen.
2. `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY` aus den Project Settings übernehmen.
3. Tabellen und RLS nach `docs/SUPABASE_SCHEMA.md` anlegen.
4. Auth E-Mail/Passwort aktivieren.
5. `.env.local` lokal setzen und Vercel Environment Variables pflegen.

## Scripts

```bash
npm run dev
npm run lint
npm run test
npm run typecheck
npm run build
npm run format
```

## Projektstruktur

```text
src/
  app/
  components/
  hooks/
  lib/
  schemas/
  store/
  types/
tests/
docs/
```

## Roadmap

Siehe `docs/ROADMAP.md`.

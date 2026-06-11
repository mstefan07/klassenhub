# Datenschutzkonzept

KlassenHub verarbeitet potenziell schulbezogene Organisationsdaten. Der MVP ist deshalb bewusst datenarm und enthält keine echten Demo-Schülerdaten.

## Grundsätze

- Datenminimierung: Nur organisatorische Informationen speichern, die für Klassenarbeit nötig sind.
- Zweckbindung: Termine, Aufgaben, Ressourcen, Ankündigungen und Abstimmungen.
- Rollenrechte: Zugriff nur für Mitglieder der jeweiligen Klasse.
- Keine Service-Role-Keys im Frontend.
- Keine echten API Keys im Repository.
- Kein Chat und keine privaten Direktnachrichten im MVP.

## Personenbezogene Daten

Mögliche Daten:

- E-Mail-Adresse
- Anzeigename
- Klassenmitgliedschaft
- Rollen
- Abstimmungsbeteiligung
- erstellte Inhalte

Abstimmungen können anonym markiert werden. Technisch sollte dennoch geprüft werden, ob Metadaten oder RLS-Zugriffe Rückschlüsse erlauben.

## Zugriffsschutz

- Supabase Auth für Login und Session.
- RLS: Nutzer sehen nur Klassen, in denen sie Mitglied sind.
- Schreibrechte abhängig von Rolle.
- Admins verwalten Mitglieder und Rollen.

## Löschung und Export

Für produktive Nutzung ergänzen:

- Nutzerprofil löschen
- Klasse archivieren/löschen
- Datenexport pro Klasse
- Abstimmungsergebnisse anonymisieren
- Aufbewahrungsfristen je Schuljahr

## Risiken

- Selbstgewählte Rollen im frühen MVP müssen vor produktiver Nutzung gehärtet werden.
- Uploads sind nur vorbereitet; echte Dateien brauchen Storage-Regeln, Dateitypprüfung und Größenlimits.
- Benachrichtigungen sind In-App vorbereitet, aber noch nicht als Push-Service umgesetzt.

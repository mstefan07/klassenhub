/**
 * Deterministische Fachfarben: gleiches Fach ⇒ immer gleiche Farbe,
 * ohne Konfiguration. Farben funktionieren in Dark- und Light-Mode
 * als Akzent (Leiste, Dot) und als Tint-Chip (12 % Fläche).
 */
export const SUBJECT_COLORS = [
  { name: "indigo", base: "#6e7cff" },
  { name: "sky", base: "#38bdf8" },
  { name: "teal", base: "#2dd8c6" },
  { name: "green", base: "#34d399" },
  { name: "amber", base: "#fbbf24" },
  { name: "orange", base: "#fb923c" },
  { name: "rose", base: "#fb7185" },
  { name: "pink", base: "#f472b6" },
  { name: "violet", base: "#a78bfa" },
  { name: "blue", base: "#60a5fa" },
] as const;

export type SubjectColor = (typeof SUBJECT_COLORS)[number];

export function subjectColor(subject: string): SubjectColor {
  let hash = 0;

  for (const char of subject.toLowerCase().trim()) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }

  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
}

/** Tint-Hintergrund (≈12 % Deckkraft) für Chips. */
export function subjectTint(subject: string) {
  return `${subjectColor(subject).base}1f`;
}

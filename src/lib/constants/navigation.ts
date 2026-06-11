export const appNavigation = [
  { title: "Dashboard", href: "/app" },
  { title: "Meine Klasse", href: "/app/classes" },
  { title: "Termine", href: "/app/events" },
  { title: "Aufgaben", href: "/app/tasks" },
  { title: "Abstimmungen", href: "/app/polls" },
  { title: "Dateien & Links", href: "/app/resources" },
  { title: "Ankuendigungen", href: "/app/announcements" },
  { title: "Einstellungen", href: "/app/settings" },
] as const;

export const roleLabels = {
  student: "Schueler/in",
  class_representative: "Klassensprecher/in",
  teacher: "Lehrkraft",
  admin: "Admin",
} as const;

export const priorityLabels = {
  low: "Niedrig",
  medium: "Mittel",
  high: "Hoch",
} as const;

export const subjectColors = [
  "#0f766e",
  "#2563eb",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0f9f6e",
  "#be123c",
  "#0891b2",
] as const;

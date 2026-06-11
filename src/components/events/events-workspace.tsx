"use client";

import { CalendarDays } from "lucide-react";
import { DataModulePage } from "@/components/layout/data-module-page";
import { calculateEventStatus } from "@/lib/calculations";

const eventFields = [
  { name: "title", label: "Titel", type: "text", required: true },
  {
    name: "type",
    label: "Typ",
    type: "select",
    required: true,
    options: [
      { label: "Klausur", value: "exam" },
      { label: "Deadline", value: "deadline" },
      { label: "Unterricht", value: "lesson" },
      { label: "Projekt", value: "project" },
      { label: "Sonstiges", value: "other" },
    ],
  },
  { name: "date", label: "Datum", type: "date", required: true },
  { name: "time", label: "Uhrzeit", type: "time" },
  { name: "subject", label: "Fach", type: "text", required: true },
  { name: "room", label: "Raum", type: "text" },
  {
    name: "priority",
    label: "Priorität",
    type: "select",
    required: true,
    options: [
      { label: "Niedrig", value: "low" },
      { label: "Mittel", value: "medium" },
      { label: "Hoch", value: "high" },
    ],
  },
  { name: "description", label: "Beschreibung", type: "textarea" },
] as const;

function text(row: Record<string, unknown>, key: string) {
  return row[key] === null || row[key] === undefined ? "" : String(row[key]);
}

export function EventsWorkspace() {
  return (
    <DataModulePage
      icon={CalendarDays}
      title="Termine & Klausuren"
      description="Verwalte Klausuren, Deadlines, Projekte, Unterrichtstermine und sonstige Ereignisse."
      emptyTitle="Noch keine Termine"
      emptyDescription="Neue Termine und Klausuren erscheinen hier, sobald sie für deine Klasse gespeichert wurden."
      tableName="events"
      createLabel="Termin erstellen oder vorschlagen"
      fields={[...eventFields]}
      createRoles={["class_representative", "teacher", "admin"]}
      orderBy="date"
      filterConfig={{
        typeField: "type",
        statusField: "status",
        priorityField: "priority",
        dateField: "date",
        types: eventFields[1].options,
        statuses: [
          { label: "Geplant", value: "planned" },
          { label: "Bald", value: "soon" },
          { label: "Erledigt", value: "done" },
          { label: "Verpasst", value: "missed" },
        ],
        priorities: eventFields[6].options,
      }}
      mapValuesToInsert={({ values, classId, userId }) => ({
        class_id: classId,
        title: values.title,
        type: values.type,
        date: values.date,
        time: values.time || null,
        subject: values.subject,
        room: values.room || null,
        description: values.description || null,
        priority: values.priority || "medium",
        status: "planned",
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })}
      getRowTitle={(row) => text(row, "title")}
      getRowMeta={(row) =>
        [
          text(row, "subject"),
          text(row, "date"),
          text(row, "time"),
          text(row, "room"),
        ].filter(Boolean)
      }
      getRowStatus={(row) => {
        const status = calculateEventStatus({
          date: text(row, "date"),
          time: text(row, "time") || null,
          status: text(row, "status") === "done" ? "done" : "planned",
        });

        return { status, label: status };
      }}
    />
  );
}

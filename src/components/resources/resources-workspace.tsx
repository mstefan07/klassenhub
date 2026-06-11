"use client";

import { Files } from "lucide-react";
import { DataModulePage } from "@/components/layout/data-module-page";

const resourceFields = [
  { name: "title", label: "Titel", type: "text", required: true },
  { name: "subject", label: "Fach", type: "text" },
  {
    name: "type",
    label: "Typ",
    type: "select",
    required: true,
    options: [
      { label: "Datei-Metadaten", value: "file" },
      { label: "Link", value: "link" },
      { label: "Notiz", value: "note" },
    ],
  },
  { name: "url", label: "URL", type: "url" },
  { name: "tags", label: "Tags", type: "text", placeholder: "Komma-getrennt" },
  { name: "description", label: "Beschreibung", type: "textarea" },
] as const;

function text(row: Record<string, unknown>, key: string) {
  return row[key] === null || row[key] === undefined ? "" : String(row[key]);
}

export function ResourcesWorkspace() {
  return (
    <DataModulePage
      icon={Files}
      title="Dateien & Links"
      description="Speichere Links, Notizen und Upload-Metadaten. Echte Uploads werden nur vorbereitet und nicht vorgetäuscht."
      emptyTitle="Noch keine Ressourcen"
      emptyDescription="Links und Beschreibungen können später mit Supabase Storage erweitert werden."
      tableName="resources"
      createLabel="Ressource speichern"
      fields={[...resourceFields]}
      createRoles="any"
      filterConfig={{
        subjectField: "subject",
        typeField: "type",
        types: resourceFields[2].options,
      }}
      mapValuesToInsert={({ values, classId, userId }) => ({
        class_id: classId,
        title: values.title,
        subject: values.subject || null,
        type: values.type || "link",
        url: values.url || null,
        description: values.description || null,
        tags: String(values.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        uploaded_by: userId,
        created_at: new Date().toISOString(),
      })}
      getRowTitle={(row) => text(row, "title")}
      getRowMeta={(row) =>
        [text(row, "subject"), text(row, "type"), text(row, "url")].filter(Boolean)
      }
      getRowStatus={(row) => ({ status: text(row, "type"), label: text(row, "type") })}
    />
  );
}

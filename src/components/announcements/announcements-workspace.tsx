"use client";

import { Megaphone } from "lucide-react";
import { DataModulePage } from "@/components/layout/data-module-page";

const announcementFields = [
  { name: "title", label: "Titel", type: "text", required: true },
  { name: "content", label: "Inhalt", type: "textarea", required: true },
  {
    name: "importance",
    label: "Wichtigkeit",
    type: "select",
    required: true,
    options: [
      { label: "Normal", value: "normal" },
      { label: "Wichtig", value: "important" },
      { label: "Dringend", value: "urgent" },
    ],
  },
  { name: "pinned", label: "Pinnen", type: "checkbox" },
  { name: "valid_until", label: "Gültig bis", type: "date" },
] as const;

function text(row: Record<string, unknown>, key: string) {
  return row[key] === null || row[key] === undefined ? "" : String(row[key]);
}

export function AnnouncementsWorkspace() {
  return (
    <DataModulePage
      icon={Megaphone}
      title="Ankündigungen"
      description="Wichtige Informationen von Klassensprechern, Lehrkräften und Admins sichtbar halten."
      emptyTitle="Noch keine Ankündigungen"
      emptyDescription="Normale, wichtige und dringende Ankündigungen erscheinen hier mit optionaler Gültigkeit und Pin-Status."
      tableName="announcements"
      createLabel="Ankündigung erstellen"
      fields={[...announcementFields]}
      createRoles={["class_representative", "teacher", "admin"]}
      filterConfig={{
        statusField: "importance",
        dateField: "valid_until",
        statuses: announcementFields[2].options,
      }}
      mapValuesToInsert={({ values, classId, userId }) => ({
        class_id: classId,
        title: values.title,
        content: values.content,
        importance: values.importance || "normal",
        pinned: Boolean(values.pinned),
        valid_until: values.valid_until || null,
        created_by: userId,
        created_at: new Date().toISOString(),
      })}
      getRowTitle={(row) => text(row, "title")}
      getRowMeta={(row) =>
        [
          text(row, "importance"),
          text(row, "pinned") === "true" ? "gepinnt" : "",
          text(row, "valid_until"),
        ].filter(Boolean)
      }
      getRowStatus={(row) => ({
        status: text(row, "importance"),
        label: text(row, "importance"),
      })}
    />
  );
}

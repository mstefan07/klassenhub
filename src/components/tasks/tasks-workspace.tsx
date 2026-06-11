"use client";

import { CheckSquare } from "lucide-react";
import { DataModulePage } from "@/components/layout/data-module-page";
import { calculateAssignmentStatus } from "@/lib/calculations";

const taskFields = [
  { name: "title", label: "Titel", type: "text", required: true },
  { name: "subject", label: "Fach", type: "text", required: true },
  { name: "description", label: "Beschreibung", type: "textarea", required: true },
  { name: "due_date", label: "Fällig am", type: "date", required: true },
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
] as const;

function text(row: Record<string, unknown>, key: string) {
  return row[key] === null || row[key] === undefined ? "" : String(row[key]);
}

export function TasksWorkspace() {
  return (
    <DataModulePage
      icon={CheckSquare}
      title="Aufgaben"
      description="Behalte Hausaufgaben, Projektaufgaben, Abgaben und offene To-dos im Blick."
      emptyTitle="Noch keine Aufgaben"
      emptyDescription="Offene, laufende, erledigte und überfällige Aufgaben werden hier nach Fach und Status filterbar."
      tableName="assignments"
      createLabel="Aufgabe erstellen"
      fields={[...taskFields]}
      createRoles={["teacher", "admin"]}
      orderBy="due_date"
      filterConfig={{
        subjectField: "subject",
        statusField: "status",
        priorityField: "priority",
        dateField: "due_date",
        statuses: [
          { label: "Offen", value: "open" },
          { label: "In Bearbeitung", value: "in_progress" },
          { label: "Erledigt", value: "done" },
          { label: "Überfällig", value: "overdue" },
        ],
        priorities: taskFields[4].options,
      }}
      mapValuesToInsert={({ values, classId, userId }) => ({
        class_id: classId,
        title: values.title,
        subject: values.subject,
        description: values.description,
        due_date: values.due_date,
        priority: values.priority || "medium",
        status: "open",
        assigned_to: null,
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })}
      getRowTitle={(row) => text(row, "title")}
      getRowMeta={(row) =>
        [text(row, "subject"), text(row, "due_date"), text(row, "priority")].filter(
          Boolean,
        )
      }
      getRowStatus={(row) => {
        const status = calculateAssignmentStatus({
          dueDate: text(row, "due_date"),
          status: text(row, "status") === "done" ? "done" : "open",
        });

        return { status, label: status };
      }}
    />
  );
}

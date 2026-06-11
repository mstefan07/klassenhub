"use client";

import { Select } from "@/components/ui/select";
import { useClassMemberships } from "@/hooks/use-class-memberships";

export function ClassPicker() {
  const {
    classes,
    selectedClassId,
    setSelectedClassId,
    isLoading,
    error,
  } = useClassMemberships();

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (isLoading) {
    return (
      <div
        aria-label="Klassen werden geladen"
        className="h-11 w-full animate-pulse rounded-lg bg-secondary sm:h-10 sm:w-80"
        role="status"
      />
    );
  }

  if (classes.length === 0) {
    return (
      <p className="max-w-60 text-xs leading-5 text-muted-foreground sm:text-right">
        Erstelle zuerst eine Klasse oder tritt per Einladungscode bei.
      </p>
    );
  }

  return (
    <Select
      aria-label="Aktuelle Klasse auswählen"
      className="w-full sm:w-80"
      value={selectedClassId ?? ""}
      onChange={(event) => setSelectedClassId(event.target.value)}
    >
      {classes.map((item) => (
        <option key={item.classId} value={item.classId}>
          {item.name} · {item.schoolYear}
        </option>
      ))}
    </Select>
  );
}

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
    return <p className="text-sm text-muted-foreground">Klassen werden geladen...</p>;
  }

  if (classes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
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

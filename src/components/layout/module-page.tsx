import type { LucideIcon } from "lucide-react";
import { Filter, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PageHeading } from "./page-heading";

type ModulePageProps = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  icon: LucideIcon;
  subjectOptions?: string[];
  typeOptions?: string[];
  statusOptions?: string[];
  priorityOptions?: string[];
};

export function ModulePage({
  title,
  description,
  emptyTitle,
  emptyDescription,
  icon: Icon,
  subjectOptions = ["Alle Fächer"],
  typeOptions = ["Alle Typen"],
  statusOptions = ["Alle Status"],
  priorityOptions = ["Alle Prioritäten"],
}: ModulePageProps) {
  return (
    <div>
      <PageHeading title={title} description={description} />
      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_150px_150px_150px_150px_150px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Suchen..." />
        </label>
        <Select aria-label="Fach filtern">
          {subjectOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </Select>
        <Select aria-label="Typ filtern">
          {typeOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </Select>
        <Select aria-label="Status filtern">
          {statusOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </Select>
        <Select aria-label="Priorität filtern">
          {priorityOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </Select>
        <Input aria-label="Datum filtern" type="date" />
      </div>
      <EmptyState
        icon={<Icon className="size-5" />}
        title={emptyTitle}
        description={emptyDescription}
      />
      <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="size-4" />
        Filter für Fach, Typ, Status, Datum und Priorität sind vorbereitet.
      </p>
    </div>
  );
}

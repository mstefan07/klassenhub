"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Filter, Plus, Search } from "lucide-react";
import { ClassPicker } from "@/components/classes/class-picker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { useClassMemberships } from "@/hooks/use-class-memberships";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { UserRole } from "@/types";
import { PageHeading } from "./page-heading";

type DataRow = Record<string, unknown>;

type FieldOption = {
  label: string;
  value: string;
};

type DataField = {
  name: string;
  label: string;
  type:
    | "text"
    | "date"
    | "time"
    | "url"
    | "textarea"
    | "select"
    | "checkbox"
    | "datetime-local";
  options?: readonly FieldOption[];
  placeholder?: string;
  required?: boolean;
};

type FilterConfig = {
  subjects?: readonly FieldOption[];
  types?: readonly FieldOption[];
  statuses?: readonly FieldOption[];
  priorities?: readonly FieldOption[];
  subjectField?: string;
  typeField?: string;
  statusField?: string;
  priorityField?: string;
  dateField?: string;
};

type DataModulePageProps = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  icon: LucideIcon;
  tableName: string;
  createLabel: string;
  fields: readonly DataField[];
  createRoles: UserRole[] | "any";
  filterConfig?: FilterConfig;
  orderBy?: string;
  mapValuesToInsert: (input: {
    values: Record<string, string | boolean>;
    classId: string;
    userId: string;
  }) => Record<string, unknown>;
  getRowTitle: (row: DataRow) => string;
  getRowMeta: (row: DataRow) => string[];
  getRowStatus?: (row: DataRow) => { status: string; label: string };
};

function createInitialValues(fields: readonly DataField[]) {
  return fields.reduce<Record<string, string | boolean>>((result, field) => {
    result[field.name] = field.type === "checkbox" ? false : "";
    return result;
  }, {});
}

function valueAsString(value: unknown) {
  return value === null || value === undefined ? "" : String(value);
}

export function DataModulePage({
  title,
  description,
  emptyTitle,
  emptyDescription,
  icon: Icon,
  tableName,
  createLabel,
  fields,
  createRoles,
  filterConfig,
  orderBy = "created_at",
  mapValuesToInsert,
  getRowTitle,
  getRowMeta,
  getRowStatus,
}: DataModulePageProps) {
  const { selectedClass, selectedClassId } = useClassMemberships();
  const [rows, setRows] = useState<DataRow[]>([]);
  const [values, setValues] = useState(() => createInitialValues(fields));
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const canCreate =
    selectedClass &&
    (createRoles === "any" || createRoles.includes(selectedClass.role));

  useEffect(() => {
    let isMounted = true;

    async function loadRows() {
      const supabase = getBrowserSupabaseClient();

      if (!supabase || !selectedClassId) {
        setRows([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      const { data, error: rowsError } = await supabase
        .from(tableName)
        .select("*")
        .eq("class_id", selectedClassId)
        .order(orderBy, { ascending: false });

      if (!isMounted) {
        return;
      }

      if (rowsError) {
        setError(rowsError.message);
        setRows([]);
      } else {
        setRows((data as DataRow[]) ?? []);
      }

      setIsLoading(false);
    }

    void loadRows();

    return () => {
      isMounted = false;
    };
  }, [orderBy, selectedClassId, tableName]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rows.filter((row) => {
      const rowText = Object.values(row).map(valueAsString).join(" ").toLowerCase();
      const matchesQuery = normalizedQuery
        ? rowText.includes(normalizedQuery)
        : true;
      const matchesSubject =
        subjectFilter && filterConfig?.subjectField
          ? valueAsString(row[filterConfig.subjectField]) === subjectFilter
          : true;
      const matchesType =
        typeFilter && filterConfig?.typeField
          ? valueAsString(row[filterConfig.typeField]) === typeFilter
          : true;
      const matchesStatus =
        statusFilter && filterConfig?.statusField
          ? valueAsString(row[filterConfig.statusField]) === statusFilter
          : true;
      const matchesPriority =
        priorityFilter && filterConfig?.priorityField
          ? valueAsString(row[filterConfig.priorityField]) === priorityFilter
          : true;
      const matchesDate =
        dateFilter && filterConfig?.dateField
          ? valueAsString(row[filterConfig.dateField]).startsWith(dateFilter)
          : true;

      return (
        matchesQuery &&
        matchesSubject &&
        matchesType &&
        matchesStatus &&
        matchesPriority &&
        matchesDate
      );
    });
  }, [
    dateFilter,
    filterConfig,
    priorityFilter,
    query,
    rows,
    statusFilter,
    subjectFilter,
    typeFilter,
  ]);

  async function refreshRows() {
    const supabase = getBrowserSupabaseClient();

    if (!supabase || !selectedClassId) {
      return;
    }

    const { data } = await supabase
      .from(tableName)
      .select("*")
      .eq("class_id", selectedClassId)
      .order(orderBy, { ascending: false });

    setRows((data as DataRow[]) ?? []);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const supabase = getBrowserSupabaseClient();

    if (!supabase || !selectedClassId) {
      setError("Supabase oder Klasse ist nicht verfügbar.");
      return;
    }

    if (!canCreate) {
      setError("Deine Rolle darf hier keine Einträge erstellen.");
      return;
    }

    setIsSubmitting(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Bitte melde dich erneut an.");
      setIsSubmitting(false);
      return;
    }

    const insertValues = mapValuesToInsert({
      values,
      classId: selectedClassId,
      userId: user.id,
    });

    const { error: insertError } = await supabase.from(tableName).insert(insertValues);

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
      return;
    }

    setValues(createInitialValues(fields));
    setSuccess("Eintrag gespeichert.");
    await refreshRows();
    setIsSubmitting(false);
  }

  return (
    <div>
      <PageHeading title={title} description={description} action={<ClassPicker />} />

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Plus className="size-5" />
              </span>
              <div>
                <CardTitle>{createLabel}</CardTitle>
                <CardDescription>
                  {canCreate
                    ? "Speichert direkt in Supabase."
                    : "Für deine Rolle oder ohne Klasse nicht verfügbar."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {fields.map((field) => (
                <div className="space-y-2" key={field.name}>
                  <Label htmlFor={`${tableName}-${field.name}`}>
                    {field.label}
                  </Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={`${tableName}-${field.name}`}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={String(values[field.name] ?? "")}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                    />
                  ) : field.type === "select" ? (
                    <Select
                      id={`${tableName}-${field.name}`}
                      required={field.required}
                      value={String(values[field.name] ?? "")}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                    >
                      <option value="">Bitte wählen</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  ) : field.type === "checkbox" ? (
                    <label className="flex items-center gap-3 rounded-md border border-border p-3 text-sm">
                      <input
                        checked={Boolean(values[field.name])}
                        className="size-4 accent-primary"
                        id={`${tableName}-${field.name}`}
                        type="checkbox"
                        onChange={(event) =>
                          setValues((current) => ({
                            ...current,
                            [field.name]: event.target.checked,
                          }))
                        }
                      />
                      Aktivieren
                    </label>
                  ) : (
                    <Input
                      id={`${tableName}-${field.name}`}
                      placeholder={field.placeholder}
                      required={field.required}
                      type={field.type}
                      value={String(values[field.name] ?? "")}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.name]: event.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              ))}

              {error ? (
                <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              {success ? (
                <p className="rounded-md bg-success/10 p-3 text-sm text-success">
                  {success}
                </p>
              ) : null}
              <Button
                disabled={
                  !isSupabaseConfigured ||
                  !selectedClassId ||
                  !canCreate ||
                  isSubmitting
                }
                type="submit"
              >
                {isSubmitting ? "Speichern..." : "Speichern"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_130px_130px_130px_130px_130px]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Suchen..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <Select
              aria-label="Fach filtern"
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
            >
              <option value="">Alle Fächer</option>
              {filterConfig?.subjects?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              aria-label="Typ filtern"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="">Alle Typen</option>
              {filterConfig?.types?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              aria-label="Status filtern"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">Alle Status</option>
              {filterConfig?.statuses?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              aria-label="Priorität filtern"
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
            >
              <option value="">Alle Prioritäten</option>
              {filterConfig?.priorities?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Input
              aria-label="Datum filtern"
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            />
          </div>

          {isLoading ? (
            <Card className="p-5 text-sm text-muted-foreground">
              Daten werden geladen...
            </Card>
          ) : filteredRows.length === 0 ? (
            <EmptyState
              icon={<Icon className="size-5" />}
              title={emptyTitle}
              description={emptyDescription}
            />
          ) : (
            <div className="space-y-3">
              {filteredRows.map((row) => {
                const status = getRowStatus?.(row);

                return (
                  <Card key={valueAsString(row.id)} className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold">{getRowTitle(row)}</h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {getRowMeta(row).map((item) => (
                            <span
                              className="rounded-md bg-secondary px-2 py-1"
                              key={item}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      {status ? (
                        <StatusBadge label={status.label} status={status.status} />
                      ) : null}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="size-4" />
            Suche und Filter laufen lokal auf den geladenen Klassendaten.
          </p>
        </section>
      </div>
    </div>
  );
}

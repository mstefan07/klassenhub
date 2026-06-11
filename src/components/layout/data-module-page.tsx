"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
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
import {
  NoAnnouncementsVisual,
  NoEventsVisual,
  NoFilesVisual,
  NoTasksVisual,
} from "@/components/ui/empty-visuals";
import { Fab } from "@/components/ui/fab";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { useClassMemberships } from "@/hooks/use-class-memberships";
import { formatRelativeDate } from "@/lib/calculations/dates";
import { subjectColor, subjectTint } from "@/lib/constants/subject-colors";
import { fadeIn, listItem } from "@/lib/motion";
import { cn } from "@/lib/utils";
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

const emptyVisualsByTable: Record<string, React.ReactNode> = {
  assignments: <NoTasksVisual />,
  events: <NoEventsVisual />,
  resources: <NoFilesVisual />,
  announcements: <NoAnnouncementsVisual />,
};

const dueToneClass = {
  overdue: "text-destructive",
  today: "text-warning",
  soon: "text-warning",
  normal: "text-muted-foreground",
} as const;

const priorityDotClass: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-faint-foreground",
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
  const reduceMotion = useReducedMotion();
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

  const hasStatusChips = Boolean(filterConfig?.statuses?.length);
  const rowVariants = reduceMotion ? fadeIn : listItem;

  return (
    <div>
      <PageHeading title={title} description={description} action={<ClassPicker />} />

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        {/* Erstellen – auf Mobile nach der Liste */}
        <Card className="order-2 h-fit xl:order-1" id="create-form">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="bg-gradient-brand flex size-10 shrink-0 items-center justify-center rounded-lg text-white">
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
                    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border p-3 text-sm transition-colors hover:border-border-strong">
                      <input
                        checked={Boolean(values[field.name])}
                        className="size-5 accent-primary"
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
                <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              {success ? (
                <p className="rounded-lg bg-success/10 p-3 text-sm text-success">
                  {success}
                </p>
              ) : null}
              <Button
                className="w-full sm:w-auto"
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

        {/* Liste – auf Mobile zuerst */}
        <section className="order-1 space-y-4 xl:order-2">
          <div className="space-y-3">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Suchen..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            {hasStatusChips ? (
              <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {[{ label: "Alle", value: "" }, ...(filterConfig?.statuses ?? [])].map(
                  (option) => {
                    const active = statusFilter === option.value;

                    return (
                      <button
                        className={cn(
                          "shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors duration-150",
                          active
                            ? "border-primary/40 bg-primary/12 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground",
                        )}
                        key={option.value || "all"}
                        type="button"
                        onClick={() => setStatusFilter(option.value)}
                      >
                        {option.label}
                      </button>
                    );
                  },
                )}
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {filterConfig?.subjects?.length ? (
                <Select
                  aria-label="Fach filtern"
                  value={subjectFilter}
                  onChange={(event) => setSubjectFilter(event.target.value)}
                >
                  <option value="">Alle Fächer</option>
                  {filterConfig.subjects.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              ) : null}
              {filterConfig?.types?.length ? (
                <Select
                  aria-label="Typ filtern"
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                >
                  <option value="">Alle Typen</option>
                  {filterConfig.types.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              ) : null}
              {filterConfig?.priorities?.length ? (
                <Select
                  aria-label="Priorität filtern"
                  value={priorityFilter}
                  onChange={(event) => setPriorityFilter(event.target.value)}
                >
                  <option value="">Alle Prioritäten</option>
                  {filterConfig.priorities.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              ) : null}
              {filterConfig?.dateField ? (
                <Input
                  aria-label="Datum filtern"
                  type="date"
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                />
              ) : null}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((index) => (
                <Skeleton className="h-20 rounded-xl" key={index} />
              ))}
            </div>
          ) : filteredRows.length === 0 ? (
            <EmptyState
              icon={
                emptyVisualsByTable[tableName] ? undefined : (
                  <Icon className="size-5" />
                )
              }
              visual={emptyVisualsByTable[tableName]}
              title={emptyTitle}
              description={emptyDescription}
            />
          ) : (
            <div className="space-y-3">
              {filteredRows.map((row) => {
                const status = getRowStatus?.(row);
                const subject = filterConfig?.subjectField
                  ? valueAsString(row[filterConfig.subjectField])
                  : valueAsString(row.subject);
                const dateValue = filterConfig?.dateField
                  ? valueAsString(row[filterConfig.dateField])
                  : "";
                const due = dateValue ? formatRelativeDate(dateValue) : null;
                const priority = filterConfig?.priorityField
                  ? valueAsString(row[filterConfig.priorityField])
                  : "";
                const hiddenMetaValues = new Set(
                  [subject, dateValue, priority].filter(Boolean),
                );
                const meta = getRowMeta(row).filter(
                  (item) => !hiddenMetaValues.has(item),
                );

                return (
                  <motion.div
                    initial="hidden"
                    key={valueAsString(row.id)}
                    variants={rowVariants}
                    viewport={{ once: true, amount: 0.2 }}
                    whileInView="visible"
                  >
                    <Card
                      className="relative overflow-hidden p-4 pl-5"
                      variant="elevated"
                    >
                      {subject ? (
                        <span
                          aria-hidden
                          className="absolute inset-y-3 left-0 w-[3px] rounded-r-full"
                          style={{ backgroundColor: subjectColor(subject).base }}
                        />
                      ) : null}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            {priority && priorityDotClass[priority] ? (
                              <span
                                aria-hidden
                                className={cn(
                                  "size-2 shrink-0 rounded-full",
                                  priorityDotClass[priority],
                                )}
                                title={`Priorität: ${priority}`}
                              />
                            ) : null}
                            <h3 className="min-w-0 truncate font-semibold">
                              {getRowTitle(row)}
                            </h3>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            {subject ? (
                              <span
                                className="rounded px-1.5 py-0.5 font-medium"
                                style={{
                                  backgroundColor: subjectTint(subject),
                                  color: subjectColor(subject).base,
                                }}
                              >
                                {subject}
                              </span>
                            ) : null}
                            {due ? (
                              <span
                                className={cn(
                                  "font-mono font-medium",
                                  dueToneClass[due.tone],
                                )}
                              >
                                {due.label}
                              </span>
                            ) : null}
                            {meta.map((item) => (
                              <span
                                className="rounded-md bg-secondary px-2 py-1 text-muted-foreground"
                                key={item}
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        {status ? (
                          <div className="shrink-0">
                            <StatusBadge
                              label={status.label}
                              status={status.status}
                            />
                          </div>
                        ) : null}
                      </div>
                    </Card>
                  </motion.div>
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

      {canCreate ? <Fab href="#create-form" label={createLabel} /> : null}
    </div>
  );
}

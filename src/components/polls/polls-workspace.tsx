"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BarChart3, Check, Lock, Plus } from "lucide-react";
import { ClassPicker } from "@/components/classes/class-picker";
import { PageHeading } from "@/components/layout/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NoPollsVisual } from "@/components/ui/empty-visuals";
import { Fab } from "@/components/ui/fab";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { useClassMemberships } from "@/hooks/use-class-memberships";
import {
  calculateParticipationRate,
  calculatePollResults,
  calculatePollStatus,
} from "@/lib/calculations";
import { pollBarAnimation } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
  canCreatePoll,
  canViewRestrictedPollResults,
} from "@/lib/permissions";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type PollRow = Record<string, unknown>;
type OptionRow = {
  id: string;
  poll_id: string;
  label: string;
};
type VoteRow = {
  id: string;
  poll_id: string;
  user_id: string;
  selected_option_ids: string[];
};

const initialPollForm = {
  title: "",
  description: "",
  type: "yes_no",
  options: "Ja\nNein",
  starts_at: "",
  ends_at: "",
  anonymous: false,
  multiple_choice: false,
  result_visibility: "immediate",
};

const pollTypeLabels: Record<string, string> = {
  yes_no: "Ja/Nein",
  single_choice: "Einzelauswahl",
  multiple_choice: "Mehrfachauswahl",
  rating: "Rating",
  date_finding: "Terminfindung",
};

function text(row: PollRow, key: string) {
  return row[key] === null || row[key] === undefined ? "" : String(row[key]);
}

/** Animierter Beteiligungs-Ring (28 px). */
function ParticipationRing({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  const radius = 11;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <span className="inline-flex items-center gap-1.5">
      <svg aria-hidden className="size-7 -rotate-90" viewBox="0 0 28 28">
        <circle
          className="stroke-secondary"
          cx="14"
          cy="14"
          fill="none"
          r={radius}
          strokeWidth="3"
        />
        <motion.circle
          className={cn(
            clamped < 50 ? "stroke-warning" : "stroke-primary",
          )}
          cx="14"
          cy="14"
          fill="none"
          initial={{
            strokeDashoffset: reduceMotion
              ? circumference * (1 - clamped / 100)
              : circumference,
          }}
          r={radius}
          strokeDasharray={circumference}
          strokeLinecap="round"
          strokeWidth="3"
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          whileInView={{
            strokeDashoffset: circumference * (1 - clamped / 100),
          }}
        />
      </svg>
      <span className="font-mono text-xs font-medium text-muted-foreground">
        {clamped}%
      </span>
    </span>
  );
}

export function PollsWorkspace() {
  const { selectedClass, selectedClassId } = useClassMemberships();
  const [polls, setPolls] = useState<PollRow[]>([]);
  const [options, setOptions] = useState<OptionRow[]>([]);
  const [votes, setVotes] = useState<VoteRow[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [form, setForm] = useState(initialPollForm);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canCreate = selectedClass ? canCreatePoll(selectedClass.role) : false;

  const optionsByPoll = useMemo(() => {
    return options.reduce<Record<string, OptionRow[]>>((result, option) => {
      result[option.poll_id] = [...(result[option.poll_id] ?? []), option];
      return result;
    }, {});
  }, [options]);

  const votesByPoll = useMemo(() => {
    return votes.reduce<Record<string, VoteRow[]>>((result, vote) => {
      result[vote.poll_id] = [...(result[vote.poll_id] ?? []), vote];
      return result;
    }, {});
  }, [votes]);

  const loadPolls = useCallback(async () => {
    const supabase = getBrowserSupabaseClient();

    if (!supabase || !selectedClassId) {
      setPolls([]);
      setOptions([]);
      setVotes([]);
      setMemberCount(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    const [{ data: pollData, error: pollError }, { count }] = await Promise.all([
      supabase
        .from("polls")
        .select("*")
        .eq("class_id", selectedClassId)
        .order("created_at", { ascending: false }),
      supabase
        .from("class_members")
        .select("id", { count: "exact", head: true })
        .eq("class_id", selectedClassId),
    ]);

    if (pollError) {
      setError(pollError.message);
      setIsLoading(false);
      return;
    }

    const loadedPolls = (pollData as PollRow[]) ?? [];
    setPolls(loadedPolls);
    setMemberCount(count ?? 0);

    const pollIds = loadedPolls.map((poll) => text(poll, "id"));

    if (pollIds.length === 0) {
      setOptions([]);
      setVotes([]);
      setIsLoading(false);
      return;
    }

    const [{ data: optionData }, { data: voteData }] = await Promise.all([
      supabase
        .from("poll_options")
        .select("id, poll_id, label")
        .in("poll_id", pollIds)
        .order("sort_order", { ascending: true }),
      supabase
        .from("poll_votes")
        .select("id, poll_id, user_id, selected_option_ids")
        .in("poll_id", pollIds),
    ]);

    setOptions((optionData as OptionRow[]) ?? []);
    setVotes((voteData as VoteRow[]) ?? []);
    setIsLoading(false);
  }, [selectedClassId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadPolls();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadPolls]);

  async function handleCreatePoll(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const supabase = getBrowserSupabaseClient();

    if (!supabase || !selectedClassId) {
      setError("Supabase oder Klasse ist nicht verfügbar.");
      return;
    }

    if (!canCreate) {
      setError("Nur Klassensprecher und Admins dürfen Abstimmungen erstellen.");
      return;
    }

    const optionLabels = form.options
      .split("\n")
      .map((option) => option.trim())
      .filter(Boolean);

    if (optionLabels.length < 2) {
      setError("Bitte mindestens zwei Optionen angeben.");
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

    const now = new Date().toISOString();
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert({
        class_id: selectedClassId,
        title: form.title,
        description: form.description || null,
        type: form.type,
        options: optionLabels,
        starts_at: new Date(form.starts_at).toISOString(),
        ends_at: new Date(form.ends_at).toISOString(),
        anonymous: form.anonymous,
        multiple_choice: form.multiple_choice,
        result_visibility: form.result_visibility,
        status: "planned",
        created_by: user.id,
        created_at: now,
        updated_at: now,
      })
      .select("id")
      .single();

    if (pollError) {
      setError(pollError.message);
      setIsSubmitting(false);
      return;
    }

    const pollId = String(poll.id);
    const { error: optionError } = await supabase.from("poll_options").insert(
      optionLabels.map((label, index) => ({
        poll_id: pollId,
        label,
        sort_order: index,
        created_at: now,
      })),
    );

    if (optionError) {
      setError(optionError.message);
      setIsSubmitting(false);
      return;
    }

    setForm(initialPollForm);
    setSuccess("Abstimmung gespeichert.");
    await loadPolls();
    setIsSubmitting(false);
  }

  function toggleSelection(pollId: string, optionId: string, multiple: boolean) {
    setSelections((current) => {
      const selected = current[pollId] ?? [];

      if (!multiple) {
        return { ...current, [pollId]: [optionId] };
      }

      return selected.includes(optionId)
        ? { ...current, [pollId]: selected.filter((id) => id !== optionId) }
        : { ...current, [pollId]: [...selected, optionId] };
    });
  }

  async function submitVote(pollId: string) {
    const supabase = getBrowserSupabaseClient();
    const selectedOptionIds = selections[pollId] ?? [];

    if (!supabase || selectedOptionIds.length === 0) {
      setError("Bitte wähle mindestens eine Option.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Bitte melde dich erneut an.");
      return;
    }

    const now = new Date().toISOString();
    const { error: voteError } = await supabase.from("poll_votes").upsert(
      {
        poll_id: pollId,
        user_id: user.id,
        selected_option_ids: selectedOptionIds,
        created_at: now,
        updated_at: now,
      },
      { onConflict: "poll_id,user_id" },
    );

    if (voteError) {
      setError(voteError.message);
      return;
    }

    setSuccess("Stimme gespeichert.");
    await loadPolls();
  }

  return (
    <div>
      <PageHeading
        title="Abstimmungen"
        description="Erstelle Entscheidungen für die Klasse, stimme ab und zeige Ergebnisse abhängig von der Sichtbarkeit."
        action={<ClassPicker />}
      />

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        {/* Erstellen – auf Mobile nach der Liste */}
        <Card className="order-2 h-fit xl:order-1" id="create-form">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="bg-gradient-brand flex size-10 shrink-0 items-center justify-center rounded-lg text-white">
                <Plus className="size-5" />
              </span>
              <div>
                <CardTitle>Abstimmung erstellen</CardTitle>
                <CardDescription>
                  Nur Klassensprecher und Admins dürfen neue Abstimmungen anlegen.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleCreatePoll}>
              <div className="space-y-2">
                <Label htmlFor="poll-title">Titel</Label>
                <Input
                  required
                  id="poll-title"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poll-description">Beschreibung</Label>
                <Textarea
                  id="poll-description"
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="poll-type">Typ</Label>
                  <Select
                    id="poll-type"
                    value={form.type}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, type: event.target.value }))
                    }
                  >
                    <option value="yes_no">Ja/Nein</option>
                    <option value="single_choice">Einzelauswahl</option>
                    <option value="multiple_choice">Mehrfachauswahl</option>
                    <option value="rating">Rating</option>
                    <option value="date_finding">Terminfindung</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poll-result-visibility">Ergebnisse</Label>
                  <Select
                    id="poll-result-visibility"
                    value={form.result_visibility}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        result_visibility: event.target.value,
                      }))
                    }
                  >
                    <option value="immediate">Sofort</option>
                    <option value="after_end">Nach Ende</option>
                    <option value="admins_only">Nur Admins</option>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="poll-starts">Start</Label>
                  <Input
                    required
                    id="poll-starts"
                    type="datetime-local"
                    value={form.starts_at}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        starts_at: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poll-ends">Ende</Label>
                  <Input
                    required
                    id="poll-ends"
                    type="datetime-local"
                    value={form.ends_at}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        ends_at: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="poll-options">Optionen (eine pro Zeile)</Label>
                <Textarea
                  required
                  id="poll-options"
                  value={form.options}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      options: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border p-3 text-sm transition-colors hover:border-border-strong">
                  <input
                    checked={form.anonymous}
                    className="size-5 accent-primary"
                    type="checkbox"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        anonymous: event.target.checked,
                      }))
                    }
                  />
                  Anonym anzeigen
                </label>
                <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border p-3 text-sm transition-colors hover:border-border-strong">
                  <input
                    checked={form.multiple_choice}
                    className="size-5 accent-primary"
                    type="checkbox"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        multiple_choice: event.target.checked,
                      }))
                    }
                  />
                  Mehrfachauswahl
                </label>
              </div>
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
                {isSubmitting ? "Speichern..." : "Abstimmung speichern"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Liste – auf Mobile zuerst */}
        <section className="order-1 space-y-4 xl:order-2">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          ) : polls.length === 0 ? (
            <EmptyState
              visual={<NoPollsVisual />}
              title="Noch nichts zu entscheiden"
              description="Klassensprecher können hier Abstimmungen starten – von Terminfindung bis Kursfahrt."
            />
          ) : (
            polls.map((poll) => {
              const pollId = text(poll, "id");
              const pollOptions = optionsByPoll[pollId] ?? [];
              const pollVotes = votesByPoll[pollId] ?? [];
              const status = calculatePollStatus({
                startsAt: text(poll, "starts_at"),
                endsAt: text(poll, "ends_at"),
                status: text(poll, "status") === "ended" ? "ended" : "planned",
              });
              const canVote = status === "active";
              const isMultipleChoice = text(poll, "multiple_choice") === "true";
              const resultVisibility = text(poll, "result_visibility");
              const canSeeResults =
                resultVisibility === "immediate" ||
                (resultVisibility === "after_end" && status === "ended") ||
                (selectedClass
                  ? canViewRestrictedPollResults(selectedClass.role)
                  : false);
              const result = calculatePollResults(
                pollOptions.map((option) => ({
                  id: option.id,
                  label: option.label,
                })),
                pollVotes.map((vote) => ({
                  userId: vote.user_id,
                  selectedOptionIds: vote.selected_option_ids,
                })),
              );
              const participation = calculateParticipationRate(
                pollVotes.map((vote) => ({ userId: vote.user_id })),
                memberCount,
              );
              const maxVotes = Math.max(...result.rows.map((row) => row.votes), 0);

              return (
                <Card key={pollId} variant="elevated">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <CardTitle className="leading-snug">
                          {text(poll, "title")}
                        </CardTitle>
                        {text(poll, "description") ? (
                          <CardDescription className="mt-1.5">
                            {text(poll, "description")}
                          </CardDescription>
                        ) : null}
                      </div>
                      <StatusBadge status={status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Badge variant="secondary">
                        {pollTypeLabels[text(poll, "type")] ?? text(poll, "type")}
                      </Badge>
                      {text(poll, "anonymous") === "true" ? (
                        <Badge variant="secondary">Anonym</Badge>
                      ) : null}
                      <span className="ml-auto">
                        <ParticipationRing value={participation} />
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {pollOptions.map((option) => {
                        const selected = Boolean(
                          selections[pollId]?.includes(option.id),
                        );

                        return (
                          <label
                            className={cn(
                              "flex min-h-12 items-center gap-3 rounded-xl border p-3 text-sm font-medium transition-colors duration-150",
                              canVote
                                ? "cursor-pointer hover:border-border-strong"
                                : "opacity-70",
                              selected
                                ? "border-primary/60 bg-primary/10"
                                : "border-border",
                            )}
                            key={option.id}
                          >
                            <input
                              checked={selected}
                              className="size-5 shrink-0 accent-primary"
                              disabled={!canVote}
                              name={`poll-${pollId}`}
                              type={isMultipleChoice ? "checkbox" : "radio"}
                              onChange={() =>
                                toggleSelection(pollId, option.id, isMultipleChoice)
                              }
                            />
                            <span className="min-w-0 flex-1">{option.label}</span>
                            {selected ? (
                              <Check className="size-4 shrink-0 text-primary" />
                            ) : null}
                          </label>
                        );
                      })}
                    </div>

                    {canVote ? (
                      <Button
                        className="w-full sm:w-auto"
                        disabled={!isSupabaseConfigured}
                        type="button"
                        onClick={() => submitVote(pollId)}
                      >
                        Stimme speichern
                      </Button>
                    ) : null}

                    {canSeeResults ? (
                      <div className="space-y-3 rounded-xl bg-secondary/60 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <BarChart3 className="size-4 text-primary" />
                          Ergebnis
                        </div>
                        {result.rows.map((row, index) => {
                          const isWinner =
                            row.votes > 0 && row.votes === maxVotes;

                          return (
                            <div className="space-y-1.5" key={row.optionId}>
                              <div className="flex items-baseline justify-between gap-3 text-sm">
                                <span
                                  className={cn(
                                    "min-w-0 truncate",
                                    isWinner && "font-semibold",
                                  )}
                                >
                                  {row.label}
                                </span>
                                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                                  {row.votes} · {row.percentage}%
                                </span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-background">
                                <motion.div
                                  className={cn(
                                    "h-full rounded-full",
                                    isWinner
                                      ? "bg-gradient-brand shadow-glow"
                                      : "bg-primary/35",
                                  )}
                                  {...pollBarAnimation(row.percentage, index)}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                        <Lock className="size-4 shrink-0" />
                        Ergebnisse werden gemäß Sichtbarkeitseinstellung später
                        angezeigt.
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </section>
      </div>

      {canCreate ? <Fab href="#create-form" label="Abstimmung erstellen" /> : null}
    </div>
  );
}

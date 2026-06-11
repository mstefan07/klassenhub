"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  Files,
  Link2,
  NotebookPen,
  Pin,
  TrendingUp,
  Vote,
} from "lucide-react";
import { ClassPicker } from "@/components/classes/class-picker";
import { PageHeading } from "@/components/layout/page-heading";
import { AnimatedNumber } from "@/components/ui/animated-number";
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
  NoClassVisual,
  NoEventsVisual,
  NoFilesVisual,
} from "@/components/ui/empty-visuals";
import { Skeleton } from "@/components/ui/skeleton";
import { useClassMemberships } from "@/hooks/use-class-memberships";
import { calculateDashboardMetrics } from "@/lib/calculations";
import { formatRelativeDate } from "@/lib/calculations/dates";
import { subjectColor, subjectTint } from "@/lib/constants/subject-colors";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import type {
  Announcement,
  Assignment,
  Event,
  Poll,
  PollVote,
  Resource,
} from "@/types";

type DataRow = Record<string, unknown>;

function text(row: DataRow, key: string) {
  return row[key] === null || row[key] === undefined ? "" : String(row[key]);
}

function mapEvent(row: DataRow): Event {
  return {
    id: text(row, "id"),
    classId: text(row, "class_id"),
    title: text(row, "title"),
    type: text(row, "type") as Event["type"],
    date: text(row, "date"),
    time: text(row, "time") || null,
    subject: text(row, "subject"),
    room: text(row, "room") || null,
    description: text(row, "description") || null,
    priority: text(row, "priority") as Event["priority"],
    status: text(row, "status") as Event["status"],
    createdBy: text(row, "created_by"),
    createdAt: text(row, "created_at"),
    updatedAt: text(row, "updated_at"),
  };
}

function mapAssignment(row: DataRow): Assignment {
  return {
    id: text(row, "id"),
    classId: text(row, "class_id"),
    title: text(row, "title"),
    subject: text(row, "subject"),
    description: text(row, "description"),
    dueDate: text(row, "due_date"),
    priority: text(row, "priority") as Assignment["priority"],
    status: text(row, "status") as Assignment["status"],
    assignedTo: text(row, "assigned_to") || null,
    createdBy: text(row, "created_by"),
    createdAt: text(row, "created_at"),
    updatedAt: text(row, "updated_at"),
  };
}

function mapAnnouncement(row: DataRow): Announcement {
  return {
    id: text(row, "id"),
    classId: text(row, "class_id"),
    title: text(row, "title"),
    content: text(row, "content"),
    importance: text(row, "importance") as Announcement["importance"],
    pinned: Boolean(row.pinned),
    validUntil: text(row, "valid_until") || null,
    createdBy: text(row, "created_by"),
    createdAt: text(row, "created_at"),
  };
}

function mapPoll(row: DataRow): Poll {
  return {
    id: text(row, "id"),
    classId: text(row, "class_id"),
    title: text(row, "title"),
    description: text(row, "description") || null,
    type: text(row, "type") as Poll["type"],
    options: Array.isArray(row.options) ? row.options.map(String) : [],
    startsAt: text(row, "starts_at"),
    endsAt: text(row, "ends_at"),
    anonymous: Boolean(row.anonymous),
    multipleChoice: Boolean(row.multiple_choice),
    resultVisibility: text(row, "result_visibility") as Poll["resultVisibility"],
    status: text(row, "status") as Poll["status"],
    createdBy: text(row, "created_by"),
    createdAt: text(row, "created_at"),
    updatedAt: text(row, "updated_at"),
  };
}

function mapResource(row: DataRow): Resource {
  return {
    id: text(row, "id"),
    classId: text(row, "class_id"),
    title: text(row, "title"),
    subject: text(row, "subject") || null,
    type: text(row, "type") as Resource["type"],
    url: text(row, "url") || null,
    description: text(row, "description") || null,
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    uploadedBy: text(row, "uploaded_by"),
    createdAt: text(row, "created_at"),
  };
}

function mapPollVote(row: DataRow): PollVote {
  return {
    id: text(row, "id"),
    pollId: text(row, "poll_id"),
    userId: text(row, "user_id"),
    selectedOptionIds: Array.isArray(row.selected_option_ids)
      ? row.selected_option_ids.map(String)
      : [],
    ratingValue: row.rating_value ? Number(row.rating_value) : null,
    createdAt: text(row, "created_at"),
    updatedAt: text(row, "updated_at"),
  };
}

const dueToneClass = {
  overdue: "text-destructive",
  today: "text-warning",
  soon: "text-warning",
  normal: "text-muted-foreground",
} as const;

const resourceTypeIcon = {
  link: Link2,
  note: NotebookPen,
  file: Files,
} as const;

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton className="h-32 rounded-xl" key={index} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}

export function DashboardOverview() {
  const {
    selectedClassId,
    classes,
    isLoading: classesLoading,
  } = useClassMemberships();
  const reduceMotion = useReducedMotion();
  const [events, setEvents] = useState<Event[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [pollVotes, setPollVotes] = useState<PollVote[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      const supabase = getBrowserSupabaseClient();

      if (!supabase || !selectedClassId) {
        return;
      }

      setIsLoading(true);

      const [
        eventsResult,
        assignmentsResult,
        announcementsResult,
        pollsResult,
        resourcesResult,
        memberResult,
      ] = await Promise.all([
        supabase.from("events").select("*").eq("class_id", selectedClassId),
        supabase.from("assignments").select("*").eq("class_id", selectedClassId),
        supabase.from("announcements").select("*").eq("class_id", selectedClassId),
        supabase.from("polls").select("*").eq("class_id", selectedClassId),
        supabase.from("resources").select("*").eq("class_id", selectedClassId),
        supabase
          .from("class_members")
          .select("id", { count: "exact", head: true })
          .eq("class_id", selectedClassId),
      ]);

      const pollIds = ((pollsResult.data as DataRow[]) ?? []).map((poll) =>
        text(poll, "id"),
      );

      const votesResult =
        pollIds.length > 0
          ? await supabase
              .from("poll_votes")
              .select("*")
              .in("poll_id", pollIds)
          : { data: [] };

      if (!isMounted) {
        return;
      }

      setEvents(((eventsResult.data as DataRow[]) ?? []).map(mapEvent));
      setAssignments(
        ((assignmentsResult.data as DataRow[]) ?? []).map(mapAssignment),
      );
      setAnnouncements(
        ((announcementsResult.data as DataRow[]) ?? []).map(mapAnnouncement),
      );
      setPolls(((pollsResult.data as DataRow[]) ?? []).map(mapPoll));
      setResources(((resourcesResult.data as DataRow[]) ?? []).map(mapResource));
      setPollVotes(((votesResult.data as DataRow[]) ?? []).map(mapPollVote));
      setMemberCount(memberResult.count ?? 0);
      setIsLoading(false);
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [selectedClassId]);

  const metrics = useMemo(
    () =>
      calculateDashboardMetrics({
        events,
        assignments,
        announcements,
        polls,
        resources,
        pollVotes,
        memberCount,
      }),
    [announcements, assignments, events, memberCount, pollVotes, polls, resources],
  );

  const cards = [
    {
      title: "Nächste Termine",
      value: metrics.nextEvents.length,
      icon: CalendarDays,
      href: "/app/events",
      tone: "bg-info/12 text-info",
    },
    {
      title: "Kommende Klausuren",
      value: metrics.upcomingExams.length,
      icon: TrendingUp,
      href: "/app/events",
      tone: "bg-destructive/12 text-destructive",
    },
    {
      title: "Offene Aufgaben",
      value: metrics.openAssignments.length,
      icon: CheckSquare,
      href: "/app/tasks",
      tone: "bg-success/12 text-success",
    },
    {
      title: "Aktive Abstimmungen",
      value: metrics.activePolls.length,
      icon: Vote,
      href: "/app/polls",
      tone: "bg-primary/12 text-primary",
    },
  ] as const;

  const itemVariants = reduceMotion ? fadeIn : staggerItem;

  return (
    <div className="space-y-6">
      <PageHeading
        title="Dashboard"
        description="Dein Überblick über Termine, Aufgaben, Ankündigungen und Abstimmungen."
        action={<ClassPicker />}
      />

      {!classesLoading && classes.length === 0 ? (
        <EmptyState
          visual={<NoClassVisual />}
          title="Noch keine Klasse"
          description="Erstelle eine Klasse oder tritt mit einem Einladungscode bei – dauert keine zwei Minuten."
          actionLabel="Klasse erstellen oder beitreten"
          actionHref="/app/classes"
        />
      ) : isLoading || classesLoading ? (
        <DashboardSkeleton />
      ) : (
        <motion.div
          animate="visible"
          className="space-y-6"
          initial="hidden"
          variants={staggerContainer}
        >
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {cards.map((card) => (
              <motion.div key={card.title} variants={itemVariants}>
                <Link className="group block h-full" href={card.href}>
                  <Card className="h-full" variant="elevated">
                    <CardContent className="flex h-full flex-col justify-between gap-4 p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "flex size-9 items-center justify-center rounded-lg",
                            card.tone,
                          )}
                        >
                          <card.icon className="size-4.5" />
                        </span>
                        <ChevronRight className="size-4 text-faint-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                      </div>
                      <div>
                        <AnimatedNumber
                          className="font-mono text-3xl font-semibold tracking-tight"
                          value={card.value}
                        />
                        <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                          {card.title}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Aktive Abstimmungen prominent */}
          {metrics.activePolls.length > 0 ? (
            <motion.div variants={itemVariants}>
              <Card className="relative overflow-hidden border-primary/30">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-60"
                  style={{
                    background:
                      "radial-gradient(420px at 0% 0%, color-mix(in srgb, var(--primary) 10%, transparent), transparent)",
                  }}
                />
                <CardContent className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="bg-gradient-brand flex size-10 shrink-0 items-center justify-center rounded-lg text-white shadow-glow">
                      <Vote className="size-5" />
                    </span>
                    <div>
                      <p className="font-semibold">
                        {metrics.activePolls.length === 1
                          ? "Eine Abstimmung läuft gerade"
                          : `${metrics.activePolls.length} Abstimmungen laufen gerade`}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {metrics.activePolls[0].title}
                        {metrics.activePolls.length > 1 ? " und weitere" : ""} ·
                        Beteiligung {metrics.averagePollParticipation}%
                      </p>
                    </div>
                  </div>
                  <Button asChild className="shrink-0">
                    <Link href="/app/polls">
                      Jetzt abstimmen
                      <ArrowRight />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Nächste Termine */}
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Nächste Termine</CardTitle>
                    <Link
                      className="text-xs font-medium text-primary hover:underline"
                      href="/app/events"
                    >
                      Alle ansehen
                    </Link>
                  </div>
                  <CardDescription>
                    Termine und Klausuren, sortiert nach Datum.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {metrics.nextEvents.length > 0 ? (
                    <div className="space-y-2.5">
                      {metrics.nextEvents.map((event) => {
                        const due = formatRelativeDate(event.date);
                        const color = subjectColor(event.subject);

                        return (
                          <Link
                            className="group flex items-center gap-3 rounded-xl border border-border p-3 transition-colors duration-150 hover:border-border-strong hover:bg-secondary/40"
                            href="/app/events"
                            key={event.id}
                          >
                            <span
                              aria-hidden
                              className="h-9 w-[3px] shrink-0 rounded-full"
                              style={{ backgroundColor: color.base }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">
                                {event.title}
                              </p>
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                <span
                                  className="rounded px-1.5 py-0.5 font-medium"
                                  style={{
                                    backgroundColor: subjectTint(event.subject),
                                    color: color.base,
                                  }}
                                >
                                  {event.subject}
                                </span>
                                {event.time ? <> · {event.time}</> : null}
                                {event.room ? <> · {event.room}</> : null}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "shrink-0 font-mono text-xs font-medium",
                                dueToneClass[due.tone],
                              )}
                            >
                              {due.label}
                            </span>
                            <ChevronRight className="size-4 shrink-0 text-faint-foreground transition-transform duration-150 group-hover:translate-x-0.5" />
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState
                      framed={false}
                      visual={<NoEventsVisual />}
                      title="Frei – nichts geplant"
                      description="Sobald Klausuren oder Termine eingetragen sind, erscheinen sie hier nach Datum sortiert."
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Offene Aufgaben + Beteiligung */}
            <motion.div className="flex flex-col gap-4" variants={itemVariants}>
              <Card className="flex-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Offene Aufgaben</CardTitle>
                    <Link
                      className="text-xs font-medium text-primary hover:underline"
                      href="/app/tasks"
                    >
                      Alle ansehen
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {metrics.openAssignments.length > 0 ? (
                    <div className="space-y-2.5">
                      {metrics.openAssignments.slice(0, 4).map((assignment) => {
                        const due = formatRelativeDate(assignment.dueDate);
                        const color = subjectColor(assignment.subject);

                        return (
                          <Link
                            className="group flex items-center gap-3 rounded-xl border border-border p-3 transition-colors duration-150 hover:border-border-strong hover:bg-secondary/40"
                            href="/app/tasks"
                            key={assignment.id}
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "size-2 shrink-0 rounded-full",
                                assignment.priority === "high"
                                  ? "bg-destructive"
                                  : assignment.priority === "medium"
                                    ? "bg-warning"
                                    : "bg-faint-foreground",
                              )}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">
                                {assignment.title}
                              </p>
                              <p
                                className="mt-0.5 truncate text-xs"
                                style={{ color: color.base }}
                              >
                                {assignment.subject}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "shrink-0 font-mono text-xs font-medium",
                                dueToneClass[due.tone],
                              )}
                            >
                              {due.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState
                      framed={false}
                      icon={<CheckSquare className="size-5" />}
                      title="Alles erledigt"
                      description="Gerade keine offenen Aufgaben – neue Abgaben erscheinen hier."
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Beteiligung bei Abstimmungen
                    </p>
                    <p className="mt-1 font-mono text-3xl font-semibold tracking-tight">
                      <AnimatedNumber value={metrics.averagePollParticipation} />%
                    </p>
                  </div>
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary/12 text-primary">
                    <Vote className="size-5" />
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Ankündigungen */}
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Wichtige Ankündigungen</CardTitle>
                    <Link
                      className="text-xs font-medium text-primary hover:underline"
                      href="/app/announcements"
                    >
                      Alle ansehen
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {metrics.pinnedAnnouncements.length > 0 ? (
                    <div className="space-y-2.5">
                      {metrics.pinnedAnnouncements.map((announcement) => (
                        <div
                          className="flex items-start gap-3 rounded-xl border-l-2 border-warning bg-secondary/50 p-3"
                          key={announcement.id}
                        >
                          <Pin className="mt-0.5 size-3.5 shrink-0 text-warning" />
                          <p className="text-sm font-medium leading-5">
                            {announcement.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      framed={false}
                      visual={<NoAnnouncementsVisual />}
                      title="Alles ruhig"
                      description="Wichtige Infos von Klassensprechern und Lehrkräften landen hier – gepinnt und unübersehbar."
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Dateien & Links */}
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Letzte Dateien & Links</CardTitle>
                    <Link
                      className="text-xs font-medium text-primary hover:underline"
                      href="/app/resources"
                    >
                      Alle ansehen
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {metrics.recentResources.length > 0 ? (
                    <div className="space-y-2.5">
                      {metrics.recentResources.map((resource) => {
                        const TypeIcon =
                          resourceTypeIcon[
                            resource.type as keyof typeof resourceTypeIcon
                          ] ?? Files;

                        return (
                          <div
                            className="flex items-center gap-3 rounded-xl border border-border p-3"
                            key={resource.id}
                          >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-indigo/12 text-brand-indigo">
                              <TypeIcon className="size-4" />
                            </span>
                            <p className="min-w-0 flex-1 truncate text-sm font-medium">
                              {resource.title}
                            </p>
                            {resource.subject ? (
                              <span
                                className="shrink-0 rounded px-1.5 py-0.5 text-xs font-medium"
                                style={{
                                  backgroundColor: subjectTint(resource.subject),
                                  color: subjectColor(resource.subject).base,
                                }}
                              >
                                {resource.subject}
                              </span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState
                      framed={false}
                      visual={<NoFilesVisual />}
                      title="Noch keine Materialien"
                      description="Lege Links, Notizen und Unterlagen ab, damit niemand mehr danach fragen muss."
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckSquare,
  Files,
  Megaphone,
  TrendingUp,
  Vote,
} from "lucide-react";
import { ClassPicker } from "@/components/classes/class-picker";
import { PageHeading } from "@/components/layout/page-heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { useClassMemberships } from "@/hooks/use-class-memberships";
import { calculateDashboardMetrics } from "@/lib/calculations";
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

export function DashboardOverview() {
  const { selectedClassId } = useClassMemberships();
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
      status: "planned",
    },
    {
      title: "Kommende Klausuren",
      value: metrics.upcomingExams.length,
      icon: TrendingUp,
      status: "soon",
    },
    {
      title: "Offene Aufgaben",
      value: metrics.openAssignments.length,
      icon: CheckSquare,
      status: "open",
    },
    {
      title: "Aktive Abstimmungen",
      value: metrics.activePolls.length,
      icon: Vote,
      status: "active",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeading
        title="Dashboard"
        description="Dein Überblick über Termine, Aufgaben, Ankündigungen und Abstimmungen."
        action={<ClassPicker />}
      />

      {isLoading ? (
        <Card className="p-5 text-sm text-muted-foreground">
          Dashboard wird geladen...
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="size-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-semibold">{card.value}</span>
                <StatusBadge status={card.status} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Wochenübersicht</CardTitle>
            <CardDescription>
              Termine und Aufgaben der aktuellen Woche erscheinen hier.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.nextEvents.length > 0 ? (
              <div className="space-y-3">
                {metrics.nextEvents.map((event) => (
                  <div
                    className="rounded-lg border border-border p-3 text-sm"
                    key={event.id}
                  >
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-muted-foreground">
                      {event.subject} · {event.date}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                framed={false}
                icon={<CalendarDays className="size-5" />}
                title="Noch keine Wochenereignisse"
                description="Sobald Termine oder Aufgaben gespeichert sind, entsteht hier eine kompakte Wochenansicht."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Beteiligung bei Abstimmungen</CardTitle>
            <CardDescription>
              Durchschnittliche Beteiligung aktiver Abstimmungen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between rounded-lg bg-secondary p-5">
              <div>
                <p className="text-sm text-muted-foreground">Quote</p>
                <p className="mt-1 text-4xl font-semibold">
                  {metrics.averagePollParticipation}%
                </p>
              </div>
              <Vote className="size-9 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Wichtige Ankündigungen</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.pinnedAnnouncements.length > 0 ? (
              <div className="space-y-3">
                {metrics.pinnedAnnouncements.map((announcement) => (
                  <p className="rounded-lg bg-secondary p-3 text-sm" key={announcement.id}>
                    {announcement.title}
                  </p>
                ))}
              </div>
            ) : (
              <EmptyState
                framed={false}
                icon={<Megaphone className="size-5" />}
                title="Keine gepinnten Infos"
                description="Wichtige Hinweise von Klassensprechern, Lehrkräften oder Admins werden hier sichtbar."
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Letzte Dateien & Links</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.recentResources.length > 0 ? (
              <div className="space-y-3">
                {metrics.recentResources.map((resource) => (
                  <p className="rounded-lg bg-secondary p-3 text-sm" key={resource.id}>
                    {resource.title}
                  </p>
                ))}
              </div>
            ) : (
              <EmptyState
                framed={false}
                icon={<Files className="size-5" />}
                title="Noch keine Ressourcen"
                description="Links, Notizen und vorbereitete Upload-Metadaten landen in diesem Bereich."
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>In-App-Hinweise</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              framed={false}
              icon={<CheckSquare className="size-5" />}
              title="Keine Hinweise"
              description="Klausuren, bald fällige Aufgaben, neue Ankündigungen und aktive Abstimmungen werden vorbereitet."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

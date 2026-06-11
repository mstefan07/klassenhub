import type {
  Announcement,
  Assignment,
  Event,
  Poll,
  PollVote,
  Resource,
} from "@/types";
import { calculateAssignmentStatus } from "./assignments";
import { parseDate } from "./dates";
import { calculateParticipationRate, calculatePollStatus } from "./polls";

export type DashboardMetricsInput = {
  events: Event[];
  assignments: Assignment[];
  announcements: Announcement[];
  polls: Poll[];
  resources: Resource[];
  pollVotes: PollVote[];
  memberCount: number;
  now?: Date;
};

export type DashboardMetrics = {
  nextEvents: Event[];
  upcomingExams: Event[];
  openAssignments: Assignment[];
  pinnedAnnouncements: Announcement[];
  activePolls: Poll[];
  recentResources: Resource[];
  averagePollParticipation: number;
};

export function calculateDashboardMetrics({
  events,
  assignments,
  announcements,
  polls,
  resources,
  pollVotes,
  memberCount,
  now = new Date(),
}: DashboardMetricsInput): DashboardMetrics {
  const upcomingEvents = events
    .filter((event) => parseDate(event.date, event.time).getTime() >= now.getTime())
    .sort(
      (a, b) =>
        parseDate(a.date, a.time).getTime() - parseDate(b.date, b.time).getTime(),
    );

  const activePolls = polls.filter(
    (poll) => calculatePollStatus(poll, now) === "active",
  );

  const participationValues = activePolls.map((poll) => {
    const votesForPoll = pollVotes.filter((vote) => vote.pollId === poll.id);

    return calculateParticipationRate(votesForPoll, memberCount);
  });

  return {
    nextEvents: upcomingEvents.slice(0, 5),
    upcomingExams: upcomingEvents
      .filter((event) => event.type === "exam")
      .slice(0, 5),
    openAssignments: assignments.filter(
      (assignment) => calculateAssignmentStatus(assignment, now) !== "done",
    ),
    pinnedAnnouncements: announcements
      .filter((announcement) => announcement.pinned)
      .slice(0, 5),
    activePolls,
    recentResources: [...resources]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5),
    averagePollParticipation:
      participationValues.length === 0
        ? 0
        : Math.round(
            participationValues.reduce((sum, value) => sum + value, 0) /
              participationValues.length,
          ),
  };
}

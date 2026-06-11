import { describe, expect, it } from "vitest";
import { calculateDashboardMetrics } from "@/lib/calculations";
import type { Announcement, Assignment, Event, Poll, PollVote, Resource } from "@/types";

const now = new Date(2026, 5, 11, 12, 0, 0);

function event(overrides: Partial<Event>): Event {
  return {
    id: "event-1",
    classId: "class-1",
    title: "Klausur",
    type: "exam",
    date: "2026-06-15",
    time: "09:00",
    subject: "Mathe",
    room: null,
    description: null,
    priority: "high",
    status: "planned",
    createdBy: "user-1",
    createdAt: "2026-06-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
    ...overrides,
  };
}

function assignment(overrides: Partial<Assignment>): Assignment {
  return {
    id: "assignment-1",
    classId: "class-1",
    title: "Aufgabe",
    subject: "Deutsch",
    description: "Lesen",
    dueDate: "2026-06-12",
    priority: "medium",
    status: "open",
    assignedTo: null,
    createdBy: "user-1",
    createdAt: "2026-06-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("dashboard metrics", () => {
  it("calculates dashboard groups and participation", () => {
    const polls: Poll[] = [
      {
        id: "poll-1",
        classId: "class-1",
        title: "Ausflug",
        description: null,
        type: "yes_no",
        options: ["Ja", "Nein"],
        startsAt: "2026-06-10T00:00:00.000Z",
        endsAt: "2026-06-12T00:00:00.000Z",
        anonymous: false,
        multipleChoice: false,
        resultVisibility: "immediate",
        status: "active",
        createdBy: "user-1",
        createdAt: "2026-06-01T00:00:00.000Z",
        updatedAt: "2026-06-01T00:00:00.000Z",
      },
    ];

    const announcements: Announcement[] = [
      {
        id: "announcement-1",
        classId: "class-1",
        title: "Wichtig",
        content: "Info",
        importance: "important",
        pinned: true,
        validUntil: null,
        createdBy: "user-1",
        createdAt: "2026-06-01T00:00:00.000Z",
      },
    ];

    const resources: Resource[] = [
      {
        id: "resource-1",
        classId: "class-1",
        title: "Link",
        subject: null,
        type: "link",
        url: "https://example.com",
        description: null,
        tags: [],
        uploadedBy: "user-1",
        createdAt: "2026-06-08T00:00:00.000Z",
      },
    ];

    const pollVotes: PollVote[] = [
      {
        id: "vote-1",
        pollId: "poll-1",
        userId: "user-1",
        selectedOptionIds: ["yes"],
        ratingValue: null,
        createdAt: "2026-06-10T00:00:00.000Z",
        updatedAt: "2026-06-10T00:00:00.000Z",
      },
      {
        id: "vote-2",
        pollId: "poll-1",
        userId: "user-2",
        selectedOptionIds: ["no"],
        ratingValue: null,
        createdAt: "2026-06-10T00:00:00.000Z",
        updatedAt: "2026-06-10T00:00:00.000Z",
      },
    ];

    const metrics = calculateDashboardMetrics({
      events: [event({}), event({ id: "event-2", type: "lesson", date: "2026-07-01" })],
      assignments: [assignment({}), assignment({ id: "done", status: "done" })],
      announcements,
      polls,
      resources,
      pollVotes,
      memberCount: 4,
      now,
    });

    expect(metrics.nextEvents).toHaveLength(2);
    expect(metrics.upcomingExams).toHaveLength(1);
    expect(metrics.openAssignments).toHaveLength(1);
    expect(metrics.pinnedAnnouncements).toHaveLength(1);
    expect(metrics.activePolls).toHaveLength(1);
    expect(metrics.recentResources).toHaveLength(1);
    expect(metrics.averagePollParticipation).toBe(50);
  });
});

import { describe, expect, it } from "vitest";
import {
  calculateAssignmentStatus,
  calculateEventStatus,
  isAssignmentOverdue,
} from "@/lib/calculations";

describe("assignment status", () => {
  const now = new Date(2026, 5, 11, 12, 0, 0);

  it("marks unfinished past due dates as overdue", () => {
    expect(
      calculateAssignmentStatus(
        { dueDate: "2026-06-10", status: "open" },
        now,
      ),
    ).toBe("overdue");
  });

  it("keeps done assignments done even after the due date", () => {
    expect(
      calculateAssignmentStatus(
        { dueDate: "2026-06-01", status: "done" },
        now,
      ),
    ).toBe("done");
  });

  it("does not mark today's date-only assignment overdue during the day", () => {
    expect(
      isAssignmentOverdue({ dueDate: "2026-06-11", status: "open" }, now),
    ).toBe(false);
  });
});

describe("event status", () => {
  const now = new Date(2026, 5, 11, 12, 0, 0);

  it("marks events in the next seven days as soon", () => {
    expect(
      calculateEventStatus(
        { date: "2026-06-15", time: "09:00", status: "planned" },
        now,
      ),
    ).toBe("soon");
  });

  it("marks past events as missed", () => {
    expect(
      calculateEventStatus(
        { date: "2026-06-10", time: "09:00", status: "planned" },
        now,
      ),
    ).toBe("missed");
  });

  it("keeps completed events done", () => {
    expect(
      calculateEventStatus(
        { date: "2026-06-10", time: "09:00", status: "done" },
        now,
      ),
    ).toBe("done");
  });

  it("keeps later events planned", () => {
    expect(
      calculateEventStatus(
        { date: "2026-07-01", time: "09:00", status: "planned" },
        now,
      ),
    ).toBe("planned");
  });
});

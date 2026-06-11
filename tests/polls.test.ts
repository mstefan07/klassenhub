import { describe, expect, it } from "vitest";
import {
  calculateParticipationRate,
  calculatePollResults,
  calculatePollStatus,
} from "@/lib/calculations";

describe("poll status and results", () => {
  const now = new Date("2026-06-11T12:00:00.000Z");

  it("calculates planned, active and ended poll states", () => {
    expect(
      calculatePollStatus(
        {
          startsAt: "2026-06-12T08:00:00.000Z",
          endsAt: "2026-06-13T08:00:00.000Z",
          status: "planned",
        },
        now,
      ),
    ).toBe("planned");

    expect(
      calculatePollStatus(
        {
          startsAt: "2026-06-10T08:00:00.000Z",
          endsAt: "2026-06-12T08:00:00.000Z",
          status: "planned",
        },
        now,
      ),
    ).toBe("active");

    expect(
      calculatePollStatus(
        {
          startsAt: "2026-06-09T08:00:00.000Z",
          endsAt: "2026-06-10T08:00:00.000Z",
          status: "active",
        },
        now,
      ),
    ).toBe("ended");
  });

  it("calculates vote counts and percentages", () => {
    const result = calculatePollResults(
      [
        { id: "yes", label: "Ja" },
        { id: "no", label: "Nein" },
      ],
      [
        { userId: "user-1", selectedOptionIds: ["yes"] },
        { userId: "user-2", selectedOptionIds: ["yes"] },
        { userId: "user-3", selectedOptionIds: ["no"] },
      ],
    );

    expect(result.totalVotes).toBe(3);
    expect(result.rows).toEqual([
      { optionId: "yes", label: "Ja", votes: 2, percentage: 67 },
      { optionId: "no", label: "Nein", votes: 1, percentage: 33 },
    ]);
  });

  it("calculates participation from unique voters", () => {
    expect(
      calculateParticipationRate(
        [{ userId: "u1" }, { userId: "u1" }, { userId: "u2" }],
        4,
      ),
    ).toBe(50);
  });
});

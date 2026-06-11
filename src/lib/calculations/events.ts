import type { Event, EventStatus } from "@/types";
import { addDays, endOfDate, parseDate } from "./dates";

type EventStatusInput = Pick<Event, "date" | "time" | "status">;

export function calculateEventStatus(
  event: EventStatusInput,
  now = new Date(),
): EventStatus {
  if (event.status === "done") {
    return "done";
  }

  const eventStart = parseDate(event.date, event.time);
  const eventEnd = event.time ? eventStart : endOfDate(event.date);

  if (eventEnd.getTime() < now.getTime()) {
    return "missed";
  }

  if (eventStart.getTime() <= addDays(now, 7).getTime()) {
    return "soon";
  }

  return "planned";
}

import type { Assignment, AssignmentStatus } from "@/types";
import { endOfDate } from "./dates";

type AssignmentStatusInput = Pick<Assignment, "dueDate" | "status">;

export function calculateAssignmentStatus(
  assignment: AssignmentStatusInput,
  now = new Date(),
): AssignmentStatus {
  if (assignment.status === "done") {
    return "done";
  }

  if (endOfDate(assignment.dueDate).getTime() < now.getTime()) {
    return "overdue";
  }

  return assignment.status === "in_progress" ? "in_progress" : "open";
}

export function isAssignmentOverdue(
  assignment: AssignmentStatusInput,
  now = new Date(),
) {
  return calculateAssignmentStatus(assignment, now) === "overdue";
}

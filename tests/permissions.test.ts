import { describe, expect, it } from "vitest";
import {
  canAssignRoles,
  canCreateAnnouncement,
  canCreatePoll,
  canManageClass,
  canPinInformation,
  hasPermission,
} from "@/lib/permissions";

describe("role permissions", () => {
  it("allows students to view and vote but not create polls", () => {
    expect(hasPermission("student", "view_events")).toBe(true);
    expect(hasPermission("student", "vote_polls")).toBe(true);
    expect(canCreatePoll("student")).toBe(false);
  });

  it("allows class representatives to create polls and announcements", () => {
    expect(canCreatePoll("class_representative")).toBe(true);
    expect(canCreateAnnouncement("class_representative")).toBe(true);
    expect(canPinInformation("class_representative")).toBe(true);
  });

  it("limits class and role management to admins", () => {
    expect(canManageClass("teacher")).toBe(false);
    expect(canAssignRoles("teacher")).toBe(false);
    expect(canManageClass("admin")).toBe(true);
    expect(canAssignRoles("admin")).toBe(true);
  });
});

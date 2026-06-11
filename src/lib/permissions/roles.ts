import type { UserRole } from "@/types";

export type Permission =
  | "view_events"
  | "view_assignments"
  | "view_resources"
  | "view_announcements"
  | "vote_polls"
  | "create_polls"
  | "create_announcements"
  | "suggest_events"
  | "pin_information"
  | "create_events"
  | "create_assignments"
  | "view_poll_results"
  | "manage_class"
  | "manage_members"
  | "assign_roles";

export const rolePermissions: Record<UserRole, Permission[]> = {
  student: [
    "view_events",
    "view_assignments",
    "view_resources",
    "view_announcements",
    "vote_polls",
  ],
  class_representative: [
    "view_events",
    "view_assignments",
    "view_resources",
    "view_announcements",
    "vote_polls",
    "create_polls",
    "create_announcements",
    "suggest_events",
    "pin_information",
    "view_poll_results",
  ],
  teacher: [
    "view_events",
    "view_assignments",
    "view_resources",
    "view_announcements",
    "vote_polls",
    "create_events",
    "create_assignments",
    "create_announcements",
    "view_poll_results",
  ],
  admin: [
    "view_events",
    "view_assignments",
    "view_resources",
    "view_announcements",
    "vote_polls",
    "create_polls",
    "create_announcements",
    "suggest_events",
    "pin_information",
    "create_events",
    "create_assignments",
    "view_poll_results",
    "manage_class",
    "manage_members",
    "assign_roles",
  ],
};

export function hasPermission(role: UserRole, permission: Permission) {
  return rolePermissions[role].includes(permission);
}

export function canCreatePoll(role: UserRole) {
  return hasPermission(role, "create_polls");
}

export function canCreateAnnouncement(role: UserRole) {
  return hasPermission(role, "create_announcements");
}

export function canManageClass(role: UserRole) {
  return hasPermission(role, "manage_class");
}

export function canAssignRoles(role: UserRole) {
  return hasPermission(role, "assign_roles");
}

export function canPinInformation(role: UserRole) {
  return hasPermission(role, "pin_information");
}

export function canViewRestrictedPollResults(role: UserRole) {
  return hasPermission(role, "view_poll_results");
}

export type UserRole = "student" | "class_representative" | "teacher" | "admin";

export type Priority = "low" | "medium" | "high";

export type Profile = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Class = {
  id: string;
  name: string;
  school: string;
  schoolYear: string;
  invitationCode: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ClassMember = {
  id: string;
  classId: string;
  userId: string;
  role: UserRole;
  joinedAt: string;
};

export type Invitation = {
  id: string;
  classId: string;
  code: string;
  active: boolean;
  expiresAt: string | null;
  maxUses: number | null;
  usedCount: number;
  createdBy: string;
  createdAt: string;
};

export type Subject = {
  id: string;
  classId: string;
  name: string;
  color: string;
  teacherName?: string | null;
  createdAt: string;
};

export type EventType = "exam" | "deadline" | "lesson" | "project" | "other";
export type EventStatus = "planned" | "soon" | "done" | "missed";

export type Event = {
  id: string;
  classId: string;
  title: string;
  type: EventType;
  date: string;
  time?: string | null;
  subject: string;
  room?: string | null;
  description?: string | null;
  priority: Priority;
  status: EventStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type AssignmentStatus = "open" | "in_progress" | "done" | "overdue";

export type Assignment = {
  id: string;
  classId: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: AssignmentStatus;
  assignedTo?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ResourceType = "file" | "link" | "note";

export type Resource = {
  id: string;
  classId: string;
  title: string;
  subject?: string | null;
  type: ResourceType;
  url?: string | null;
  description?: string | null;
  tags: string[];
  uploadedBy: string;
  createdAt: string;
};

export type AnnouncementImportance = "normal" | "important" | "urgent";

export type Announcement = {
  id: string;
  classId: string;
  title: string;
  content: string;
  importance: AnnouncementImportance;
  pinned: boolean;
  validUntil?: string | null;
  createdBy: string;
  createdAt: string;
};

export type PollType =
  | "yes_no"
  | "single_choice"
  | "multiple_choice"
  | "rating"
  | "date_finding";

export type PollResultVisibility = "immediate" | "after_end" | "admins_only";
export type PollStatus = "planned" | "active" | "ended";

export type Poll = {
  id: string;
  classId: string;
  title: string;
  description?: string | null;
  type: PollType;
  options: string[];
  startsAt: string;
  endsAt: string;
  anonymous: boolean;
  multipleChoice: boolean;
  resultVisibility: PollResultVisibility;
  status: PollStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type PollOption = {
  id: string;
  pollId: string;
  label: string;
  sortOrder: number;
  createdAt: string;
};

export type PollVote = {
  id: string;
  pollId: string;
  userId: string;
  selectedOptionIds: string[];
  ratingValue?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type NotificationType =
  | "next_exam"
  | "assignment_due"
  | "new_announcement"
  | "active_poll"
  | "project_deadline";

export type Notification = {
  id: string;
  classId: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  readAt?: string | null;
  createdAt: string;
};

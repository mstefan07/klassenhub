import { z } from "zod";

export const userRoleSchema = z.enum([
  "student",
  "class_representative",
  "teacher",
  "admin",
]);

export const prioritySchema = z.enum(["low", "medium", "high"]);
export const eventTypeSchema = z.enum([
  "exam",
  "deadline",
  "lesson",
  "project",
  "other",
]);
export const eventStatusSchema = z.enum(["planned", "soon", "done", "missed"]);
export const assignmentStatusSchema = z.enum([
  "open",
  "in_progress",
  "done",
  "overdue",
]);
export const resourceTypeSchema = z.enum(["file", "link", "note"]);
export const announcementImportanceSchema = z.enum([
  "normal",
  "important",
  "urgent",
]);
export const pollTypeSchema = z.enum([
  "yes_no",
  "single_choice",
  "multiple_choice",
  "rating",
  "date_finding",
]);
export const pollResultVisibilitySchema = z.enum([
  "immediate",
  "after_end",
  "admins_only",
]);
export const pollStatusSchema = z.enum(["planned", "active", "ended"]);
export const notificationTypeSchema = z.enum([
  "next_exam",
  "assignment_due",
  "new_announcement",
  "active_poll",
  "project_deadline",
]);

const idSchema = z.string().min(1);
const textSchema = z.string().trim().min(1, "Dieses Feld ist erforderlich.");
const optionalTextSchema = z.string().trim().optional().nullable();
const dateStringSchema = z.string().trim().min(1, "Bitte ein Datum angeben.");

export const profileSchema = z.object({
  id: idSchema,
  email: z.string().email("Bitte eine gueltige E-Mail-Adresse angeben."),
  fullName: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

export const classSchema = z.object({
  id: idSchema,
  name: textSchema,
  school: textSchema,
  schoolYear: textSchema,
  invitationCode: textSchema,
  createdBy: idSchema,
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

export const classMemberSchema = z.object({
  id: idSchema,
  classId: idSchema,
  userId: idSchema,
  role: userRoleSchema,
  joinedAt: dateStringSchema,
});

export const invitationSchema = z.object({
  id: idSchema,
  classId: idSchema,
  code: textSchema,
  active: z.boolean(),
  expiresAt: z.string().nullable(),
  maxUses: z.number().int().positive().nullable(),
  usedCount: z.number().int().min(0),
  createdBy: idSchema,
  createdAt: dateStringSchema,
});

export const subjectSchema = z.object({
  id: idSchema,
  classId: idSchema,
  name: textSchema,
  color: textSchema,
  teacherName: optionalTextSchema,
  createdAt: dateStringSchema,
});

export const eventSchema = z.object({
  id: idSchema,
  classId: idSchema,
  title: textSchema,
  type: eventTypeSchema,
  date: dateStringSchema,
  time: optionalTextSchema,
  subject: textSchema,
  room: optionalTextSchema,
  description: optionalTextSchema,
  priority: prioritySchema,
  status: eventStatusSchema,
  createdBy: idSchema,
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

export const assignmentSchema = z.object({
  id: idSchema,
  classId: idSchema,
  title: textSchema,
  subject: textSchema,
  description: textSchema,
  dueDate: dateStringSchema,
  priority: prioritySchema,
  status: assignmentStatusSchema,
  assignedTo: optionalTextSchema,
  createdBy: idSchema,
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

export const resourceSchema = z.object({
  id: idSchema,
  classId: idSchema,
  title: textSchema,
  subject: optionalTextSchema,
  type: resourceTypeSchema,
  url: z.string().url().optional().nullable(),
  description: optionalTextSchema,
  tags: z.array(z.string().trim()).default([]),
  uploadedBy: idSchema,
  createdAt: dateStringSchema,
});

export const announcementSchema = z.object({
  id: idSchema,
  classId: idSchema,
  title: textSchema,
  content: textSchema,
  importance: announcementImportanceSchema,
  pinned: z.boolean(),
  validUntil: z.string().optional().nullable(),
  createdBy: idSchema,
  createdAt: dateStringSchema,
});

export const pollSchema = z.object({
  id: idSchema,
  classId: idSchema,
  title: textSchema,
  description: optionalTextSchema,
  type: pollTypeSchema,
  options: z.array(textSchema).min(1),
  startsAt: dateStringSchema,
  endsAt: dateStringSchema,
  anonymous: z.boolean(),
  multipleChoice: z.boolean(),
  resultVisibility: pollResultVisibilitySchema,
  status: pollStatusSchema,
  createdBy: idSchema,
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

export const pollOptionSchema = z.object({
  id: idSchema,
  pollId: idSchema,
  label: textSchema,
  sortOrder: z.number().int().min(0),
  createdAt: dateStringSchema,
});

export const pollVoteSchema = z.object({
  id: idSchema,
  pollId: idSchema,
  userId: idSchema,
  selectedOptionIds: z.array(idSchema),
  ratingValue: z.number().min(1).max(5).optional().nullable(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

export const notificationSchema = z.object({
  id: idSchema,
  classId: idSchema,
  userId: idSchema,
  type: notificationTypeSchema,
  title: textSchema,
  body: textSchema,
  readAt: z.string().optional().nullable(),
  createdAt: dateStringSchema,
});

export const loginFormSchema = z.object({
  email: z.string().email("Bitte eine gueltige E-Mail-Adresse angeben."),
  password: z.string().min(8, "Das Passwort braucht mindestens 8 Zeichen."),
});

export const registerFormSchema = loginFormSchema.extend({
  fullName: textSchema,
});

export const createClassFormSchema = z.object({
  name: textSchema,
  school: textSchema,
  schoolYear: textSchema,
  role: userRoleSchema,
});

export const joinClassFormSchema = z.object({
  invitationCode: z
    .string()
    .trim()
    .min(6, "Der Einladungscode ist zu kurz.")
    .max(12, "Der Einladungscode ist zu lang."),
  role: userRoleSchema,
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type CreateClassFormValues = z.infer<typeof createClassFormSchema>;
export type JoinClassFormValues = z.infer<typeof joinClassFormSchema>;

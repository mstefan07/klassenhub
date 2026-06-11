"use client";

import type {
  CreateClassFormValues,
  JoinClassFormValues,
} from "@/schemas";
import { generateInvitationCode, normalizeInvitationCode } from "@/lib/calculations";
import { getBrowserSupabaseClient } from "./client";

export async function createClassWithMembership(
  values: CreateClassFormValues,
  userId: string,
) {
  const supabase = getBrowserSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }

  const invitationCode = generateInvitationCode();
  const now = new Date().toISOString();

  const { data: classRow, error: classError } = await supabase
    .from("classes")
    .insert({
      name: values.name,
      school: values.school,
      school_year: values.schoolYear,
      invitation_code: invitationCode,
      created_by: userId,
      created_at: now,
      updated_at: now,
    })
    .select("id, invitation_code")
    .single();

  if (classError) {
    throw classError;
  }

  const classId = classRow.id as string;

  const { error: memberError } = await supabase.from("class_members").insert({
    class_id: classId,
    user_id: userId,
    role: values.role,
    joined_at: now,
  });

  if (memberError) {
    throw memberError;
  }

  const { error: invitationError } = await supabase.from("invitations").insert({
    class_id: classId,
    code: classRow.invitation_code,
    active: true,
    used_count: 0,
    created_by: userId,
    created_at: now,
  });

  if (invitationError) {
    throw invitationError;
  }

  return classRow;
}

export async function joinClassWithInvitation(
  values: JoinClassFormValues,
  userId: string,
) {
  const supabase = getBrowserSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }

  const code = normalizeInvitationCode(values.invitationCode);

  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("id, class_id, active, expires_at, max_uses, used_count")
    .eq("code", code)
    .eq("active", true)
    .single();

  if (invitationError) {
    throw invitationError;
  }

  const expiresAt = invitation.expires_at
    ? new Date(invitation.expires_at as string)
    : null;

  if (expiresAt && expiresAt.getTime() < Date.now()) {
    throw new Error("Der Einladungscode ist abgelaufen.");
  }

  if (
    invitation.max_uses !== null &&
    Number(invitation.used_count) >= Number(invitation.max_uses)
  ) {
    throw new Error("Der Einladungscode wurde bereits vollstaendig genutzt.");
  }

  const { error: memberError } = await supabase.from("class_members").insert({
    class_id: invitation.class_id,
    user_id: userId,
    role: values.role,
    joined_at: new Date().toISOString(),
  });

  if (memberError) {
    throw memberError;
  }

  await supabase
    .from("invitations")
    .update({ used_count: Number(invitation.used_count) + 1 })
    .eq("id", invitation.id);

  return invitation.class_id as string;
}

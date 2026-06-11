"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { PageHeading } from "@/components/layout/page-heading";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import {
  createClassWithMembership,
  joinClassWithInvitation,
} from "@/lib/supabase/database";
import {
  createClassFormSchema,
  joinClassFormSchema,
  type CreateClassFormValues,
  type JoinClassFormValues,
} from "@/schemas";
import type { UserRole } from "@/types";

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "student", label: "Schüler/in" },
  { value: "class_representative", label: "Klassensprecher/in" },
  { value: "teacher", label: "Lehrkraft" },
  { value: "admin", label: "Admin" },
];

async function getCurrentUserId() {
  const supabase = getBrowserSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("Bitte melde dich zuerst an.");
  }

  return user.id;
}

export function ClassSetupPanel() {
  const [createMessage, setCreateMessage] = useState<string | null>(null);
  const [joinMessage, setJoinMessage] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  const createForm = useForm<CreateClassFormValues>({
    resolver: zodResolver(createClassFormSchema),
    defaultValues: {
      name: "",
      school: "",
      schoolYear: "",
      role: "admin",
    },
  });

  const joinForm = useForm<JoinClassFormValues>({
    resolver: zodResolver(joinClassFormSchema),
    defaultValues: {
      invitationCode: "",
      role: "student",
    },
  });

  async function handleCreate(values: CreateClassFormValues) {
    setCreateError(null);
    setCreateMessage(null);

    try {
      const userId = await getCurrentUserId();
      const classRow = await createClassWithMembership(values, userId);
      setCreateMessage(
        `Klasse erstellt. Einladungscode: ${classRow.invitation_code}`,
      );
      createForm.reset({ name: "", school: "", schoolYear: "", role: "admin" });
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Klasse konnte nicht erstellt werden.",
      );
    }
  }

  async function handleJoin(values: JoinClassFormValues) {
    setJoinError(null);
    setJoinMessage(null);

    try {
      const userId = await getCurrentUserId();
      await joinClassWithInvitation(values, userId);
      setJoinMessage("Du bist der Klasse beigetreten.");
      joinForm.reset({ invitationCode: "", role: "student" });
    } catch (error) {
      setJoinError(
        error instanceof Error ? error.message : "Beitritt war nicht möglich.",
      );
    }
  }

  return (
    <div>
      <PageHeading
        title="Meine Klasse"
        description="Erstelle eine Klasse oder tritt per Einladungscode bei. Mitglieder, Rollen und Einladungen werden über Supabase gespeichert."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="bg-gradient-brand flex size-10 items-center justify-center rounded-lg text-white">
                <Users className="size-5" />
              </span>
              <div>
                <CardTitle>Klasse erstellen</CardTitle>
                <CardDescription>
                  Für FOS, Berufsschule, Schulklasse oder Azubi-Gruppe.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={createForm.handleSubmit(handleCreate)}
            >
              <div className="space-y-2">
                <Label htmlFor="name">Klassenname</Label>
                <Input
                  id="name"
                  placeholder="z. B. FOS 12 Wirtschaftsinformatik"
                  {...createForm.register("name")}
                />
                {createForm.formState.errors.name ? (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.name.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">Schule/Berufsschule</Label>
                <Input id="school" {...createForm.register("school")} />
                {createForm.formState.errors.school ? (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.school.message}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="schoolYear">Schuljahr</Label>
                  <Input id="schoolYear" {...createForm.register("schoolYear")} />
                  {createForm.formState.errors.schoolYear ? (
                    <p className="text-sm text-destructive">
                      {createForm.formState.errors.schoolYear.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rolle</Label>
                  <Select id="role" {...createForm.register("role")}>
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              {createError ? (
                <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {createError}
                </p>
              ) : null}
              {createMessage ? (
                <p className="rounded-md bg-success/10 p-3 text-sm text-success">
                  {createMessage}
                </p>
              ) : null}
              <Button
                disabled={!isSupabaseConfigured || createForm.formState.isSubmitting}
                type="submit"
              >
                Klasse erstellen
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Per Einladungscode beitreten</CardTitle>
            <CardDescription>
              Nutze den Code deiner Klasse und wähle deine Rolle.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={joinForm.handleSubmit(handleJoin)}
            >
              <div className="space-y-2">
                <Label htmlFor="invitationCode">Einladungscode</Label>
                <Input
                  id="invitationCode"
                  placeholder="ABCD2345"
                  {...joinForm.register("invitationCode")}
                />
                {joinForm.formState.errors.invitationCode ? (
                  <p className="text-sm text-destructive">
                    {joinForm.formState.errors.invitationCode.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinRole">Rolle</Label>
                <Select id="joinRole" {...joinForm.register("role")}>
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </Select>
              </div>
              {joinError ? (
                <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {joinError}
                </p>
              ) : null}
              {joinMessage ? (
                <p className="rounded-md bg-success/10 p-3 text-sm text-success">
                  {joinMessage}
                </p>
              ) : null}
              <Button
                disabled={!isSupabaseConfigured || joinForm.formState.isSubmitting}
                type="submit"
              >
                Klasse beitreten
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { registerFormSchema, type RegisterFormValues } from "@/schemas";
import { SupabaseSetupNotice } from "./supabase-setup-notice";

export function RegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null);
    setMessage(null);

    const supabase = getBrowserSupabaseClient();

    if (!supabase) {
      setFormError("Supabase ist noch nicht konfiguriert.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
        },
      },
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    setMessage("Registrierung angelegt. Bitte pruefe ggf. deine E-Mails.");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {!isSupabaseConfigured ? <SupabaseSetupNotice /> : null}
      <Card>
        <CardContent className="p-5">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="fullName">Name</Label>
              <Input
                id="fullName"
                autoComplete="name"
                placeholder="Max Mustermann"
                {...register("fullName")}
              />
              {errors.fullName ? (
                <p className="text-sm text-destructive">
                  {errors.fullName.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="du@beispiel.de"
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password ? (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              ) : null}
            </div>
            {formError ? (
              <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {formError}
              </p>
            ) : null}
            {message ? (
              <p className="rounded-md bg-success/10 p-3 text-sm text-success">
                {message}
              </p>
            ) : null}
            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Konto wird angelegt..." : "Kostenlos starten"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground">
        Bereits registriert?{" "}
        <Link className="font-semibold text-primary" href="/login">
          Einloggen
        </Link>
      </p>
    </div>
  );
}

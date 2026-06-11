import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Einloggen"
      description="Melde dich an, um deine Klasse zu organisieren."
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

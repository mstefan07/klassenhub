import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Registrierung",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Kostenlos starten"
      description="Erstelle dein Konto und richte danach deine Klasse ein."
    >
      <RegisterForm />
    </AuthShell>
  );
}

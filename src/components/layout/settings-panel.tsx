import { CheckCircle2, ShieldCheck, SlidersHorizontal, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeading } from "@/components/layout/page-heading";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const roles = [
  ["student", "sehen und abstimmen"],
  ["class_representative", "Abstimmungen, Ankündigungen, Pins"],
  ["teacher", "Termine, Aufgaben, Ankündigungen"],
  ["admin", "Klasse, Mitglieder, Rollen"],
] as const;

const preparedNotifications = [
  "nächste Klausur",
  "Aufgabe bald fällig",
  "neue Ankündigung",
  "aktive Abstimmung",
  "Projektdeadline",
] as const;

export function SettingsPanel() {
  return (
    <div>
      <PageHeading
        title="Einstellungen"
        description="Projektstatus, Rollenmodell und vorbereitete Hinweise für den MVP."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Supabase</CardTitle>
            <CardDescription>
              Auth und Datenbank werden über öffentliche Anon-Keys verbunden.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 rounded-lg bg-secondary p-4">
              {isSupabaseConfigured ? (
                <CheckCircle2 className="size-5 text-success" />
              ) : (
                <XCircle className="size-5 text-warning" />
              )}
              <div>
                <p className="font-semibold">
                  {isSupabaseConfigured ? "Konfiguriert" : "Setup offen"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isSupabaseConfigured
                    ? "Die App kann Supabase Auth und Tabellen verwenden."
                    : "Der Build bleibt stabil. Trage die Werte aus Supabase in .env.local ein."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rollen</CardTitle>
            <CardDescription>
              Rechte sind in der Permission-Schicht gekapselt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {roles.map(([role, description]) => (
              <div
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                key={role}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-4 text-primary" />
                  <span className="text-sm font-semibold">{role}</span>
                </div>
                <span className="text-right text-sm text-muted-foreground">
                  {description}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>In-App-Hinweise</CardTitle>
            <CardDescription>
              Push Notifications werden im MVP nicht vorgetäuscht.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {preparedNotifications.map((notification) => (
              <Badge key={notification} variant="secondary">
                <SlidersHorizontal className="mr-1 size-3" />
                {notification}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

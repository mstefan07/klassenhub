"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarDays,
  CheckSquare,
  Files,
  GraduationCap,
  Home,
  Megaphone,
  Settings,
  Users,
  Vote,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const navigation = [
  { title: "Dashboard", href: "/app", icon: Home },
  { title: "Meine Klasse", href: "/app/classes", icon: Users },
  { title: "Termine", href: "/app/events", icon: CalendarDays },
  { title: "Aufgaben", href: "/app/tasks", icon: CheckSquare },
  { title: "Abstimmungen", href: "/app/polls", icon: Vote },
  { title: "Dateien & Links", href: "/app/resources", icon: Files },
  { title: "Ankündigungen", href: "/app/announcements", icon: Megaphone },
  { title: "Einstellungen", href: "/app/settings", icon: Settings },
] as const;

const mobileNavigation = navigation.slice(0, 5);

function isActive(pathname: string, href: string) {
  if (href === "/app") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-svh bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-card px-4 py-5 lg:flex lg:flex-col">
        <Link className="flex items-center gap-2 px-2 font-semibold" href="/app">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          KlassenHub
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                )}
                href={item.href}
                key={item.href}
              >
                <item.icon className="size-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between px-2">
            <Badge variant={isSupabaseConfigured ? "success" : "warning"}>
              {isSupabaseConfigured ? "Verbunden" : "Setup offen"}
            </Badge>
            <ThemeToggle />
          </div>
          <LogoutButton />
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                KlassenHub
              </p>
              <h1 className="text-lg font-semibold">Organizer</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button aria-label="Hinweise" size="icon" type="button" variant="ghost">
                <Bell />
              </Button>
              <div className="lg:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-10">
          {!isSupabaseConfigured ? (
            <div className="mb-6">
              <SupabaseSetupNotice />
            </div>
          ) : null}
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-1 py-2">
          {mobileNavigation.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium text-muted-foreground",
                  active && "bg-secondary text-primary",
                )}
                href={item.href}
                key={item.href}
              >
                <item.icon className="size-5" />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

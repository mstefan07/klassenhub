"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Bell,
  CalendarDays,
  CheckSquare,
  Files,
  GraduationCap,
  Home,
  Megaphone,
  MoreHorizontal,
  Settings,
  Users,
  Vote,
  X,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useClassMemberships } from "@/hooks/use-class-memberships";
import { activeRouteIndicator, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavSection = {
  label: string | null;
  items: NavItem[];
};

const navigationSections: NavSection[] = [
  {
    label: "Übersicht",
    items: [
      { title: "Dashboard", href: "/app", icon: Home },
      { title: "Meine Klasse", href: "/app/classes", icon: Users },
    ],
  },
  {
    label: "Organisation",
    items: [
      { title: "Termine", href: "/app/events", icon: CalendarDays },
      { title: "Aufgaben", href: "/app/tasks", icon: CheckSquare },
      { title: "Abstimmungen", href: "/app/polls", icon: Vote },
      { title: "Dateien & Links", href: "/app/resources", icon: Files },
      { title: "Ankündigungen", href: "/app/announcements", icon: Megaphone },
    ],
  },
  {
    label: null,
    items: [{ title: "Einstellungen", href: "/app/settings", icon: Settings }],
  },
];

const allNavigationItems = navigationSections.flatMap((section) => section.items);

const mobilePrimaryNavigation = [
  { title: "Dashboard", href: "/app", icon: Home },
  { title: "Termine", href: "/app/events", icon: CalendarDays },
  { title: "Aufgaben", href: "/app/tasks", icon: CheckSquare },
  { title: "Abstimmen", href: "/app/polls", icon: Vote },
] as const;

const mobileMoreNavigation = [
  { title: "Meine Klasse", href: "/app/classes", icon: Users },
  { title: "Dateien & Links", href: "/app/resources", icon: Files },
  { title: "Ankündigungen", href: "/app/announcements", icon: Megaphone },
  { title: "Einstellungen", href: "/app/settings", icon: Settings },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/app") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

function currentPageTitle(pathname: string) {
  const match = allNavigationItems
    .filter((item) => isActive(pathname, item.href))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return match?.title ?? "Dashboard";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { selectedClass } = useClassMemberships();
  const [moreOpen, setMoreOpen] = useState(false);

  const moreActive = mobileMoreNavigation.some((item) =>
    isActive(pathname, item.href),
  );

  return (
    <div className="min-h-svh bg-background">
      {/* Sidebar (Desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-border bg-surface px-4 py-5 lg:flex">
        <Link className="flex items-center gap-2.5 px-2 font-semibold" href="/app">
          <span className="bg-gradient-brand flex size-9 items-center justify-center rounded-lg text-white shadow-soft">
            <GraduationCap className="size-5" />
          </span>
          KlassenHub
        </Link>

        <nav className="mt-7 flex flex-1 flex-col gap-5 overflow-y-auto">
          {navigationSections.map((section, sectionIndex) => (
            <div key={section.label ?? `section-${sectionIndex}`}>
              {section.label ? (
                <p className="mb-1.5 px-3 font-mono text-[10px] font-medium uppercase tracking-widest text-faint-foreground">
                  {section.label}
                </p>
              ) : null}
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const active = isActive(pathname, item.href);

                  return (
                    <Link
                      className={cn(
                        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-secondary/60 hover:text-foreground",
                        active && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
                      )}
                      href={item.href}
                      key={item.href}
                    >
                      {active ? (
                        <motion.span
                          aria-hidden
                          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary"
                          layoutId="sidebar-indicator"
                          transition={reduceMotion ? { duration: 0 } : activeRouteIndicator}
                        />
                      ) : null}
                      <item.icon className="size-4" />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-3 border-t border-border pt-4">
          {!isSupabaseConfigured ? (
            <div className="px-2">
              <Badge withDot variant="warning">
                Setup offen
              </Badge>
            </div>
          ) : null}
          <div className="flex items-center justify-between px-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight">
                {currentPageTitle(pathname)}
              </h1>
              {selectedClass ? (
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {selectedClass.name} · {selectedClass.schoolYear}
                </p>
              ) : (
                <p className="text-[11px] text-faint-foreground">KlassenHub</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Button aria-label="Hinweise" size="icon" type="button" variant="ghost">
                <Bell />
              </Button>
              <div className="lg:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:pb-10">
          {!isSupabaseConfigured ? (
            <div className="mb-6">
              <SupabaseSetupNotice />
            </div>
          ) : null}
          {children}
        </main>
      </div>

      {/* „Mehr"-Sheet (Mobile) */}
      <AnimatePresence>
        {moreOpen ? (
          <>
            <motion.button
              animate={{ opacity: 1 }}
              aria-label="Menü schließen"
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              type="button"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              animate={{ y: 0 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-border bg-surface pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-overlay lg:hidden"
              exit={{ y: "100%" }}
              initial={{ y: "100%" }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.3, ease: EASE_OUT }
              }
            >
              <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-border-strong" />
              <div className="flex items-center justify-between px-5 pb-1 pt-3">
                <p className="text-sm font-semibold">Mehr</p>
                <Button
                  aria-label="Schließen"
                  size="icon"
                  type="button"
                  variant="ghost"
                  onClick={() => setMoreOpen(false)}
                >
                  <X />
                </Button>
              </div>
              <nav className="grid gap-1 px-3 pb-2">
                {mobileMoreNavigation.map((item) => {
                  const active = isActive(pathname, item.href);

                  return (
                    <Link
                      className={cn(
                        "flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground",
                        active && "bg-primary/10 text-primary",
                      )}
                      href={item.href}
                      key={item.href}
                      onClick={() => setMoreOpen(false)}
                    >
                      <item.icon className="size-5" />
                      {item.title}
                    </Link>
                  );
                })}
                <div className="mt-1 flex items-center justify-between border-t border-border px-3 pt-3">
                  <ThemeToggle />
                  <LogoutButton />
                </div>
              </nav>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/85 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5 gap-1 py-1.5">
          {mobilePrimaryNavigation.map((item) => {
            const active = isActive(pathname, item.href) && !moreOpen;

            return (
              <Link
                className={cn(
                  "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-medium text-muted-foreground transition-colors",
                  active && "text-primary",
                )}
                href={item.href}
                key={item.href}
              >
                {active ? (
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-2 inset-y-1 rounded-lg bg-primary/10"
                    layoutId="bottomnav-pill"
                    transition={reduceMotion ? { duration: 0 } : activeRouteIndicator}
                  />
                ) : null}
                <motion.span
                  animate={reduceMotion ? undefined : { scale: active ? 1 : 0.92 }}
                  className="relative"
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                >
                  <item.icon className="size-5" />
                </motion.span>
                <span className="relative truncate">{item.title}</span>
              </Link>
            );
          })}
          <button
            className={cn(
              "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-medium text-muted-foreground transition-colors",
              (moreActive || moreOpen) && "text-primary",
            )}
            type="button"
            onClick={() => setMoreOpen((open) => !open)}
          >
            {moreActive || moreOpen ? (
              <motion.span
                aria-hidden
                className="absolute inset-x-2 inset-y-1 rounded-lg bg-primary/10"
                layoutId="bottomnav-pill"
                transition={reduceMotion ? { duration: 0 } : activeRouteIndicator}
              />
            ) : null}
            <MoreHorizontal className="relative size-5" />
            <span className="relative truncate">Mehr</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

"use client";

import { motion } from "motion/react";
import {
  CalendarDays,
  CheckSquare,
  Files,
  Home,
  Megaphone,
  Vote,
} from "lucide-react";
import { pollBarAnimation } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Eigene Visuals für die Landingpage – komplett aus CSS/SVG gebaut,
 * keine externen Bilder. Der Hero ist immer dunkel, daher nutzen
 * Hero-Visuals fixe Dark-Werte; Sektions-Visuals nutzen Theme-Tokens.
 */

/** Hintergrund-Canvas des Heros: Radial-Glows + dezentes Grid. */
export function ClassHubHeroVisual() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(640px at 18% -10%, rgba(45,216,198,0.14), transparent 70%), radial-gradient(820px at 85% 20%, rgba(110,124,255,0.12), transparent 70%)",
        }}
      />
      <div className="bg-grid-fade absolute inset-0" />
    </div>
  );
}

/* --- Hero: App-Preview ------------------------------------------------ */

const heroDark = {
  surface: "#0e1422",
  card: "#121829",
  cardElevated: "#18203a",
  border: "#232c44",
  secondary: "#1a2236",
  text: "#f2f5fa",
  muted: "#8b95ab",
  teal: "#2dd8c6",
  indigo: "#6e7cff",
} as const;

function PreviewBar({
  width,
  color = heroDark.secondary,
  className,
}: {
  width: string;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn("block h-1.5 rounded-full", className)}
      style={{ width, backgroundColor: color }}
    />
  );
}

/** Browser-Frame mit Mini-Dashboard + schwebenden Karten. */
export function AppPreviewVisual() {
  const navIcons = [Home, CalendarDays, CheckSquare, Vote, Files, Megaphone];

  return (
    <div aria-hidden className="relative mx-auto w-full max-w-3xl select-none">
      {/* Browser-Frame */}
      <div
        className="overflow-hidden rounded-2xl border shadow-overlay"
        style={{
          backgroundColor: heroDark.surface,
          borderColor: "rgba(255,255,255,0.10)",
        }}
      >
        {/* Fensterleiste */}
        <div
          className="flex items-center gap-1.5 border-b px-4 py-3"
          style={{ borderColor: heroDark.border }}
        >
          {["#f87171", "#fbbf24", "#34d399"].map((dot) => (
            <span
              className="size-2.5 rounded-full opacity-80"
              key={dot}
              style={{ backgroundColor: dot }}
            />
          ))}
          <span
            className="mx-auto hidden rounded-md px-8 py-1 font-mono text-[10px] sm:block"
            style={{ backgroundColor: heroDark.secondary, color: heroDark.muted }}
          >
            klassenhub.app
          </span>
        </div>

        <div className="flex">
          {/* Mini-Sidebar */}
          <div
            className="hidden w-36 shrink-0 flex-col gap-1 border-r p-3 sm:flex"
            style={{ borderColor: heroDark.border }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className="size-5 rounded-md"
                style={{
                  background: `linear-gradient(135deg, ${heroDark.teal}, ${heroDark.indigo})`,
                }}
              />
              <PreviewBar color={heroDark.cardElevated} width="60%" />
            </div>
            {navIcons.map((NavIcon, index) => (
              <div
                className="flex items-center gap-2 rounded-md px-2 py-1.5"
                key={index}
                style={
                  index === 0
                    ? { backgroundColor: "rgba(45,216,198,0.12)" }
                    : undefined
                }
              >
                <NavIcon
                  className="size-3"
                  style={{
                    color: index === 0 ? heroDark.teal : heroDark.muted,
                  }}
                />
                <PreviewBar
                  color={index === 0 ? "rgba(45,216,198,0.4)" : heroDark.secondary}
                  width={`${56 - index * 4}%`}
                />
              </div>
            ))}
          </div>

          {/* Mini-Dashboard */}
          <div className="flex-1 space-y-3 p-4">
            <div className="grid grid-cols-4 gap-2">
              {[CalendarDays, CheckSquare, Vote, Megaphone].map((StatIcon, index) => (
                <div
                  className="rounded-lg border p-2.5"
                  key={index}
                  style={{
                    backgroundColor: heroDark.card,
                    borderColor: heroDark.border,
                  }}
                >
                  <StatIcon className="size-3" style={{ color: heroDark.teal }} />
                  <p
                    className="mt-2 font-mono text-sm font-semibold leading-none"
                    style={{ color: heroDark.text }}
                  >
                    {[3, 5, 2, 1][index]}
                  </p>
                </div>
              ))}
            </div>
            <div
              className="space-y-2 rounded-lg border p-3"
              style={{
                backgroundColor: heroDark.card,
                borderColor: heroDark.border,
              }}
            >
              <PreviewBar color={heroDark.cardElevated} width="40%" />
              {["#6e7cff", "#34d399", "#fbbf24"].map((accent, index) => (
                <div
                  className="flex items-center gap-2 rounded-md border p-2"
                  key={accent}
                  style={{ borderColor: heroDark.border }}
                >
                  <span
                    className="h-5 w-[3px] rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                  <PreviewBar width={`${64 - index * 12}%`} />
                  <PreviewBar
                    className="ml-auto"
                    color={heroDark.cardElevated}
                    width="14%"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schwebende Poll-Karte */}
      <div
        className="animate-kh-float absolute -right-3 -top-8 hidden w-48 rounded-xl border p-3 shadow-overlay sm:block"
        style={{
          backgroundColor: heroDark.cardElevated,
          borderColor: "rgba(255,255,255,0.10)",
        }}
      >
        <div className="flex items-center gap-2">
          <Vote className="size-3.5" style={{ color: heroDark.teal }} />
          <PreviewBar color={heroDark.secondary} width="55%" />
        </div>
        <div className="mt-3 space-y-2">
          {[68, 32].map((pct, index) => (
            <div
              className="h-1.5 overflow-hidden rounded-full"
              key={pct}
              style={{ backgroundColor: heroDark.secondary }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background:
                    index === 0
                      ? `linear-gradient(90deg, ${heroDark.teal}, ${heroDark.indigo})`
                      : "rgba(45,216,198,0.35)",
                }}
              />
            </div>
          ))}
        </div>
        <p
          className="mt-2 font-mono text-[10px]"
          style={{ color: heroDark.muted }}
        >
          21 von 26 Stimmen
        </p>
      </div>

      {/* Schwebende Task-Karte */}
      <div
        className="animate-kh-float-delayed absolute -bottom-6 -left-3 hidden w-44 rounded-xl border p-3 shadow-overlay sm:block"
        style={{
          backgroundColor: heroDark.cardElevated,
          borderColor: "rgba(255,255,255,0.10)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex size-4 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(52,211,153,0.18)" }}
          >
            <svg className="size-2.5" fill="none" viewBox="0 0 10 10">
              <path
                d="M2 5.2 4.2 7.4 8 3"
                stroke="#34d399"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </span>
          <PreviewBar color={heroDark.secondary} width="60%" />
        </div>
        <p className="mt-2 font-mono text-[10px]" style={{ color: heroDark.muted }}>
          Mathe · Fr, 13. Jun
        </p>
      </div>
    </div>
  );
}

/* --- Sektionen: Poll- und Task-Visuals (Theme-Tokens) ------------------ */

/** Funktionsfähig aussehende Abstimmungs-Karte mit animierten Balken. */
export function PollVisual() {
  const rows = [
    { label: "Mo, 23. Juni", votes: 14, percentage: 56, winner: true },
    { label: "Di, 24. Juni", votes: 8, percentage: 32, winner: false },
    { label: "Fr, 27. Juni", votes: 3, percentage: 12, winner: false },
  ];

  return (
    <div aria-hidden className="rounded-xl border border-border bg-card p-5 shadow-raised">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">Termin für die Kursfahrt-Besprechung</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Terminfindung · endet in 2 Tagen
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-success/12 px-2 py-0.5 text-xs font-semibold text-success">
          <span className="size-1.5 rounded-full bg-current" />
          Aktiv
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((row, index) => (
          <div className="space-y-1.5" key={row.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span className={cn(row.winner && "font-semibold")}>{row.label}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {row.votes} · {row.percentage}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  row.winner ? "bg-gradient-brand" : "bg-primary/35",
                )}
                {...pollBarAnimation(row.percentage, index)}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 font-mono text-xs text-muted-foreground">
        Beteiligung 81% · 25 von 31 Mitgliedern
      </p>
    </div>
  );
}

/** Aufgeräumte Task-Karte – der Kontrast zum Chat-Chaos. */
export function TaskPlanningVisual() {
  return (
    <div aria-hidden className="rounded-xl border border-border bg-card p-5 shadow-raised">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="h-9 w-[3px] rounded-full"
          style={{ backgroundColor: "#6e7cff" }}
        />
        <div>
          <p className="font-semibold">Mathe-Hausaufgabe S. 142, Nr. 3–7</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <span
              className="rounded px-1.5 py-0.5 font-medium"
              style={{ backgroundColor: "#6e7cff1f", color: "#6e7cff" }}
            >
              Mathe
            </span>{" "}
            · <span className="font-mono text-warning">Morgen fällig</span>
          </p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-info/12 px-2 py-0.5 text-xs font-semibold text-info">
          <span className="size-1.5 rounded-full bg-current" />
          Offen
        </span>
      </div>
    </div>
  );
}

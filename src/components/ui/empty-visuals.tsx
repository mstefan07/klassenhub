import { Link2, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Eigene CSS/SVG-Visuals für Premium Empty States.
 * Nur Design-Tokens, keine externen Assets, alle dekorativ (aria-hidden).
 */

function VisualFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative flex h-28 w-44 items-center justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Keine Klasse: überlappende Avatare + pulsierendes Plus. */
export function NoClassVisual() {
  return (
    <VisualFrame>
      <div className="flex items-center">
        {[
          "bg-role-student/20 text-role-student",
          "bg-role-rep/20 text-role-rep",
          "bg-role-teacher/20 text-role-teacher",
        ].map((tone, index) => (
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-full border-2 border-background text-sm font-semibold",
              tone,
              index > 0 && "-ml-3",
            )}
            key={tone}
          >
            {["A", "B", "C"][index]}
          </div>
        ))}
        <div className="animate-kh-pulse-soft -ml-3 flex size-12 items-center justify-center rounded-full border-2 border-dashed border-primary/50 bg-primary/10 text-lg font-semibold text-primary">
          +
        </div>
      </div>
    </VisualFrame>
  );
}

/** Keine Aufgaben: Karten-Stack mit gezeichnetem Check. */
export function NoTasksVisual() {
  return (
    <VisualFrame>
      <div className="w-40 space-y-2">
        {[0, 1, 2].map((index) => (
          <div
            className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2 shadow-soft"
            key={index}
          >
            <svg
              className={cn(
                "size-4 shrink-0",
                index === 0 ? "text-success" : "text-border-strong",
              )}
              fill="none"
              viewBox="0 0 16 16"
            >
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              {index === 0 ? (
                <path
                  d="M5 8.2 7.2 10.4 11 6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              ) : null}
            </svg>
            <div
              className={cn(
                "h-1.5 rounded-full bg-secondary",
                ["w-24", "w-16", "w-20"][index],
              )}
            />
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

/** Keine Termine: Kalenderblatt + leere Slots. */
export function NoEventsVisual() {
  return (
    <VisualFrame>
      <div className="flex items-center gap-3">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
          <div className="bg-gradient-brand h-2 w-14" />
          <div className="px-3 py-2 text-center">
            <p className="font-mono text-lg font-semibold leading-none">13</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Jun
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex h-7 w-24 items-center gap-2 rounded-lg border border-dashed border-border px-2">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="h-1.5 w-12 rounded-full bg-secondary" />
          </div>
          <div className="h-7 w-24 rounded-lg border border-dashed border-border" />
        </div>
      </div>
    </VisualFrame>
  );
}

/** Keine Abstimmungen: Ergebnisbalken, der mittlere füllt sich langsam. */
export function NoPollsVisual() {
  return (
    <VisualFrame>
      <div className="w-40 space-y-2.5 rounded-lg border border-border bg-card p-3 shadow-soft">
        {[
          { width: "35%", animate: false },
          { width: "64%", animate: true },
          { width: "22%", animate: false },
        ].map((bar, index) => (
          <div
            className="h-2 overflow-hidden rounded-full bg-secondary"
            key={index}
          >
            <div
              className={cn(
                "h-full rounded-full",
                bar.animate
                  ? "bg-gradient-brand animate-kh-bar-fill"
                  : "bg-primary/30",
              )}
              style={bar.animate ? undefined : { width: bar.width }}
            />
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

/** Keine Dateien: Ordner mit herausschauender Link-Karte. */
export function NoFilesVisual() {
  return (
    <VisualFrame>
      <div className="relative">
        <div className="animate-kh-float-delayed absolute -top-5 left-7 flex h-9 w-24 items-center gap-2 rounded-lg border border-border bg-card px-2.5 shadow-raised">
          <Link2 className="size-3.5 text-brand-indigo" />
          <span className="h-1.5 w-12 rounded-full bg-secondary" />
        </div>
        <svg className="h-16 w-24 text-border-strong" fill="none" viewBox="0 0 96 64">
          <path
            d="M4 14a6 6 0 0 1 6-6h22l8 9h42a6 6 0 0 1 6 6v31a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V14Z"
            fill="var(--secondary)"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
    </VisualFrame>
  );
}

/** Keine Ankündigungen: Megafon mit auslaufenden Ringen. */
export function NoAnnouncementsVisual() {
  return (
    <VisualFrame>
      <div className="relative flex items-center justify-center">
        <span className="animate-kh-ring-out absolute size-20 rounded-full border border-primary/25" />
        <span
          className="animate-kh-ring-out absolute size-20 rounded-full border border-primary/15"
          style={{ animationDelay: "1s" }}
        />
        <div className="relative flex size-14 items-center justify-center rounded-full bg-primary/12 text-primary">
          <Megaphone className="size-6" />
        </div>
      </div>
    </VisualFrame>
  );
}

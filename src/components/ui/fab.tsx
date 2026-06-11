"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Floating Action Button für Mobile: springt zum Create-Formular
 * der Seite (Anker), liegt über der Bottom-Navigation.
 */
export function Fab({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      aria-label={label}
      className={cn(
        "fixed right-4 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-overlay transition-transform duration-150 active:scale-95 lg:hidden",
        className,
      )}
      href={href}
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 5.25rem)" }}
    >
      <Plus className="size-6" />
    </a>
  );
}

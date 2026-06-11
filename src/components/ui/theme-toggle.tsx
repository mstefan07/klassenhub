"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

function subscribeNoop() {
  return () => {};
}

/** True erst nach der Hydration – verhindert Server/Client-Mismatch beim Theme-Icon. */
function useMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      aria-label={isDark ? "Light Mode aktivieren" : "Dark Mode aktivieren"}
      size="icon"
      type="button"
      variant="ghost"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? (
        isDark ? (
          <Sun />
        ) : (
          <Moon />
        )
      ) : (
        <span aria-hidden className="size-4 rounded-full bg-secondary" />
      )}
    </Button>
  );
}

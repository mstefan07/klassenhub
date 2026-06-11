import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-svh overflow-hidden bg-background">
      {/* Dezenter Glow hinter dem Formular */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(560px at 50% 32%, color-mix(in srgb, var(--primary) 9%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <Link className="flex items-center gap-2.5 font-semibold" href="/">
            <span className="bg-gradient-brand flex size-9 items-center justify-center rounded-lg text-white shadow-soft">
              <GraduationCap className="size-5" />
            </span>
            KlassenHub
          </Link>
          <ThemeToggle />
        </header>
        <section className="grid flex-1 place-items-center py-10">
          <div className="animate-kh-fade-up w-full max-w-md">
            <div className="mb-7 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

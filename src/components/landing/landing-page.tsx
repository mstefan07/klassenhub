"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Bell,
  CalendarDays,
  CheckSquare,
  FileText,
  GraduationCap,
  ShieldCheck,
  Users,
  Vote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const features = [
  {
    icon: CalendarDays,
    title: "Termine & Klausuren",
    text: "Wichtige Daten, Raum, Fach und Prioritaet bleiben an einem Ort.",
  },
  {
    icon: CheckSquare,
    title: "Aufgaben",
    text: "Offene To-dos, Deadlines und Status sind schnell erfassbar.",
  },
  {
    icon: FileText,
    title: "Dateien & Links",
    text: "Materialien, Notizen und relevante Links werden sauber abgelegt.",
  },
  {
    icon: Vote,
    title: "Abstimmungen",
    text: "Klassensprecher koennen Entscheidungen strukturiert vorbereiten.",
  },
] as const;

const faq = [
  {
    question: "Ist KlassenHub ein Chat?",
    answer:
      "Nein. Das MVP fokussiert Organisation, Aufgaben, Termine, Ankuendigungen und Abstimmungen.",
  },
  {
    question: "Kann eine Klasse per Code beitreten?",
    answer:
      "Ja. Klassen koennen Einladungscodes nutzen, sobald Supabase eingerichtet ist.",
  },
  {
    question: "Welche Rollen gibt es?",
    answer:
      "Student, Klassensprecher, Lehrkraft und Admin mit getrennten Rechten.",
  },
  {
    question: "Funktioniert der Build ohne Supabase Keys?",
    answer:
      "Ja. Die App zeigt dann klare Setup-Hinweise und bleibt auf Vercel deploybar.",
  },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function LandingPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative min-h-[82svh] overflow-hidden bg-[#0d1420] text-white">
        <Image
          priority
          fill
          alt="KlassenHub Dashboard auf Desktop und Smartphone"
          className="object-cover object-center"
          src="/klassenhub-hero.png"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07111f] via-[#07111f]/80 to-[#07111f]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/65 via-transparent to-[#07111f]/35" />

        <div className="relative z-10 mx-auto flex min-h-[82svh] max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <span className="flex size-9 items-center justify-center rounded-md bg-white/12 text-teal-200 ring-1 ring-white/15">
                <GraduationCap className="size-5" />
              </span>
              KlassenHub
            </Link>
            <nav className="flex items-center gap-2">
              <ThemeToggle />
              <Button asChild variant="ghost">
                <Link href="/login">Einloggen</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/register">Kostenlos starten</Link>
              </Button>
            </nav>
          </header>

          <div className="flex flex-1 items-center py-14">
            <motion.div
              animate="visible"
              className="max-w-2xl"
              initial="hidden"
              transition={{ duration: 0.55, ease: "easeOut" }}
              variants={fadeUp}
            >
              <p className="mb-4 inline-flex rounded-md border border-white/15 bg-white/10 px-3 py-1 text-sm text-teal-100">
                Digitaler Organizer fuer Schulklassen und Azubi-Gruppen
              </p>
              <h1 className="max-w-xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                Deine Klasse. Ein Hub.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
                Termine, Aufgaben, Dateien, Ankündigungen und Abstimmungen an
                einem Ort.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/register">Kostenlos starten</Link>
                </Button>
                <Button
                  asChild
                  className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                  size="lg"
                  variant="outline"
                >
                  <Link href="/login">Einloggen</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            transition={{ delay: index * 0.07, duration: 0.4 }}
            viewport={{ once: true, amount: 0.25 }}
            whileHover={{ y: -4 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Card className="h-full p-5">
              <div className="mb-5 flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </div>
              <h2 className="text-base font-semibold">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {feature.text}
              </p>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Warum KlassenHub?
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Weniger Suchen, mehr Überblick.
            </h2>
            <p className="mt-4 text-muted-foreground">
              KlassenHub ersetzt lose Listen, verstreute Links und unklare
              Zuständigkeiten durch einen ruhigen Arbeitsbereich für den
              Klassenalltag.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Geschützter App-Bereich",
              "Rollen mit klaren Rechten",
              "Status-Badges und Filter",
              "Supabase-ready Datenmodell",
            ].map((item) => (
              <div
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-4"
                key={item}
              >
                <ShieldCheck className="size-5 text-success" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Für Klassensprecher
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Entscheidungen vorbereiten, ohne einen Chat zu eröffnen.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Abstimmungen, Ankündigungen und gepinnte Informationen helfen
              dabei, wichtige Klassenthemen sichtbar und nachvollziehbar zu
              halten.
            </p>
          </div>
          <Card className="p-5">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Vote, label: "Abstimmungen" },
                { icon: Bell, label: "Ankündigungen" },
                { icon: Users, label: "Rollen" },
              ].map((item) => (
                <div
                  className="rounded-lg bg-secondary p-4 text-center"
                  key={item.label}
                >
                  <item.icon className="mx-auto size-6 text-primary" />
                  <p className="mt-3 text-sm font-semibold">{item.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-secondary/70">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-8 divide-y divide-border rounded-lg border border-border bg-card">
            {faq.map((item) => (
              <details className="group p-5" key={item.question}>
                <summary className="cursor-pointer list-none font-semibold">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} KlassenHub</p>
          <p>Organisation für Klassen, FOS, Berufsschule und Azubi-Gruppen.</p>
        </div>
      </footer>
    </main>
  );
}

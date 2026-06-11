"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  FileText,
  GraduationCap,
  ShieldCheck,
  Vote,
} from "lucide-react";
import {
  AppPreviewVisual,
  ClassHubHeroVisual,
  PollVisual,
  TaskPlanningVisual,
} from "@/components/landing/visuals";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { EASE_OUT, fadeIn, fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: CalendarDays,
    title: "Termine & Klausuren",
    text: "Wichtige Daten, Raum, Fach und Priorität bleiben an einem Ort – sortiert nach Datum.",
    tone: "bg-info/12 text-info",
  },
  {
    icon: CheckSquare,
    title: "Aufgaben",
    text: "Offene To-dos, Deadlines und Status sind auf einen Blick erfassbar – nichts geht unter.",
    tone: "bg-success/12 text-success",
  },
  {
    icon: FileText,
    title: "Dateien & Links",
    text: "Materialien, Notizen und relevante Links werden sauber abgelegt und wiedergefunden.",
    tone: "bg-role-rep/12 text-role-rep",
  },
  {
    icon: Vote,
    title: "Abstimmungen",
    text: "Klassensprecher bereiten Entscheidungen strukturiert vor – mit klaren Ergebnissen.",
    tone: "bg-primary/12 text-primary",
  },
] as const;

const steps = [
  {
    number: "01",
    title: "Klasse erstellen",
    text: "Name, Schule, Schuljahr – fertig. Dauert keine zwei Minuten.",
  },
  {
    number: "02",
    title: "Code teilen",
    text: "Mitschüler treten mit dem Einladungscode bei und wählen ihre Rolle.",
  },
  {
    number: "03",
    title: "Organisiert bleiben",
    text: "Termine, Aufgaben, Dateien und Abstimmungen – alles an einem Ort.",
  },
] as const;

const faq = [
  {
    question: "Ist KlassenHub ein Chat?",
    answer:
      "Nein – ganz bewusst nicht. KlassenHub organisiert Termine, Aufgaben, Dateien, Ankündigungen und Abstimmungen. Für Gespräche bleibt euer bestehender Chat. Wichtige Infos gehen hier nicht mehr in Nachrichtenfluten unter.",
  },
  {
    question: "Wie tritt meine Klasse bei?",
    answer:
      "Eine Person erstellt die Klasse und teilt den Einladungscode. Alle anderen treten damit in unter einer Minute bei – ohne komplizierte Einrichtung.",
  },
  {
    question: "Welche Rollen gibt es?",
    answer:
      "Schüler:in, Klassensprecher:in, Lehrkraft und Admin – mit klar getrennten Rechten. Zum Beispiel dürfen nur Klassensprecher und Admins Abstimmungen starten.",
  },
  {
    question: "Wer sieht meine Daten?",
    answer:
      "Nur die Mitglieder deiner Klasse. Jede Klasse ist ein geschützter Bereich mit eigenem Zugang – ohne öffentliche Profile.",
  },
] as const;

const chatBubbles = [
  { text: "hat jmd die hausaufgabe??", align: "left" },
  { text: "welche seite war das nochmal", align: "right" },
  { text: "war das nicht bis freitag?", align: "left" },
  { text: "kann jemand das foto nochmal schicken", align: "right" },
  { text: "???", align: "left" },
] as const;

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="p-5">
      <button
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 text-left font-semibold"
        type="button"
        onClick={onToggle}
      >
        {question}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.25, ease: EASE_OUT }
            }
          >
            <p className="pt-3 text-sm leading-6 text-muted-foreground">
              {answer}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function LandingPage() {
  const reduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const itemVariants = reduceMotion ? fadeIn : staggerItem;
  const revealVariants = reduceMotion ? fadeIn : fadeInUp;

  return (
    <main className="bg-background text-foreground">
      {/* Hero – immer dunkel, unabhängig vom Theme */}
      <section className="relative overflow-hidden bg-[#0a0e1a] text-[#f2f5fa]">
        <ClassHubHeroVisual />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between">
            <Link className="flex items-center gap-2.5 font-semibold" href="/">
              <span className="bg-gradient-brand flex size-9 items-center justify-center rounded-lg text-white shadow-glow">
                <GraduationCap className="size-5" />
              </span>
              KlassenHub
            </Link>
            <nav className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                asChild
                className="text-[#f2f5fa] hover:bg-white/10 hover:text-white"
                variant="ghost"
              >
                <Link href="/login">Einloggen</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/register">Kostenlos starten</Link>
              </Button>
            </nav>
          </header>

          <motion.div
            animate="visible"
            className="mx-auto max-w-3xl pb-16 pt-16 text-center sm:pb-20 sm:pt-24"
            initial="hidden"
            variants={staggerContainer}
          >
            <motion.p
              className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-1.5 text-sm text-[#8b95ab]"
              variants={itemVariants}
            >
              <span className="size-1.5 rounded-full bg-[#2dd8c6]" />
              Für Schulklassen, FOS, Berufsschule & Azubi-Gruppen
            </motion.p>
            <motion.h1
              className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl"
              variants={itemVariants}
            >
              Deine Klasse.{" "}
              <span className="text-gradient-brand">Ein Hub.</span>
            </motion.h1>
            <motion.p
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#8b95ab]"
              variants={itemVariants}
            >
              Organisiere Termine, Aufgaben, Dateien, Ankündigungen und
              Abstimmungen an einem Ort – ohne Chat-Chaos.
            </motion.p>
            <motion.div
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
              variants={itemVariants}
            >
              <Button
                asChild
                className="hover:shadow-glow w-full transition-shadow sm:w-auto"
                size="lg"
              >
                <Link href="/register">
                  Kostenlos starten
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                className="w-full border border-white/15 bg-white/5 text-[#f2f5fa] hover:bg-white/10 hover:text-white sm:w-auto"
                size="lg"
                variant="ghost"
              >
                <Link href="/login">Einloggen</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            className="pb-20 sm:pb-24"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 24, scale: 0.97 }
            }
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.35 }}
          >
            <AppPreviewVisual />
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          variants={staggerContainer}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full p-5" variant="elevated">
                <div
                  className={cn(
                    "mb-5 flex size-11 items-center justify-center rounded-lg",
                    feature.tone,
                  )}
                >
                  <feature.icon className="size-5" />
                </div>
                <h2 className="text-base font-semibold">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {feature.text}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* So funktioniert KlassenHub */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            variants={revealVariants}
            viewport={{ once: true, amount: 0.4 }}
            whileInView="visible"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              So funktioniert KlassenHub
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              In drei Schritten startklar.
            </h2>
          </motion.div>
          <motion.div
            className="relative mt-12 grid gap-4 md:grid-cols-3"
            initial="hidden"
            variants={staggerContainer}
            viewport={{ once: true, amount: 0.3 }}
            whileInView="visible"
          >
            <div
              aria-hidden
              className="absolute left-[16%] right-[16%] top-7 hidden h-px md:block"
              style={{
                background:
                  "linear-gradient(90deg, transparent, color-mix(in srgb, var(--primary) 40%, transparent), transparent)",
              }}
            />
            {steps.map((step) => (
              <motion.div key={step.number} variants={itemVariants}>
                <Card className="relative h-full p-6">
                  <span className="bg-gradient-brand inline-flex size-9 items-center justify-center rounded-lg font-mono text-sm font-semibold text-white">
                    {step.number}
                  </span>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.text}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Für Klassensprecher */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial="hidden"
            variants={revealVariants}
            viewport={{ once: true, amount: 0.4 }}
            whileInView="visible"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Für Klassensprecher
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Entscheidungen vorbereiten, ohne einen Chat zu eröffnen.
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Abstimmungen, Ankündigungen und gepinnte Informationen halten
              wichtige Klassenthemen sichtbar und nachvollziehbar.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Abstimmungen anlegen – von Ja/Nein bis Terminfindung",
                "Ankündigungen pinnen, die niemand übersehen kann",
                "Beteiligung live sehen, statt Stimmen einzusammeln",
              ].map((item) => (
                <li className="flex items-start gap-3 text-sm" key={item}>
                  <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-success" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial="hidden"
            variants={revealVariants}
            viewport={{ once: true, amount: 0.3 }}
            whileInView="visible"
          >
            <PollVisual />
          </motion.div>
        </div>
      </section>

      {/* Warum kein Chat? */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            variants={revealVariants}
            viewport={{ once: true, amount: 0.4 }}
            whileInView="visible"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Warum kein Chat?
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Kein Chat. Absicht.
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Infos statt Nachrichtenflut: In KlassenHub hat jede Information
              ihren festen Platz – nichts geht unter, nichts lenkt ab.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <motion.div
              initial="hidden"
              variants={revealVariants}
              viewport={{ once: true, amount: 0.3 }}
              whileInView="visible"
            >
              <div aria-hidden className="space-y-2.5 opacity-60 select-none">
                {chatBubbles.map((bubble, index) => (
                  <div
                    className={cn(
                      "flex",
                      bubble.align === "right" && "justify-end",
                    )}
                    key={index}
                  >
                    <span
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                        bubble.align === "right"
                          ? "rounded-br-md bg-primary/15 text-foreground"
                          : "rounded-bl-md bg-secondary text-muted-foreground",
                      )}
                    >
                      {bubble.text}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                87 Nachrichten. Die Hausaufgabe? Irgendwo da drin.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col justify-center"
              initial="hidden"
              variants={revealVariants}
              viewport={{ once: true, amount: 0.3 }}
              whileInView="visible"
            >
              <TaskPlanningVisual />
              <p className="mt-4 text-sm font-semibold">
                Eine Karte. Alles drauf.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <motion.h2
          className="text-3xl font-semibold tracking-tight"
          initial="hidden"
          variants={revealVariants}
          viewport={{ once: true, amount: 0.5 }}
          whileInView="visible"
        >
          Häufige Fragen
        </motion.h2>
        <motion.div
          className="mt-8 divide-y divide-border rounded-xl border border-border bg-card shadow-soft"
          initial="hidden"
          variants={revealVariants}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          {faq.map((item, index) => (
            <FaqItem
              answer={item.answer}
              key={item.question}
              open={openFaq === index}
              question={item.question}
              onToggle={() => setOpenFaq(openFaq === index ? null : index)}
            />
          ))}
        </motion.div>
      </section>

      {/* Finaler CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <motion.div
          className="bg-gradient-brand rounded-2xl p-[1px]"
          initial="hidden"
          variants={revealVariants}
          viewport={{ once: true, amount: 0.4 }}
          whileInView="visible"
        >
          <div className="rounded-2xl bg-card px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="text-3xl font-semibold tracking-tight">
              Bring deine Klasse auf einen Stand.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Kostenlos · Kein Chat · In zwei Minuten startklar
            </p>
            <Button asChild className="mt-7" size="lg">
              <Link href="/register">
                Kostenlos starten
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Link className="flex items-center gap-2.5 font-semibold" href="/">
                <span className="bg-gradient-brand flex size-8 items-center justify-center rounded-lg text-white">
                  <GraduationCap className="size-4.5" />
                </span>
                KlassenHub
              </Link>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                Deine Klasse. Ein Hub. Organisation für Klassen, FOS,
                Berufsschule und Azubi-Gruppen.
              </p>
            </div>
            <div className="flex gap-12">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-faint-foreground">
                  Produkt
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <Link
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      href="/register"
                    >
                      Kostenlos starten
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      href="/login"
                    >
                      Einloggen
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} KlassenHub</p>
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </main>
  );
}

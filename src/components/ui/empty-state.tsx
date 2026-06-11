"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fadeIn, fadeInUp } from "@/lib/motion";

type EmptyStateProps = {
  icon?: React.ReactNode;
  /** Eigenes SVG/CSS-Visual, ersetzt das Icon-Quadrat. */
  visual?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Alternativ zur onAction: CTA als Link. */
  actionHref?: string;
  framed?: boolean;
};

export function EmptyState({
  icon,
  visual,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  framed = true,
}: EmptyStateProps) {
  const reduceMotion = useReducedMotion();
  const variants = reduceMotion ? fadeIn : fadeInUp;

  const content = (
    <motion.div
      className="flex flex-col items-center"
      initial="hidden"
      variants={variants}
      viewport={{ once: true, amount: 0.3 }}
      whileInView="visible"
    >
      {visual ? (
        <div className="mb-2">{visual}</div>
      ) : icon ? (
        <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Button asChild className="mt-5">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : actionLabel ? (
        <Button className="mt-5" onClick={onAction} type="button">
          {actionLabel}
        </Button>
      ) : null}
    </motion.div>
  );

  if (!framed) {
    return (
      <div className="flex min-h-44 flex-col items-center justify-center py-4 text-center">
        {content}
      </div>
    );
  }

  return (
    <Card className="flex min-h-56 flex-col items-center justify-center p-8 text-center">
      {content}
    </Card>
  );
}

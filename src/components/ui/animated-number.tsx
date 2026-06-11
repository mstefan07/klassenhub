"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";

export function AnimatedNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const controls = animate(0, value, {
      duration: 0.8,
      ease: EASE_OUT,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [value, reduceMotion]);

  return <span className={className}>{reduceMotion ? value : display}</span>;
}

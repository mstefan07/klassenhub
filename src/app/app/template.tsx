"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeIn, pageTransition } from "@/lib/motion";

export default function AppTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate="visible"
      initial="hidden"
      variants={reduceMotion ? fadeIn : pageTransition}
    >
      {children}
    </motion.div>
  );
}

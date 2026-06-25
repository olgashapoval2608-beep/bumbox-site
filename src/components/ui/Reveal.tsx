"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  createElement,
  type ElementType,
  type ReactNode,
} from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ----------------------------------------------------------------------------
   RevealText — split copy into words (or characters) that rise out of a
   clipped mask as they enter view. Accessible: the full string is exposed via
   aria-label and the animated fragments are hidden from assistive tech.
   -------------------------------------------------------------------------- */
type RevealTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  by?: "word" | "char";
  delay?: number;
  stagger?: number;
  once?: boolean;
};

export function RevealText({
  text,
  as = "span",
  className,
  by = "word",
  delay = 0,
  stagger = 0.045,
  once = true,
}: RevealTextProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return createElement(as, { className }, text);
  }

  const tokens = by === "word" ? text.split(" ") : Array.from(text);

  return createElement(
    as,
    { className, "aria-label": text },
    <motion.span
      aria-hidden
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-12% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      style={{ display: "inline" }}
    >
      {tokens.map((token, i) => (
        <span
          key={i}
          className="reveal-mask"
          style={{ display: "inline-block" }}
        >
          <motion.span
            style={{ display: "inline-block", willChange: "transform" }}
            variants={
              {
                hidden: { y: "115%", rotate: 4 },
                visible: {
                  y: 0,
                  rotate: 0,
                  transition: { duration: 0.9, ease: EASE },
                },
              } satisfies Variants
            }
          >
            {token}
            {by === "word" ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>,
  );
}

/* ----------------------------------------------------------------------------
   Reveal — generic fade/slide-up container for blocks of content.
   -------------------------------------------------------------------------- */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px" }}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

type Variant = "primary" | "ghost" | "solid";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
};

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-signal text-bone shadow-[0_0_0_0_rgba(242,53,39,0.5)] hover:shadow-[0_18px_50px_-12px_rgba(242,53,39,0.6)]",
  solid: "bg-bone text-ink hover:bg-white",
  ghost:
    "border border-bone/25 bg-bone/[0.03] text-bone backdrop-blur-md hover:border-signal hover:bg-bone/[0.06]",
};

/**
 * A CTA that drifts toward the cursor (the "magnetic" microinteraction). The
 * pull is applied to a wrapper so the inner anchor/button keeps clean ref
 * typing and full keyboard semantics. Disabled under reduced motion.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  target,
  rel,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 170, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 170, damping: 15, mass: 0.3 });

  const handleMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.4);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const cls =
    "group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-3.5 font-mono text-[0.72rem] uppercase tracking-[0.22em] transition-shadow duration-500 ease-cinema " +
    VARIANTS[variant] +
    " " +
    className;

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 vu" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
    </>
  );

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy, display: "inline-flex" }}
    >
      {href ? (
        <a
          href={href}
          target={target}
          rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
          aria-label={ariaLabel}
          className={cls}
        >
          {inner}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          aria-label={ariaLabel}
          className={cls}
        >
          {inner}
        </button>
      )}
    </motion.span>
  );
}

"use client";

import type { ReactNode } from "react";

/**
 * Infinite horizontal marquee. The track is duplicated and translated -50%,
 * so the loop is seamless. Pauses on hover and under reduced-motion.
 */
export function Marquee({
  children,
  className = "",
  reverse = false,
  speed = 40,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  speed?: number;
}) {
  return (
    <div className={`group flex overflow-hidden ${className}`}>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className="flex shrink-0 items-center motion-reduce:animate-none group-hover:[animation-play-state:paused]"
          style={{
            animation: `marquee ${speed}s linear infinite`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

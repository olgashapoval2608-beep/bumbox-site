"use client";

import { RevealText, Reveal } from "@/components/ui/Reveal";

type Props = {
  kicker: string;
  title: string;
  description?: string;
  className?: string;
};

/**
 * Shared editorial header: a sweeping signal line, a mono kicker that encodes
 * the section's real subject, and a masked display heading.
 */
export function SectionHeader({ kicker, title, description, className = "" }: Props) {
  return (
    <div className={className}>
      <div className="signal-line mb-9" />
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="kicker mb-5">{kicker}</p>
          <RevealText
            as="h2"
            text={title}
            className="font-display text-[clamp(2.6rem,7vw,6.5rem)] font-black leading-[0.86] tracking-tightest text-bone"
          />
        </div>
        {description && (
          <Reveal delay={0.1} className="max-w-sm md:text-right">
            <p className="text-pretty text-base text-bone-dim">{description}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

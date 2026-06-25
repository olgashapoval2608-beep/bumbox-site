"use client";

import { Reveal, RevealText } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import {
  NAV_LINKS,
  STREAMING,
  SOCIALS,
  BAND,
  ALL_TICKETS,
} from "@/lib/content";

export function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink pt-24 md:pt-32">
      <div className="shell">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker mb-5">Сигнал триває</p>
            <RevealText
              as="h2"
              text="Залишайся на хвилі"
              className="font-display text-[clamp(2.4rem,7vw,5.5rem)] font-black leading-[0.88] tracking-tightest text-bone"
            />
          </div>
          <Reveal delay={0.1}>
            <MagneticButton href={ALL_TICKETS} target="_blank" variant="primary">
              Купити квитки
            </MagneticButton>
          </Reveal>
        </div>

        {/* Columns */}
        <div className="mt-20 grid grid-cols-2 gap-10 md:grid-cols-4">
          <FooterCol title="Розділи">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(`#${l.id}`, 0)}
                className="text-left text-bone-dim transition-colors duration-300 hover:text-signal"
              >
                {l.label}
              </button>
            ))}
          </FooterCol>

          <FooterCol title="Слухати">
            {STREAMING.map((s) => (
              <FooterLink key={s.label} href={s.href}>
                {s.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Соцмережі">
            {SOCIALS.map((s) => (
              <FooterLink key={s.label} href={s.href}>
                {s.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Контакти">
            <FooterLink href="mailto:booking@bumbox.band">
              Букінг
            </FooterLink>
            <FooterLink href="mailto:press@bumbox.band">Преса</FooterLink>
            <span className="text-bone-dim">
              {BAND.city}, Україна
            </span>
          </FooterCol>
        </div>
      </div>

      {/* Marquee */}
      <Marquee className="mt-20 border-y border-line py-5" speed={32}>
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="flex items-center gap-6 px-6 font-display text-2xl font-extrabold uppercase tracking-tightest text-bone-dim"
          >
            {BAND.name}
            <span className="text-signal">✱</span>
            {BAND.tagline}
            <span className="text-signal">✱</span>
          </span>
        ))}
      </Marquee>

      {/* Bottom bar */}
      <div className="shell flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-smoke">
          © {year} {BAND.name} — {BAND.city}, Україна
        </p>
        <button
          onClick={() => scrollTo("#top", 0)}
          className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-smoke transition-colors hover:text-bone"
        >
          Нагору ↑
        </button>
      </div>

      {/* Giant watermark wordmark */}
      <div
        aria-hidden
        className="pointer-events-none select-none px-[var(--gutter)]"
      >
        <span className="block translate-y-[18%] font-display text-[24vw] font-black leading-[0.7] tracking-tightest text-bone/[0.04]">
          {BAND.name}
        </span>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="mb-1 font-mono text-[0.66rem] uppercase tracking-[0.22em] text-smoke">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-bone-dim transition-colors duration-300 hover:text-signal"
    >
      {children}
    </a>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import { NAV_LINKS, BAND, ALL_TICKETS, SOCIALS } from "@/lib/content";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { useActiveSection } from "@/lib/hooks";
import { MagneticButton } from "@/components/ui/MagneticButton";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Navbar() {
  const { scrollTo, lenis } = useSmoothScroll();
  const ids = NAV_LINKS.map((l) => l.id);
  const active = useActiveSection(ids);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Freeze the page behind the mobile menu.
  useEffect(() => {
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, lenis]);

  const go = (id: string) => {
    setOpen(false);
    scrollTo(`#${id}`, 0);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-cinema ${
          scrolled || open
            ? "border-b border-line bg-ink/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="shell flex h-16 items-center justify-between md:h-20">
          {/* Wordmark */}
          <button
            onClick={() => scrollTo("#top", 0)}
            className="group flex items-center gap-2.5"
            aria-label="Бумбокс — на початок"
          >
            <span className="font-display text-lg font-extrabold tracking-tightest text-bone md:text-xl">
              {BAND.name}
            </span>
            <span className="vu opacity-80" aria-hidden>
              <i />
              <i />
              <i />
              <i />
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`relative rounded-full px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  active === l.id
                    ? "text-bone"
                    : "text-smoke hover:text-bone"
                }`}
              >
                {active === l.id && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 -z-0 rounded-full border border-signal/40 bg-signal/10"
                    transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <MagneticButton
                href={ALL_TICKETS}
                target="_blank"
                variant="primary"
              >
                Квитки
              </MagneticButton>
            </div>

            {/* Burger */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bone/[0.03] backdrop-blur md:hidden"
              aria-label={open ? "Закрити меню" : "Відкрити меню"}
              aria-expanded={open}
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={`absolute left-0 block h-[1.5px] w-full bg-bone transition-all duration-300 ${
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 block h-[1.5px] w-full bg-bone transition-all duration-300 ${
                    open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Scroll progress — the "tape position" line */}
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="h-px origin-left bg-gradient-to-r from-signal to-amber"
        />
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-24 md:hidden"
          >
            <nav className="flex flex-col">
              {NAV_LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  onClick={() => go(l.id)}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: reduce ? 0 : 0.15 + i * 0.06,
                    duration: 0.6,
                    ease: EASE,
                  }}
                  className="flex items-baseline justify-between border-b border-line py-4 text-left"
                >
                  <span className="font-display text-4xl font-extrabold tracking-tightest text-bone">
                    {l.label}
                  </span>
                  <span className="font-mono text-xs text-smoke">
                    0{i + 1}
                  </span>
                </motion.button>
              ))}
            </nav>

            <div className="flex flex-col gap-6">
              <MagneticButton
                href={ALL_TICKETS}
                target="_blank"
                variant="primary"
                className="w-full justify-center"
              >
                Купити квитки
              </MagneticButton>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs uppercase tracking-widest text-smoke transition-colors hover:text-signal"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

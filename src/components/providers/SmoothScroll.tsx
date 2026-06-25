"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type LenisContextValue = {
  lenis: Lenis | null;
  /** Smooth-scroll to a selector or element, falling back to native behaviour. */
  scrollTo: (target: string | HTMLElement, offset?: number) => void;
};

const SmoothScrollContext = createContext<LenisContextValue>({
  lenis: null,
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Under reduced-motion we skip Lenis entirely; ScrollTrigger still drives
    // scroll-linked animations off the native scroller.
    if (prefersReduced) {
      ScrollTrigger.refresh();
      return;
    }

    const instance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    setLenis(instance);

    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Recompute trigger positions once async media has settled.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const settle = window.setTimeout(refresh, 1200);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", refresh);
      window.clearTimeout(settle);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  const scrollTo: LenisContextValue["scrollTo"] = (target, offset = 0) => {
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.4 });
      return;
    }
    const el =
      typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

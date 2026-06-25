"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Reveal direction of the unmasking wipe. */
  from?: "bottom" | "top" | "left" | "right";
};

const CLIP: Record<NonNullable<Props["from"]>, string> = {
  bottom: "inset(0 0 100% 0)",
  top: "inset(100% 0 0 0)",
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
};

/**
 * next/image behind a clip-path wipe with a counter-scale on the photo, so the
 * picture is unmasked while it settles from a slight zoom — a cinematic reveal
 * rather than a generic fade. The parent controls the aspect/size.
 */
export function RevealImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  sizes = "100vw",
  priority = false,
  from = "bottom",
}: Props) {
  const reduce = useReducedMotion();

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { clipPath: CLIP[from] }}
        whileInView={{ clipPath: "inset(0 0 0 0)" }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <motion.div
          className="relative h-full w-full"
          initial={reduce ? false : { scale: 1.2 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 1.5, ease: EASE }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={`object-cover ${imgClassName}`}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

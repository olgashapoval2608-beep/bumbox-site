"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MEMBERS, type Member } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

function MemberCard({ member, index }: { member: Member; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.75, ease: EASE, delay: (index % 4) * 0.06 }}
      tabIndex={0}
      className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-ink-700 ring-1 ring-line focus:outline-none focus-visible:ring-2 focus-visible:ring-signal"
    >
      <Image
        src={member.photo}
        alt={`${member.name} ${member.surname}`.trim()}
        fill
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
        className="object-cover grayscale transition-all duration-[800ms] ease-cinema group-hover:scale-[1.05] group-hover:grayscale-0 group-focus:scale-[1.05] group-focus:grayscale-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-signal">
          {member.role}
        </p>
        <h3 className="mt-1.5 font-display text-2xl font-extrabold leading-none tracking-tightest text-bone md:text-3xl">
          {member.surname}
        </h3>
        {member.name && (
          <p className="font-mono text-xs text-smoke">{member.name}</p>
        )}

        {/* Bio overlay: revealed on hover/focus; shown by default on touch */}
        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-cinema group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus:grid-rows-[1fr] group-focus:opacity-100 max-md:grid-rows-[1fr] max-md:opacity-100">
          <div className="overflow-hidden">
            <p className="mt-3 text-pretty text-[0.82rem] leading-relaxed text-bone-dim">
              {member.bio}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Members() {
  const reduce = useReducedMotion();
  return (
    <section id="members" className="relative bg-ink-800 py-24 md:py-36">
      <div className="shell">
        <SectionHeader
          kicker="Гурт · склад"
          title="Сім на одній сцені"
          description="Від співзасновників до нового складу — голоси, що зібрані на одну плівку Бумбоксу."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {MEMBERS.map((m, i) => (
            <MemberCard key={m.id} member={m} index={i} />
          ))}

          {/* Ensemble tile fills the grid and points to the gallery */}
          <motion.a
            href="#gallery"
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.75, ease: EASE, delay: 0.18 }}
            className="group relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-line"
          >
            <Image
              src="/media/band-group.jpg"
              alt="Гурт Бумбокс разом"
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
              className="object-cover transition-transform duration-[800ms] ease-cinema group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-ink/55 transition-colors duration-500 group-hover:bg-ink/35" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
              <span className="font-display text-2xl font-extrabold tracking-tightest text-bone">
                Гурт разом
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-bone-dim">
                Дивитись галерею →
              </span>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

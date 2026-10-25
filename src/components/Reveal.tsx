"use client";
// ============================================================
// REVEAL — fade-up on enter. Wrap a list in <Stagger> and each
// <Reveal> child animates 100ms after the previous one.
// ============================================================
import { motion, type Variants } from "framer-motion";

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export function Stagger({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "ul" }) {
  const M = as === "ul" ? motion.ul : motion.div;
  return (
    <M className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}>
      {children}
    </M>
  );
}

export function Reveal({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "li" }) {
  const M = as === "li" ? motion.li : motion.div;
  return <M className={className} variants={item}>{children}</M>;
}

// Standalone reveal (not inside a Stagger).
export function FadeUp({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, intro, id }: { eyebrow: string; title: React.ReactNode; intro?: string; id?: string }) {
  return (
    <Stagger className="mx-auto max-w-3xl text-center">
      <Reveal><p className="eyebrow">{eyebrow}</p></Reveal>
      <Reveal>
        <h2 id={id} className="mt-5 font-serif text-4xl font-light leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">{title}</h2>
      </Reveal>
      {intro && <Reveal><p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">{intro}</p></Reveal>}
    </Stagger>
  );
}

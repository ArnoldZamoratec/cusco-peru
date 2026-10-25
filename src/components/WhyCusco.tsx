"use client";
// ============================================================
// WHY CUSCO — four animated line icons with counting stats.
// ============================================================
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "@/data/content";
import { Reveal, SectionHeading, Stagger } from "./Reveal";

// Line icons that draw themselves when in view.
const draw = { hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1.6, ease: "easeInOut" } } };
function Icon({ name }: { name: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, variants: draw };
  return (
    <motion.svg viewBox="0 0 64 64" className="h-14 w-14 text-accent" aria-hidden>
      {name === "mountain" && (<>
        <motion.path {...p} d="M4 54 L24 18 L34 34 L42 24 L60 54 Z" />
        <motion.path {...p} d="M19 27 L24 18 L29 26 L26 24 L22 28 Z" />
      </>)}
      {name === "wonder" && (<>
        <motion.path {...p} d="M8 54h48M12 54V40h40v14M18 40V30h28v10M24 30v-8h16v8" />
        <motion.path {...p} d="M32 8 L35 14 L42 15 L37 20 L38 27 L32 23 L26 27 L27 20 L22 15 L29 14 Z" />
      </>)}
      {name === "sun" && (<>
        <motion.circle {...p} cx="32" cy="32" r="11" />
        <motion.path {...p} d="M32 6v8M32 50v8M6 32h8M50 32h8M13.6 13.6l5.6 5.6M44.8 44.8l5.6 5.6M13.6 50.4l5.6-5.6M44.8 19.2l5.6-5.6" />
      </>)}
      {name === "infinity" && (
        <motion.path {...p} d="M32 32c-6-8-11-12-17-12a12 12 0 0 0 0 24c6 0 11-4 17-12s11-12 17-12a12 12 0 0 1 0 24c-6 0-11-4-17-12z" />
      )}
    </motion.svg>
  );
}

function Counter({ to, suffix = "", display }: { to: number; suffix?: string; display?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView || display) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 1800);
      setN(Math.round(to * (1 - Math.pow(1 - k, 4))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, display]);
  return <span ref={ref} className="tabular-nums">{display ?? n.toLocaleString("es-PE")}{!display && suffix}</span>;
}

export default function WhyCusco() {
  return (
    <section id="why" tabIndex={-1} className="relative px-4 py-28 md:px-8 md:py-40" aria-labelledby="why-title">
      <SectionHeading
        id="why-title"
        eyebrow="El corazón de los Andes"
        title={<>Cusco: historia que <em className="text-accent">sigue viva</em>.</>}
        intro="La antigua capital inca reúne arquitectura, tradición y vida cotidiana en medio de los Andes. Ven con tiempo para recorrerla y aclimatarte a la altura."
      />
      <Stagger as="ul" className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line/10 bg-line/10 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Reveal as="li" key={s.label} className="group bg-bg p-8 transition-colors duration-700 hover:bg-surface md:p-10">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}>
              <Icon name={s.icon} />
            </motion.div>
            <p className="mt-8 font-serif text-5xl font-light md:text-6xl">
              <Counter to={s.value} suffix={s.suffix} display={"display" in s ? s.display : undefined} />
            </p>
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em]">{s.label}</p>
            <p className="mt-2 text-sm text-muted">{s.note}</p>
          </Reveal>
        ))}
      </Stagger>
    </section>
  );
}

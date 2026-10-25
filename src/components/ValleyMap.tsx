"use client";
// ============================================================
// INTERACTIVE 3D VALLEY MAP — a topographic plane tilted in CSS
// 3D that leans with the mouse. Glowing pins stand upright on it;
// hover / focus a pin to reveal its photo and a curious fact.
// ============================================================
import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { mapPoints } from "@/data/content";
import { images } from "@/data/images";
import { SectionHeading } from "./Reveal";

// Urubamba river: Pisac → Urubamba → Ollantaytambo → Machu Picchu.
const RIVER = "M100 41 C 90 40, 84 44, 78 44 S 60 47, 50 47 S 36 44, 30 42 S 20 32, 15 29 S 8 24, 0 20";

export default function ValleyMap() {
  const [active, setActive] = useState(0);
  const plane = useRef<HTMLDivElement>(null);
  const p = mapPoints[active];

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !plane.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    plane.current.style.transform = `rotateX(${52 - y * 10}deg) rotateZ(${-14 + x * 10}deg)`;
  };

  return (
    <section id="map" tabIndex={-1} className="relative overflow-hidden bg-valley/10 px-4 py-28 md:px-8 md:py-40" aria-labelledby="map-title">
      <SectionHeading
        id="map-title"
        eyebrow="Valle Sagrado · Mapa interactivo"
        title={<>Recorre el valle. <em className="text-accent">A tu ritmo.</em></>}
        intro="Explora seis lugares entre Cusco, el río Urubamba y las montañas que rodean Machu Picchu."
      />

      <div className="mx-auto mt-16 grid max-w-7xl items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* 3D stage */}
        <div className="relative aspect-[4/3] [perspective:1400px]" onPointerMove={onMove}>
          <div
            ref={plane}
            className="absolute inset-[6%] rounded-[32px] border border-line/15 bg-surface shadow-[0_60px_80px_-30px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-cine [transform-style:preserve-3d]"
            style={{ transform: "rotateX(52deg) rotateZ(-14deg)" }}
          >
            {/* Topographic texture */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full rounded-[32px]" aria-hidden>
              <defs>
                <radialGradient id="peak" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D4A24C" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#D4A24C" stopOpacity="0" />
                </radialGradient>
              </defs>
              {[[20, 70, 14], [55, 25, 18], [70, 85, 12], [40, 80, 10], [90, 15, 12]].map(([cx, cy, r], i) => (
                <g key={i} fill="none" stroke="currentColor" className="text-fg/15" strokeWidth="0.25">
                  <circle cx={cx} cy={cy} r={r} fill="url(#peak)" />
                  {[0.8, 0.6, 0.4, 0.2].map((k) => <ellipse key={k} cx={cx} cy={cy} rx={r * k * 1.2} ry={r * k} />)}
                </g>
              ))}
              <path d={RIVER} fill="none" stroke="#5fa8b8" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
              <path d={RIVER} fill="none" stroke="#bfe6ee" strokeWidth="0.4" strokeDasharray="1.5 2.5" strokeLinecap="round">
                <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="6s" repeatCount="indefinite" />
              </path>
            </svg>
            <span className="absolute bottom-5 right-6 text-[10px] uppercase tracking-[0.3em] text-muted">Río Urubamba</span>

            {/* Pins — counter-rotated so they stand up off the map */}
            {mapPoints.map((pt, i) => (
              <button
                key={pt.name}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                aria-label={`${pt.name}: ver fotografía e información`}
                className="absolute -translate-x-1/2 -translate-y-full [transform-style:preserve-3d]"
                style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              >
                <span className="block origin-bottom [transform:rotateZ(14deg)_rotateX(-52deg)]">
                  <span className={`mx-auto mb-1 block w-max whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] transition-colors ${active === i ? "bg-terracotta text-bone" : "bg-ink/80 text-bone"}`}>
                    {pt.name}
                  </span>
                  <span className={`mx-auto block h-10 w-px bg-gradient-to-b ${active === i ? "from-terracotta" : "from-ochre"} to-transparent`} />
                </span>
                <span className={`pin-glow absolute left-1/2 top-full block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${active === i ? "bg-terracotta" : "bg-ochre"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Detail card */}
        <div className="relative min-h-[460px]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-[28px] border border-line/10 bg-bg"
            >
              <div className="relative aspect-[4/3]" data-cursor="explore">
                <Image src={images[p.image].src} alt={`${p.name}, Sacred Valley`} fill sizes="(min-width:1024px) 35vw, 100vw"
                  placeholder="blur" blurDataURL={images[p.image].blurDataURL} className="object-cover" />
              </div>
              <div className="p-7">
                <p className="eyebrow">Un detalle del lugar</p>
                <h3 className="mt-3 font-serif text-3xl font-light">{p.name}</h3>
                <p className="mt-3 leading-relaxed text-muted">{p.fact}</p>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

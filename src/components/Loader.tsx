"use client";
// ============================================================
// LOADER — 0→100% counter while a chakana (Andean cross) draws
// itself. Kept short (~1.6s) and skipped on repeat visits.
// ============================================================
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CHAKANA = "M40 4h20v14h14v14h14v20H74v14H60v14H40V66H26V52H12V32h14V18h14z";

export default function Loader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("cusco-loaded") === "1"; } catch {}
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) { setDone(true); return; }

    const start = performance.now();
    const DURATION = 1600;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setPct(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(step);
      else setTimeout(() => {
        setDone(true);
        try { sessionStorage.setItem("cusco-loaded", "1"); } catch {}
      }, 250);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = done ? "" : "hidden";
    if (done) {
      // Hero waits for this before playing its title animation.
      (window as unknown as { __cuscoReady?: boolean }).__cuscoReady = true;
      window.dispatchEvent(new Event("cusco:ready"));
    }
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          role="status"
          aria-label={`Cargando ${pct}%`}
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-ink text-bone"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden>
            <motion.path
              d={CHAKANA}
              fill="none"
              stroke="#C1502E"
              strokeWidth={1.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: pct / 100 }}
              transition={{ ease: "linear", duration: 0.05 }}
            />
            <motion.circle cx="50" cy="42" r="7" fill="none" stroke="#D4A24C" strokeWidth={1.5}
              initial={{ scale: 0 }} animate={{ scale: pct > 60 ? 1 : 0 }} style={{ transformOrigin: "50px 42px" }} />
          </svg>
          <div className="mt-8 font-serif text-7xl font-light tabular-nums md:text-8xl">
            {pct}<span className="text-ochre">%</span>
          </div>
          <div className="mt-6 h-px w-48 overflow-hidden bg-bone/15">
            <div className="h-full bg-gradient-to-r from-terracotta via-ochre to-valley" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-6 text-[11px] uppercase tracking-mega text-bone/70">Allinllachu · Bienvenidos</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

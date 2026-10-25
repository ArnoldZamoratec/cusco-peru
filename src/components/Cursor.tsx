"use client";
// ============================================================
// CUSTOM CURSOR — a ring that trails the pointer and morphs into
// an "Explore" disc over anything tagged data-cursor="explore".
// Only on fine pointers; touch devices keep native behaviour.
// ============================================================
import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      setLabel(t ? t.dataset.cursor === "explore" ? "Explorar" : t.dataset.cursor! : null);
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;
  const active = !!label;
  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[90] flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-500 ease-cine ${
          active ? "h-24 w-24 border-transparent bg-terracotta/90" : "h-9 w-9 border-bone/60 mix-blend-difference"
        }`}
      >
        <span className={`text-[11px] font-medium uppercase tracking-[0.2em] text-bone transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}>
          {label}
        </span>
      </div>
      <div ref={dot} aria-hidden className={`pointer-events-none fixed left-0 top-0 z-[91] h-1.5 w-1.5 rounded-full bg-ochre transition-opacity ${active ? "opacity-0" : "opacity-100"}`} />
    </>
  );
}

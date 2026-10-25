"use client";
// ============================================================
// CINEMATIC FLY-THROUGH — a 400vh section whose sticky viewport
// holds the 3D Machu Picchu. GSAP ScrollTrigger maps scroll to
// camera progress (Apple-style scroll-driven animation).
// Mobile / reduced motion / no WebGL → crossfading photo stills.
// ============================================================
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters } from "@/data/content";
import { images, type ImageKey } from "@/data/images";

const Scene = dynamic(() => import("./three/MachuPicchuScene"), { ssr: false });
const stills: ImageKey[] = ["machu-clouds", "inca-wall", "machu-picchu"];

function canUse3D() {
  if (typeof window === "undefined") return false;
  if (!matchMedia("(min-width: 768px) and (pointer: fine)").matches) return false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

export default function FlyThrough() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [use3D, setUse3D] = useState(false);
  const [active, setActive] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => setUse3D(canUse3D()), []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
        setChapter(Math.min(chapters.length - 1, Math.floor(self.progress * chapters.length * 0.999)));
        if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`;
      },
    });
    // Also render while approaching, so the canvas is warm before pinning.
    const near = ScrollTrigger.create({
      trigger: section.current, start: "top bottom", end: "bottom top",
      onToggle: (self) => setActive(self.isActive),
    });
    return () => { st.kill(); near.kill(); };
  }, []);

  return (
    <section ref={section} className="relative h-[400vh] bg-ink text-bone" aria-labelledby="fly-title">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Dawn sky behind a transparent canvas */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0d0d0d_0%,#2a1a14_35%,#7a3b22_70%,#C1502E_100%)]" aria-hidden />

        {use3D ? (
          <div className="absolute inset-0" data-cursor="explore">
            <Scene progress={progress} active={active} />
          </div>
        ) : (
          <div className="absolute inset-0">
            {stills.map((k, i) => (
              <Image
                key={k}
                src={images[k].src}
                alt={i === 0 ? "Machu Picchu entre nubes de la mañana" : i === 1 ? "Piedras incas encajadas con precisión" : "Machu Picchu con Huayna Picchu al fondo"}
                fill
                sizes="100vw"
                placeholder="blur"
                blurDataURL={images[k].blurDataURL}
                className={`object-cover transition-opacity duration-1000 ${chapter === i ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" aria-hidden />

        {/* Chapter captions */}
        <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-24 md:items-center md:px-8 md:pb-0">
          <div className="max-w-lg">
            <p className="eyebrow !text-ochre">Una mirada a la ciudadela</p>
            <h2 id="fly-title" className="sr-only">Recorrido visual por Machu Picchu</h2>
            <div className="relative mt-6 min-h-[16rem]">
              {chapters.map((c, i) => (
                <div
                  key={c.title}
                  aria-hidden={chapter !== i}
                  className={`absolute inset-0 transition-all duration-1000 ease-cine ${chapter === i ? "translate-y-0 opacity-100" : i < chapter ? "-translate-y-8 opacity-0" : "translate-y-8 opacity-0"}`}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-bone/70">{c.kicker}</p>
                  <p className="mt-3 font-serif text-5xl font-light leading-[1.05] md:text-7xl">{c.title}</p>
                  <p className="mt-5 max-w-sm text-base leading-relaxed text-bone/85">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress rail */}
        <div className="absolute right-6 top-1/2 h-40 w-px -translate-y-1/2 bg-bone/20 md:right-10" aria-hidden>
          <div ref={bar} className="h-full w-full origin-top scale-y-0 bg-ochre" />
        </div>
        {use3D && (
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.25em] text-bone/70">
            Mueve el cursor · sigue deslizando
          </p>
        )}
      </div>
    </section>
  );
}

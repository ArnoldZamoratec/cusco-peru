"use client";
// ============================================================
// HERO — looping Machu Picchu timelapse, dark gradient, giant
// letter-by-letter title, glass CTA and pulsing scroll line.
// ============================================================
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { site } from "@/data/content";

function useReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if ((window as unknown as { __cuscoReady?: boolean }).__cuscoReady) return setReady(true);
    const on = () => setReady(true);
    addEventListener("cusco:ready", on);
    return () => removeEventListener("cusco:ready", on);
  }, []);
  return ready;
}

// Splits text into individually animated letters or words (screen readers get the full string).
// The clip mask is padded and pulled back with negative margins so italic overhangs and
// descenders aren't cut off; word mode also keeps line breaks between words only.
function Letters({ text, delay, className, show, by = "letter" }: { text: string; delay: number; className?: string; show: boolean; by?: "letter" | "word" }) {
  const parts = by === "word" ? text.split(" ") : text.split("");
  const stagger = by === "word" ? 0.12 : 0.045;
  return (
    <span className={className} aria-hidden>
      {parts.map((ch, i) => (
        <span key={i}>
          <span className="-mx-[0.15em] -my-[0.2em] inline-block overflow-hidden px-[0.15em] py-[0.2em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "110%", opacity: 0 }}
              animate={show ? { y: "0%", opacity: 1 } : {}}
              transition={{ duration: 1, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          </span>
          {by === "word" && i < parts.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const ready = useReady();
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Parallax: video drifts at 0.3x and the title lifts away as you scroll.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.current?.pause();
      setPlaying(false);
    }
  }, []);

  const toggleVideo = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return (
    <section
      id="top"
      ref={ref}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink text-bone"
      onMouseMove={(e) => setMouse({ x: e.clientX / innerWidth - 0.5, y: e.clientY / innerHeight - 0.5 })}
    >
      {/* Background video (poster doubles as the LCP image) */}
      <motion.div style={{ y: videoY }} className="absolute inset-0 scale-110">
        <video
          ref={video}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/og-image.jpg"
          aria-hidden
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Cinematic overlays: vignette + bottom fade into page */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/25 to-ink" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(13,13,13,0.65)_100%)]" aria-hidden />

      <motion.div style={{ y: titleY, opacity: fade }} className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.p
          className="eyebrow !text-ochre"
          initial={{ opacity: 0, y: 10 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1 }}
        >
          Cusco, Perú · 3.399 m s. n. m.
        </motion.p>

        <h1 className="mt-6" style={{ transform: `translate3d(${mouse.x * -18}px, ${mouse.y * -12}px, 0)`, transition: "transform 0.6s cubic-bezier(.22,1,.36,1)" }}>
          <span className="sr-only">{site.title}</span>
          <Letters text="CUSCO" delay={0.2} show={ready}
            className="block font-serif text-[22vw] font-light leading-[0.85] tracking-[-0.02em] md:text-[15vw]" />
          <Letters text="Donde los Andes cuentan su historia" by="word" delay={0.6} show={ready}
            className="mx-auto mt-4 block max-w-[92vw] font-serif text-[5.3vw] font-light italic leading-tight md:text-[3.4vw]" />
        </h1>

        <motion.p
          className="mt-6 max-w-md text-sm uppercase tracking-[0.3em] text-bone/85 md:text-base"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 1.9 }}
        >
          {site.tagline}
        </motion.p>

        <motion.a
          href="#why"
          data-cursor="¡Explora!"
          className="glass group mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-bone transition-all duration-500 hover:bg-bone/20"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 2.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Comienza a explorar
          <span className="transition-transform duration-500 group-hover:translate-x-1.5" aria-hidden>→</span>
        </motion.a>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 max-[720px]:hidden" aria-hidden>
        <span className="text-[10px] uppercase tracking-mega text-bone/70">Desliza</span>
        <span className="scroll-line h-16 w-px bg-bone/20" />
      </div>

      {/* Video pause control (WCAG 2.2.2) */}
      <button
        onClick={toggleVideo}
        className="glass absolute bottom-8 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-bone md:right-8"
        aria-label={playing ? "Pausar video de fondo" : "Reproducir video de fondo"}
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden><rect x="2" y="1" width="3" height="10" /><rect x="7" y="1" width="3" height="10" /></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden><path d="M2 1l9 5-9 5z" /></svg>
        )}
      </button>

      <p className="absolute bottom-8 left-4 z-10 hidden text-[10px] uppercase tracking-[0.2em] text-bone/60 md:left-8 md:block">
        Machu Picchu · Amanecer entre las nubes
      </p>
    </section>
  );
}

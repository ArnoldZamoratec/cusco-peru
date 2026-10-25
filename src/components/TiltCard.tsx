"use client";
// ============================================================
// TILT CARD — follows the cursor in 3D. Layers sit at different
// translateZ depths (photo → title → badge) for real parallax.
// ============================================================
import { useRef } from "react";
import Image from "next/image";
import { images, type ImageKey } from "@/data/images";

type Props = {
  image: ImageKey;
  alt: string;
  index: number;
  title: string;
  kicker: string;
  meta: string;
  description: string;
  className?: string;
  sizes?: string;
};

export default function TiltCard({ image, alt, index, title, kicker, meta, description, className = "", sizes = "(min-width:1024px) 33vw, 100vw" }: Props) {
  const card = useRef<HTMLDivElement>(null);
  const shine = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !card.current) return;
    const r = card.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    card.current.style.transform = `rotateY(${(px - 0.5) * 14}deg) rotateX(${(0.5 - py) * 12}deg)`;
    if (shine.current) shine.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(245,241,232,0.22), transparent 55%)`;
  };
  const onLeave = () => {
    if (card.current) card.current.style.transform = "rotateY(0deg) rotateX(0deg)";
    if (shine.current) shine.current.style.background = "transparent";
  };

  const img = images[image];
  return (
    <div className="h-full [perspective:1200px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div
        ref={card}
        data-cursor="explorar"
        className={`${className} group relative h-full min-h-[420px] overflow-hidden rounded-[28px] bg-ink text-bone shadow-2xl shadow-black/30 transition-transform duration-500 ease-cine [transform-style:preserve-3d] focus-within:ring-2 focus-within:ring-ochre`}
      >
        {/* Layer 0 — photo */}
        <div className="absolute inset-0 [transform:translateZ(0)]">
          <Image
            src={img.src}
            alt={alt}
            fill
            sizes={sizes}
            placeholder="blur"
            blurDataURL={img.blurDataURL}
            className="object-cover transition-transform duration-[1.4s] ease-cine group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
          <div className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/35" />
        </div>
        <div ref={shine} className="pointer-events-none absolute inset-0 transition-[background] duration-300" aria-hidden />

        {/* Layer 1 — badge */}
        <div className="absolute left-6 top-6 flex items-center gap-3 [transform:translateZ(70px)]">
          <span className="glass flex h-11 w-11 items-center justify-center rounded-full font-serif text-lg">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-[11px] uppercase tracking-[0.25em] text-bone/85">{meta}</span>
        </div>

        {/* Layer 2 — title + revealed description */}
        <div className="absolute inset-x-0 bottom-0 p-6 [transform:translateZ(50px)] md:p-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-ochre">{kicker}</p>
          <h3 className="mt-2 font-serif text-4xl font-light leading-none md:text-5xl">{title}</h3>
          <div className="grid transition-all duration-700 ease-cine [grid-template-rows:1fr] [@media(hover:hover)]:[grid-template-rows:0fr] [@media(hover:hover)]:group-hover:[grid-template-rows:1fr] [@media(hover:hover)]:group-focus-within:[grid-template-rows:1fr]">
            <div className="overflow-hidden">
              <p className="mt-4 max-w-md text-sm leading-relaxed text-bone/90">{description}</p>
              <a
                href="#plan"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-bone/40 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:bg-bone hover:text-ink"
              >
                Descubrir <span className="sr-only">{title}</span> <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

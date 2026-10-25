"use client";

import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Loader from "@/components/Loader";
import WhyCusco from "@/components/WhyCusco";
import TextileDivider from "@/components/TextileDivider";
import Iconic7 from "@/components/Iconic7";
import FlyThrough from "@/components/FlyThrough";
import ValleyMap from "@/components/ValleyMap";
import { FadeUp, Stagger, Reveal } from "@/components/Reveal";
import { journeys, moments, gallery } from "@/data/content";
import { images } from "@/data/images";
import TiltCard from "@/components/TiltCard";
import Image from "next/image";

const galleryRatios = ["aspect-[4/5]", "aspect-[3/2]", "aspect-[4/3]", "aspect-[3/4]", "aspect-[4/5]"];

export default function Home() {
  return (
    <>
      <Loader />
      <Nav />
      <main id="main">
        <Hero />
        <WhyCusco />
        <TextileDivider />
        <Iconic7 />
        <FlyThrough />
        <ValleyMap />

        <section id="journeys" className="px-4 py-28 md:px-8 md:py-40">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16">
              <p className="eyebrow">Rutas para inspirarte</p>
              <h2 className="mt-5 font-serif text-4xl font-light leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                Encuentra tu camino <em className="text-accent">andino</em>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                Ideas de itinerario para descubrir Cusco, el Valle Sagrado y sus paisajes a tu propio ritmo.
              </p>
            </div>
            <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {journeys.map((j) => (
                <Reveal key={j.name}>
                  <article className={`group relative overflow-hidden rounded-[28px] border border-line/10 ${j.featured ? "md:col-span-2 lg:col-span-1 lg:translate-y-6" : ""}`}>
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={images[j.image].src}
                        alt={j.name}
                        fill
                        sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                        placeholder="blur"
                        blurDataURL={images[j.image].blurDataURL}
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.25em] text-bone/70">{j.days} días · idea de ruta</p>
                        {j.featured && <span className="rounded-full bg-ochre/90 px-3 py-1 text-xs uppercase tracking-[0.2em] text-ink">Recomendada</span>}
                      </div>
                      <h3 className="mt-3 font-serif text-3xl font-light text-bone">{j.name}</h3>
                      <p className="mt-2 text-sm text-bone/80">{j.vibe}</p>
                      <ul className="mt-4 space-y-1 text-sm text-bone/70">
                        {j.highlights.slice(0, 3).map((h) => (
                          <li key={h}>• {h}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              ))}
            </Stagger>
            <p className="mt-8 text-sm text-muted">Son propuestas de referencia; verifica horarios, accesos y servicios antes de viajar.</p>
          </div>
        </section>

        <section id="vibe" className="px-4 py-28 md:px-8 md:py-40">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16">
              <p className="eyebrow">Cultura y territorio</p>
              <h2 className="mt-5 font-serif text-4xl font-light leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                Un viaje más allá de la <em className="text-accent">postal</em>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                Montañas, memoria y saberes locales: algunas claves para mirar Cusco con más contexto.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {moments.map((moment, i) => (
                <FadeUp key={moment.title} delay={(i % 3) * 0.1}>
                  <article className="group h-full overflow-hidden rounded-[28px] border border-line/10 bg-surface">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={images[moment.image].src}
                        alt={moment.title}
                        fill
                        sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                        placeholder="blur"
                        blurDataURL={images[moment.image].blurDataURL}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-7">
                      <h3 className="font-serif text-2xl font-light">{moment.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted">{moment.description}</p>
                    </div>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-28 md:px-8 md:py-40">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16">
              <p className="eyebrow">Galería</p>
              <h2 className="mt-5 font-serif text-4xl font-light leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                Postales <em className="text-accent">vivas</em> de Cusco
              </h2>
            </div>
            <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
              {gallery.map((g, i) => (
                <figure key={g.image} className="mb-4 break-inside-avoid overflow-hidden rounded-[24px]">
                  <div className={`relative ${galleryRatios[i % galleryRatios.length]}`}>
                    <Image
                      src={images[g.image].src}
                      alt={g.alt}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                      placeholder="blur"
                      blurDataURL={images[g.image].blurDataURL}
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <figcaption className="p-4 text-sm text-muted">{g.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="plan" className="px-4 py-28 md:px-8 md:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <p className="eyebrow">Tu próxima aventura</p>
            <h2 className="mt-5 font-serif text-4xl font-light leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Cusco te espera <em className="text-accent">a tu manera</em>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Guarda tus lugares favoritos, revisa las condiciones de altura y prepara una ruta que respete tu ritmo y el territorio.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href="#journeys" className="rounded-full bg-terracotta px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:bg-[#a8431f]">
                Ver rutas sugeridas
              </a>
              <a href="https://www.google.com/maps/search/?api=1&query=Cusco%2C+Per%C3%BA" target="_blank" rel="noreferrer" className="rounded-full border border-line/30 px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] transition-colors hover:bg-surface">
                Ver Cusco en el mapa
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-line/10 px-4 py-12 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden>
              <path d="M26 8h12v8h8v10h10v12H46v10h-8v8H26v-8h-8V38H8V26h10V16h8z" fill="#C1502E" />
              <circle cx="32" cy="32" r="4" fill="#D4A24C" />
            </svg>
            <span className="font-serif text-xl tracking-[0.25em]">CUSCO</span>
          </div>
          <p className="text-sm text-muted">© {new Date().getFullYear()} Cusco · Una guía visual para viajar con curiosidad y respeto.</p>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-line/10 pt-6">
          <details className="group text-sm text-muted">
            <summary className="w-fit cursor-pointer list-none transition-colors hover:text-fg">
              Créditos y licencias de las fotografías <span className="ml-1 text-accent group-open:inline-block group-open:rotate-180">⌄</span>
            </summary>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(images).map(([key, image]) => (
                <li key={key} className="leading-relaxed">
                  <span className="capitalize text-fg">{key.replace(/-/g, " ")}</span>
                  <span> · {image.credit.author || "Autoría no indicada"} · {image.credit.license} · </span>
                  <a href={image.credit.url} target="_blank" rel="noreferrer" className="underline decoration-line/30 underline-offset-4 hover:text-fg">
                    ver fuente
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </footer>
    </>
  );
}

// ============================================================
// SIETE IMPERDIBLES — editorial grid of must-do experiences.
// ============================================================
import { iconic7 } from "@/data/content";
import TiltCard from "./TiltCard";
import { FadeUp, SectionHeading } from "./Reveal";

// Asymmetric 6-column layout: big/small, three, two.
const spans = ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-3"];

const alts: Record<string, string> = {
  "machu-picchu": "Ciudadela de Machu Picchu entre montañas y nubes",
  "rainbow-mountain": "Laderas de colores de Vinicunca bajo el cielo andino",
  "sacred-valley": "Andenes incas en el paisaje del Valle Sagrado",
  sacsayhuaman: "Muros incas de piedra en Sacsayhuamán",
  "maras-moray": "Pozas de sal de Maras en la ladera de una montaña",
  humantay: "Laguna Humantay de color turquesa bajo los nevados",
  "san-blas": "Calle empedrada del barrio de San Blas al atardecer",
};

export default function Iconic7() {
  return (
    <section id="iconic" tabIndex={-1} className="px-4 py-28 md:px-8 md:py-40" aria-labelledby="iconic-title">
      <SectionHeading
        id="iconic-title"
        eyebrow="Siete lugares imperdibles"
        title={<>Lugares que se quedan <em className="text-accent">contigo</em>.</>}
        intro="Explora algunos de los paisajes y sitios culturales más memorables de Cusco."
      />
      <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
        {iconic7.map((e, i) => (
          <FadeUp key={e.slug} delay={(i % 3) * 0.1} className={`${spans[i]} ${i === 0 ? "md:col-span-2" : ""}`}>
            <TiltCard
              index={i}
              image={e.image}
              alt={alts[e.slug]}
              title={e.title}
              kicker={e.kicker}
              meta={e.altitude}
              description={e.description}
              className={`h-full ${i === 0 ? "lg:min-h-[620px]" : ""}`}
              sizes={i === 0 ? "(min-width:1024px) 66vw, 100vw" : "(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"}
            />
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

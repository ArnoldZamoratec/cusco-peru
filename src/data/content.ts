// ============================================================
// SITE CONTENT — single source of truth for copy.
// Swap this file for a CMS fetch (Sanity / Contentful) later:
// every section only consumes these typed arrays.
// ============================================================
import type { ImageKey } from "./images";

export const site = {
  name: "Cusco",
  title: "Cusco — Donde los Andes cuentan su historia",
  tagline: "Historia viva, cultura andina y naturaleza en cada camino.",
  description:
    "Explora Machu Picchu al amanecer, la Montaña de Siete Colores, las salineras de Maras y los paisajes del Valle Sagrado. Inspírate para viajar a Cusco, Perú.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cusco-travel.vercel.app",
};

export const stats = [
  { value: 3399, suffix: " m", label: "Altitud de Cusco", note: "Tómate el día con calma al llegar.", icon: "mountain" },
  { value: 1, suffix: "", label: "Maravilla del mundo", note: "Machu Picchu, reconocida en 2007.", icon: "wonder", display: "1 de 7" },
  { value: 500, suffix: "+", label: "Años de historia", note: "Un legado vivo entre los Andes.", icon: "sun" },
  { value: 0, suffix: "", label: "Recuerdos", note: "Imposibles de medir.", icon: "infinity", display: "∞" },
] as const;

export type Experience = {
  slug: string;
  title: string;
  kicker: string;
  image: ImageKey;
  description: string;
  altitude: string;
};

export const iconic7: Experience[] = [
  {
    slug: "machu-picchu",
    title: "Machu Picchu",
    kicker: "La ciudad entre las nubes",
    image: "machu-picchu",
    altitude: "2,430m",
    description:
      "Construida durante el siglo XV, esta ciudadela se alza entre montañas y nubes. Al amanecer, la luz revela poco a poco sus terrazas de piedra.",
  },
  {
    slug: "rainbow-mountain",
    title: "Montaña de 7 Colores",
    kicker: "Vinicunca",
    image: "rainbow-mountain",
    altitude: "≈5,000m",
    description:
      "Franjas de tonos rojizos, ocres y verdes recorren la montaña. La caminata exige aclimatarse y avanzar con calma: aquí se superan los 5.000 metros.",
  },
  {
    slug: "sacred-valley",
    title: "Valle Sagrado",
    kicker: "Valle Sagrado",
    image: "sacred-valley",
    altitude: "2,800m",
    description:
      "Pueblos, andenes y campos acompañan el curso del río Urubamba. Un paisaje para recorrer sin prisa y conocer la herencia viva de los Andes.",
  },
  {
    slug: "sacsayhuaman",
    title: "Sacsayhuamán",
    kicker: "Piedra sobre piedra",
    image: "sacsayhuaman",
    altitude: "3,700m",
    description:
      "Sus muros de piedra labrada forman un impresionante zigzag sobre la ciudad. Recorre el sitio con respeto y dedica tiempo a observar cada detalle.",
  },
  {
    slug: "maras-moray",
    title: "Maras y Moray",
    kicker: "Sal y andenes circulares",
    image: "maras",
    altitude: "3,380m",
    description:
      "Las pozas de sal de Maras siguen siendo trabajadas por familias de la zona. Muy cerca, las terrazas circulares de Moray crean un paisaje único.",
  },
  {
    slug: "humantay",
    title: "Laguna Humantay",
    kicker: "Turquesa entre montañas",
    image: "humantay",
    altitude: "4,200m",
    description:
      "Una laguna de tonos turquesa al pie de los nevados. La caminata alcanza gran altitud: aclimátate, consulta las condiciones y avanza a tu ritmo.",
  },
  {
    slug: "san-blas",
    title: "San Blas",
    kicker: "Barrio de artistas",
    image: "san-blas",
    altitude: "3,450m",
    description:
      "Calles empedradas, talleres de arte y cafés de barrio hacen de San Blas un buen lugar para caminar, descubrir y disfrutar la tarde.",
  },
];

// Interactive valley map — coordinates are % positions on the stylized map.
export const mapPoints: {
  name: string;
  x: number;
  y: number;
  image: ImageKey;
  fact: string;
}[] = [
  { name: "Machu Picchu", x: 9, y: 22, image: "machu-clouds", fact: "La ciudadela está rodeada por las montañas Huayna Picchu y Machu Picchu, sobre el valle del río Urubamba." },
  { name: "Ollantaytambo", x: 30, y: 40, image: "ollantaytambo", fact: "Su traza urbana conserva calles y canales de origen inca, que todavía forman parte del pueblo." },
  { name: "Maras", x: 46, y: 60, image: "moray", fact: "Las salineras están formadas por miles de pozas alimentadas por un manantial salino." },
  { name: "Chinchero", x: 62, y: 70, image: "chinchero", fact: "En Chinchero, familias tejedoras mantienen técnicas tradicionales de teñido y tejido." },
  { name: "Pisac", x: 80, y: 42, image: "pisac", fact: "El complejo arqueológico de Pisac se extiende por la montaña, entre andenes y recintos incas." },
  { name: "Cusco", x: 86, y: 80, image: "cathedral", fact: "La ciudad combina vestigios incas, arquitectura colonial y barrios que conservan su identidad propia." },
];

export type Journey = {
  name: string;
  days: number;
  vibe: string;
  image: ImageKey;
  highlights: string[];
  featured?: boolean;
};

export const journeys: Journey[] = [
  {
    name: "Aventura andina",
    days: 7,
    vibe: "Caminatas, mercados locales y noches en el centro histórico.",
    image: "rainbow-mountain",
    highlights: ["Caminata a la Montaña de 7 Colores", "Ruta a la laguna Humantay", "Visita a Machu Picchu", "Tarde por las calles de San Blas"],
  },
  {
    name: "Valle Sagrado sin prisa",
    days: 5,
    vibe: "Pueblos, paisajes y tiempo para conocer la cultura local.",
    image: "sacred-valley",
    highlights: ["Mercado y sitio arqueológico de Pisac", "Tradición textil de Chinchero", "Salineras de Maras y terrazas de Moray", "Tren hacia Machu Picchu"],
    featured: true,
  },
  {
    name: "Escapada entre los Andes",
    days: 10,
    vibe: "Un itinerario amplio para disfrutar cada parada con calma.",
    image: "machu-dawn",
    highlights: ["Amanecer en Machu Picchu", "Recorrido por el Valle Sagrado", "Tiempo libre en Cusco", "Paisajes de montaña y cultura local"],
  },
];

export const gallery: { image: ImageKey; caption: string; alt: string }[] = [
  { image: "llama", caption: "Una visita curiosa en el camino", alt: "Una llama blanca mira a la cámara junto a las ruinas de Machu Picchu" },
  { image: "cusco-night", caption: "Cusco al caer la noche", alt: "Calle colonial iluminada por faroles en Cusco" },
  { image: "market-pigments", caption: "Colores del mercado andino", alt: "Cuencos con pigmentos naturales de colores en el mercado de Pisac" },
  { image: "weaver", caption: "Tejidos que cuentan historias", alt: "Tejedora andina trabaja en un telar con un tejido rojo y dorado" },
  { image: "inti-raymi", caption: "Inti Raymi, Fiesta del Sol", alt: "Representación del Inca durante la celebración del Inti Raymi" },
  { image: "coffee", caption: "Una pausa en San Blas", alt: "Taza de café sobre un plato azul estampado" },
  { image: "alpaca", caption: "Una compañera de altura", alt: "Alpaca de lana larga sobre una montaña de los Andes" },
  { image: "market-street", caption: "Un paseo por el mercado", alt: "Calle estrecha con puestos de textiles coloridos en Pisac" },
  { image: "inca-wall", caption: "El detalle de la piedra", alt: "Detalle de un muro inca de piedras encajadas con precisión" },
  { image: "inti-raymi-sacsayhuaman", caption: "Celebración en Sacsayhuamán", alt: "Danzantes en la explanada de Sacsayhuamán durante el Inti Raymi" },
  { image: "humantay-trail", caption: "El camino a Humantay", alt: "Caminantes en un sendero bajo los nevados de Humantay" },
  { image: "alpacas-trail", caption: "Un encuentro en la montaña", alt: "Alpacas recorren un sendero rocoso en un valle andino" },
];

export const moments = [
  { title: "Montañas de muchos colores", image: "rainbow-mountain" as ImageKey, description: "Vinicunca sorprende con sus franjas minerales. La altura es exigente: aclimatarse antes de la caminata es fundamental." },
  { title: "Una ciudad para caminar", image: "san-blas" as ImageKey, description: "En San Blas, calles empedradas y talleres de artistas revelan otra cara del centro histórico." },
  { title: "Piedra y memoria", image: "machu-picchu" as ImageKey, description: "Machu Picchu forma parte del Santuario Histórico y es uno de los paisajes culturales más reconocidos del Perú." },
  { title: "El arte de tejer", image: "weaver" as ImageKey, description: "Los textiles andinos reúnen técnicas, colores y conocimientos que se transmiten entre generaciones." },
  { title: "Agua de deshielo", image: "humantay" as ImageKey, description: "La laguna Humantay se encuentra en un entorno de alta montaña: revisa el clima y sigue las indicaciones locales." },
];

// Scroll-driven flight chapters (pinned 3D section).
export const chapters = [
  { kicker: "Capítulo I", title: "Sobre las nubes", body: "La niebla de la mañana se abre entre las montañas y deja ver, poco a poco, la ciudadela." },
  { kicker: "Capítulo II", title: "El dibujo de los andenes", body: "Terrazas de piedra recorren la ladera y dan forma a uno de los paisajes más memorables del Perú." },
  { kicker: "Capítulo III", title: "La montaña guardiana", body: "Huayna Picchu se alza junto a la ciudadela. Una vista que recuerda la escala del paisaje andino." },
];

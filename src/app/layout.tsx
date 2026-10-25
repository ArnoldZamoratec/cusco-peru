import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/data/content";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";

// Editorial serif for titles + clean sans for body.
const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif", axes: ["opsz", "SOFT"], display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

// ---------- SEO + Open Graph ----------
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s · Cusco" },
  description: site.description,
  keywords: ["Cusco", "Machu Picchu", "Perú", "Montaña de 7 Colores", "Valle Sagrado", "viajes a Cusco"],
  openGraph: {
    type: "website",
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: "Cusco · Donde los Andes cuentan su historia",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Machu Picchu sobre el valle del Urubamba" }],
    locale: "es_PE",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0D0D0D" },
    { media: "(prefers-color-scheme: light)", color: "#F5F1E8" },
  ],
};

// Runs before paint so the persisted theme never flashes.
const themeScript = `try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="dark" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-bone focus:px-5 focus:py-3 focus:text-ink">
          Ir al contenido
        </a>
        <SmoothScroll />
        <Cursor />
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}

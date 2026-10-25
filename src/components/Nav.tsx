"use client";
// ============================================================
// NAV — transparent over the hero, frosted once you scroll.
// Includes the persistent dark/light toggle.
// ============================================================
import { useEffect, useState } from "react";

const links = [
  { href: "#iconic", label: "Imperdibles" },
  { href: "#map", label: "El valle" },
  { href: "#journeys", label: "Rutas" },
  { href: "#vibe", label: "Cultura" },
  { href: "#plan", label: "Explora" },
];

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
  };
  return (
    <button onClick={toggle} aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
      className="glass relative flex h-10 w-10 items-center justify-center rounded-full text-bone transition-transform hover:scale-105">
      {theme === "dark" ? (
        // Sun (Inti)
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="12" y1="2.5" x2="12" y2="5" transform={`rotate(${a} 12 12)`} />
          ))}
        </svg>
      ) : (
        // Moon (Mama Killa)
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(scrollY > 60);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-cine ${scrolled ? "bg-ink/70 py-3 backdrop-blur-xl" : "py-6"}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8" aria-label="Navegación principal">
        <a href="#top" className="flex items-center gap-3 text-bone" aria-label="Cusco — volver al inicio">
          <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden>
            <path d="M26 8h12v8h8v10h10v12H46v10h-8v8H26v-8h-8V38H8V26h10V16h8z" fill="#C1502E" />
            <circle cx="32" cy="32" r="4" fill="#D4A24C" />
          </svg>
          <span className="font-serif text-xl tracking-[0.25em]">CUSCO</span>
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="group relative text-[13px] uppercase tracking-[0.18em] text-bone/85 transition-colors hover:text-bone">
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-ochre transition-all duration-500 ease-cine group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a href="#plan" className="hidden rounded-full bg-terracotta px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.14em] text-bone transition-colors hover:bg-[#a8431f] sm:inline-block">
            ¡Vamos!
          </a>
          <button className="glass flex h-10 w-10 items-center justify-center rounded-full text-bone md:hidden" onClick={() => setOpen(!open)}
            aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Cerrar menú" : "Abrir menú"}>
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px w-5 bg-current transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>
      <div id="mobile-menu" hidden={!open} className="mx-4 mt-3 rounded-3xl bg-ink/90 p-6 backdrop-blur-xl md:hidden">
        <ul className="space-y-4">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="font-serif text-3xl text-bone">{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

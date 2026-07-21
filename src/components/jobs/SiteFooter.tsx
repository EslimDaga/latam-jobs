import { Reveal } from "@/components/motion";

/**
 * SiteFooter — pie de página del sitio de empleos LATAM.
 *
 * Reproduce el diseño de Figma: una franja superior con degradado de índigo a
 * magenta (los colores de marca), sobre un cuerpo claro con el logotipo
 * atenuado a la izquierda y tres columnas de enlaces a la derecha, más una
 * fila inferior con el copyright y el selector de país/idioma.
 */

type FooterColumn = { title: string; links: { label: string; href: string }[] };

const COLUMNS: FooterColumn[] = [
  {
    title: "Carreras",
    links: [
      { label: "Vacantes", href: "#vacantes" },
      { label: "Proceso de selección", href: "#proceso" },
      { label: "Cultura", href: "#cultura" },
      { label: "Testimonios", href: "#testimonios" },
    ],
  },
  {
    title: "LATAM",
    links: [
      { label: "Sobre LATAM", href: "#" },
      { label: "Sostenibilidad", href: "#" },
      { label: "Diversidad e inclusión", href: "#" },
      { label: "Prensa", href: "#" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { label: "Preguntas frecuentes", href: "#" },
      { label: "Contacto", href: "mailto:empleos@latam.com" },
      { label: "Privacidad", href: "#" },
    ],
  },
];

function ChileFlag() {
  return (
    <svg
      width="20"
      height="14"
      viewBox="0 0 30 20"
      role="img"
      aria-label="Bandera de Chile"
      className="rounded-[2px] ring-1 ring-black/10"
    >
      <rect width="30" height="10" fill="#ffffff" />
      <rect y="10" width="30" height="10" fill="#D52B1E" />
      <rect width="10" height="10" fill="#0039A6" />
      <path
        d="M5 1.6 L5.882 3.786 L8.233 3.949 L6.427 5.464 L6.999 7.751 L5 6.5 L3.001 7.751 L3.573 5.464 L1.767 3.949 L4.118 3.786 Z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="w-full">
      {/* Franja de marca: índigo → magenta */}
      <div
        className="h-[60px] w-full"
        style={{
          background:
            "linear-gradient(90deg, #0a0030 0%, #1b0563 24%, #4a107f 48%, #8f157f 72%, #d31a7b 100%)",
        }}
      />

      <div className="bg-[#f4f5f8]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <Reveal>
          <div className="flex flex-col gap-14 lg:flex-row lg:justify-between">
            {/* Logotipo */}
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/latam-logo-dark.svg"
                alt="LATAM Airlines"
                width={150}
                height={46}
                className="h-11 w-auto opacity-50"
              />
            </div>

            {/* Columnas de enlaces */}
            <nav
              aria-label="Enlaces del pie de página"
              className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3 sm:gap-x-16 lg:gap-x-24"
            >
              {COLUMNS.map((col) => (
                <div key={col.title}>
                  <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#474c8a]">
                    {col.title}
                  </h3>
                  <ul className="mt-5 space-y-3.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-[15px] text-[#8388b3] transition-colors duration-200 hover:text-indigo-latam"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          </Reveal>

          {/* Fila inferior */}
          <Reveal delay={0.1}>
          <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#9297bd]">© 2026 LATAM Airlines Chile</p>
            <div className="flex items-center gap-2 text-sm text-[#6f74a3]">
              <ChileFlag />
              <span>Chile · Español</span>
            </div>
          </div>
          </Reveal>
        </div>
      </div>
    </footer>
  );
}

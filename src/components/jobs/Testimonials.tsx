"use client";

import { PaperPlaneTilt } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion";

/**
 * Testimonials — "Voces a bordo".
 *
 * Reproduce el diseño de Figma: un bloque centrado (antetítulo rosa, título
 * índigo y bajada) sobre una fila de cinco tarjetas fotográficas dispuestas en
 * arco —la central es la más alta— con sombra difusa, y un CTA rojo tipo
 * píldora. Las tarjetas entran de forma escalonada al aparecer en viewport.
 */

type Story = { src: string; alt: string; h: number; pos?: string };

// Alturas en px que forman el arco (la central es la más alta). El ancho es
// constante; el conjunto va centrado verticalmente para que el arco sea
// simétrico arriba y abajo, como en el diseño.
const STORIES: Story[] = [
  { src: "/images/voces/voces-01.jpg", alt: "Agentes de servicio de LATAM sonriendo en el aeropuerto", h: 300, pos: "45% 30%" },
  { src: "/images/voces/voces-05.jpg", alt: "Piloto de LATAM en la cabina de mando", h: 338, pos: "55% 35%" },
  { src: "/images/voces/voces-04.jpg", alt: "Piloto de LATAM sonriendo en la cabina de mando", h: 366, pos: "50% 22%" },
  { src: "/images/voces/voces-02.jpg", alt: "Agente de counter de LATAM sonriendo", h: 338, pos: "60% 32%" },
  { src: "/images/voces/voces-03.jpg", alt: "Técnico de mantenimiento de LATAM revisando equipo de a bordo", h: 300, pos: "72% 28%" },
];

export function Testimonials(): React.JSX.Element {
  return (
    <section
      id="testimonios"
      aria-labelledby="testimonios-title"
      className="w-full bg-white px-5 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <Reveal className="text-center" from="up">
          <span className="mb-4 block text-xs font-black uppercase leading-[10.798px] tracking-[3.4554px] text-[#E6114C]">
            Explora tu próximo rol
          </span>
          <h2
            id="testimonios-title"
            className="mx-auto text-[clamp(1.75rem,2.86vw,41.212px)] font-bold leading-[0.9719] tracking-[-0.3927px] text-[#1B0088] [font-family:var(--font-inter),sans-serif] md:whitespace-nowrap"
          >
            Hay muchas formas de construir LATAM
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15.216px] font-normal leading-[22.823px] text-[#5B6172] [font-family:var(--font-inter),sans-serif] lg:max-w-none lg:whitespace-nowrap">
            Descubre dónde puede despegar tu talento y conoce las oportunidades
            disponibles en nuestros distintos equipos.
          </p>
        </Reveal>

        {/* Fila de tarjetas en arco */}
        <div className="mt-16 flex items-center justify-start gap-4 overflow-x-auto pb-6 sm:gap-5 xl:justify-center xl:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STORIES.map((s, i) => (
            <Reveal key={s.src} from="up" delay={i * 0.09} offset={32} className="shrink-0">
              <figure
                className="group relative w-44 overflow-hidden rounded-[28px] shadow-[0_30px_58px_-26px_rgba(16,0,79,0.45)] ring-1 ring-black/[0.04] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 sm:w-52"
                style={{ height: `${s.h}px` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={s.alt}
                  loading="lazy"
                  style={{ objectPosition: s.pos ?? "50% 50%" }}
                  className="h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                {/* Velo inferior sutil para dar profundidad como en el diseño */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-indigo-latam-deep/20 to-transparent" />
              </figure>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal className="mt-12 flex justify-center" from="up" delay={0.1}>
          <a
            href="#vacantes"
            className="group inline-flex items-center gap-2.5 rounded-full bg-red-latam px-8 py-4 text-[15.75px] font-medium text-white [font-family:var(--font-inter),sans-serif] shadow-[0_0.75rem_2rem_-0.4rem_rgba(232,17,75,0.5)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-red-latam-deep active:scale-[0.98]"
          >
            Explorar todos los roles
            <PaperPlaneTilt
              size={18}
              weight="fill"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

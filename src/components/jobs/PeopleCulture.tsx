"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion";

/**
 * Sección "Personas y Cultura LATAM Airlines" — fondo índigo con texto blanco,
 * diseño editorial centrado, con CTA "Ver vacantes" en pill blanco.
 */
export function PeopleCulture(): React.JSX.Element {
  return (
    <section
      aria-label="Personas y Cultura"
      className="relative overflow-hidden bg-indigo-latam px-6 py-20 text-white lg:px-12 lg:py-28"
    >
      {/* Decorative gradient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-indigo-latam-soft/40 blur-3xl"
      />

      <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        {/* Small label */}
        <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
          Personas y Cultura
        </span>

        {/* Red accent line */}
        <div className="my-5 h-0.5 w-16 rounded-full bg-red-latam" />

        {/* Heading */}
        <h2 className="text-3xl font-semibold leading-tight lg:text-5xl">
          En LATAM creemos que el talento transforma el cielo
        </h2>

        {/* Description */}
        <p className="mt-6 text-lg leading-relaxed text-white/75">
          Somos más de 40,000 personas apasionadas por conectar América Latina con el mundo.
          Nuestra cultura se construye sobre la colaboración, la innovación y el respeto por
          cada persona que forma parte de este viaje.
        </p>

        {/* CTA Button */}
        <a
          href="/vacantes"
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-indigo-latam shadow-lg transition-all duration-200 hover:scale-105 hover:bg-white/90 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Ver vacantes
          <ArrowRightIcon
            weight="bold"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </a>
      </Reveal>
    </section>
  );
}

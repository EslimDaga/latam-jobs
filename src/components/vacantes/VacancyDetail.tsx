"use client";

import { BookmarkSimple, MapPin, ShareNetwork } from "@phosphor-icons/react";
import type { Vacante } from "@/lib/vacantes/vacantes";

/* ────────────────────────────────────────────────────────────────────────────
 * VacancyDetail — panel derecho de la vista /vacantes.
 *
 * Cabecera índigo con el área, el título y el CTA "Postularme" (más los
 * botones circulares de compartir/guardar), tarjeta blanca con la grilla de
 * metadatos (Área / Modalidad / Ubicación / Estado / Jornada / Idioma), las
 * secciones de contenido y la barra inferior lavanda con el CTA a todo ancho.
 * ──────────────────────────────────────────────────────────────────────────── */

const PLACEHOLDERS = {
  sobreElRol:
    "Contenido pendiente. Aquí irá la descripción del rol provista por tu equipo.",
  loQueHaras:
    "Contenido pendiente. Responsabilidades del rol, según la descripción oficial.",
  loQueBuscamos:
    "Contenido pendiente. Requisitos y perfil buscado, según la descripción oficial.",
};

function MetaItem({
  label,
  value,
  valueClassName = "text-indigo-latam-soft",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-normal uppercase tracking-[1.91px] text-[#5b567a]">
        {label}
      </span>
      <span className={`text-xl font-bold tracking-[-0.01em] ${valueClassName}`}>{value}</span>
    </div>
  );
}

function ContentSection({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="pt-6">
      <h3 className="text-[12.5px] font-bold uppercase tracking-[2.5px] text-[#e5006d]">
        {heading}
      </h3>
      <div className="mt-3 rounded-[14px] bg-[#f5f4fd] px-[21px] py-[19px]">
        <p className="text-[16px] font-semibold leading-relaxed text-indigo-latam-soft [font-family:var(--font-inter),sans-serif]">
          {body}
        </p>
      </div>
    </section>
  );
}

function IconCircleButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/25 active:scale-95"
    >
      {children}
    </button>
  );
}

export function VacancyDetail({ vacante }: { vacante: Vacante }) {
  return (
    <article
      id="detalle-vacante"
      aria-live="polite"
      className="scroll-mt-24 overflow-hidden rounded-2xl shadow-[0_28px_70px_-30px_rgba(27,0,136,0.32)]"
    >
      {/* ── Cabecera índigo ── */}
      <div className="relative bg-indigo-latam-soft px-6 pb-8 pt-7 sm:px-10">
        <div className="absolute right-5 top-5 flex gap-2.5 sm:right-8 sm:top-7">
          <IconCircleButton label={`Guardar la vacante ${vacante.titulo}`}>
            <BookmarkSimple size={20} aria-hidden />
          </IconCircleButton>
          <IconCircleButton label={`Compartir la vacante ${vacante.titulo}`}>
            <ShareNetwork size={20} aria-hidden />
          </IconCircleButton>
        </div>

        <p className="pr-32 text-sm font-normal uppercase tracking-[2.91px] text-[#ffd0e4]">
          {vacante.area}
        </p>
        <h2 className="mt-2 pr-32 text-[clamp(1.5rem,2.6vw,2rem)] font-bold tracking-[-0.027em] text-white">
          {vacante.titulo}
        </h2>
        <p className="mt-2 flex items-center gap-2 text-base text-[#e7e3ff]">
          <MapPin size={18} aria-hidden />
          {vacante.ubicacion}
        </p>

        <button
          type="button"
          className="mt-5 cursor-pointer rounded-full bg-red-latam px-[21px] py-3 text-[17px] font-medium text-white transition hover:bg-red-latam-deep active:scale-95 [font-family:var(--font-inter),sans-serif]"
        >
          Postularme
        </button>
      </div>

      {/* ── Cuerpo blanco ── */}
      <div className="border-x border-indigo-latam-soft/10 bg-white px-6 pb-10 pt-8 sm:px-10">
        {/* Grilla de metadatos */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-b border-indigo-latam-soft/15 pb-6 sm:grid-cols-3">
          <MetaItem label="Área" value={vacante.area} />
          <MetaItem label="Modalidad" value={vacante.modalidad} />
          <MetaItem label="Ubicación" value={vacante.ubicacion} />
          <MetaItem
            label="Estado"
            value={vacante.estado}
            valueClassName={vacante.estado === "Abierto" ? "text-[#128f5b]" : "text-indigo-latam-soft"}
          />
          <MetaItem label="Jornada" value={vacante.jornada} />
          <MetaItem label="Idioma" value={vacante.idioma} />
        </div>

        <ContentSection
          heading="Sobre el rol"
          body={vacante.sobreElRol ?? PLACEHOLDERS.sobreElRol}
        />
        <ContentSection
          heading="Lo que harás"
          body={vacante.loQueHaras ?? PLACEHOLDERS.loQueHaras}
        />
        <ContentSection
          heading="Lo que buscamos"
          body={vacante.loQueBuscamos ?? PLACEHOLDERS.loQueBuscamos}
        />
      </div>

      {/* ── Barra inferior con CTA a todo ancho ── */}
      <div className="border-t border-indigo-latam-soft/10 bg-[#f5f4fd] px-6 py-6 sm:px-10">
        <button
          type="button"
          className="w-full cursor-pointer rounded-full bg-red-latam py-4 text-[17px] font-semibold text-white shadow-[0_7px_31px_rgba(233,88,120,0.8)] transition hover:bg-red-latam-deep active:scale-[0.99] [font-family:var(--font-inter),sans-serif]"
        >
          Postularme
        </button>
      </div>
    </article>
  );
}

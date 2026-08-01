"use client";

import { BookmarkSimple, MapPin, ShareNetwork } from "@phosphor-icons/react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_ENTER } from "@/components/motion";
import type { Vacante } from "@/lib/vacantes/vacantes";

/* ────────────────────────────────────────────────────────────────────────────
 * VacancyDetail — panel derecho (#3298:16372), 766px de ancho.
 *
 * Cotas del Figma:
 *   · Cabecera índigo de 247px: área en y=37.82 (Latam Sans 14/19.86,
 *     tracking .208em, #FFD0E4), título en y=73.29 (Black 32/36.78,
 *     tracking -.0271em) y ubicación en y=119.51 (16/25.53, #E7E3FF). El CTA
 *     arranca en y=168.67 y mide 55.62px. Los botones circulares miden 49.64px
 *     y viven en y=26 con fondo rgba(255,255,255,.08).
 *   · "Article" (#16394): radio 18.911, borde rgba(27,0,136,.1) y sombra
 *     0 28.367px 70.916px -33.094px rgba(27,0,136,.32).
 *   · Rejilla de metadatos: 3 columnas, gap 23.639/30.730, filete inferior.
 *   · Cajas de contenido: fondo #F5F4FD y borde DISCONTINUO [2.364, 1.182]
 *     rgba(27,0,136,.16), radio 14.183, padding 18.911/21.275.
 *   · Pie: padding 26.003/40.186 sobre #F5F4FD, CTA a todo ancho.
 * ──────────────────────────────────────────────────────────────────────────── */

/** Los textos del diseño van en dos tramos: entradilla en índigo y resto en gris. */
const PLACEHOLDERS = {
  sobreElRol: "Aquí irá la descripción del rol provista por tu equipo.",
  loQueHaras: "Responsabilidades del rol, según la descripción oficial.",
  loQueBuscamos: "Requisitos y perfil buscado, según la descripción oficial.",
};

const ENTRADILLA = "Contenido pendiente.";

const CONTENIDO: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
};

const LINEA: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE_ENTER } },
};

/* `hidden` idéntico al de LINEA a propósito: es lo que se sirve en SSR y
   `useReducedMotion` difiere entre servidor y cliente (mismatch de
   hidratación). El `y` salta a duración 0 y sólo queda el fundido. */
const LINEA_REDUCIDA: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, y: { duration: 0 } } },
};

function MetaItem({
  label,
  value,
  variants,
  valueClassName = "text-[var(--fig-indigo)] tracking-[-0.0096em] leading-[28.93px]",
}: {
  label: string;
  value: string;
  variants: Variants;
  valueClassName?: string;
}) {
  return (
    <motion.div variants={variants} className="flex flex-col gap-[5.91px]">
      <span className="text-[12px] font-normal uppercase leading-[17.87px] tracking-[0.1589em] text-[var(--fig-muted)]">
        {label}
      </span>
      <span className={`text-[20px] font-bold ${valueClassName}`}>{value}</span>
    </motion.div>
  );
}

/* Sección de contenido: rótulo magenta en versalitas y caja lavanda con borde
   discontinuo. El texto arranca con la entradilla en índigo. */
function ContentSection({
  heading,
  lead,
  body,
  variants,
}: {
  heading: string;
  lead?: string;
  body: string;
  variants: Variants;
}) {
  return (
    <motion.section variants={variants} className="pt-6">
      <h3 className="text-[12.481px] font-bold uppercase leading-[18.72px] tracking-[0.2em] text-[var(--fig-magenta)]">
        {heading}
      </h3>
      <div className="pt-[11.819px]">
        <div className="rounded-[14.183px] border-[1.182px] border-dashed border-[rgba(27,0,136,0.16)] bg-[var(--fig-lavender)] px-[21.275px] py-[18.911px]">
          <p className="text-[17.398px] leading-[26.97px] font-sans">
            {lead && <span className="font-semibold text-[var(--fig-indigo)]">{lead} </span>}
            <span className="font-normal text-[var(--fig-muted)]">{body}</span>
          </p>
        </div>
      </div>
    </motion.section>
  );
}

/* Botón circular de la cabecera: 49.64px, fondo blanco al 8% y borde al 28%. */
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
      className="flex h-[49.64px] w-[49.64px] cursor-pointer items-center justify-center rounded-[24.82px] border-[1.182px] border-white/[0.28] bg-white/[0.08] text-white backdrop-blur-sm transition hover:bg-white/25 active:scale-95"
    >
      {children}
    </button>
  );
}

export function VacancyDetail({ vacante }: { vacante: Vacante }) {
  const reduced = useReducedMotion();
  const linea = reduced ? LINEA_REDUCIDA : LINEA;

  return (
    <article
      id="detalle-vacante"
      aria-live="polite"
      className="scroll-mt-24 overflow-hidden rounded-[16px]"
    >
      {/* ── Cabecera índigo (247px de alto en el diseño) ── */}
      <div className="relative rounded-t-[16px] bg-[var(--fig-indigo)] px-6 pb-[22.71px] pt-[37.82px] sm:px-[40.19px]">
        <div className="absolute right-6 top-[26px] flex gap-[10.58px] sm:right-[26.14px]">
          <IconCircleButton label={`Guardar la vacante ${vacante.titulo}`}>
            <BookmarkSimple size={20} aria-hidden />
          </IconCircleButton>
          <IconCircleButton label={`Compartir la vacante ${vacante.titulo}`}>
            <ShareNetwork size={20.09} aria-hidden />
          </IconCircleButton>
        </div>

        {/* `key` por vacante: al cambiar de ficha el bloque se repone con el
            barrido en vez de saltar de un texto a otro. */}
        <motion.div key={vacante.id} variants={CONTENIDO} initial="hidden" animate="show">
          <motion.p
            variants={linea}
            className="pr-32 text-[14px] font-normal uppercase leading-[19.86px] tracking-[0.208em] text-[var(--fig-pink-soft)]"
          >
            {vacante.area}
          </motion.p>
          <motion.h2
            variants={linea}
            className="mt-[15.47px] pr-32 text-[clamp(1.625rem,2.22vw,2rem)] font-black leading-[36.78px] tracking-[-0.0271em] text-white"
          >
            {vacante.titulo}
          </motion.h2>
          <motion.p
            variants={linea}
            className="mt-[9.22px] flex items-center gap-[8.274px] text-[16px] font-normal leading-[25.53px] text-[#e7e3ff]"
          >
            <MapPin size={17.73} className="opacity-80" aria-hidden />
            {vacante.ubicacion}
          </motion.p>

          <motion.div variants={linea}>
            <button
              type="button"
              className="mt-[23.63px] flex h-[55.62px] cursor-pointer items-center rounded-full bg-[var(--fig-red)] px-[21.188px] text-[20.856px] font-medium text-white transition hover:brightness-110 active:scale-95 font-sans"
            >
              Postularme
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* ── "Article" (#16394): tarjeta blanca que envuelve el contenido Y el
             pie; en el Figma el pie es hijo suyo, no un hermano. ── */}
      <motion.div
        key={vacante.id}
        variants={CONTENIDO}
        initial="hidden"
        animate="show"
        style={{ boxShadow: "0px 28.367px 70.916px -33.094px rgba(27,0,136,0.32)" }}
        className="overflow-hidden rounded-[18.911px] border-[1.182px] border-[var(--fig-indigo-border)] bg-white"
      >
        {/* "Container" (#16395) — padding 30.73 / 40.186 / 40.186 */}
        <div className="px-6 pb-[40.186px] pt-[30.73px] sm:px-[40.186px]">
        {/* Rejilla de metadatos — 3 columnas, gap 23.639/30.730 */}
        <div className="grid grid-cols-2 gap-x-[30.73px] gap-y-[23.639px] border-b-[1.182px] border-[var(--fig-indigo-border)] pb-6 sm:grid-cols-3">
          <MetaItem label="Área" value={vacante.area} variants={linea} />
          <MetaItem label="Modalidad" value={vacante.modalidad} variants={linea} />
          <MetaItem label="Ubicación" value={vacante.ubicacion} variants={linea} />
          <MetaItem
            label="Estado"
            value={vacante.estado}
            variants={linea}
            valueClassName={
              vacante.estado === "Abierto"
                ? "text-[var(--fig-green)] tracking-[-0.0087em] leading-[26.1px]"
                : "text-[var(--fig-indigo)] tracking-[-0.0096em] leading-[28.93px]"
            }
          />
          <MetaItem label="Jornada" value={vacante.jornada} variants={linea} />
          <MetaItem label="Idioma" value={vacante.idioma} variants={linea} />
        </div>

        <ContentSection
          heading="Sobre el rol"
          variants={linea}
          lead={vacante.sobreElRol ? undefined : ENTRADILLA}
          body={vacante.sobreElRol ?? PLACEHOLDERS.sobreElRol}
        />
        <ContentSection
          heading="Lo que harás"
          variants={linea}
          lead={vacante.loQueHaras ? undefined : ENTRADILLA}
          body={vacante.loQueHaras ?? PLACEHOLDERS.loQueHaras}
        />
        <ContentSection
          heading="Lo que buscamos"
          variants={linea}
          lead={vacante.loQueBuscamos ? undefined : ENTRADILLA}
          body={vacante.loQueBuscamos ?? PLACEHOLDERS.loQueBuscamos}
        />
        </div>

        {/* "Container" (#16445) — pie lavanda con el CTA a todo ancho */}
        <div className="border-t-[1.182px] border-[var(--fig-indigo-border)] bg-[var(--fig-lavender)] px-6 py-[26.003px] sm:px-[40.186px]">
          <button
            type="button"
            style={{ boxShadow: "0px 7px 30.73px -14.183px rgba(233,88,120,1)" }}
            className="w-full cursor-pointer rounded-full bg-[var(--fig-red)] py-[16.547px] text-[17.02px] font-semibold leading-[25.53px] text-white transition hover:brightness-110 active:scale-[0.99] font-sans"
          >
            Postularme
          </button>
        </div>
      </motion.div>
    </article>
  );
}

"use client";

import {
  AirplaneTakeoff,
  Briefcase,
  CaretDown,
  Globe,
  List,
  MagnifyingGlass,
  MapPin,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_ENTER, usePauseOffscreen } from "@/components/motion";

/* ────────────────────────────────────────────────────────────────────────────
 * VacantesHero — cabecera de la vista /vacantes.
 *
 * Clon del nodo "Hero" (#3298:16097) del Figma [RH+] Trabalhe Conosco. Todas
 * las medidas son las del archivo a 1440px de ancho:
 *
 *   · Foto "image 159": rect 1466×1955 en (-26,-682) sobre un marco 1440×614.
 *     El original es 3024×4032 (razón 0.75), así que `object-cover` reproduce
 *     el encuadre con object-position 50% 50.9% (ver cálculo abajo).
 *   · "Overlay+Shadow": caja 1440×1024 con sombra interior 21px 91px 125.1px
 *     rgba(6,16,35,.85) — oscurece arriba e izquierda, no abajo.
 *   · "Overlay 2": caja 1441×875 en y=-131 con el radial índigo.
 *   · Nav bar: padding 16/100, interior 1241, borde inferior rgba(27,17,71,.1).
 *   · Bloque de titular en (99,231); buscador glass en (99,586), ancho 1241,
 *     es decir montado 28px sobre el borde inferior del hero.
 * ──────────────────────────────────────────────────────────────────────────── */

/* Encuadre de la foto: la franja visible del rect va de y=682 a y=1296 sobre
   1955 de alto (fracción 0.3489→0.6629). Con object-cover el alto renderizado
   es 1920 para un marco de 614, así que el desplazamiento es
   (0.5059·1920 − 307) / (1920 − 614) ≈ 50.9%. */
const ENCUADRE_FOTO = "50% 50.9%";

const HERO: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const HERO_ITEM: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE_ENTER } },
};

/* El `hidden` es idéntico al de arriba a propósito: es lo que se sirve en SSR
   y `useReducedMotion` difiere entre servidor (false) y cliente (true), así
   que ramificar el estado inicial rompía la hidratación. Con motion reducido
   el `y` salta a duración 0 y sólo se percibe el fundido. */
const HERO_ITEM_REDUCIDO: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, y: { duration: 0 } } },
};

export interface VacantesSearchState {
  keyword: string;
  lugar: string;
  modalidad: string;
}

interface VacantesHeroProps {
  search: VacantesSearchState;
  onSearchChange: (next: VacantesSearchState) => void;
  onSubmit: () => void;
}

interface SearchFieldProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  /**
   * Separación entre el rótulo y el chevron. En el Figma no es un valor
   * derivado: los dos primeros campos llevan 19.678px y "Modalidad" lleva
   * 65.435px puestos a mano, y de ahí sale el ancho de esa columna.
   */
  gapChevron: number;
  onChange: (value: string) => void;
}

/* Campo del buscador: columna con gap 9.839px. Arriba icono (19.68) + rótulo
   Latam Sans Medium 17.218 y el chevron al final de la fila; abajo la pista en
   Latam Sans Regular 14.759 sangrada 29.517px para alinearla bajo el rótulo.
 *
 * En el Figma la columna se ajusta a la MÁS ancha de sus dos filas, y la fila
 * del rótulo se estira hasta ese ancho, que es lo que separa el chevron del
 * texto. Un <input> con `w-full` no aporta ancho intrínseco, así que apilamos
 * un duplicado invisible del placeholder en la misma celda de rejilla: ese
 * fantasma sí mide, y la columna recupera el ancho que tiene en el diseño. */
function SearchField({
  icon,
  label,
  placeholder,
  value,
  gapChevron,
  onChange,
}: SearchFieldProps) {
  return (
    <label className="flex min-w-0 flex-1 cursor-text flex-col gap-[9.839px] lg:flex-none">
      <span
        className="flex items-center justify-between"
        style={{ gap: `${gapChevron}px` }}
      >
        <span className="flex items-center gap-[9.839px]">
          <span className="shrink-0 text-[var(--fig-indigo)]">{icon}</span>
          <span className="whitespace-nowrap text-[17.218px] font-medium leading-none text-[var(--fig-field)] font-sans">
            {label}
          </span>
        </span>
        {/* Los chevrons van en #66718A, como el texto; sólo los iconos guía
            son índigo (comprobado sobre el render del Figma). */}
        <CaretDown size={19.68} className="shrink-0 text-[var(--fig-field)]" aria-hidden />
      </span>
      <span className="grid pl-[29.517px] text-[14.759px] font-sans">
        <span
          aria-hidden
          className="pointer-events-none invisible col-start-1 row-start-1 h-0 select-none whitespace-pre font-normal"
        >
          {placeholder}
        </span>
        {/* `size={1}` anula el ancho intrínseco por defecto del input (20
            caracteres ≈ 168px), que si no gobernaría la columna en lugar del
            fantasma y ensancharía los campos cortos. */}
        <input
          type="text"
          size={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="col-start-1 row-start-1 w-full border-0 bg-transparent p-0 font-normal text-[var(--fig-ink)] placeholder:text-[var(--fig-field)] focus:outline-none focus:ring-0"
        />
      </span>
    </label>
  );
}

/* Separador vertical entre campos: LINE de 29.52px, trazo #B8B8B8 de 1.23px,
   dentro de un marco con padding lateral de 9.839px. */
function Divisor() {
  return (
    <span aria-hidden className="hidden shrink-0 px-[9.839px] lg:block">
      <span className="block h-[29.52px] w-[1.23px] bg-[var(--fig-divider)]" />
    </span>
  );
}

export function VacantesHero({ search, onSearchChange, onSubmit }: VacantesHeroProps) {
  const reduced = useReducedMotion();

  // Marco del hero: mientras esté fuera de pantalla, la respiración y la luz
  // ambiente se pausan (ver `[data-motion-idle]` en globals.css).
  const marcoRef = useRef<HTMLDivElement>(null);
  usePauseOffscreen(marcoRef);
  const item = reduced ? HERO_ITEM_REDUCIDO : HERO_ITEM;

  return (
    <motion.header className="relative" variants={HERO} initial="hidden" animate="show">
      {/* ── Marco del hero: 1440×614 en el diseño ── */}
      <div
        ref={marcoRef}
        className="relative h-[460px] overflow-hidden bg-[#0c104f] sm:h-[540px] lg:h-[614px]"
      >
        {/* ── Capa de fondo animada: respiración cinematográfica ─────────────
             El nodo exterior lleva la clase CSS `hero__bg-layer` que controla
             la respiración (keyframe continuo). La entrada visual se consigue
             con una capa hija que arranca opaca y se desvanece, sin tocar el
             `transform` del padre (que sí necesita la animación CSS libre). */}
        <div
          aria-hidden
          className="hero__bg-layer absolute"
          style={{
            inset: "-2%",
            backgroundImage: "url('/images/hero/vacantes-wing.jpg')",
            backgroundSize: "cover",
            backgroundPosition: ENCUADRE_FOTO,
          }}
        >
          {/* Scrim de entrada: opaco → transparente, sólo opacidad. El
              `initial` no ramifica en `reduced` (SSR determinista); un fundido
              de opacidad es aceptable con motion reducido, sólo más corto. */}
          <motion.div
            className="absolute inset-0 bg-[#0c104f]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.5 : 1.4, ease: EASE_ENTER }}
          />
        </div>

        {/* ── Luz ambiente: destello cálido que se desplaza sobre el cielo ──
            Se renderiza siempre (condicionarla a `reduced` desalineaba el
            árbol entre SSR y cliente): su animación ya está tras
            `prefers-reduced-motion: no-preference` en globals.css, así que con
            motion reducido queda como luz estática. */}
        <div
          aria-hidden
          className="hero__ambient-light pointer-events-none absolute inset-0 z-[1]"
        />

        {/* "Overlay+Shadow" — sombra interior desplazada 21/91 con 125.1 de
            desenfoque: encaja el hero por arriba y por la izquierda. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[1024px]"
          style={{ boxShadow: "inset 21px 91px 125.1px 0px rgba(6,16,35,0.85)" }}
        />

        {/* "Overlay 2" — velo radial índigo, arranca 131px por encima del marco. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[-131px] h-[875px]"
          style={{
            background:
              "radial-gradient(circle at 50% 53%, rgba(164,149,80,0.03) 0%, rgba(27,0,136,0.14) 31%, rgba(12,16,79,0.33) 78%)",
          }}
        />

        {/* ── Nav bar (#3298:16103) — padding 16/100, interior 1241 ── */}
        <motion.nav
          variants={item}
          className="relative z-20 border-b border-[rgba(27,17,71,0.1)] px-4 py-4 sm:px-8 lg:px-[100px]"
        >
          <div className="mx-auto flex w-full max-w-[1241px] items-center justify-between">
            {/* Izquierda: "Menú" y el logotipo, separados por 494px en el diseño */}
            <div className="flex items-center gap-8 md:gap-24 lg:gap-[494px]">
              <Link
                href="/"
                className="flex items-center gap-2 py-2.5 text-[14px] font-medium text-white transition hover:opacity-80 font-sans"
              >
                <List size={16} aria-hidden />
                <span className="hidden sm:inline">Menú</span>
              </Link>

              <Link href="/" aria-label="Empleos LATAM — inicio" className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/latam-logo.svg"
                  alt="LATAM Airlines"
                  className="h-[26px] w-auto md:h-8"
                />
              </Link>
            </div>

            {/* Derecha (#3298:16126) — gap 14px */}
            <div className="flex items-center gap-2 sm:gap-[14px]">
              <button
                type="button"
                className="hidden h-[42px] cursor-pointer items-center gap-2 rounded-full border border-[rgba(27,17,71,0.1)] bg-white/10 px-4 py-[7px] text-[14px] font-medium text-white backdrop-blur-sm transition hover:bg-white/20 md:flex font-sans"
              >
                <Globe size={14} aria-hidden />
                <span>Chile</span>
                <CaretDown size={14} aria-hidden />
              </button>
              <a
                href="#listado"
                className="flex h-[42px] items-center rounded-full bg-[var(--fig-red-nav)] px-4 text-[14px] font-semibold text-white transition hover:brightness-110 active:scale-95 sm:px-[22px] sm:text-[15px] font-sans"
              >
                Ver vacantes
              </a>
            </div>
          </div>
        </motion.nav>

        {/* ── Titular (#3298:16140) — bloque en (99,231); el nav ocupa 74px ── */}
        <div className="relative z-10 mx-auto w-full max-w-[1242px] px-4 sm:px-8 lg:px-0">
          <div className="flex flex-col gap-2 pt-[68px] sm:pt-[110px] lg:pt-[157px]">
            {/* "Section" — padding 16px 0 8px, gap 8px */}
            <div className="flex flex-col gap-2 pb-2 pt-4">
              <motion.p
                variants={item}
                className="text-[13px] font-black uppercase leading-[22.04px] tracking-[0.2939em] text-[#eceef3] sm:text-[16px]"
              >
                Súmate a latam
              </motion.p>

              {/* "Heading 1" — padding-top 10.2px; 96px con interlínea 73.44px */}
              <motion.div variants={item} className="pt-[10.2px]">
                {/* La interlínea 73.44/96 = 0.765 del Figma sólo funciona con el
                    titular en una línea; al envolver en pantallas pequeñas las
                    líneas se pisarían, así que ahí se relaja. */}
                <h1 className="text-[clamp(2.5rem,6.667vw,6rem)] font-black leading-[1.04] tracking-[-0.0187em] text-white lg:leading-[0.765]">
                  Se parte de lo que viene
                </h1>
              </motion.div>

              {/* "Paragraph:margin" — padding-top 11.22px */}
              <motion.div variants={item} className="pt-[11.22px]">
                <p className="max-w-[700px] text-[clamp(1rem,1.39vw,1.25rem)] font-bold leading-[32.14px] text-white">
                  Cada vacante es un pase de embarque. Filtra por área o busca tu próximo vuelo.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Buscador glass (#3298:16148) — ancho 1241, montado 28px sobre el hero ── */}
      <motion.div
        variants={item}
        className="relative z-20 mx-auto -mt-[28px] w-full max-w-[calc(1241px+2rem)] px-4 sm:px-6 lg:max-w-[1241px] lg:px-0"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          // ── Liquid glass idéntico al hero del índice ──────────────────────
          // Fondo: rgba semitransparente + backdrop-blur + saturate para el
          // efecto de vidrio esmerilado. El gradiente diagonal y los insets
          // luminosos simulan la refracción y el filete del cristal.
          className="flex w-full flex-col gap-5 rounded-[19.678px] px-6 py-6 text-[var(--fig-ink)] backdrop-blur-[18px] backdrop-saturate-[1.4] lg:flex-row lg:items-center lg:justify-center lg:gap-[24.598px] lg:py-[29.517px] lg:pl-[46.739px] lg:pr-[47.674px]"
          style={{
            background: "rgba(255,255,255,0.18)",
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.01) 60%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.55), inset 1px 0 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(255,255,255,0.12), inset -1px 0 0 rgba(255,255,255,0.10), 0 20px 48px -18px rgba(6,16,35,0.45), 0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <SearchField
            icon={<MagnifyingGlass size={19.68} weight="bold" aria-hidden />}
            label="Cargo, área o palabra clave"
            placeholder="Ej: Tripulación, Tecnología"
            value={search.keyword}
            gapChevron={19.678}
            onChange={(keyword) => onSearchChange({ ...search, keyword })}
          />

          <Divisor />

          <SearchField
            icon={<MapPin size={19.68} weight="fill" aria-hidden />}
            label="País o ciudad"
            placeholder="Ej: Chile, São Paulo"
            value={search.lugar}
            gapChevron={19.678}
            onChange={(lugar) => onSearchChange({ ...search, lugar })}
          />

          <Divisor />

          <SearchField
            icon={<Briefcase size={19.68} weight="fill" aria-hidden />}
            label="Modalidad"
            placeholder="Ej: Presencial, híbrido"
            value={search.modalidad}
            gapChevron={65.435}
            onChange={(modalidad) => onSearchChange({ ...search, modalidad })}
          />

          <Divisor />

          {/* "button-large" — 51.65px de alto, padding 10.761/19.678 */}
          <button
            type="submit"
            className="flex h-[51.65px] w-full shrink-0 cursor-pointer items-center justify-center gap-[8.609px] rounded-full bg-[var(--fig-red)] px-[19.678px] text-[19.371px] font-medium text-white transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98] lg:w-auto font-sans"
          >
            Ver vacantes
            <AirplaneTakeoff size={20.91} weight="fill" aria-hidden />
          </button>
        </form>
      </motion.div>
    </motion.header>
  );
}

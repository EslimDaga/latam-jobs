"use client";

import { AirplaneTakeoffIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { SplitFlapBoard } from "./SplitFlapBoard";

/* ────────────────────────────────────────────────────────────────────────────
 * Anuncio de vacantes en formato tablero de aeropuerto (split-flap).
 * Cada vuelo es un puesto real: rol arriba, destino abajo. El tablero cicla
 * entre ellos como una pantalla de salidas — las hojas vuelven a girar en cada
 * cambio porque cambian los `rows` que recibe SplitFlapBoard.
 * ──────────────────────────────────────────────────────────────────────────── */

interface Opening {
  role: string;
  place: string;
  area: string;
}

const OPENINGS: readonly Opening[] = [
  { role: "Product Designer", place: "Remoto - LATAM", area: "Tecnología" },
  { role: "Analista de Vuelo", place: "Lima - Perú", area: "Operaciones" },
  { role: "Data Engineer", place: "Remoto - LATAM", area: "Tecnología" },
  { role: "Marketing Manager", place: "Sao Paulo - BR", area: "Comercial" },
  { role: "Tripulante Cabina", place: "Cusco - Perú", area: "Operaciones" },
  { role: "Talent Partner", place: "Santiago - CL", area: "People" },
];

/** Ancho fijo del tablero: sin esto cada anuncio (de largo distinto) haría
 *  encoger o crecer el tablero en cada ciclo. Centramos ambas filas sobre él. */
const BOARD_COLS = 18;

const CYCLE_MS = 4200;

function center(value: string, width: number): string {
  const clipped = value.slice(0, width);
  const spare = width - clipped.length;
  const left = Math.floor(spare / 2);
  return " ".repeat(left) + clipped + " ".repeat(spare - left);
}

export function HiringBoard(): React.JSX.Element {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % OPENINGS.length);
    }, CYCLE_MS);
    return () => window.clearInterval(timer);
  }, []);

  const current = OPENINGS[index];
  const rows = [center(current.role, BOARD_COLS), center(current.place, BOARD_COLS)];

  return (
    <section
      id="vacantes"
      aria-label="Vacantes abiertas"
      className="relative isolate overflow-hidden bg-[#06182b] px-4 py-24 sm:px-6 lg:py-32"
    >
      {/* Fondo de cielo — el mismo panorama del hero, así la sección continúa
          "sobre las nubes". */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/sky-panorama.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* Velo AZUL: arranca en el mismo azul de cielo con el que termina el hero
          (#06182b) para que el cielo fluya continuo — sin banda oscura — y recién
          más abajo deja ver el panorama. Vuelve a profundizar al pie. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#06182b_0%,rgba(6,24,43,0.8)_14%,rgba(6,24,43,0.36)_40%,rgba(6,24,43,0.42)_72%,rgba(6,24,43,0.72)_100%)]"
      />
      {/* Halo suave detrás del tablero para asentarlo sobre las nubes. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[42rem] w-[70rem] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse,rgba(6,10,25,0.55),transparent_70%)] blur-2xl"
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        {/* Eyebrow — pantalla de salidas */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.12] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur-md"
        >
          <AirplaneTakeoffIcon weight="fill" className="h-4 w-4 text-red-latam" />
          Salidas · Empleos
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-white [text-shadow:0_2px_30px_rgba(6,10,25,0.6)]"
        >
          Tu próximo destino <span className="text-red-latam">te espera</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-xl text-base text-white/80 [text-shadow:0_1px_18px_rgba(6,10,25,0.55)] md:text-lg"
        >
          Vacantes abiertas ahora mismo, en pantalla como en el aeropuerto.
        </motion.p>
      </div>

      {/* Tablero split-flap — a todo el ancho para que respire en grande. */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay: 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-14 w-full"
      >
        <SplitFlapBoard
          rows={rows}
          label={`Vacante: ${current.role} en ${current.place}`}
        />
      </motion.div>

      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        {/* Meta de la vacante en pantalla + CTA */}
        <div className="mt-10 flex min-h-[3.5rem] flex-col items-center gap-5 sm:flex-row sm:gap-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduced ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 text-sm text-white/60"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-semibold text-white/85">{current.area}</span>
              <span aria-hidden className="text-white/25">·</span>
              <span>Postulaciones abiertas</span>
            </motion.div>
          </AnimatePresence>

          <a
            href="mailto:empleos@latam.com?subject=Postulación%20LATAM"
            className="group inline-flex items-center gap-2 rounded-full bg-red-latam px-6 py-3 text-sm font-semibold text-white shadow-[0_1rem_2.5rem_-0.75rem_rgba(232,17,75,0.6)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-red-latam-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Postula ahora
            <ArrowRightIcon
              weight="bold"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </a>
        </div>

        {/* Dots de progreso del ciclo */}
        <div className="mt-8 flex items-center gap-2" aria-hidden>
          {OPENINGS.map((opening, i) => (
            <span
              key={opening.role}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-red-latam" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

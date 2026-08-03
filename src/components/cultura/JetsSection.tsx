"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_ENTER, Reveal } from "@/components/motion";
import { VALORES_JETS } from "@/lib/cultura/cultura";

/* ────────────────────────────────────────────────────────────────────────────
 * JetsSection — "Ser cada día +JETS" (#3416:11493).
 *
 * Cotas del Figma:
 *   · Sección de 122.44px de aire vertical sobre #F5F4FD, interior 1244.
 *   · Titular 48/64.11 con el "+" en rojo; antetítulo 15.31/23.72 (.24em).
 *   · Rejilla de 4 columnas de 286.97 con gap 31 / 23.46.
 *   · Ficha (#3416:11504): blanca, filete rgba(27,0,136,.1), radio 21.11 y
 *     padding 35.19/30.49/32.84. Dentro: rótulo 11.73/18.18 (.2em), título
 *     23.9/25.46 y párrafo 18/28.22. La inicial gigante (63.8px, 14% de
 *     opacidad) va alineada a la derecha del área de contenido, en y=22.29.
 * ──────────────────────────────────────────────────────────────────────────── */

const REJILLA: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const FICHA: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_ENTER } },
};

/* `hidden` idéntico a propósito: es lo que se sirve en SSR y `useReducedMotion`
   difiere entre servidor y cliente. Con motion reducido sólo queda el fundido. */
const FICHA_REDUCIDA: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, y: { duration: 0 } } },
};

export function JetsSection() {
  const reduced = useReducedMotion();
  const ficha = reduced ? FICHA_REDUCIDA : FICHA;

  return (
    <section
      id="jets"
      aria-labelledby="jets-titulo"
      className="scroll-mt-8 bg-[var(--fig-lavender)] px-6 py-[80px] sm:px-8 lg:py-[122.44px]"
    >
      <div className="mx-auto w-full max-w-[1244px]">
        <Reveal>
          <p className="text-[15.31px] font-bold uppercase leading-[23.72px] tracking-[0.24em] text-[var(--fig-red)]">
            +JETS
          </p>
          <h2
            id="jets-titulo"
            className="pt-2 text-[clamp(2rem,3.33vw,3rem)] font-black leading-[1.336] tracking-[-0.0252em] text-[var(--fig-indigo)]"
          >
            Ser cada día <span className="text-[var(--fig-red)]">+</span>JETS
          </h2>
        </Reveal>

        <motion.ul
          variants={REJILLA}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-x-[31px] gap-y-[23.46px] pt-[50px] sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALORES_JETS.map((valor) => (
            <motion.li
              key={valor.letra}
              variants={ficha}
              className="group relative overflow-hidden rounded-[21.11px] border-[1.173px] border-[var(--fig-indigo-border)] bg-white px-[30.49px] pb-[32.84px] pt-[35.19px] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--fig-indigo)]/25 hover:shadow-[0px_28px_60px_-32px_rgba(27,0,136,0.45)]"
            >
              {/* Inicial de agua: alineada al borde derecho del contenido. */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-[30.49px] top-[22.29px] text-[63.8px] font-black leading-[0.8] text-[var(--fig-indigo)] opacity-[0.14] transition-[opacity,transform] duration-500 group-hover:scale-110 group-hover:opacity-[0.22]"
              >
                {valor.letra}
              </span>

              {/* El diseño repite la palabra como versalita roja sobre el
                  título. Es un recurso gráfico, no información nueva: para un
                  lector de pantalla sería el mismo texto dos veces. */}
              <p
                aria-hidden
                className="relative text-[11.73px] font-bold uppercase leading-[18.18px] tracking-[0.2em] text-[var(--fig-red)]"
              >
                {valor.rotulo}
              </p>
              <h3 className="relative pt-[11.73px] text-[23.91px] font-bold leading-[25.46px] tracking-[-0.0151em] text-[var(--fig-indigo)]">
                {valor.rotulo}
              </h3>
              <p className="relative max-w-[223.62px] pt-[14.07px] text-[18px] font-normal leading-[28.22px] text-[var(--fig-muted)]">
                {valor.descripcion}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

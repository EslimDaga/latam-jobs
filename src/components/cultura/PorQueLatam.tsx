"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_ENTER, Reveal } from "@/components/motion";
import { RAZONES } from "@/lib/cultura/cultura";

/* ────────────────────────────────────────────────────────────────────────────
 * PorQueLatam — "Por qué elegimos volar más alto todos los días" (#3416:11673).
 *
 * Cotas del Figma:
 *   · Sección de 122.44px de aire vertical, interior 1242.
 *   · Antetítulo 12/22.24 (.287em) en #E5006D, titular 42/60.1 y bajada
 *     20/36.86 en #050847.
 *   · Rejilla (#3416:11683): 3 columnas con gap 1.196 sobre un fondo
 *     rgba(27,0,136,.1) — el "gap" ES el filete: las celdas son blancas y lo
 *     que se ve entre ellas es el fondo del contenedor. Radio 23.92.
 *   · Celda: padding 40.66/35.87, número 13.15/20.39 (.16em), título 20/27.99
 *     y párrafo 16/29.44 en #5B567A.
 * ──────────────────────────────────────────────────────────────────────────── */

const REJILLA: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const CELDA: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_ENTER } },
};

const CELDA_REDUCIDA: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, y: { duration: 0 } } },
};

export function PorQueLatam() {
  const reduced = useReducedMotion();
  const celda = reduced ? CELDA_REDUCIDA : CELDA;

  return (
    <section
      id="por-que-latam"
      aria-labelledby="por-que-titulo"
      className="scroll-mt-8 px-6 py-[80px] sm:px-8 lg:px-0 lg:py-[122.44px]"
    >
      <div className="mx-auto w-full max-w-[1242px]">
        <Reveal>
          <p className="text-[12px] font-black uppercase leading-[22.24px] tracking-[0.287em] text-[var(--fig-magenta)]">
            Por qué LATAM
          </p>
          <h2
            id="por-que-titulo"
            className="max-w-[909px] pt-[19.13px] text-[clamp(1.875rem,2.92vw,2.625rem)] font-bold leading-[1.431] tracking-[-0.0203em] text-[var(--fig-indigo)]"
          >
            Por qué elegimos volar más alto todos los días
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="max-w-[917px] pt-[16.74px] text-[clamp(1.0625rem,1.39vw,1.25rem)] font-normal leading-[1.843] text-[#050847]">
            Crecer y aprender, desarrollando tu carrera en una industria global y
            multicultural. Es ser parte de un entorno dinámico, donde la diversidad de
            personas, experiencias e ideas impulsa nuestra forma de crecer, innovar y conectar
            al mundo. Aquí, cada día es una oportunidad para aportar y llegar más lejos.
          </p>
        </Reveal>

        {/* El contenedor pinta el filete y las celdas lo tapan: el gap de
            1.196px es la única línea que se ve entre ellas. */}
        <motion.ol
          variants={REJILLA}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-[66.96px] grid grid-cols-1 gap-[1.196px] overflow-hidden rounded-[23.92px] border-[1.196px] border-[var(--fig-indigo-border)] bg-[var(--fig-indigo-border)] sm:grid-cols-2 lg:grid-cols-3"
        >
          {RAZONES.map((razon) => (
            <motion.li
              key={razon.numero}
              variants={celda}
              className="group bg-white px-[35.87px] py-[40.66px] transition-colors duration-300 hover:bg-[var(--fig-lavender)]"
            >
              <span className="block text-[13.15px] font-bold uppercase leading-[20.39px] tracking-[0.16em] text-[var(--fig-magenta)] tabular-nums">
                {razon.numero}
              </span>
              <h3 className="pt-[19.13px] text-[20px] font-bold leading-[27.99px] tracking-[-0.0178em] text-[var(--fig-indigo)]">
                {razon.titulo}
              </h3>
              <p className="max-w-[341px] pt-[14.35px] text-[16px] font-normal leading-[29.44px] text-[var(--fig-muted)]">
                {razon.descripcion}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

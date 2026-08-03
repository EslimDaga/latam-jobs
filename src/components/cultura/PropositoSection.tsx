"use client";

import { animate, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { EASE_ENTER, Reveal } from "@/components/motion";
import { PRESENCIA } from "@/lib/cultura/cultura";

/* ────────────────────────────────────────────────────────────────────────────
 * PropositoSection — bloque de propósito y tarjeta de cifras (#3416:11440).
 *
 * Cotas del Figma:
 *   · Bloque de texto de 755px: antetítulo "Propósito" 15/23.72 con tracking
 *     .2449em, titular 42/54 (tracking -.0216em) y párrafos 18/39.31 en
 *     #10004F, separados 28.06px entre sí.
 *   · Tarjeta (#3416:11455): rejilla 280.60 + 903.90 con gap 51.02, padding
 *     43.37, fondo lineal blanco→#FAF9FF, filete rgba(27,0,136,.1) y radio
 *     25.51. La cifra va a 70/86.4 y las píldoras a 18.77/29.1.
 * ──────────────────────────────────────────────────────────────────────────── */

const TOTAL_COLABORADORES = 30000;

/** Miles con punto, a mano: `toLocaleString` depende del ICU del entorno y
 *  aquí el mismo número se pinta en servidor y en cliente. */
function formatear(n: number): string {
  return `+${Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/* La cifra sube desde cero cuando entra en pantalla.
 *
 * El valor se escribe directamente en el nodo, no en un estado de React: así
 * el render —el de SSR y el de hidratación— siempre trae la cifra final (que
 * es lo correcto sin JS y para quien busque "30.000" en la página), y el
 * conteo es sólo una capa de presentación encima. Como `useInView` da false en
 * el primer pase, el nodo se pone a cero antes de que el bloque sea visible. */
function CifraColaboradores() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const enVista = useInView(ref, { once: true, amount: 0.6 });
  const yaContado = useRef(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || reduced || yaContado.current) return;

    if (!enVista) {
      nodo.textContent = formatear(0);
      return;
    }

    yaContado.current = true;
    const control = animate(0, TOTAL_COLABORADORES, {
      duration: 1.6,
      ease: EASE_ENTER,
      onUpdate: (v) => {
        nodo.textContent = formatear(v);
      },
    });
    return () => control.stop();
  }, [reduced, enVista]);

  return (
    <span
      ref={ref}
      className="block text-[clamp(3rem,4.86vw,4.375rem)] font-black leading-[1.234] tracking-[-0.037em] text-[var(--fig-indigo)] tabular-nums"
    >
      {formatear(TOTAL_COLABORADORES)}
    </span>
  );
}

const FILA: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};

const PILDORA: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_ENTER } },
};

const PILDORA_REDUCIDA: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, y: { duration: 0 } } },
};

export function PropositoSection() {
  const reduced = useReducedMotion();
  const pildora = reduced ? PILDORA_REDUCIDA : PILDORA;

  return (
    <section
      id="proposito"
      aria-labelledby="proposito-titulo"
      className="mx-auto w-full max-w-[1242px] scroll-mt-8 px-6 pt-[72px] sm:px-8 lg:px-0 lg:pt-[120px]"
    >
      <Reveal className="max-w-[755px]">
        <p className="text-[15px] font-bold uppercase leading-[23.72px] tracking-[0.2449em] text-[var(--fig-red)]">
          Propósito
        </p>

        <h2
          id="proposito-titulo"
          className="max-w-[747px] pt-[20.41px] text-[clamp(1.875rem,2.92vw,2.625rem)] font-bold leading-[1.286] tracking-[-0.0216em] text-[var(--fig-indigo)]"
        >
          Volar va mucho más allá de subirse a un avión.
        </h2>
      </Reveal>

      <Reveal
        delay={0.08}
        className="max-w-[755px] pt-[17.86px] text-[clamp(1rem,1.25vw,1.125rem)] leading-[2.184] text-[#10004f]"
      >
        <p>
          En LATAM, estamos impulsados por un propósito:{" "}
          <strong className="font-bold text-[var(--fig-indigo)]">
            elevar cada viaje, siempre
          </strong>
          . Porque sabemos que volar va mucho más allá de subirse a un avión o incluso
          operarlo… Se trata de crear experiencias memorables, transformar vidas y ser parte
          de las historias de las personas.
        </p>
        <p className="pt-[28.06px]">
          Aquí en LATAM, creemos en una cultura colaborativa, y eso es lo que nos impulsa a
          volar cada vez más alto y más lejos. Somos más de 30.000 colaboradores distribuidos
          por todo el mundo.
        </p>
        <p className="pt-[28.06px]">
          ¡Somos muchos! Y trabajamos todos los días para ofrecer la mejor experiencia de
          viaje a nuestros pasajeros, buscando ser cada día{" "}
          <strong className="font-bold text-[var(--fig-indigo)]">+JETS</strong>.
        </p>
      </Reveal>

      {/* ── Tarjeta de cifras (#3416:11455) ── */}
      <Reveal delay={0.12} className="pt-[71.43px]">
        <div className="grid grid-cols-1 gap-8 rounded-[25.51px] border-[1.275px] border-[var(--fig-indigo-border)] bg-[linear-gradient(180deg,#ffffff_0%,#faf9ff_100%)] p-8 sm:p-[43.37px] lg:grid-cols-[280.6px_minmax(0,1fr)] lg:items-center lg:gap-[51.02px]">
          <div>
            <CifraColaboradores />
            <p className="pt-[12.75px] text-[15.31px] font-normal uppercase leading-[15.31px] tracking-[0.22em] text-[var(--fig-muted)]">
              Colaboradores
            </p>
          </div>

          <div className="flex flex-col gap-[22.96px]">
            {PRESENCIA.map((grupo, i) => (
              <motion.div
                key={grupo.region}
                variants={FILA}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.6 }}
                /* La primera región lleva siete países: en el diseño su rótulo
                   va encima y las píldoras debajo. Las otras dos caben en una
                   línea, así que el rótulo se sienta a su izquierda. */
                className={
                  i === 0
                    ? "flex flex-col gap-[17.6px]"
                    : "flex flex-col gap-[17.6px] sm:flex-row sm:items-center sm:gap-9"
                }
              >
                <span className="shrink-0 text-[14.03px] font-bold uppercase leading-[21.75px] tracking-[0.16em] text-[var(--fig-red)]">
                  {grupo.region}
                </span>
                <span className="flex flex-wrap gap-[12.75px]">
                  {grupo.paises.map((pais) => (
                    <motion.span
                      key={pais}
                      variants={pildora}
                      className="cursor-default rounded-full border-[1.275px] border-[rgba(27,0,136,0.16)] px-[15.31px] py-[6.38px] text-[clamp(1rem,1.3vw,1.174rem)] font-bold leading-[29.1px] text-[var(--fig-chip-ink)] transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--fig-indigo)]/35 hover:bg-white"
                    >
                      {pais}
                    </motion.span>
                  ))}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

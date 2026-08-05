"use client";

import { ArrowRight, CaretRight } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useState } from "react";
import { EASE_ENTER, Reveal } from "@/components/motion";
import { GUIAS_CULTURALES } from "@/lib/cultura/cultura";

/* ────────────────────────────────────────────────────────────────────────────
 * GuiasCulturales — "Nuestras 9 Guías Culturales" (#3416:11548).
 *
 * En el Figma cada tarjeta es un <details> plegado: la fila mide 81.84px (sólo
 * el "Summary") y el párrafo aparece al abrirlo. Aquí se implementa con un
 * botón real + región desplegable, que es lo que un <details> le cuenta a un
 * lector de pantalla, pero con la altura animada.
 *
 * Cotas del Figma:
 *   · Sección: padding 122/100, fondo índigo en degradado 122° con un foco
 *     violeta radial arriba a la derecha.
 *   · Cabecera: columna de 687.25 (antetítulo 12.59/18.63, titular 42/44.71,
 *     bajada 18/27.2) y, alineado abajo a la derecha, un enlace en píldora.
 *   · Rejilla 3×3 con gap 14.69. Tarjeta: degradado blanco 8%→2%, filete
 *     blanco al 14%, radio 14.69 y luz interior superior.
 *   · "Summary": rejilla 44.07 / 262.31 / 35.67 con gap 12.59 y padding
 *     14.69/16.79. Icono rojo #E8114B con radio 8.97; chevron en círculo de
 *     31.48 con filete blanco al 26%.
 *   · Párrafo: sangrado izquierdo 73.45 (16.79 + 44.07 + 12.59), es decir
 *     alineado con el título, y 14.94/23.16 en blanco al 70%.
 * ──────────────────────────────────────────────────────────────────────────── */

/* ── Iconografía ─────────────────────────────────────────────────────────────
 * Los pictogramas son los del propio Figma (los `Vector` dentro de cada
 * "Summary"), exportados uno a uno: son iconografía de marca dibujada para
 * estas nueve guías —el de "Ser JETS" es directamente el lettering de JETS—,
 * y ningún equivalente de una librería genérica dice lo mismo. Antes había
 * stand-ins de Phosphor; marca los rechazó en el comentario del archivo
 * ("Guias culturales con logo").
 *
 * Van como fichero y no inline: son blancos sobre la caja roja y no necesitan
 * heredar color, así que un `<img>` los mantiene fuera del bundle. El de JETS
 * es PNG porque su vector viene calcado a 13.648 trazados (4 MB); a 27 px un
 * PNG de 101 px sobra y pesa 5 KB.
 * ────────────────────────────────────────────────────────────────────────── */
const ICONOS: Record<string, string> = {
  turbulencias: "/images/cultura/guias/turbulencias.svg",
  cliente: "/images/cultura/guias/cliente.svg",
  jets: "/images/cultura/guias/jets.png",
  excelencia: "/images/cultura/guias/excelencia.svg",
  liderazgo: "/images/cultura/guias/liderazgo.svg",
  adelante: "/images/cultura/guias/adelante.svg",
  cooperar: "/images/cultura/guias/cooperar.svg",
  grande: "/images/cultura/guias/grande.svg",
  sostenibilidad: "/images/cultura/guias/sostenibilidad.svg",
};

const REJILLA: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};

const TARJETA: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_ENTER } },
};

const TARJETA_REDUCIDA: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, y: { duration: 0 } } },
};

export function GuiasCulturales() {
  const reduced = useReducedMotion();
  const tarjeta = reduced ? TARJETA_REDUCIDA : TARJETA;

  // Varias guías pueden estar abiertas a la vez, como <details> independientes.
  const [abiertas, setAbiertas] = useState<string[]>([]);
  const alternar = (id: string) =>
    setAbiertas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <section
      id="guias"
      aria-labelledby="guias-titulo"
      className="scroll-mt-8 px-6 py-[80px] sm:px-8 lg:px-[100px] lg:py-[122px]"
      style={{
        background:
          "radial-gradient(circle at 74% 10%, rgba(126,65,255,0.55) 0%, rgba(126,65,255,0) 30%), linear-gradient(122deg, #110056 0%, #1A006F 45%, #2A078B 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-[1238px]">
        {/* ── Cabecera (#3416:11551) ── */}
        <Reveal className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-[60px]">
          <div className="max-w-[697px]">
            <p className="text-[12.59px] font-black uppercase leading-[18.63px] tracking-[0.1391em] text-[var(--fig-pink-hot)]">
              Nuestra cultura
            </p>
            <h2
              id="guias-titulo"
              className="pt-2 text-[clamp(1.875rem,2.92vw,2.625rem)] font-bold leading-[1.064] tracking-[-0.0377em] text-white"
            >
              Nuestras 9 Guías Culturales
            </h2>
            <p className="max-w-[696px] pt-[16.79px] text-[clamp(1rem,1.25vw,1.125rem)] font-normal leading-[1.511] tracking-[-0.0182em] text-white/70">
              Creencias que nos unen, nos inspiran y nos guían en cada decisión. Así es como
              elevamos cada día.
            </p>
          </div>

          <a
            href="#jets"
            className="group flex shrink-0 items-center gap-[12.59px] rounded-full border-[1.05px] border-white/[0.42] bg-white/[0.04] px-[23.08px] py-[13px] text-[16.79px] font-normal leading-[25.18px] tracking-[-0.0195em] text-white backdrop-blur-sm transition-[background-color,border-color] duration-300 hover:border-white/70 hover:bg-white/10"
          >
            Conocer más sobre nuestra cultura
            <ArrowRight
              size={19}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </Reveal>

        {/* ── Rejilla de guías (#3416:11565) ── */}
        <motion.ul
          variants={REJILLA}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-[14.69px] pt-[44.07px] md:grid-cols-2 lg:grid-cols-3"
        >
          {GUIAS_CULTURALES.map((guia) => {
            const icono = ICONOS[guia.id];
            const abierta = abiertas.includes(guia.id);

            return (
              <motion.li
                key={guia.id}
                variants={tarjeta}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                  boxShadow: "inset 0px 1.05px 0px 0px rgba(255,255,255,0.06)",
                }}
                className="h-fit overflow-hidden rounded-[14.69px] border-[1.05px] border-white/[0.14] backdrop-blur-[2px] transition-colors duration-300 hover:border-white/[0.28]"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => alternar(guia.id)}
                    aria-expanded={abierta}
                    aria-controls={`guia-${guia.id}`}
                    /* `min-h` = la fila de 81.84px del Figma: así los títulos
                       de dos líneas no descuadran la fila frente a los de una. */
                    className="flex min-h-[81.84px] w-full cursor-pointer items-center gap-[12.59px] px-[16.79px] py-[14.69px] text-left"
                  >
                    <span className="flex h-[50.36px] w-[44.07px] shrink-0 items-center justify-center rounded-[8.97px] bg-[var(--fig-red)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={icono}
                        alt=""
                        aria-hidden
                        width={26.91}
                        height={26.91}
                        loading="lazy"
                        decoding="async"
                        className="h-[26.91px] w-[26.91px] object-contain"
                      />
                    </span>

                    <span className="min-w-0 flex-1 text-[16.79px] font-bold leading-[21.39px] tracking-[-0.0179em] text-white">
                      {guia.titulo}
                    </span>

                    <span className="flex h-[31.48px] w-[31.48px] shrink-0 items-center justify-center rounded-full border-[1.05px] border-white/[0.26] text-white">
                      <CaretRight
                        size={15}
                        weight="bold"
                        aria-hidden
                        className={`transition-transform duration-300 ${
                          abierta ? "rotate-90" : ""
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {abierta && (
                    <motion.div
                      id={`guia-${guia.id}`}
                      key="cuerpo"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: reduced ? 0.15 : 0.32,
                        ease: EASE_ENTER,
                        opacity: { duration: reduced ? 0.15 : 0.22 },
                      }}
                      className="overflow-hidden"
                    >
                      <p className="pb-[18.89px] pl-[73.45px] pr-[16.79px] text-[14.94px] font-normal leading-[23.16px] tracking-[-0.0119em] text-white/70">
                        {guia.descripcion}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}

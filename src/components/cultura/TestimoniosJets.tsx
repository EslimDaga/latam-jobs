"use client";

import { ArrowRight, Play } from "@phosphor-icons/react";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { TESTIMONIO } from "@/lib/cultura/cultura";

/* ────────────────────────────────────────────────────────────────────────────
 * TestimoniosJets — "El viaje de quien vuela con nosotros" (#3416:11726).
 *
 * Cotas del Figma:
 *   · Sección de 122px de aire vertical sobre blanco, interior 1236.93.
 *   · Antetítulo 12/18.62 (.1458em) en #FF2F8D y titular 42/44.66.
 *   · Rejilla 572.57 + 641.30 con gap 23.06 y fila de 356.4.
 *   · Cita (#3416:11736): degradado 135° #17006D→#3D12BC con foco violeta
 *     radial arriba a la derecha, sombra 0 18.87px 50.32px rgba(23,0,105,.12),
 *     radio 25.16 y padding 41.93. Comilla 67px, cita 20.12/29.17, avatar de
 *     48.22 con degradado 145° y filete blanco al 42%.
 *   · Píldora final: 578.69×52.41, blanca, filete #DDD8F1 y radio completo.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface TestimoniosJetsProps {
  /** Abre el visor de vídeo; lo gobierna `CulturaView`. */
  onPlay: () => void;
}

export function TestimoniosJets({ onPlay }: TestimoniosJetsProps) {
  return (
    <section
      id="testimonios"
      aria-labelledby="testimonios-titulo"
      className="scroll-mt-8 bg-white px-6 py-[80px] sm:px-8 lg:px-0 lg:py-[122px]"
    >
      <div className="mx-auto w-full max-w-[1237px]">
        <Reveal>
          <p className="text-[12px] font-black uppercase leading-[18.62px] tracking-[0.1458em] text-[var(--fig-pink-hot)]">
            Testimonios JETS
          </p>
          <h2
            id="testimonios-titulo"
            className="pt-2 text-[clamp(1.875rem,2.92vw,2.625rem)] font-bold leading-[1.063] tracking-[-0.0377em] text-[var(--fig-indigo)]"
          >
            El viaje de quien vuela con nosotros
          </h2>
        </Reveal>

        <Reveal
          delay={0.08}
          className="grid grid-cols-1 gap-[23.06px] pt-[35.64px] lg:grid-cols-[572.57px_minmax(0,1fr)]"
        >
          {/* ── Cita (#3416:11736) ── */}
          <figure
            style={{
              background:
                "radial-gradient(circle at 83% 15%, rgba(164,98,255,0.85) 0%, rgba(164,98,255,0) 32%), linear-gradient(135deg, #17006D 0%, #3D12BC 100%)",
              boxShadow: "0px 18.868px 50.316px 0px rgba(23,0,105,0.12)",
            }}
            className="flex min-h-[356.4px] flex-col justify-between rounded-[25.16px] p-8 sm:p-[41.93px]"
          >
            <div>
              <span
                aria-hidden
                className="block text-[67.09px] font-black leading-[0.8] text-[var(--fig-pink-hot)]"
              >
                “
              </span>
              <blockquote className="max-w-[490px] pb-[35.64px] pt-[12.58px] text-[clamp(1.125rem,1.4vw,1.258rem)] font-normal leading-[1.45] tracking-[-0.0382em] text-white">
                {TESTIMONIO.cita}
              </blockquote>
            </div>

            <figcaption className="flex items-center gap-[12.58px]">
              <span
                aria-hidden
                style={{ background: "linear-gradient(145deg, #FFD7B7 0%, #B7856D 100%)" }}
                className="flex h-[48.22px] w-[48.22px] shrink-0 items-center justify-center rounded-full border-[2.1px] border-white/[0.42] text-[16.77px] font-extrabold text-white"
              >
                {TESTIMONIO.inicial}
              </span>
              <span className="flex flex-col">
                <span className="text-[15.43px] font-bold leading-[23.15px] tracking-[-0.0143em] text-white">
                  {TESTIMONIO.nombre}
                </span>
                <span className="pt-[3.14px] text-[13.08px] font-normal leading-[19.62px] text-white/70">
                  {TESTIMONIO.cargo}
                </span>
              </span>
            </figcaption>
          </figure>

          {/* ── Tarjeta de vídeo (#3416:11777) ── */}
          <button
            type="button"
            onClick={onPlay}
            style={{ boxShadow: "0px 18.868px 50.316px 0px rgba(23,0,105,0.12)" }}
            className="group relative flex min-h-[280px] cursor-pointer overflow-hidden rounded-[25.16px] text-left lg:min-h-[356.4px]"
            aria-label="Abrir la historia en vídeo de nuestros equipos"
          >
            {/* La portada del Figma es un mock de 360×205 con su propio botón
                de play y su propio titular incrustados: al ampliarla se veía
                borrosa y con el texto duplicado sobre el nuestro. Se usa una
                foto real del banco de "Nuestra cultura" del propio repo, que es
                lo que ese hueco pide. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/cultura/cultura-03.jpg"
              alt=""
              aria-hidden
              style={{ objectPosition: "50% 42%" }}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(92deg,rgba(17,0,79,0.41)_0%,rgba(17,0,79,0)_100%)]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,3,40,0)_24%,rgba(9,3,40,0.55)_62%,rgba(9,3,40,0.92)_100%)]"
            />

            <span className="relative flex w-full flex-col justify-end p-8 sm:p-[41.93px]">
              <span className="flex h-[62px] w-[62px] items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-sm transition-[background-color,transform] duration-300 group-hover:scale-105 group-hover:bg-white/25">
                <Play size={24} weight="fill" aria-hidden className="ml-[3px] text-white" />
              </span>
              <span className="block pt-5 text-[12px] font-black uppercase leading-[18.62px] tracking-[0.1458em] text-[var(--fig-pink-hot)]">
                Historias que inspiran
              </span>
              <span className="block max-w-[420px] pt-2 text-[clamp(1.25rem,1.8vw,1.5rem)] font-bold leading-tight tracking-[-0.02em] text-white">
                Conoce a quienes hacen volar a LATAM cada día
              </span>
            </span>
          </button>
        </Reveal>

        {/* ── Píldora final (#3416:11763) ── */}
        <Reveal delay={0.12} className="flex justify-center pt-[33.54px]">
          <Link
            href="/vacantes"
            style={{ boxShadow: "0px 8.386px 29.351px 0px rgba(23,0,105,0.08)" }}
            className="group flex w-full max-w-[578.69px] flex-col items-center justify-center gap-2 rounded-full border-[1.05px] border-[#ddd8f1] bg-white px-[25.16px] py-4 text-center text-[15.43px] font-bold leading-[23.15px] tracking-[-0.0143em] text-[#17105c] transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[var(--fig-indigo)]/30 sm:h-[52.41px] sm:flex-row sm:gap-[10.48px] sm:py-0"
          >
            Ya eres parte de LATAM o aún no vuelas con nosotros
            <span className="flex items-center gap-1.5 text-[#f0006f]">
              Ver vacantes
              <ArrowRight
                size={16}
                weight="bold"
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

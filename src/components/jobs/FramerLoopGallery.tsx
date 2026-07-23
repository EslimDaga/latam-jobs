"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * FramerLoopGallery — sección "Nuestra cultura".
 *
 * Collage flotante con parallax por scroll construido EXCLUSIVAMENTE con las
 * fotos propias de LATAM en `public/images/cultura/`. En desktop las imágenes
 * se dispersan en un lienzo posicionado; en móvil caen en una grilla limpia.
 */

// Fotos propias (carpeta "Nuestra cultura"), en orden natural. `portrait`
// marca la orientación para elegir la proporción adecuada en la grilla móvil.
const IMAGES = [
  { src: "/images/cultura/cultura-01.jpg", alt: "Técnica de mantenimiento inspeccionando una aeronave en plataforma", portrait: false },
  { src: "/images/cultura/cultura-02.jpg", alt: "Avión de LATAM en vuelo", portrait: false },
  { src: "/images/cultura/cultura-03.jpg", alt: "Equipo de agentes de LATAM en la puerta de embarque", portrait: false },
  { src: "/images/cultura/cultura-04.jpg", alt: "Técnico de LATAM frente a la turbina de un avión", portrait: true },
  { src: "/images/cultura/cultura-05.jpg", alt: "Avión de LATAM volando sobre las nubes al atardecer", portrait: false },
  { src: "/images/cultura/cultura-06.jpg", alt: "Agente de counter de LATAM sonriendo en el aeropuerto", portrait: true },
  { src: "/images/cultura/cultura-07.jpg", alt: "Colaboradora de LATAM sonriendo junto al mostrador", portrait: false },
  { src: "/images/cultura/cultura-08.jpg", alt: "Piloto de LATAM junto a la aeronave", portrait: false },
  { src: "/images/cultura/cultura-09.jpg", alt: "Agente de LATAM ayudando a una pasajera en el autoservicio", portrait: false },
  { src: "/images/cultura/cultura-10.jpg", alt: "Comandante de LATAM en plataforma junto a un Airbus A320", portrait: true },
  { src: "/images/cultura/cultura-11.jpg", alt: "Tripulante de cabina de LATAM sonriendo a bordo", portrait: false },
];

// Cada slot del collage desktop: qué imagen usa y su posición/tamaño absolutos.
const SLOTS: { img: number; cls: string }[] = [
  { img: 2, cls: "left-[22%] top-[3%] w-[160px] aspect-[4/3]" },
  { img: 1, cls: "right-[11%] top-[5%] w-[150px] aspect-[4/3]" },
  { img: 3, cls: "left-[12%] top-[19%] w-[150px] aspect-[4/5]" },
  { img: 5, cls: "left-[61%] top-[15%] w-[185px] aspect-[4/5]" },
  { img: 10, cls: "right-[4%] top-[27%] w-[180px] aspect-[4/3]" },
  { img: 8, cls: "left-[30%] top-[24%] w-[200px] aspect-[4/3]" },
  { img: 9, cls: "left-[17%] top-[45%] w-[175px] aspect-[4/5]" },
  { img: 0, cls: "left-[3%] top-[56%] w-[160px] aspect-square" },
  { img: 4, cls: "left-[53%] top-[57%] w-[170px] aspect-[4/3]" },
  { img: 7, cls: "right-[13%] top-[51%] w-[180px] aspect-[4/3]" },
  { img: 6, cls: "right-[22%] top-[71%] w-[160px] aspect-[4/3]" },
];

export function FramerLoopGallery(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Un desplazamiento parallax distinto por slot para el efecto 3D flotante.
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const y4 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y5 = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const y6 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y7 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const y8 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y9 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const y10 = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const y11 = useTransform(scrollYProgress, [0, 1], [-45, 45]);
  const ys = [y1, y2, y3, y4, y5, y6, y7, y8, y9, y10, y11];

  // Texto (bloques), con su propio parallax suave.
  const yText1 = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const cardStyle =
    "relative overflow-hidden rounded-[2rem] shadow-lg border border-black/5 bg-zinc-50 hover:scale-[1.04] hover:shadow-2xl transition-all duration-500 cursor-pointer w-full h-full";

  return (
    <section
      id="cultura"
      ref={containerRef}
      className="relative z-10 -mt-32 overflow-hidden bg-white pb-12 pt-0 md:-mt-48 md:pb-24 md:pt-4"
    >
      <div className="container relative mx-auto max-w-7xl px-4">
        {/* Desktop: collage flotante */}
        <div className="relative mx-auto hidden h-[1050px] w-full max-w-7xl md:block">
          {SLOTS.map((slot, i) => {
            const img = IMAGES[slot.img];
            return (
              <motion.div
                key={img.src}
                style={{ y: reduced ? undefined : ys[i] }}
                className={`absolute ${slot.cls}`}
              >
                <div className={cardStyle}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover" />
                </div>
              </motion.div>
            );
          })}

          {/* Titular central + CTA, como en el Figma (nodo 89:2472) */}
          <motion.div
            style={{ y: reduced ? undefined : yText1 }}
            className="absolute left-1/2 top-1/2 z-10 flex w-max -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 text-center"
          >
            <h2 className="text-[42px] font-bold leading-[40.052px] tracking-[-0.3927px] text-[#1b0088] [font-family:var(--font-inter),sans-serif]">
              Sé tú. Volemos más alto.
            </h2>
            <a
              href="#cultura"
              className="inline-flex select-none items-center justify-center rounded-full bg-red-latam px-[17px] py-2.5 text-[15.75px] font-medium text-white [font-family:var(--font-inter),sans-serif] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-red-latam-deep active:scale-95"
            >
              Nuestra cultura
            </a>
          </motion.div>
        </div>

        {/* Móvil: grilla limpia con las mismas fotos */}
        <div className="flex flex-col gap-8 md:hidden">
          <div className="px-4 text-center">
            <h2 className="text-[clamp(1.75rem,8vw,42px)] font-bold leading-[0.9536] tracking-[-0.3927px] text-[#1b0088] [font-family:var(--font-inter),sans-serif]">
              Sé tú. Volemos más alto.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {IMAGES.map((img) => (
              <div
                key={img.src}
                className={`${img.portrait ? "aspect-[3/4]" : "aspect-[4/3]"} overflow-hidden rounded-2xl shadow-md`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <a
              href="#cultura"
              className="rounded-full bg-red-latam px-[17px] py-2.5 text-center text-[15.75px] font-medium text-white [font-family:var(--font-inter),sans-serif] shadow-md"
            >
              Nuestra cultura
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Sección "Trabaja con nosotros" — muestra las imágenes flotantes en parallax
 * sobre fondo blanco con esquinas redondeadas. El texto principal ya se reveló
 * en la capa del cielo del hero, por lo que aquí el scroll revela directamente
 * los rostros y equipos que hacen posible el viaje.
 */
export function WorkWithUs(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax offsets for each floating card
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const y3 = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="descubre" className="relative z-10 -mt-10 scroll-mt-0 rounded-t-[2.5rem] bg-white py-16 lg:py-24 overflow-hidden shadow-[0_-1rem_3rem_-1.5rem_rgba(16,0,79,0.12)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Floating Images Staggered Container */}
        <div
          ref={containerRef}
          className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 min-h-[450px] md:min-h-[550px] max-w-5xl mx-auto"
        >
          {/* Left Image: Maintenance Hangar */}
          <motion.div
            style={{ y: y1 }}
            className="group relative w-64 lg:w-80 -mt-6 z-0 rotate-[-3deg] hover:rotate-0 hover:scale-105 transition-all duration-500"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-500 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/team-hangar.jpg"
                alt="Personal de ingeniería de mantenimiento de aeronaves"
                className="w-full h-auto aspect-[4/5] object-cover"
              />
            </div>
            <p className="text-xs font-semibold text-ink-muted text-center mt-4 tracking-wide uppercase">
              Mantenimiento
            </p>
          </motion.div>

          {/* Center Image: Flight Crew (placed slightly higher index and overlapping) */}
          <motion.div
            style={{ y: y2 }}
            className="group relative w-56 lg:w-72 z-10 rotate-[2deg] hover:rotate-0 hover:scale-105 transition-all duration-500"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-shadow duration-500 border-4 border-white bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/crew-smiling.jpg"
                alt="Tripulación de cabina sonriendo en uniforme"
                className="w-full h-auto aspect-[3/4] object-cover"
              />
            </div>
            <p className="text-xs font-semibold text-ink-muted text-center mt-4 tracking-wide uppercase">
              Tripulación
            </p>
          </motion.div>

          {/* Right Image: Tech Office Collaboration */}
          <motion.div
            style={{ y: y3 }}
            className="group relative w-64 lg:w-80 mt-6 z-0 rotate-[-1deg] hover:rotate-0 hover:scale-105 transition-all duration-500"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-500 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/office-tech.jpg"
                alt="Equipo de tecnología colaborando en una oficina moderna"
                className="w-full h-auto aspect-[4/5] object-cover"
              />
            </div>
            <p className="text-xs font-semibold text-ink-muted text-center mt-4 tracking-wide uppercase">
              Tecnología
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export function FramerLoopGallery(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Scroll Progress tracking for the entire gallery section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Unique parallax shifts for each image to create a rich 3D floating effect
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);      // Turbine mechanic
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);     // Check-in machine agent
  const y3 = useTransform(scrollYProgress, [0, 1], [80, -80]);      // Stewardess cabin
  const y4 = useTransform(scrollYProgress, [0, 1], [50, -50]);      // LATAM counter agent
  const y5 = useTransform(scrollYProgress, [0, 1], [-30, 30]);      // Ramp agent tail
  const y6 = useTransform(scrollYProgress, [0, 1], [100, -100]);    // Pilot stewardess
  const y7 = useTransform(scrollYProgress, [0, 1], [30, -30]);      // Text block 1
  const y8 = useTransform(scrollYProgress, [0, 1], [40, -40]);      // Text block 2
  const y9 = useTransform(scrollYProgress, [0, 1], [-60, 60]);      // Plane clouds
  const y10 = useTransform(scrollYProgress, [0, 1], [90, -90]);     // Plane flying
  const y11 = useTransform(scrollYProgress, [0, 1], [-40, 40]);     // Stewardesses walking
  const y12 = useTransform(scrollYProgress, [0, 1], [70, -70]);     // Mechanic engine

  const cardStyle = "relative overflow-hidden rounded-[2rem] shadow-lg border border-black/5 bg-zinc-50 hover:scale-[1.04] hover:shadow-2xl transition-all duration-500 cursor-pointer w-full h-full";

  return (
    <section 
      ref={containerRef}
      className="relative z-10 bg-white -mt-32 md:-mt-48 pt-0 md:pt-4 pb-12 md:pb-24 overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-7xl relative">
        
        {/* Desktop view (Floating absolute grid matching Figma/Screenshot #2) */}
        <div className="hidden md:block relative h-[1050px] w-full max-w-7xl mx-auto">
          
          {/* 1. Stewardess in cabin (top left center) */}
          <motion.div 
            style={{ y: reduced ? undefined : y3 }}
            className="absolute left-[23%] top-[4%] w-[160px] aspect-[4/3]"
          >
            <div className={cardStyle}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/crew-smiling.jpg" alt="Tripulación LATAM" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* 2. Text block 1 (top center) */}
          <motion.div 
            style={{ y: reduced ? undefined : y7 }}
            className="absolute left-[45%] top-[8%] max-w-[340px] text-left"
          >
            <p className="text-[17px] font-medium text-[#12103a] leading-relaxed">
              Discover our curated collection of stunning photography that captures moments of beauty and inspiration from around the world.
            </p>
          </motion.div>

          {/* 3. Airplane flying close-up (right top) */}
          <motion.div 
            style={{ y: reduced ? undefined : y10 }}
            className="absolute right-[12%] top-[6%] w-[150px] aspect-[4/3]"
          >
            <div className={cardStyle}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?q=80&w=600&auto=format&fit=crop" alt="Vuelo LATAM" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* 4. Check-in machine agent (mid left) */}
          <motion.div 
            style={{ y: reduced ? undefined : y2 }}
            className="absolute left-[13%] top-[20%] w-[150px] aspect-[4/5]"
          >
            <div className={cardStyle}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=600&auto=format&fit=crop" alt="Agente de check-in" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* 5. Pilot stewardess with arms crossed (right center high) */}
          <motion.div 
            style={{ y: reduced ? undefined : y6 }}
            className="absolute left-[62%] top-[16%] w-[200px] aspect-[4/5]"
          >
            <div className={cardStyle}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/through-windshield.jpg" alt="Piloto LATAM" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* 6. Group of stewardesses walking (right mid) */}
          <motion.div 
            style={{ y: reduced ? undefined : y11 }}
            className="absolute right-[4%] top-[28%] w-[180px] aspect-[4/3]"
          >
            <div className={cardStyle}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=600&auto=format&fit=crop" alt="Personal LATAM" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* 7. Ramp agent in front of airplane tail (center) */}
          <motion.div 
            style={{ y: reduced ? undefined : y5 }}
            className="absolute left-[36%] top-[34%] w-[200px] aspect-[4/3]"
          >
            <div className={cardStyle}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop" alt="Operaciones de rampa" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* 8. LATAM counter agent (bottom left center) */}
          <motion.div 
            style={{ y: reduced ? undefined : y4 }}
            className="absolute left-[18%] top-[45%] w-[190px] aspect-[4/5]"
          >
            <div className={cardStyle}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/office-tech.jpg" alt="Oficina LATAM" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* 9. Turbine mechanic (bottom left) */}
          <motion.div 
            style={{ y: reduced ? undefined : y1 }}
            className="absolute left-[4%] top-[56%] w-[160px] aspect-square"
          >
            <div className={cardStyle}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop" alt="Mantenimiento de turbinas" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* 10. Plane flying above clouds (right center bottom) */}
          <motion.div 
            style={{ y: reduced ? undefined : y9 }}
            className="absolute left-[54%] top-[58%] w-[170px] aspect-[4/3]"
          >
            <div className={cardStyle}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/sky-panorama.jpg" alt="Vuelo sobre nubes" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* 11. Mechanic under engine (right bottom) */}
          <motion.div 
            style={{ y: reduced ? undefined : y12 }}
            className="absolute right-[14%] top-[52%] w-[180px] aspect-[4/3]"
          >
            <div className={cardStyle}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1485083269755-a7b559a4fe5e?q=80&w=600&auto=format&fit=crop" alt="Ingeniería hangar" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* 12. Text block 2 (bottom left-center) */}
          <motion.div 
            style={{ y: reduced ? undefined : y8 }}
            className="absolute left-[29%] top-[70%] max-w-[320px] text-left"
          >
            <p className="text-[15px] text-zinc-500 leading-relaxed">
              Explore our collection of stunning photography that captures moments of beauty and inspiration from around the world.
            </p>
          </motion.div>

          {/* Red button "Nuestra cultura" centered at the bottom */}
          <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2">
            <a 
              href="#cultura"
              className="inline-flex items-center justify-center rounded-full bg-red-latam px-8 py-3.5 text-base font-bold text-white shadow-lg hover:bg-red-latam-deep hover:scale-105 active:scale-95 transition-all duration-300 select-none cursor-pointer"
            >
              Nuestra cultura
            </a>
          </div>

        </div>

        {/* Mobile View (Clean stack layout for readability & responsive layout) */}
        <div className="block md:hidden flex flex-col gap-8">
          
          <div className="text-center px-4">
            <p className="text-base font-medium text-[#12103a] leading-relaxed">
              Discover our curated collection of stunning photography that captures moments of beauty and inspiration from around the world.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
              <img src="/images/crew-smiling.jpg" alt="Tripulación" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md">
              <img src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=600&auto=format&fit=crop" alt="Agente" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
              <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop" alt="Operaciones" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md">
              <img src="/images/through-windshield.jpg" alt="Piloto" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md col-span-2">
              <img src="/images/sky-panorama.jpg" alt="Cielo" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="text-center px-4">
            <p className="text-sm text-zinc-500 leading-relaxed">
              Explore our collection of stunning photography that captures moments of beauty and inspiration from around the world.
            </p>
          </div>

          <div className="flex justify-center mt-4">
            <a 
              href="#cultura"
              className="rounded-full bg-red-latam px-8 py-3 text-sm font-bold text-white shadow-md text-center"
            >
              Nuestra cultura
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}

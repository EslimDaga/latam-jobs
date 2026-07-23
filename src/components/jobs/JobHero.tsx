"use client";

import {
  AirplaneTakeoff,
  CaretDoubleDownIcon,
  MagnifyingGlass,
  MapPin,
  Briefcase,
  CaretDown,
  Globe,
} from "@phosphor-icons/react";
import {
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useLenis } from "lenis/react";
import { useRef, useState } from "react";
import { HoverLink } from "@/components/motion/HoverLink";
import { RevealText } from "@/components/motion/RevealText";

/* ────────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────────── */

interface JobHeroProps {
  totalJobs?: number;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Constants
 * ──────────────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "Vacantes", href: "#vacantes" },
  { label: "Beneficios", href: "#beneficios" },
  { label: "Cultura", href: "#cultura" },
  { label: "Nosotros", href: "#nosotros" },
] as const;

/* ── "Nuestro propósito" — scroll-linked word reveal (gray → color) ──────── */
// Texto y bitono exactos del Figma (nodo 89:2466): índigo #1b0088 para las
// frases de apertura/cierre y gris azulado para el tramo central.
const PROPOSITO_LINES: readonly { words: readonly string[]; color: string }[] = [
  { words: ["Con", "tu", "talento,"], color: "#1b0088" },
  { words: ["acercamos", "personas,", "abrimos", "oportunidades"], color: "rgba(49,50,69,0.73)" },
  { words: ["y", "hacemos", "que", "la", "región", "siga", "avanzando."], color: "#1b0088" },
];
const PROPOSITO_TOTAL = PROPOSITO_LINES.reduce((n, l) => n + l.words.length, 0);
const REVEAL_START = 0.58;
const REVEAL_END = 0.96;
const REVEAL_DUR = 0.13;
const REVEAL_STEP = (REVEAL_END - REVEAL_START - REVEAL_DUR) / (PROPOSITO_TOTAL - 1);

/** One word of the purpose statement, its color/opacity driven by scroll. */
function ScrollWord({
  progress,
  start,
  to,
  reduced,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  to: string;
  reduced: boolean;
  children: React.ReactNode;
}): React.JSX.Element {
  const end = Math.min(start + REVEAL_DUR, 0.99);
  const color = useTransform(progress, [start, end], ["#cbd0dc", to]);
  const opacity = useTransform(progress, [start, end], [0.35, 1]);
  if (reduced) return <span style={{ color: to }}>{children} </span>;
  return (
    <motion.span style={{ color, opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}


export function JobHero({ totalJobs = 8 }: JobHeroProps): React.JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLElement>(null);
  const progress = useMotionValue(0);

  /* ── Scroll Progress via Lenis ────────────────────────────────────────── */
  useLenis(() => {
    if (reduced) return;
    const el = trackRef.current;
    if (el === null) return;
    const range = el.offsetHeight - window.innerHeight;
    if (range <= 0) return;
    const p = Math.min(Math.max(-el.getBoundingClientRect().top / range, 0), 1);
    progress.set(p);
  });

  /* ── Text Content Animation (0% → 16% - starts immediately) ───────────── */
  const textOpacity = useTransform(progress, [0, 0.16], [1, 0]);
  const textY = useTransform(progress, [0, 0.16], [0, -50]);

  /* ── Cabin overlay transparent window zoom (Starts at 0% scroll progress!) ── */
  const cabinScale = useTransform(progress, [0, 0.5], [1, 5.0]);
  const cabinOpacity = useTransform(progress, [0, 0.35, 0.48], [1, 1, 0]);

  /* ── Sky Panorama (scale 1.05x → 1.2x, always visible behind window) ── */
  const skyScale = useTransform(progress, [0, 0.5], [1.05, 1.2]);
  const skyOpacity = useTransform(progress, [0, 0.35], [1, 1]);

  /* ── White Bloom transition helper (30% → 52%) ── */
  const bloomOpacity = useTransform(
    progress,
    [0, 0.3, 0.42, 0.52],
    [0, 0, 0.4, 0],
  );

  /* ── Center sky text container settles in before the per-word reveal, then slides up slightly ────── */
  const skyTextOpacity = useTransform(progress, [0.5, 0.58], [0, 1]);
  const skyTextScale = useTransform(progress, [0.5, 0.58], [0.98, 1]);
  const skyTextY = useTransform(progress, [0.5, 0.58, 0.78, 0.98], [24, 0, 0, -110]);

  /* ── White backdrop overlay on top of sky (ready before words reveal) ──── */
  const whiteOverlayOpacity = useTransform(progress, [0.46, 0.6], [0, 1]);

  /* ── Header element color interpolation (white to deep indigo: 55% → 68%) ── */
  const headerTextColor = useTransform(
    progress,
    [0.55, 0.68],
    ["rgba(255, 255, 255, 1)", "rgba(16, 0, 79, 1)"]
  );
  const headerBorderColor = useTransform(
    progress,
    [0.55, 0.68],
    ["rgba(255, 255, 255, 0.2)", "rgba(16, 0, 79, 0.15)"]
  );
  const headerBgColor = useTransform(
    progress,
    [0.55, 0.68],
    ["rgba(255, 255, 255, 0.05)", "rgba(16, 0, 79, 0.05)"]
  );

  /* ── Logo opacity fade (white logo vs dark logo cross-fade: 55% → 68%) ── */
  const whiteLogoOpacity = useTransform(progress, [0.55, 0.68], [1, 0]);
  const darkLogoOpacity = useTransform(progress, [0.55, 0.68], [0, 1]);

  return (
    <section
      ref={trackRef}
      id="hero"
      aria-label="Trabaja con nosotros"
      className="relative h-[250vh] bg-[#0a0e1a] text-white"
    >
      {/* ── Sticky Viewport ──────────────────────────────────────────────── */}
      <div className="sticky top-0 flex h-[100dvh] w-full items-stretch overflow-hidden">
        {/* eslint-disable @next/next/no-img-element */}
        {/* ── 1. Sky panorama layer (Bottom/Back) ── */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale: skyScale, opacity: skyOpacity }}
        >
          <img
            src="/images/sky-panorama.jpg"
            alt="Sky panorama"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>

        {/* ── White backdrop overlay on top of sky (fades in as zoom completes) ── */}
        <motion.div
          className="absolute inset-0 bg-white"
          style={{ opacity: whiteOverlayOpacity }}
        />

        {/* ── 2. Cabin overlay with transparent window hole (Top/Front) ── */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{
            scale: cabinScale,
            opacity: cabinOpacity,
            transformOrigin: "50% 49.5%", // Center of transparent window
          }}
        >
          <img
            src="/images/window-full.png"
            alt="Cabin Window Overlay"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>

        {/* eslint-enable @next/next/no-img-element */}

        {/* ── White Bloom transition helper ── */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-white"
          style={{ opacity: bloomOpacity }}
        />

        {/* ── Overlay+Shadow del Figma (89:2382): sombra interna azul noche
             (dx 21, dy 91, blur 125) que oscurece el borde superior/izquierdo ── */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[4]"
          style={{
            opacity: cabinOpacity,
            boxShadow: "inset 21px 91px 125px rgba(6,16,35,0.85)",
          }}
        />

        {/* ── Radial overlay del Figma (89:2383), SIEMPRE encima de la imagen:
             centro cálido rgba(164,149,80,.26) que cae a índigo #0C104F al 57%,
             capa al 33% ── */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            opacity: cabinOpacity,
            background:
              "radial-gradient(circle 58.25vw at 50.03% 65.33%, rgba(164,149,80,0.086) 11%, rgba(12,16,79,0.33) 57%)",
          }}
        />

        {/* ── Menu Overlay ── */}
        <motion.div
          initial={false}
          animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: "-100%" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-30 bg-[#0d091e]/98 px-8 pt-32 pb-12 flex flex-col justify-between md:px-20 md:pb-20 text-white backdrop-blur-md"
          style={{ pointerEvents: menuOpen ? "auto" : "none" }}
        >
          {/* Navigation large links */}
          <div className="flex flex-col gap-6 md:gap-8 mt-10">
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">
              Navegación
            </span>
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.08 + 0.1, duration: 0.3 }}
                  className="text-4xl md:text-6xl font-bold tracking-tight text-white hover:text-red-latam transition-colors duration-200"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Footer of the menu */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-t border-white/10 pt-8">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                Contacto
              </span>
              <a href="mailto:empleos@latam.com" className="text-lg font-semibold hover:text-red-latam transition-colors">
                empleos@latam.com
              </a>
            </div>
            
            <div className="flex flex-col gap-1 text-sm text-white/60">
              <p>© 2026 LATAM Airlines. Todos los derechos reservados.</p>
              <p>Construyendo el futuro de la aviación en América Latina.</p>
            </div>
          </div>
        </motion.div>

        {/* ── Header / Navigation (LATAM Airlines Official Mock Header) ── */}
        <header className="absolute inset-x-0 top-0 z-40">
          <div className="mx-auto flex max-w-[100rem] items-center justify-between gap-6 px-6 py-7 lg:px-12 relative">
            
            {/* Left: Custom Menu button */}
            <motion.button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="z-40 flex items-center gap-5 lg:gap-6 bg-transparent border-0 font-medium text-sm [font-family:var(--font-inter),sans-serif] cursor-pointer hover:opacity-85 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-xl px-2 py-1.5"
              style={{ color: headerTextColor }}
            >
              {/* Custom Framer Hamburger Icon */}
              <div className="w-[30px] h-[30px] relative flex flex-col justify-between overflow-visible flex-shrink-0">
                {/* Top line container */}
                <motion.div 
                  animate={menuOpen ? { y: 9 } : { y: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute top-[4px] left-0 w-[30px] h-[4px] flex"
                >
                  <motion.div 
                    animate={menuOpen ? { rotate: 45 } : { rotate: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ transformOrigin: "right center", backgroundColor: headerTextColor }}
                    className="w-[15px] h-[4px] rounded-l-full"
                  />
                  <motion.div 
                    animate={menuOpen ? { rotate: -45 } : { rotate: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ transformOrigin: "left center", backgroundColor: headerTextColor }}
                    className="w-[15px] h-[4px] rounded-r-full"
                  />
                </motion.div>

                {/* Middle line */}
                <motion.div 
                  animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  style={{ backgroundColor: headerTextColor }}
                  className="absolute top-[13px] left-0 w-[30px] h-[4px] rounded-full"
                />

                {/* Bottom line container */}
                <motion.div 
                  animate={menuOpen ? { y: -9 } : { y: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute top-[22px] left-0 w-[30px] h-[4px] flex"
                >
                  <motion.div 
                    animate={menuOpen ? { rotate: -45 } : { rotate: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ transformOrigin: "right center", backgroundColor: headerTextColor }}
                    className="w-[15px] h-[4px] rounded-l-full"
                  />
                  <motion.div 
                    animate={menuOpen ? { rotate: 45 } : { rotate: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ transformOrigin: "left center", backgroundColor: headerTextColor }}
                    className="w-[15px] h-[4px] rounded-r-full"
                  />
                </motion.div>
              </div>
              <span className="hidden sm:inline select-none min-w-[45px] text-left">
                {menuOpen ? "Cerrar" : "Menú"}
              </span>
            </motion.button>

            {/* Center: LATAM wordmark (Centered perfectly) */}
            <a
              href="#hero"
              aria-label="Empleos LATAM — inicio"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-40 h-7 w-48"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                src="/images/latam-logo.svg"
                alt="LATAM Airlines"
                className="absolute inset-0 h-full w-auto mx-auto"
                style={{ opacity: whiteLogoOpacity }}
              />
              <motion.img
                src="/images/latam-logo-dark.svg"
                alt="LATAM Airlines"
                className="absolute inset-0 h-full w-auto mx-auto"
                style={{ opacity: darkLogoOpacity }}
              />
            </a>

            {/* Right: Country selector & CTA */}
            <div className="flex items-center gap-3 z-40">
              <motion.button 
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium [font-family:var(--font-inter),sans-serif] hover:bg-white/10 transition cursor-pointer"
                style={{ 
                  color: headerTextColor, 
                  borderColor: headerBorderColor,
                  backgroundColor: headerBgColor
                }}
              >
                <Globe size={18} />
                <span>Chile</span>
                <CaretDown size={14} />
              </motion.button>

              <a
                href="#vacantes"
                className="rounded-full bg-red-latam px-5 py-2 text-[15px] font-semibold text-white [font-family:var(--font-jakarta),sans-serif] shadow-md hover:bg-red-latam-deep transition active:scale-95 cursor-pointer text-center animate-pulse-subtle"
              >
                Ver vacantes
              </a>
            </div>

          </div>
        </header>

        {/* ── A. Initial Hero Text (Fades out early) ── */}
        <motion.div
          className="absolute inset-0 z-10 mx-auto flex w-full max-w-[100rem] flex-col px-6 pt-28 pb-14 pointer-events-none lg:px-12 lg:pb-16"
          style={{ opacity: textOpacity, y: textY }}
        >
          {/* Headline block - Left Aligned Title & Right Aligned Subtitle (Centered Vertically) */}
          <div className="flex-1 flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
              {/* Left Column: Label + Title */}
              <div className="lg:col-span-8 flex flex-col items-start text-left">
                <span className="mb-3 block text-sm font-bold uppercase leading-[22.448px] tracking-[4.4896px] text-white [font-family:var(--font-space-mono),monospace] md:mb-5">
                  Trabaja con nosotros
                </span>
                <h1 className="text-[clamp(2.75rem,7.64vw,6.875rem)] font-bold leading-[1.1075] tracking-[-0.0236em] text-white">
                  Construye tu<br />carrera junto<br />a LATAM
                </h1>
              </div>

              {/* Right Column: Subtitle */}
              <div className="lg:col-span-4 flex items-center justify-start lg:justify-end">
                <p className="max-w-[375px] text-center text-[20.16px] font-normal leading-[32.256px] text-[#f2f2f2] lg:ml-auto">
                  Encuentra la vacante que despega tu próximo capítulo profesional.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Center Search Capsule (Enlarged) */}
          <div className="mt-8 flex justify-center w-full pointer-events-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const el = document.getElementById("vacantes");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex w-full max-w-[898px] flex-col gap-5 rounded-[16px] bg-[rgba(242,242,242,0.04)] px-[21px] py-6 text-white backdrop-blur-[16px] backdrop-saturate-[1.35] [font-family:var(--font-inter),sans-serif] lg:flex-row lg:items-center lg:gap-5"
              style={{
                // Efecto "Glass" del Figma (Frost 16, Light -45° 80%, Refraction 27):
                // brillo diagonal desde arriba-izquierda + filete luminoso en los
                // bordes que imita la refracción del vidrio.
                backgroundImage:
                  "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 32%, rgba(255,255,255,0) 55%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.22), inset 1px 0 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(255,255,255,0.07), inset -1px 0 0 rgba(255,255,255,0.06), 0 18px 42px -20px rgba(6,16,35,0.55)",
              }}
            >
              {/* Campo 1: Cargo, área o palabra clave */}
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex cursor-pointer items-center gap-4">
                  <div className="flex items-center gap-2">
                    <MagnifyingGlass size={16} className="shrink-0 text-white" />
                    <span className="whitespace-nowrap text-sm font-medium text-white">Cargo, área o palabra clave</span>
                  </div>
                  <CaretDown size={16} className="shrink-0 text-white" />
                </div>
                <input
                  type="text"
                  placeholder="Ej: Tripulación, Tecnología"
                  className="w-full border-0 bg-transparent p-0 pl-6 text-xs font-normal text-white placeholder:text-white/50 focus:outline-none focus:ring-0"
                />
              </div>

              {/* Divisor */}
              <div className="hidden h-6 w-4 shrink-0 items-center justify-center lg:flex">
                <span className="h-full w-px bg-white/25" />
              </div>

              {/* Campo 2: País o ciudad */}
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex cursor-pointer items-center gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="shrink-0 text-white" />
                    <span className="whitespace-nowrap text-sm font-medium text-white">País o ciudad</span>
                  </div>
                  <CaretDown size={16} className="shrink-0 text-white" />
                </div>
                <input
                  type="text"
                  placeholder="Ej: Chile, São Paulo"
                  className="w-full border-0 bg-transparent p-0 pl-6 text-xs font-normal text-white placeholder:text-white/50 focus:outline-none focus:ring-0"
                />
              </div>

              {/* Divisor */}
              <div className="hidden h-6 w-4 shrink-0 items-center justify-center lg:flex">
                <span className="h-full w-px bg-white/25" />
              </div>

              {/* Campo 3: Modalidad */}
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex cursor-pointer items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="shrink-0 text-white" />
                    <span className="whitespace-nowrap text-sm font-medium text-white">Modalidad</span>
                  </div>
                  <CaretDown size={16} className="shrink-0 text-white" />
                </div>
                <input
                  type="text"
                  placeholder="Ej: Presencial, híbrido"
                  className="w-full border-0 bg-transparent p-0 pl-6 text-xs font-normal text-white placeholder:text-white/50 focus:outline-none focus:ring-0"
                />
              </div>

              {/* Divisor */}
              <div className="hidden h-6 w-4 shrink-0 items-center justify-center lg:flex">
                <span className="h-full w-px bg-white/25" />
              </div>

              {/* CTA */}
              <button
                type="submit"
                className="flex h-[42px] w-full shrink-0 cursor-pointer items-center justify-center gap-[7px] rounded-full border border-red-latam bg-red-latam px-[17px] text-[15.75px] font-medium text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-red-latam-deep active:scale-[0.98] lg:w-auto"
              >
                Ver vacantes
                <AirplaneTakeoff size={17} weight="fill" />
              </button>
            </form>
          </div>
        </motion.div>

        {/* ── B. Sky Center Reveal Text (Nuestro Propósito - White Background & Slate/Navy Text) ── */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          style={{ opacity: skyTextOpacity, scale: skyTextScale, y: skyTextY }}
        >
          {/* Label: NUESTRO PROPÓSITO in pink/coral */}
          <p className="mb-6 text-sm font-black uppercase leading-[22.448px] tracking-[4.4896px] text-[#fc4a78] md:mb-8">
            Nuestro propósito
          </p>

          {/* Heading — words fill from gray to color as you scroll (scroll reveal) */}
          <h2
            aria-label="Con tu talento, acercamos personas, abrimos oportunidades y hacemos que la región siga avanzando."
            className="font-sans text-[clamp(1.75rem,3.75vw,3.375rem)] font-normal leading-[1.216] tracking-[-0.0101em] max-w-[954px] mx-auto"
          >
            {PROPOSITO_LINES.map((line, li) => {
              const offset = PROPOSITO_LINES.slice(0, li).reduce(
                (n, l) => n + l.words.length,
                0,
              );
              return (
                <span aria-hidden key={li} className="inline">
                  {line.words.map((w, wi) => (
                    <ScrollWord
                      key={wi}
                      progress={progress}
                      start={REVEAL_START + (offset + wi) * REVEAL_STEP}
                      to={line.color}
                      reduced={!!reduced}
                    >
                      {w}
                    </ScrollWord>
                  ))}
                </span>
              );
            })}
          </h2>

          <div className="mt-6 flex items-center gap-3 text-xs font-semibold tracking-wide text-[#757585]">
            <motion.span
              animate={reduced ? undefined : { y: [0, 5, 0] }}
              transition={{
                duration: 1.6,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <CaretDoubleDownIcon className="h-4 w-4 text-[#f0506e]" />
            </motion.span>
            <span>Sigue bajando para explorar las vacantes</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

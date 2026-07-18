"use client";

import { AirplaneTiltIcon, CaretDownIcon } from "@phosphor-icons/react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useLenis } from "lenis/react";
import { useRef } from "react";
import { HoverLink } from "@/components/motion/HoverLink";
import { RevealText } from "@/components/motion/RevealText";

/* ────────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────────── */


/* ────────────────────────────────────────────────────────────────────────────
 * Constants
 * ──────────────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "Vacantes", href: "#vacantes" },
  { label: "Beneficios", href: "#descubre" },
  { label: "Cultura", href: "#cultura" },
  { label: "Nosotros", href: "#nosotros" },
] as const;

/* Shared entrance easing (see ui-animation: "Enter" curve). */
const ENTER = [0.22, 1, 0.36, 1] as const;

/* ────────────────────────────────────────────────────────────────────────────
 * Scroll-down control — clickable, and its ring fills with scroll progress.
 * ──────────────────────────────────────────────────────────────────────────── */

const RING_R = 21;
const RING_C = 2 * Math.PI * RING_R;

function ScrollProgressButton({
  progress,
  reduced,
  onClick,
}: {
  progress: MotionValue<number>;
  reduced: boolean | null;
  onClick: () => void;
}): React.JSX.Element {
  // Ring fills as the hero scroll progresses (0 → 1).
  const dashOffset = useTransform(progress, (p) => RING_C * (1 - p));
  // Colour glides from white (cabin phase) to deep indigo (over the clouds),
  // so it stays legible on both backgrounds without ever darkening the sky.
  const stroke = "#ffffff";
  const track = "rgba(255, 255, 255, 0.4)";
  // Fade the cue out as we reach the end, so it never collides with the white
  // section rising over the clouds.
  const fadeOut = useTransform(progress, [0.88, 0.98], [1, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute bottom-14 left-1/2 z-20 hidden -translate-x-1/2 sm:block"
      style={{ opacity: fadeOut }}
    >
      <motion.button
        type="button"
        onClick={onClick}
        aria-label="Ir a la siguiente sección"
        className="pointer-events-auto flex cursor-pointer flex-col items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-latam"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6, ease: ENTER }}
        whileHover={reduced ? undefined : { y: -2 }}
      >
        <span className="relative grid h-12 w-12 place-items-center">
          <svg viewBox="0 0 48 48" className="h-12 w-12 -rotate-90">
            <motion.circle
              cx="24"
              cy="24"
              r={RING_R}
              fill="none"
              strokeWidth="2.5"
              style={{ stroke: track }}
            />
            <motion.circle
              cx="24"
              cy="24"
              r={RING_R}
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              style={{ stroke, strokeDashoffset: dashOffset }}
            />
          </svg>
          <motion.span
            className="absolute"
            style={{ color: stroke }}
            animate={reduced ? undefined : { y: [0, 4, 0] }}
            transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
          >
            <CaretDownIcon weight="bold" className="h-4 w-4" />
          </motion.span>
        </span>
      </motion.button>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Scroll-linked word reveal — each word fills from faint to solid indigo as
 * the hero is scrolled, left to right (the "color reveal on scroll" effect).
 * ──────────────────────────────────────────────────────────────────────────── */

const WORD_DIM = "rgba(255, 255, 255, 0.28)";
const WORD_LIT = "rgba(255, 255, 255, 1)";

function RevealWord({
  progress,
  word,
  start,
  end,
}: {
  progress: MotionValue<number>;
  word: string;
  start: number;
  end: number;
}): React.JSX.Element {
  const color = useTransform(progress, [start, end], [WORD_DIM, WORD_LIT]);
  const opacity = useTransform(progress, [start, end], [0.55, 1]);
  return (
    <motion.span
      aria-hidden
      className="mr-[0.25em] inline-block"
      style={{ color, opacity }}
    >
      {word}
    </motion.span>
  );
}

function ScrollWordReveal({
  progress,
  text,
  start,
  end,
  className,
}: {
  progress: MotionValue<number>;
  text: string;
  start: number;
  end: number;
  className?: string;
}): React.JSX.Element {
  const words = text.split(" ");
  const span = end - start;
  const step = span / words.length;
  return (
    <h2 className={className} aria-label={text}>
      {words.map((w, i) => {
        const a = start + i * step;
        const b = Math.min(end, a + step * 2.4); // overlap → smoother sweep
        return (
          <RevealWord key={`${w}-${i}`} progress={progress} word={w} start={a} end={b} />
        );
      })}
    </h2>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Hero
 * ──────────────────────────────────────────────────────────────────────────── */

export function JobHero(): React.JSX.Element {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLElement>(null);
  const progress = useMotionValue(0);

  /* ── Scroll Progress via Lenis ────────────────────────────────────────── */
  const lenis = useLenis(() => {
    if (reduced) return;
    const el = trackRef.current;
    if (el === null) return;
    const range = el.offsetHeight - window.innerHeight;
    if (range <= 0) return;
    const p = Math.min(Math.max(-el.getBoundingClientRect().top / range, 0), 1);
    progress.set(p);
  });

  const goToNext = (): void => {
    const target = document.getElementById("descubre");
    if (lenis && target) {
      lenis.scrollTo(target, { duration: 1.2 });
    } else {
      target?.scrollIntoView({ behavior: "smooth" });
    }
  };

  /* ── Initial hero text (0% → 22%) ─────────────────────────────────────── */
  const textOpacity = useTransform(progress, [0, 0.08, 0.16], [1, 1, 0]);
  const textY = useTransform(progress, [0, 0.08, 0.16], [0, 0, -40]);

  /* ── Cabin overlay: zoom through the transparent window (1x → 5x) —
     starts on the very first scroll (no initial hold). ──────────────────── */
  const cabinScale = useTransform(progress, [0, 0.6], [1, 5]);
  const cabinOpacity = useTransform(progress, [0, 0.45, 0.6], [1, 1, 0]);

  /* ── Sky panorama (gentle push-in, never dimmed) ──────────────────────── */
  const skyScale = useTransform(progress, [0, 0.6], [1.05, 1.2]);

  /* ── White bloom flash at the moment we break through (45% → 62%) ─────── */
  const bloomOpacity = useTransform(progress, [0, 0.4, 0.52, 0.62], [0, 0, 0.35, 0]);

  /* ── Sky content: appears right as we break through the window ─────────
     (much earlier than before — no more empty-cloud dead zone). The heading
     itself fills in word-by-word with the scroll (REVEAL_START → REVEAL_END). */
  const skyContentOpacity = useTransform(progress, [0.46, 0.54], [0, 1]);
  const skyBadgeY = useTransform(progress, [0.46, 0.58], [22, 0]);
  const skySubOpacity = useTransform(progress, [0.66, 0.76], [0, 1]);
  const skySubY = useTransform(progress, [0.66, 0.76], [18, 0]);

  /* ── Sky darkens progressively as you scroll (night falls) — a black veil
     over the clouds so the white heading reads with more drama. ─────────── */
  const skyDarken = useTransform(progress, [0.48, 0.95], [0, 0.62]);

  return (
    <section
      ref={trackRef}
      id="hero"
      aria-label="Trabaja con nosotros"
      className="relative h-[260vh] bg-[#0a0e1a] text-white"
    >
      {/* ── Sticky Viewport ──────────────────────────────────────────────── */}
      <div className="sticky top-0 flex h-[100dvh] w-full items-stretch overflow-hidden">
        {/* ── 1. Sky panorama (back) — fades in on mount, zooms on scroll ── */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.img
            src="/images/sky-panorama.jpg"
            alt="Vista del cielo sobre las nubes desde la ventana del avión"
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
            style={{ scale: skyScale }}
          />
        </motion.div>

        {/* ── 2. Cabin overlay with transparent window hole (front) ──
             Outer div = mount entrance; inner div = scroll-driven zoom. */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: ENTER }}
        >
          <motion.img
            src="/images/window-full.png"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
            style={{
              scale: cabinScale,
              opacity: cabinOpacity,
              transformOrigin: "50.1% 45.6%", // Center of transparent window
            }}
          />
        </motion.div>

        {/* ── White bloom (break-through flash) ── */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-white"
          style={{ opacity: bloomOpacity }}
        />

        {/* ── Progressive black veil over the sky (darkens on scroll) ── */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: skyDarken }}
        />

        {/* ── Header / Navigation ── */}
        <header className="absolute inset-x-0 top-0 z-30">
          <div className="mx-auto flex max-w-[100rem] items-center justify-between gap-6 px-6 py-7 lg:px-12">
            <motion.a
              href="#hero"
              aria-label="Empleos LATAM — inicio"
              className="shrink-0"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: ENTER }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/latam-logo.svg"
                alt="LATAM Airlines"
                className="h-7 w-auto drop-shadow-[0_1px_8px_rgba(6,10,25,0.35)]"
              />
            </motion.a>

            <motion.nav
              className="hidden items-center gap-9 text-sm font-semibold md:flex"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: ENTER }}
            >
              {NAV_LINKS.map((link) => (
                <HoverLink key={link.href} label={link.label} href={link.href} />
              ))}
            </motion.nav>

            <motion.div
              className="hidden items-center gap-6 text-sm font-semibold md:flex"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: ENTER }}
            >
              <HoverLink label="empleos@latam.com" href="mailto:empleos@latam.com" />
            </motion.div>
          </div>
        </header>

        {/* ── Left readability gradient (cabin phase only — fades before the
             sky, so it never dims the clouds) ── */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[rgba(5,8,20,0.55)] via-[rgba(5,8,20,0.12)] to-transparent"
          style={{ opacity: textOpacity }}
        />

        {/* ── A. Initial hero lockup — cohesive column, centered on the left ── */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center"
          style={{ opacity: textOpacity, y: textY }}
        >
          <div className="mx-auto w-full max-w-[100rem] px-6 lg:px-12">
            <div className="max-w-xl">
              <h1 className="font-display text-[clamp(3rem,8vw,6.25rem)] font-bold leading-[0.92] tracking-tight text-white [text-shadow:0_2px_36px_rgba(6,10,25,0.45)]">
                <RevealText text="Despega tu" split="words" />
                <span className="block text-red-latam">
                  <RevealText text="carrera" split="chars" delay={0.22} />
                </span>
              </h1>

              <motion.div
                className="mt-7 h-1 w-16 origin-left rounded-full bg-red-latam"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: ENTER }}
              />

              <motion.p
                className="mt-6 max-w-md text-base leading-relaxed text-white/85 [text-shadow:0_1px_16px_rgba(6,10,25,0.5)] md:text-lg"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.7, ease: ENTER }}
              >
                Únete a los más de 40,000 colaboradores que construyen el futuro
                de la aviación en América Latina — en tecnología, operaciones y
                experiencia de clientes.
              </motion.p>

              <motion.a
                href="#vacantes"
                className="group/cta mt-8 inline-flex items-center gap-3 rounded-full bg-red-latam px-6 py-3 text-sm font-semibold text-white shadow-[0_1rem_2.5rem_-0.5rem_rgba(232,17,75,0.55)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-red-latam-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7, ease: ENTER }}
              >
                Postula ahora
                <AirplaneTiltIcon
                  weight="fill"
                  className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5"
                />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* ── B. Sky reveal (white text on the darkening sky) ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: skyContentOpacity }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 shadow-sm backdrop-blur-md"
            style={{ y: skyBadgeY }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            <span className="text-sm font-semibold text-white">
              ¡Estamos contratando!
            </span>
          </motion.div>

          <ScrollWordReveal
            progress={progress}
            text="Explora nuestras oportunidades y elige cuál será tu próximo destino"
            start={0.5}
            end={0.92}
            className="mx-auto mb-8 max-w-6xl font-display font-bold leading-[1.03] tracking-tight text-[clamp(2.75rem,7.8vw,6.75rem)] [-webkit-text-stroke:0.6px_currentColor]"
          />

          <motion.p
            className="mx-auto max-w-2xl text-lg font-medium text-white/75 md:text-xl"
            style={{ opacity: skySubOpacity, y: skySubY }}
          >
            Más de 40,000 colaboradores en 5 países construyen el futuro de la
            aviación en América Latina.
          </motion.p>
        </motion.div>

        {/* ── Scroll-down control (clickable + fills with progress) ── */}
        <ScrollProgressButton
          progress={progress}
          reduced={reduced}
          onClick={goToNext}
        />
      </div>
    </section>
  );
}

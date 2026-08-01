"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_ENTER, type PolymorphicTag, type RevealBaseProps } from "./motion.types";

export interface RevealProps extends RevealBaseProps {
  children: React.ReactNode;
  /** Elemento real que se renderiza. Por defecto `div`. */
  as?: PolymorphicTag;
  /** Desde dónde entra: distancia en píxeles del translate inicial. */
  offset?: number;
  /** Dirección de entrada. `up` (por defecto) sube desde abajo. */
  from?: "up" | "down" | "left" | "right";
}

/**
 * Equivalente al `data-div-reveal` de Webflow: un bloque que aparece con un
 * fundido y un empuje corto cuando entra en viewport. A diferencia del export
 * de Framer, no depende de `position:absolute`: es un motion.* normal en el
 * flujo del documento, así que escala con flex/grid sin sorpresas.
 */
export function Reveal({
  children,
  as = "div",
  offset = 24,
  from = "up",
  delay = 0,
  once = true,
  amount = 0.25,
  className,
}: RevealProps): React.JSX.Element {
  const reduced = useReducedMotion();

  const axis = from === "left" || from === "right" ? "x" : "y";
  const sign = from === "down" || from === "right" ? -1 : 1;

  // `hidden` es idéntico con y sin motion reducido a propósito: es lo que se
  // sirve en SSR, y `useReducedMotion` da false en servidor y true en el
  // primer render del cliente — ramificar aquí rompía la hidratación para
  // usuarios con motion reducido. La rama vive en la transición: el transform
  // salta a duración 0 (sin movimiento) y sólo queda el fundido.
  const variants: Variants = {
    hidden: { opacity: 0, [axis]: offset * sign },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: reduced
        ? { duration: 0.35, delay, [axis]: { duration: 0 } }
        : { duration: 0.7, ease: EASE_ENTER, delay },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {children}
    </MotionTag>
  );
}

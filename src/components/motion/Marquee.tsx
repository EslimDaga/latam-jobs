"use client";

import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

export interface MarqueeProps {
  children: React.ReactNode;
  /** Segundos por vuelta completa. Menor = más rápido. Por defecto 48. */
  duration?: number;
  /** `left` (por defecto) o `right`. */
  direction?: "left" | "right";
  /** Separación entre copias, cualquier unidad CSS. Por defecto `3rem`. */
  gap?: string;
  /** Pausa la cinta al pasar el puntero por encima. */
  pauseOnHover?: boolean;
  /** Difumina los bordes con una máscara para que entre y salga suave. */
  fade?: boolean;
  className?: string;
}

/**
 * Cinta infinita, como las nubes del hero de Jesko (marquee 48s). En Webflow
 * era un @keyframes con `position:absolute`; aquí el contenido se duplica y el
 * loop se avanza a mano dentro del rAF de framer-motion sobre un motion value:
 * el bucle es perfecto (envuelve en la mitad del ancho) y `pauseOnHover` para
 * sin saltos porque retoma desde la posición exacta. Con motion reducido queda
 * estático.
 */
export function Marquee({
  children,
  duration = 48,
  direction = "left",
  gap = "3rem",
  pauseOnHover = false,
  fade = true,
  className,
}: MarqueeProps): React.JSX.Element {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [paused, setPaused] = useState(false);

  useAnimationFrame((_, delta) => {
    if (reduced || paused) return;
    const halfWidth = (trackRef.current?.offsetWidth ?? 0) / 2;
    if (halfWidth === 0) return;

    const pxPerMs = halfWidth / (duration * 1000);
    const dir = direction === "left" ? -1 : 1;
    let next = x.get() + dir * pxPerMs * delta;

    // Envolver en el punto medio: las dos copias son idénticas, así que saltar
    // de -half a 0 (o de +half a 0) es invisible.
    if (next <= -halfWidth) next += halfWidth;
    else if (next >= halfWidth) next -= halfWidth;
    x.set(next);
  });

  return (
    <div
      className={`flex overflow-hidden ${className ?? ""}`}
      style={
        fade
          ? { maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }
          : undefined
      }
      onPointerEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onPointerLeave={pauseOnHover ? () => setPaused(false) : undefined}
    >
      <motion.div ref={trackRef} className="flex shrink-0" style={{ x }}>
        <div className="flex shrink-0" style={{ gap, paddingInlineEnd: gap }}>
          {children}
        </div>
        {/* Copia de relevo: aria-hidden para no duplicar la lectura. */}
        <div aria-hidden className="flex shrink-0" style={{ gap, paddingInlineEnd: gap }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE_ENTER } from "./motion.types";

export interface LoopingWordsProps {
  /** Palabras que rotan (ciudades, categorías, ubicaciones…). */
  words: string[];
  /** Milisegundos que cada palabra permanece visible. Por defecto 2200. */
  interval?: number;
  className?: string;
}

/**
 * Rotador vertical enmascarado, como el carrusel de ciudades de Jesko
 * (`data-looping-words`). Una palabra sale hacia arriba tras una máscara y la
 * siguiente entra desde abajo. La caja mide una línea y recorta con
 * `overflow:hidden`. Con motion reducido no rota: muestra la primera palabra.
 */
export function LoopingWords({
  words,
  interval = 2200,
  className,
}: LoopingWordsProps): React.JSX.Element {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || words.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [reduced, words.length, interval]);

  if (reduced) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span
      className={`relative inline-flex overflow-hidden align-bottom ${className ?? ""}`}
      // La altura la fija la línea del contenido: 1em de line-box evita saltos.
      style={{ lineHeight: 1.1 }}
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
          className="inline-block whitespace-nowrap will-change-transform"
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-110%" }}
          transition={{ duration: 0.55, ease: EASE_ENTER }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

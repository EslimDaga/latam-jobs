import type { Transition } from "framer-motion";

/**
 * Curvas compartidas con el sistema (globals.css). `enter` para entradas y
 * hovers con transform; `move` para desplazamientos largos. Nada de ease-in,
 * que arrastra en UI. Se declaran como tuplas para que framer-motion las tome
 * como bezier sin que TS las ensanche a number[].
 */
export const EASE_ENTER = [0.22, 1, 0.36, 1] as const;
export const EASE_MOVE = [0.25, 1, 0.5, 1] as const;

/** Transición de resorte para lo magnético y lo que persigue al puntero. */
export const SPRING_MAGNETIC: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 22,
  mass: 0.6,
};

/** Cómo se parte un texto para revelarlo pieza a pieza. */
export type SplitMode = "chars" | "words" | "lines";

/** Base común de todo lo que se revela al entrar en viewport. */
export interface RevealBaseProps {
  /** Retardo antes de arrancar, en segundos. */
  delay?: number;
  /** Si true (por defecto) se anima una sola vez y no vuelve a ocultarse. */
  once?: boolean;
  /**
   * Margen del viewport para disparar antes/después de que el elemento entre.
   * Formato de rootMargin CSS. Por defecto dispara un poco antes del borde.
   */
  amount?: number;
  className?: string;
}

/** Etiquetas de bloque admitidas donde importa el elemento semántico real. */
export type PolymorphicTag =
  | "div"
  | "section"
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

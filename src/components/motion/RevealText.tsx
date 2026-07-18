"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  EASE_ENTER,
  type PolymorphicTag,
  type RevealBaseProps,
  type SplitMode,
} from "./motion.types";

export interface RevealTextProps extends RevealBaseProps {
  /** El texto a revelar. Para `lines`, usa `\n` para separar renglones. */
  text: string;
  /** Cómo se parte: por caracteres, palabras o líneas. Por defecto `chars`. */
  split?: SplitMode;
  /** Elemento semántico real (h1, h2, p…). Por defecto `span`. */
  as?: PolymorphicTag;
  /** Segundos entre cada pieza. Por defecto derivado del modo. */
  stagger?: number;
}

const DEFAULT_STAGGER: Record<SplitMode, number> = {
  chars: 0.018,
  words: 0.05,
  lines: 0.09,
};

/** Una pieza a animar y su índice global (para la cascada por retardo). */
interface Piece {
  text: string;
  index: number;
}

/** Un grupo que no debe partirse de línea (una palabra, un renglón). */
type Group = Piece[];

/**
 * Parte el texto en grupos irrompibles de piezas. En modo `chars` cada palabra
 * es un grupo de caracteres (así "tu" nunca queda "t / u"); en `words`/`lines`
 * cada pieza es su propio grupo. El índice global se conserva para que la
 * cascada de retardo sea continua aunque las piezas estén anidadas por palabra.
 */
function toGroups(text: string, split: SplitMode): Group[] {
  if (split === "lines") {
    return text.split("\n").map((line, index) => [{ text: line, index }]);
  }
  if (split === "words") {
    return text
      .split(/\s+/)
      .filter(Boolean)
      .map((word, index) => [{ text: word, index }]);
  }
  let index = 0;
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => Array.from(word).map((char) => ({ text: char, index: index++ })));
}

/**
 * Reemplaza `data-char-reveal` / `data-line-reveal` de Webflow (que dependían
 * de GSAP SplitText). Cada pieza sube desde debajo de una máscara
 * `overflow:hidden`, en cascada mediante retardo por índice. El texto real
 * queda accesible en `aria-label`; las piezas visibles van `aria-hidden`.
 */
export function RevealText({
  text,
  split = "chars",
  as = "span",
  delay = 0,
  once = true,
  amount = 0.6,
  stagger,
  className,
}: RevealTextProps): React.JSX.Element {
  const reduced = useReducedMotion();
  const groups = toGroups(text, split);
  const step = stagger ?? DEFAULT_STAGGER[split];

  // `custom` = índice global de la pieza → su retardo dentro de la cascada.
  const piece: Variants = {
    hidden: reduced ? { opacity: 0 } : { y: "110%" },
    show: (i: number) => ({
      opacity: 1,
      y: "0%",
      transition: { duration: 0.7, ease: EASE_ENTER, delay: delay + (reduced ? 0 : i * step) },
    }),
  };

  const MotionTag = motion[as];
  const isLines = split === "lines";

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      aria-label={text.replace(/\n/g, " ")}
      style={{
        display: "flex",
        flexDirection: isLines ? "column" : "row",
        flexWrap: isLines ? "nowrap" : "wrap",
        alignItems: "flex-start",
        columnGap: isLines ? undefined : split === "chars" ? "0.28em" : "0.32em",
      }}
    >
      {groups.map((group, gi) => (
        // Grupo irrompible: las piezas de dentro no se separan de línea.
        <span key={gi} aria-hidden className="inline-flex whitespace-nowrap">
          {group.map((p) => (
            <span key={p.index} className="inline-flex overflow-hidden">
              <motion.span
                custom={p.index}
                variants={piece}
                className="inline-block will-change-transform"
              >
                {p.text}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </MotionTag>
  );
}

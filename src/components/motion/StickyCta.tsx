"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useState } from "react";
import { MagneticButton } from "./MagneticButton";
import { EASE_ENTER } from "./motion.types";

export interface StickyCtaProps {
  /** Texto del botón. */
  label: string;
  onClick?: () => void;
  /** Icono opcional a la derecha del texto. */
  icon?: React.ReactNode;
  /** Píxeles de scroll tras los que aparece el CTA. Por defecto 600. */
  revealAfter?: number;
  /** Posición horizontal del botón flotante. Por defecto centrado. */
  align?: "center" | "right";
}

/**
 * CTA flotante como el "Book the Flight" de Jesko: fijo abajo, aparece cuando
 * ya scrolleaste un poco y se esconde arriba del todo. Es magnético y su
 * etiqueta hace el relevo de dos capas en hover. `position:fixed` aquí sí es
 * legítimo (overlay), no el `absolute` de maquetación que evitamos en el resto.
 */
export function StickyCta({
  label,
  onClick,
  icon,
  revealAfter = 600,
  align = "center",
}: StickyCtaProps): React.JSX.Element {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    setVisible(value > revealAfter);
  });

  const position = align === "right" ? "right-6" : "left-1/2 -translate-x-1/2";

  return (
    <div className={`pointer-events-none fixed bottom-6 z-50 ${position}`}>
      <AnimatePresence>
        {visible ? (
          <motion.div
            className="pointer-events-auto"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.9 }}
            transition={{ duration: 0.4, ease: EASE_ENTER }}
          >
            <MagneticButton
              onClick={onClick}
              strength={0.4}
              className="group inline-flex items-center gap-3 rounded-full bg-indigo-latam px-6 py-3.5 text-sm font-semibold text-white shadow-[0_1rem_2.5rem_-0.5rem_rgba(15,0,80,0.55)]"
            >
              <span className="relative inline-flex overflow-hidden">
                <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[110%]">
                  {label}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 inline-block translate-y-[110%] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
                >
                  {label}
                </span>
              </span>
              {icon ? (
                <span className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                  {icon}
                </span>
              ) : null}
            </MagneticButton>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

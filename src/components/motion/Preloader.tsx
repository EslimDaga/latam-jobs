"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { RevealText } from "./RevealText";
import { EASE_ENTER } from "./motion.types";

export interface PreloaderProps {
  /** Título grande (se revela carácter a carácter). */
  title: string;
  /** Línea de apoyo bajo el título. */
  subtitle?: string;
  /** Cuánto permanece en pantalla antes de retirarse, en ms. Por defecto 2200. */
  minDuration?: number;
  /** Se llama cuando la cortina termina de salir. */
  onComplete?: () => void;
  /**
   * Máscara opcional (url a webp/png) para recortar la cortina como el globo de
   * Jesko. Si se omite, la cortina sube limpia con un radial suave.
   */
  maskImage?: string;
}

/**
 * Preloader como el de Jesko: fondo de marca, texto que se revela y una cortina
 * que se retira hacia arriba dejando ver la página. En Webflow dependía de una
 * máscara de globo + GSAP; aquí el reveal es `RevealText` y la salida un
 * translate con framer-motion. Con `maskImage` recupera el recorte exacto del
 * globo. Con motion reducido se muestra un instante y se va sin animar.
 */
export function Preloader({
  title,
  subtitle,
  minDuration = 2200,
  onComplete,
  maskImage,
}: PreloaderProps): React.JSX.Element {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setActive(false), reduced ? 300 : minDuration);
    return () => window.clearTimeout(id);
  }, [reduced, minDuration]);

  const maskStyle = maskImage
    ? {
        WebkitMaskImage: `url(${maskImage})`,
        maskImage: `url(${maskImage})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "cover",
        maskSize: "cover",
      }
    : undefined;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {active ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-indigo-latam text-white"
          style={maskStyle}
          initial={{ y: "0%" }}
          exit={reduced ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE_ENTER }}
        >
          <div className="px-6 text-center">
            <RevealText
              as="p"
              text={title}
              split="chars"
              className="text-3xl font-semibold tracking-tight sm:text-5xl"
              delay={0.15}
            />
            {subtitle ? (
              <RevealText
                as="p"
                text={subtitle}
                split="words"
                delay={0.5}
                className="mt-4 block text-sm text-white/70"
              />
            ) : null}

            {/* Barra de progreso decorativa que se llena durante la espera. */}
            <div className="mx-auto mt-8 h-px w-40 overflow-hidden bg-white/20">
              <motion.div
                className="h-full bg-white"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: (reduced ? 300 : minDuration) / 1000, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

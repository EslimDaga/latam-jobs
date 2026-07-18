"use client";

import { useLenis } from "lenis/react";
import { useRef } from "react";

/**
 * Escribe el progreso de scroll (0 → 1) en la custom property `--scroll-p`
 * del elemento referenciado. Se actualiza dentro del rAF de Lenis y muta el
 * estilo directamente, así el parallax no dispara renders de React.
 *
 * @param viewports Cuántas alturas de viewport tarda el progreso en llegar a 1.
 */
export function useScrollProgress<T extends HTMLElement>(viewports = 1): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useLenis(({ scroll }) => {
    const element = ref.current;
    if (element === null) return;

    const distance = window.innerHeight * viewports;
    const progress = distance === 0 ? 0 : Math.min(Math.max(scroll / distance, 0), 1);

    element.style.setProperty("--scroll-p", progress.toFixed(4));
  });

  return ref;
}

"use client";

import { useEffect, type RefObject } from "react";

/* ────────────────────────────────────────────────────────────────────────────
 * usePauseOffscreen — congela las animaciones en bucle de un subárbol cuando
 * sale del viewport.
 *
 * Un `@keyframes ... infinite` sigue corriendo aunque su nodo esté a miles de
 * píxeles fuera de pantalla: el compositor mantiene la capa viva y repinta en
 * cada frame para nadie. En un hero a sangre completa eso es una capa del
 * tamaño de la ventana trabajando durante todo el scroll.
 *
 * El hook marca el contenedor con `data-motion-idle` mientras no se cruza con
 * el viewport; el CSS asociado pausa los bucles y suelta el `will-change`, que
 * es justo lo que no debe quedarse fijo (reserva memoria de compositor).
 *
 * Se observa el contenedor, no cada nodo animado, para que un solo observer
 * cubra todas las capas del hero.
 * ──────────────────────────────────────────────────────────────────────────── */

const ATTR = "data-motion-idle";

export function usePauseOffscreen<T extends HTMLElement>(
  ref: RefObject<T | null>,
  /** Margen de precarga: reanuda un poco antes de que el nodo asome. */
  rootMargin = "200px",
) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Sin IntersectionObserver (o en SSR) se deja corriendo: es el
    // comportamiento anterior, nunca peor.
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        node.toggleAttribute(ATTR, !entry.isIntersecting);
      },
      { rootMargin },
    );

    io.observe(node);
    return () => {
      io.disconnect();
      node.removeAttribute(ATTR);
    };
  }, [ref, rootMargin]);
}

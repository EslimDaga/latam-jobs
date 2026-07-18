"use client";

import { ReactLenis } from "lenis/react";
import type { LenisOptions } from "lenis";

/**
 * `lerp` domina la sensación: valores bajos = scroll pesado, con mucha inercia.
 * `wheelMultiplier` < 1 compensa el peso para que la rueda no se sienta perezosa.
 */
const HEAVY_SCROLL_OPTIONS: LenisOptions = {
  lerp: 0.055,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.6,
  smoothWheel: true,
  syncTouch: false,
};

export function SmoothScroll({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <ReactLenis root options={HEAVY_SCROLL_OPTIONS}>
      {children}
    </ReactLenis>
  );
}

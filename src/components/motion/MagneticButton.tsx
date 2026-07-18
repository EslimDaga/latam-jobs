"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { useRef } from "react";
import { SPRING_MAGNETIC } from "./motion.types";

type MagneticButtonProps = HTMLMotionProps<"button"> & {
  children: React.ReactNode;
  /** Cuánto persigue al puntero, 0 → 1. Por defecto 0.35. */
  strength?: number;
};

/**
 * Botón magnético como los `data-magnetic-strength` de Jesko: el botón se
 * inclina hacia el puntero mientras está encima y vuelve a su sitio con un
 * resorte al salir. El desplazamiento se calcula desde el centro del elemento
 * y se suaviza con `useSpring`. Con motion reducido no se mueve, pero sigue
 * siendo un botón normal (hover/click intactos).
 */
export function MagneticButton({
  children,
  strength = 0.35,
  className,
  onPointerMove,
  onPointerLeave,
  ...rest
}: MagneticButtonProps): React.JSX.Element {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(useMotionValue(0), SPRING_MAGNETIC);
  const y = useSpring(useMotionValue(0), SPRING_MAGNETIC);

  return (
    <motion.button
      ref={ref}
      className={className}
      style={reduced ? undefined : { x, y }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (reduced) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        x.set(0);
        y.set(0);
      }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_ENTER } from "./motion.types";

export interface HoverLinkProps {
  /** Texto del enlace. Se duplica para el efecto de relevo. */
  label: string;
  href: string;
  /** Abre en pestaña nueva y añade rel de seguridad. */
  external?: boolean;
  className?: string;
}

/**
 * Enlace con el hover de relevo de Jesko (`hover="text" is-2`): al pasar el
 * puntero, la etiqueta de arriba sube y sale mientras un duplicado idéntico
 * entra desde abajo, dando la sensación de que el texto "gira". Dos capas
 * dentro de una máscara `overflow:hidden`; el duplicado va `aria-hidden`.
 */
export function HoverLink({
  label,
  href,
  external = false,
  className,
}: HoverLinkProps): React.JSX.Element {
  const reduced = useReducedMotion();
  const transition = { duration: 0.4, ease: EASE_ENTER };
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  if (reduced) {
    return (
      <a
        href={href}
        className={`inline-block transition-opacity hover:opacity-60 ${className ?? ""}`}
        {...externalProps}
      >
        {label}
      </a>
    );
  }

  return (
    <motion.a
      href={href}
      className={`group relative inline-flex overflow-hidden ${className ?? ""}`}
      initial="rest"
      whileHover="hover"
      animate="rest"
      {...externalProps}
    >
      <motion.span
        className="inline-block will-change-transform"
        variants={{ rest: { y: "0%" }, hover: { y: "-110%" } }}
        transition={transition}
      >
        {label}
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute inset-0 inline-block will-change-transform"
        variants={{ rest: { y: "110%" }, hover: { y: "0%" } }}
        transition={transition}
      >
        {label}
      </motion.span>
    </motion.a>
  );
}

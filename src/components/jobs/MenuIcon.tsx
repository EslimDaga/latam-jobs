"use client";

import { motion, useReducedMotion } from "framer-motion";

/* Curva "Enter" del sistema (ver ui-animation). */
const ENTER = [0.22, 1, 0.36, 1] as const;

/**
 * Icono de menú "moderno" portado del componente de Framer: hamburguesa de tres
 * barras donde la superior y la inferior están partidas en dos mitades (con la
 * costura al centro). Al abrir se transforma en una X (las filas rotan ±45° y la
 * barra central se desvanece) y al pasar el puntero las mitades se separan un
 * poco. Hereda el color vía `currentColor`, así se adapta a fondo claro u oscuro.
 *
 * Solo anima `transform`/`opacity`. Respeta `prefers-reduced-motion`.
 */
export function MenuIcon({ open }: { open: boolean }): React.JSX.Element {
  const reduced = useReducedMotion();
  const transition = { duration: reduced ? 0 : 0.32, ease: ENTER };

  return (
    <span
      aria-hidden
      className="relative block h-[22px] w-[26px] text-current drop-shadow-[0_1px_10px_rgba(6,10,25,0.45)]"
    >
      {/* Fila superior — dos mitades. */}
      <motion.span
        className="absolute inset-x-0 top-0 flex h-[3px]"
        style={{ transformOrigin: "center" }}
        initial={false}
        animate={open ? { y: 9.5, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={transition}
      >
        <span className="h-full w-1/2 rounded-l-full bg-current transition-transform duration-300 group-hover:-translate-x-[3px]" />
        <span className="h-full w-1/2 rounded-r-full bg-current transition-transform duration-300 group-hover:translate-x-[2px]" />
      </motion.span>

      {/* Barra central — se desvanece al abrir. */}
      <motion.span
        className="absolute inset-x-0 top-[9.5px] h-[3px] rounded-full bg-current"
        style={{ transformOrigin: "center" }}
        initial={false}
        animate={open ? { opacity: 0, scaleX: 0.3 } : { opacity: 1, scaleX: 1 }}
        transition={transition}
      />

      {/* Fila inferior — dos mitades. */}
      <motion.span
        className="absolute inset-x-0 bottom-0 flex h-[3px]"
        style={{ transformOrigin: "center" }}
        initial={false}
        animate={open ? { y: -9.5, rotate: -45 } : { y: 0, rotate: 0 }}
        transition={transition}
      >
        <span className="h-full w-1/2 rounded-l-full bg-current transition-transform duration-300 group-hover:-translate-x-[2px]" />
        <span className="h-full w-1/2 rounded-r-full bg-current transition-transform duration-300 group-hover:translate-x-[3px]" />
      </motion.span>
    </span>
  );
}

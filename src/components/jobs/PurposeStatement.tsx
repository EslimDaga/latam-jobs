"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

/* Curva "Enter" del sistema (ver ui-animation). */
const ENTER = [0.22, 1, 0.36, 1] as const;

/* Las líneas suben escalonadas al entrar en viewport (una sola vez). */
const GROUP: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const LINE: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ENTER } },
};

/**
 * Declaración de propósito posterior al hero: fondo blanco, etiqueta rosa y un
 * enunciado grande en índigo con el cierre en gris. Las líneas se revelan
 * escalonadas al entrar en viewport (framer-motion `whileInView`, una sola vez).
 */
export function PurposeStatement(): React.JSX.Element {
  const reduced = useReducedMotion();

  return (
    <section
      id="proposito"
      aria-label="Nuestro propósito"
      className="bg-white py-28 md:py-40"
    >
      <motion.div
        className="mx-auto max-w-5xl px-6 text-center"
        variants={GROUP}
        initial={reduced ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        <motion.p
          variants={LINE}
          className="text-xs font-bold uppercase tracking-[0.35em] text-red-latam"
        >
          Nuestro propósito
        </motion.p>

        <h2 className="mt-8 font-sans text-[clamp(1.65rem,4vw,2.9rem)] font-medium leading-[1.25] tracking-[-0.01em] text-indigo-latam">
          <motion.span variants={LINE} className="block">
            Volar es solo el comienzo.
          </motion.span>
          <motion.span variants={LINE} className="block">
            Tu talento conecta personas, mueve negocios y
          </motion.span>
          <motion.span variants={LINE} className="block text-ink-faint">
            eleva el futuro de la región.
          </motion.span>
        </h2>
      </motion.div>
    </section>
  );
}

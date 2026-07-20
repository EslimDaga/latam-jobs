"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { EASE_ENTER } from "./motion.types";
import type { CurtainLoaderProps } from "./CurtainLoader.types";

/** Isotipo LATAM (la bandera roja) — se reutiliza como marca de agua del fondo. */
function LatamMark({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg viewBox="0 0 39 61" fill="none" className={className} aria-hidden>
      <path d="M8.964 54.322l5.383-1.95c1.128-.408 1.128.488 1.128 1.831v2.464c0 1.989-.676 2.226-1.565 2.555l-4.932 1.778v-6.678z" fill="#1B0088" />
      <path d="M8.964 43.415l13.684-4.954c1.127-.408 1.127.488 1.127 1.831v2.451c0 2.002-.676 2.239-1.565 2.568L8.977 50.093v-6.678z" fill="#1B0088" />
      <path d="M7.85 27.857L.902 25.341C0 25.025 0 23.813 0 23.366c0 0 0 1.462 1.339.974l34.079-12.316c2.691-.975 2.691-1.726 1.564-2.134 1.127.408 1.127.408 1.127 3.675 0 3.122 0 4.162-1.339 4.65L10.091 27.857c-1.127.408-1.127.408-2.241 0z" fill="#1B0088" />
      <path d="M36.996 20.797c1.127.408 1.127 1.159-1.565 2.133L8.964 32.494v6.678l27.806-10.05c1.339-.488 1.339-1.528 1.339-4.65 0-3.267 0-3.267-1.113-3.675z" fill="#1B0088" />
      <path d="M2.917 15.159l11.908 4.307 9.242-3.346L1.79 8.072C.225 7.505 0 7.426 0 8.546v2.898c0 2.661 2.016 3.399 2.917 3.715z" fill="#ED1650" />
      <path d="M36.996 20.797l-3.7-1.33-9.242 3.346 5.848 2.12 5.516-1.989c2.691-.988 2.691-1.739 1.578-2.147z" fill="#ED1650" />
      <path d="M36.996 9.89S12.332.972 10.767.405C9.189-.161 8.964-.24 8.964.866v2.898c0 2.674 2.015 3.399 2.917 3.728l18.034 6.521 5.516-1.989c2.679-.975 2.679-1.726 1.565-2.134z" fill="#ED1650" />
      <path d="M1.339 24.34l7.625-2.753-7.174-2.595C.225 18.426 0 18.334 0 19.453v3.913s0 1.462 1.339.974z" fill="#ED1650" />
    </svg>
  );
}

/** Logotipo completo LATAM (isotipo rojo + wordmark índigo) — protagonista. */
function LatamLogo({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg viewBox="0 0 200 61" fill="none" className={className} role="img" aria-label="LATAM Airlines">
      <path d="M129.669 47.129v13.726h2.162V47.129h-2.162zm37.725 0v13.726h11.085v-2.002h-8.924v-4.295h7.771v-1.857h-7.771v-3.715h8.632v-1.857h-10.793zm-91.428 0v13.726h2.161V47.129h-2.161zm35.696 13.739h10.078v-1.857h-7.916V47.142h-2.162v13.726zm-16.548-6.007c-1.578 0-3.169-.434-4.177-1.001v-5.15h5.622c2.732 0 3.739 1.435 3.739 2.713 0 1.858-1.445 3.438-5.184 3.438zm-33.402.577h-6.338l3.169-6.442 3.169 6.442zm82.782 5.43V49.566l9.507 10.722c.292.435.716.567 1.3.567h1.299V47.129h-2.015v10.867l-9.362-10.301c-.292-.435-.57-.566-1.299-.566h-1.446v13.726h2.016v.013zm-53.557 0V55.862c1.008.567 2.453.856 4.031.856.862 0 1.446 0 2.162-.144l2.878 4.294h2.307l-3.169-4.861c2.015-.856 3.315-2.568 3.315-4.571 0-2.568-2.162-4.439-6.047-4.439h-7.638v13.871h2.161zm-26.639 0h2.161l-6.484-13.16c-.292-.434-.57-.566-1.008-.566h-1.578l-6.762 13.726h2.148l1.724-3.57h8.062l1.737 3.57zm129.917-14.028c-3.74 0-6.193 1.581-6.193 4.004 0 2.292 1.87 3.149 4.893 3.715l1.445.29c2.162.434 3.315 1.146 3.315 2.292 0 1.146-1.153 2.002-4.031 2.002-2.585 0-4.614-.856-5.184-1.291l-.57 2.002c.57.29 2.585 1.146 5.609 1.146 4.031 0 6.338-1.567 6.338-4.004 0-2.292-2.016-3.438-5.185-4.005l-1.445-.29c-2.307-.434-3.023-.856-3.023-2.002 0-1.146 1.299-2.002 3.885-2.002 2.161 0 3.739.435 4.468.711l.438-1.712c-.875-.277-2.453-.856-4.76-.856z" fill="#1B0088" />
      <path d="M114.155 32.138h6.073V15.33l10.608-.698v-4.334h-27.289v4.334l10.608.698v16.808zM70.318 32.138l2.492-5.032H58.079V10.298h-6.312v21.84h18.551zM93.788 23.695h-8.182l4.137-8.747 4.045 8.747zm54.909 0h-8.194l4.137-8.747 4.057 8.747zm27.753 3.108c.239.777 1.167 1.318 2.188 1.318h6.312l4.681-12.857 4.442 16.888H200l-4.906-19.364c-.464-1.936-1.565-2.476-3.355-2.476h-6.166l-4.442 12.777-3.514-10.854c-.464-1.383-1.326-1.936-2.731-1.936h-6.935l-5.689 21.84h6.007l4.363-16.887 3.818 11.551zm-23.629 5.335h6.63L149.002 11.68c-.543-1.001-1.087-1.396-2.334-1.396h-5.768l-11.005 21.854h6.709l1.949-4.031h12.319l1.949 4.031zm-52.985 0h6.71L94.106 11.694c-.544-1.001-1.088-1.396-2.347-1.396h-5.768L74.998 32.138h6.696l1.95-4.031h12.318l1.883 4.031z" fill="#1B0088" />
      <path d="M8.964 54.322l5.383-1.95c1.128-.408 1.128.488 1.128 1.831v2.464c0 1.989-.676 2.226-1.565 2.555l-4.932 1.778v-6.678z" fill="#1B0088" />
      <path d="M8.964 43.415l13.684-4.954c1.127-.408 1.127.488 1.127 1.831v2.451c0 2.002-.676 2.239-1.565 2.568L8.977 50.093v-6.678z" fill="#1B0088" />
      <path d="M7.85 27.857L.902 25.341C0 25.025 0 23.813 0 23.366c0 0 0 1.462 1.339.974l34.079-12.316c2.691-.975 2.691-1.726 1.564-2.134 1.127.408 1.127.408 1.127 3.675 0 3.122 0 4.162-1.339 4.65L10.091 27.857c-1.127.408-1.127.408-2.241 0z" fill="#1B0088" />
      <path d="M36.996 20.797c1.127.408 1.127 1.159-1.565 2.133L8.964 32.494v6.678l27.806-10.05c1.339-.488 1.339-1.528 1.339-4.65 0-3.267 0-3.267-1.113-3.675z" fill="#1B0088" />
      <path d="M2.917 15.159l11.908 4.307 9.242-3.346L1.79 8.072C.225 7.505 0 7.426 0 8.546v2.898c0 2.661 2.016 3.399 2.917 3.715z" fill="#ED1650" />
      <path d="M36.996 20.797l-3.7-1.33-9.242 3.346 5.848 2.12 5.516-1.989c2.691-.988 2.691-1.739 1.578-2.147z" fill="#ED1650" />
      <path d="M36.996 9.89S12.332.972 10.767.405C9.189-.161 8.964-.24 8.964.866v2.898c0 2.674 2.015 3.399 2.917 3.728l18.034 6.521 5.516-1.989c2.679-.975 2.679-1.726 1.565-2.134z" fill="#ED1650" />
      <path d="M1.339 24.34l7.625-2.753-7.174-2.595C.225 18.426 0 18.334 0 19.453v3.913s0 1.462 1.339.974z" fill="#ED1650" />
    </svg>
  );
}

/**
 * Cortina de carga LATAM. Reescritura sobre fondo blanco corporativo: dos
 * paneles blancos en flujo flex (sin `position:absolute` para maquetar) que se
 * retiran a los lados con framer-motion, con el logotipo oficial de LATAM al
 * centro y un isotipo gigante como marca de agua para dar textura al blanco.
 *
 * Se abre cuando terminan de cargar los recursos (`window.load`), con un mínimo
 * en pantalla para que no parpadee y un tope de seguridad por si algo se cuelga.
 * Con movimiento reducido solo hace un fundido.
 */
export function CurtainLoader({
  minDuration = 1000,
  maxDuration = 6000,
  onComplete,
}: CurtainLoaderProps): React.JSX.Element {
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const [active, setActive] = useState(true);

  useEffect(() => {
    const start = Date.now();
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, (reduced ? 0 : minDuration) - elapsed);
      window.setTimeout(() => setActive(false), remaining);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }
    const safety = window.setTimeout(finish, maxDuration);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(safety);
    };
  }, [reduced, minDuration, maxDuration]);

  // Congela el scroll (Lenis) mientras la cortina cubre y lo reactiva al abrir.
  // Al ser hijo de <SmoothScroll>, el loader alcanza la instancia de Lenis; así
  // el scroll queda garantizado apenas termina el loader.
  useEffect(() => {
    if (active) {
      lenis?.stop();
    }
    return () => {
      lenis?.start();
    };
  }, [active, lenis]);

  const handleExitComplete = () => {
    lenis?.start();
    onComplete?.();
  };

  // Los paneles esperan a que el logo se desvanezca antes de partirse.
  const panelExit = reduced
    ? {}
    : ({ duration: 1.05, ease: EASE_ENTER, delay: 0.2 } as const);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {active ? (
        <motion.div
          key="curtain-loader"
          className="fixed inset-0 z-[200] flex"
          exit={reduced ? { opacity: 0 } : {}}
          transition={reduced ? { duration: 0.4, ease: EASE_ENTER } : undefined}
          aria-hidden
        >
          {/* Panel izquierdo — se retira hacia la izquierda. */}
          <motion.div
            className="h-full w-1/2 bg-white"
            exit={reduced ? {} : { x: "-100%" }}
            transition={panelExit}
          />
          {/* Panel derecho — se retira hacia la derecha. */}
          <motion.div
            className="h-full w-1/2 bg-white"
            exit={reduced ? {} : { x: "100%" }}
            transition={panelExit}
          />

          {/* Marca de agua: isotipo gigante que sangra por el borde, muy tenue. */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden">
            <LatamMark className="h-[135%] w-auto translate-x-[22%] opacity-[0.035]" />
          </div>

          {/* Bloque central: logotipo + línea de progreso. Se desvanece primero. */}
          <motion.div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_ENTER }}
          >
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={reduced ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: EASE_ENTER }}
            >
              <LatamLogo className="h-12 w-auto sm:h-14" />
            </motion.div>

            {/* Riel de progreso con degradado de marca índigo → rojo. */}
            <span className="block h-[2px] w-28 overflow-hidden rounded-full bg-[#1B0088]/10">
              <motion.span
                className="block h-full w-full origin-left rounded-full bg-gradient-to-r from-[#1B0088] to-[#ED1650]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: (reduced ? 0.3 : minDuration / 1000) * 1.15,
                  ease: "easeInOut",
                }}
              />
            </span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

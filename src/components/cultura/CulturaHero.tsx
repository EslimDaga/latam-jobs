"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_ENTER, usePauseOffscreen } from "@/components/motion";
import { SiteHeader } from "@/components/header/SiteHeader";

/* ────────────────────────────────────────────────────────────────────────────
 * CulturaHero — cabecera de /cultura.
 *
 * Clon del nodo "Section" (#3416:11385) del Figma [RH+] Trabalhe Conosco. Las
 * medidas son las del archivo a 1440px:
 *
 *   · Marco de vídeo "Image - Video de cultura LATAM" (#3416:11386): 1401×792
 *     en (19,15) sobre una sección de 842, radio 28.06, filete blanco al 16% y
 *     sombra 0 51.02px 114.79px -51.02px rgba(31,19,81,1).
 *   · Portada "image 167": rect 1753×1140 en (-208,-195). El JPG del repo ya
 *     viene recortado a esa ventana (sin las bandas negras del vídeo), así que
 *     aquí basta un `object-cover`. Hoy sólo actúa de `poster`: el marco lo
 *     ocupa el vídeo institucional en bucle mudo.
 *   · "Overlay+Shadow": sombra interior 21px 91px 125.1px rgba(6,16,35,.85).
 *   · "Overlay 2": velo radial rgba(20,8,68,.19) → rgba(3,1,24,.31).
 *   · Botón de play: retirado a petición del usuario (el marco ya reproduce).
 *   · Bloque de titular en (38,357): antetítulo 16/22.04 y titular de 96/94.
 *   · Nav bar (#3416:11403): padding 39/100/16, interior 1241.
 * ──────────────────────────────────────────────────────────────────────────── */

const HERO: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const HERO_ITEM: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE_ENTER } },
};

/* El `hidden` es idéntico al de arriba a propósito: es lo que se sirve en SSR
   y `useReducedMotion` difiere entre servidor (false) y cliente (true), así
   que ramificar el estado inicial rompía la hidratación. Con motion reducido
   el `y` salta a duración 0 y sólo se percibe el fundido. */
const HERO_ITEM_REDUCIDO: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, y: { duration: 0 } } },
};

export interface CulturaHeroProps {
  /** El visor está abierto: hay que callar el bucle del fondo. */
  visorAbierto?: boolean;
}

export function CulturaHero({ visorAbierto = false }: CulturaHeroProps) {
  const reduced = useReducedMotion();
  const item = reduced ? HERO_ITEM_REDUCIDO : HERO_ITEM;

  // Mientras el marco esté fuera de pantalla, la respiración de la portada y
  // el halo del play se congelan (ver `[data-motion-idle]` en globals.css).
  const marcoRef = useRef<HTMLDivElement>(null);
  usePauseOffscreen(marcoRef);

  /* ── Bucle de fondo ───────────────────────────────────────────────────────
   * El <video> no lleva `autoPlay`: lo arranca este efecto. Así hay un único
   * camino de decisión (visible && !reducido && !visor) en vez de un atributo
   * en el HTML de SSR peleándose con `useReducedMotion`, que en servidor vale
   * `false` y en cliente `true` — eso rompía la hidratación.
   *
   * Además de ahorrar CPU, pausar fuera de pantalla corta la descarga: el
   * vídeo va en streaming y un marco que ya nadie ve no debe seguir tirando
   * del ancho de banda mientras se lee el resto de la página.
   * ────────────────────────────────────────────────────────────────────────── */
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Cinturón y tirantes: sin `muted` en la propiedad (no sólo en el atributo)
    // el autoplay se cae en Safari.
    video.muted = true;

    // Con motion reducido el marco se queda en el `poster`, quieto.
    if (reduced) {
      video.pause();
      return;
    }

    let visible = true;

    const sincronizar = () => {
      if (visible && !visorAbierto) {
        // Safari rechaza la promesa si el usuario aún no ha interactuado o si
        // el gestor de energía lo bloquea; el poster se queda puesto y ya.
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          sincronizar();
        },
        { rootMargin: "150px" },
      );
      io.observe(video);
    } else {
      sincronizar();
    }

    return () => io?.disconnect();
  }, [reduced, visorAbierto]);

  return (
    <motion.header className="relative" variants={HERO} initial="hidden" animate="show">
      {/* ── Cabecera / Navegación Oficial LATAM Airlines (SiteHeader) ── */}
      <SiteHeader />

      {/* ── Marco de vídeo (#3416:11386) ── */}
      <motion.div
        variants={item}
        className="px-[19px] pb-[35px] pt-[15px] sm:px-5"
      >
        <div
          ref={marcoRef}
          style={{
            background: "linear-gradient(135deg, #241B5E 0%, #160D47 100%)",
            boxShadow: "0px 51.019px 114.792px -51.019px rgba(31,19,81,1)",
          }}
          className="relative min-h-[540px] overflow-hidden rounded-[28.06px] border border-white/[0.16] lg:min-h-0 lg:aspect-[1401/792]"
        >
          {/* El marco lo ocupa el vídeo institucional en bucle mudo. Ya no
              lleva la respiración de `.hero__bg-layer`: un zoom lento encima
              de metraje que de por sí se mueve sólo ensucia la imagen.

              El `poster` es el fotograma del Figma, y es también la red: si el
              navegador bloquea el autoplay o el visitante pidió menos
              movimiento, el marco se queda exactamente como estaba antes. */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="/videos/cultura/latam-institucional-2023-loop.mp4"
            poster="/images/cultura/cultura-hero-video.jpg"
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden
            tabIndex={-1}
          />

          {/* Telón de entrada: se retira sobre el primer fotograma para que el
              vídeo no aparezca de golpe al montar. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[#160d47]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.5 : 1.4, ease: EASE_ENTER }}
          />

          {/* "Overlay+Shadow" — encaja el marco por arriba y por la izquierda. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: "inset 21px 91px 125.1px 0px rgba(6,16,35,0.85)" }}
          />

          {/* "Overlay 2" — velo radial que hunde los bordes. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 53%, rgba(20,8,68,0.19) 0%, rgba(3,1,24,0.31) 78%)",
            }}
          />

          {/* El botón de play del Figma (#3416:11389) ya no está: el marco
              reproduce solo, así que un control de play encima no gobernaba
              nada. */}

          {/* ── Titular (#3416:11396) — en (38,357) sobre el marco ──
               Anclado por arriba (357/792 = 45.1%), como en el Figma: es lo que
               deja el botón de play justo encima del antetítulo en vez de
               cruzado con el titular. */}
          <div className="absolute inset-x-0 bottom-8 z-10 flex flex-col gap-3.5 px-6 sm:px-8 lg:bottom-auto lg:left-[38px] lg:right-auto lg:top-[45.1%] lg:max-w-[886px] lg:px-0">
            <motion.p
              variants={item}
              className="text-[13px] font-black uppercase leading-[22.04px] tracking-[0.2939em] text-[#eceef3] sm:text-[16px]"
            >
              Nuestra Cultura
            </motion.p>

            <motion.h1
              variants={item}
              className="max-w-[870px] text-[clamp(2.25rem,6.667vw,6rem)] font-black leading-[1.04] tracking-[-0.0278em] text-[var(--fig-cloud)] lg:leading-[0.979]"
            >
              Nuestro propósito es elevar cada viaje, <span>siempre.</span>
            </motion.h1>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}

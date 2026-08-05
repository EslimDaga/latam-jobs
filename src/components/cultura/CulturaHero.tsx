"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_ENTER, usePauseOffscreen, useScrollProgress } from "@/components/motion";
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
 *   · Metraje: "Somos LATAM" (LATAM Brasil), la pieza que marca dejó en el
 *     comentario de Figma anclado sobre este marco. El máster viene 1920×1080
 *     con el cuadro apaisado dentro y los **subtítulos en portugués quemados**
 *     en la franja inferior; el asset del repo va recortado a
 *     `crop=1920:830:0:108`, que se los come enteros (medido a lo largo de todo
 *     el film, no a ojo). Se recorta también el bumper del logo (0–1,2 s) y las
 *     cartelas finales "SOMOS LATAM" + créditos (desde 109,5 s), que son
 *     grafismo y no metraje. Mudo, 1280×554, 24 fps.
 *   · El `poster` es el fotograma de 1,2 s: es exactamente la portada del
 *     Figma, así que el relevo póster→vídeo no se ve. Sigue siendo la red si
 *     el navegador bloquea el autoplay o si se pidió menos movimiento.
 *   · "Overlay+Shadow": sombra interior 21px 91px 125.1px rgba(6,16,35,.85).
 *   · "Overlay 2": velo radial rgba(20,8,68,.19) → rgba(3,1,24,.31).
 *   · Botón de play: retirado a petición del usuario (el marco ya reproduce).
 *   · Bloque de titular en (38,357): antetítulo 16/22.04 y titular de 96/94.
 *   · Nav bar (#3416:11403): padding 39/100/16, interior 1241.
 *
 * ── Movimiento ──────────────────────────────────────────────────────────────
 * El gesto está calcado del hero de wolverineworldwide.com, que es el que pidió
 * el usuario. Su JS va compilado (Locomotive + GSAP SplitText), así que lo que
 * se reproduce es el vocabulario observable en el marcado y en las fórmulas que
 * sí viajan en el HTML, no su código:
 *
 *   1. Entrada del metraje: el marco arranca con el plano un punto más cerca y
 *      lo suelta (`scale` 1.12 → 1) por debajo del telón que ya existía. Es su
 *      `data-hero-home="background"`.
 *   2. Titular por piezas enmascaradas: cada palabra sube desde detrás de un
 *      `overflow:hidden` en cascada. Es el SplitText de su `data-hero-home="title"`,
 *      partido por palabras en vez de por líneas para que aguante el `clamp()`
 *      del titular en móvil sin cortes fijos.
 *   3. Paralaje al hacer scroll: el metraje se queda rezagado y se acerca,
 *      mientras el bloque de texto se retira y se apaga. Es su patrón
 *      `data-scroll-css-progress` — allí `scale(calc(1.15 - var(--progress)*0.15))`
 *      con un `translateY` acoplado; aquí la variable es `--scroll-p`, que
 *      escribe `useScrollProgress` dentro del rAF de Lenis (el scroll suave ya
 *      estaba montado en el layout raíz). Las fórmulas viven en globals.css.
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

/* ── Titular enmascarado ─────────────────────────────────────────────────────
 * No se reutiliza `RevealText` de la librería a propósito: su modo `lines`
 * fuerza `flex-direction: column` con `nowrap`, y este titular es una frase
 * larga sobre un `clamp()` — en móvil se saldría del marco. Y sus máscaras no
 * dejan aire bajo la línea base, que aquí hace falta: "propósito" y "viaje,"
 * bajan del renglón y con `leading-[1.04]` el `overflow:hidden` les comería la
 * cola. La holgura la pone `.cultura-hero__mask` en globals.css.
 * ──────────────────────────────────────────────────────────────────────────── */

const TITULO = "Nuestro propósito es elevar cada viaje, siempre.";

/** Arranca cuando el antetítulo ya está puesto, no a la vez. */
const TITULO_DELAY = 0.26;
/* 70 ms por palabra. La referencia de entradas escalonadas pide 80 ms para un
   titular de hero (frente a los 30-50 ms de una lista), pero éste tiene siete
   palabras: a 80 ms la última arrancaría pasados 0,82 s y el remate se iría a
   casi 1,8 s. A 70 ms se mantiene el peso narrativo y cierra en ~1,6 s. */
const TITULO_STAGGER = 0.07;
const TITULO_DURACION = 0.95;

/* Las tres propiedades van juntas a propósito. Por separado el gesto se lee
   pobre: sólo `y` es mecánico (era el defecto de la versión anterior), sólo
   `opacity` es plano y sólo el desenfoque no lleva a ninguna parte. Juntas dan
   la palabra que sube, se materializa y enfoca al asentarse.

   El desenfoque va en `em`, no en píxeles: el titular es un `clamp()` de 36 a
   96 px, y unos 9 px fijos que en escritorio son un matiz en móvil taparían la
   palabra entera. En `em` el desenfoque escala con la tipografía.

   El recorrido es la altura completa de la pieza (115%), no un empuje corto: la
   entrada es lo que construye presencia, y la máscara ya la tenía tapada. */
const PALABRA_OCULTA = { y: "115%", opacity: 0, filter: "blur(0.09em)" };
const PALABRA_VISIBLE = { y: "0%", opacity: 1, filter: "blur(0em)" };

function TituloRevelado({ reducido }: { reducido: boolean }) {
  return (
    <h1
      aria-label={TITULO}
      className="max-w-[870px] text-[clamp(2.25rem,6.667vw,6rem)] font-black leading-[1.04] tracking-[-0.0278em] text-[var(--fig-cloud)] lg:leading-[0.979]"
    >
      {TITULO.split(" ").map((palabra, i) => (
        <span key={i} aria-hidden className="cultura-hero__mask">
          <motion.span
            className="inline-block"
            /* El `initial` no ramifica en `reducido`: es lo que se sirve en SSR
               y `useReducedMotion` vale false en servidor y true en el primer
               render del cliente, así que ramificar aquí rompe la hidratación
               (mismo criterio que el resto de la librería de motion). */
            initial={PALABRA_OCULTA}
            animate={PALABRA_VISIBLE}
            transition={
              reducido
                ? { duration: 0 }
                : {
                    duration: TITULO_DURACION,
                    ease: EASE_ENTER,
                    delay: TITULO_DELAY + i * TITULO_STAGGER,
                    /* El desenfoque cierra antes que el recorrido: la palabra
                       llega ya nítida y sólo el último tramo del viaje es el
                       asentamiento. Si enfocara a la vez, el remate se vería
                       blando. */
                    filter: {
                      duration: TITULO_DURACION * 0.66,
                      ease: EASE_ENTER,
                      delay: TITULO_DELAY + i * TITULO_STAGGER,
                    },
                  }
            }
          >
            {palabra}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

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

  // `--scroll-p` (0 → 1 en una altura de ventana) se escribe sobre el <header>
  // y cae por herencia al metraje y al bloque de texto. Se muta el estilo
  // dentro del rAF de Lenis, así que la paralaje no dispara renders de React.
  const headerRef = useScrollProgress<HTMLElement>(1);

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
    <motion.header
      ref={headerRef}
      className="relative"
      variants={HERO}
      initial="hidden"
      animate="show"
    >
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
          {/* Dos capas de transform anidadas, y no una: la de fuera hace la
              entrada (una sola vez, la lleva framer) y la de dentro la
              paralaje de scroll (continua, la lleva CSS con `--scroll-p`).
              Juntas en el mismo nodo se pisarían la propiedad `transform`. */}
          <motion.div
            aria-hidden
            className="absolute inset-0"
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: reduced ? 0 : 1.8, ease: EASE_ENTER }}
          >
            <video
              ref={videoRef}
              className="cultura-hero__media absolute inset-0 h-full w-full object-cover"
              src="/videos/cultura/cultura-somos-latam-loop.mp4"
              poster="/images/cultura/cultura-hero-somos-latam.jpg"
              loop
              muted
              playsInline
              preload="metadata"
              aria-hidden
              tabIndex={-1}
            />
          </motion.div>

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

          {/* ── Velo de lectura ───────────────────────────────────────────────
               No está en el Figma: el mock es un fotograma fijo y oscuro, pero
               el metraje real pasa por fuselajes blancos, cielos reventados y
               una cartela clara. Medido sobre la página compuesta (texto
               oculto, siete puntos del bucle) el titular caía a 1.47:1 y el
               antetítulo a 1.48:1 — muy por debajo de AA.

               El degradado es diagonal y sólo cubre la mitad donde vive el
               texto, así que la derecha del plano se mantiene limpia. Las
               paradas están calibradas contra ESTE clip: si se cambia el
               metraje hay que volver a medir, no mirar. Umbrales: titular de
               96px → 3:1; antetítulo de 16px → 4.5:1 (es el que se queda corto
               primero). */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(101deg, rgba(6,3,30,0.88) 0%, rgba(6,3,30,0.82) 24%, rgba(6,3,30,0.60) 44%, rgba(6,3,30,0.28) 62%, rgba(6,3,30,0.06) 78%, rgba(6,3,30,0) 90%)",
            }}
          />

          {/* El botón de play del Figma (#3416:11389) ya no está: el marco
              reproduce solo, así que un control de play encima no gobernaba
              nada. */}

          {/* ── Titular (#3416:11396) — en (38,357) sobre el marco ──
               Anclado por arriba (357/792 = 45.1%), como en el Figma: es lo que
               deja el botón de play justo encima del antetítulo en vez de
               cruzado con el titular. */}
          <div className="cultura-hero__copy absolute inset-x-0 bottom-8 z-10 flex flex-col gap-3.5 px-6 sm:px-8 lg:bottom-auto lg:left-[38px] lg:right-auto lg:top-[45.1%] lg:max-w-[886px] lg:px-0">
            <motion.p
              variants={item}
              className="text-[13px] font-black uppercase leading-[22.04px] tracking-[0.2939em] text-[#eceef3] sm:text-[16px]"
            >
              Nuestra Cultura
            </motion.p>

            <TituloRevelado reducido={reduced === true} />
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}

"use client";

import { X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { EASE_ENTER } from "@/components/motion";

/* ────────────────────────────────────────────────────────────────────────────
 * VideoLightbox — visor compartido por los dos reproductores del diseño:
 * el marco grande del hero (#3416:11386) y la tarjeta de testimonio
 * (#3416:11777).
 *
 * Con `src` reproduce la pieza a pantalla completa, con sonido y controles —
 * es el único sitio de /cultura donde suena algo. Sin `src` se cae al aviso de
 * contenido pendiente sobre el fotograma de portada, que es lo que sigue
 * necesitando la tarjeta de testimonios hasta que marca entregue su vídeo.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface VideoLightboxProps {
  abierto: boolean;
  onClose: () => void;
  /** Fotograma de portada que se muestra dentro del visor. */
  poster: string;
  titulo: string;
  /** Pieza a reproducir. Si falta, el visor enseña el aviso de pendiente. */
  src?: string;
}

export function VideoLightbox({ abierto, onClose, poster, titulo, src }: VideoLightboxProps) {
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const cerrarRef = useRef<HTMLButtonElement>(null);
  // Quién tenía el foco antes de abrir: al cerrar hay que devolvérselo.
  const origenFoco = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!abierto) return;

    origenFoco.current = document.activeElement as HTMLElement | null;
    // Lenis gobierna el scroll del documento: pararlo es más fiable que
    // `overflow:hidden`, que él mismo puede volver a pisar en el siguiente rAF.
    lenis?.stop();
    cerrarRef.current?.focus();

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", alTeclear);

    return () => {
      window.removeEventListener("keydown", alTeclear);
      lenis?.start();
      origenFoco.current?.focus();
    };
  }, [abierto, lenis, onClose]);

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,4,32,0.82)] p-4 backdrop-blur-md sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.28, ease: EASE_ENTER }}
          onClick={onClose}
          data-lenis-prevent
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={titulo}
            className="relative w-full max-w-[1100px] overflow-hidden rounded-[24px] border border-white/15 bg-[#0d0733] shadow-[0px_51px_115px_-51px_rgba(31,19,81,1)]"
            initial={{ opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.98, y: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.35, ease: EASE_ENTER }}
            // El clic dentro no debe cerrar; sólo el telón.
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={cerrarRef}
              type="button"
              onClick={onClose}
              aria-label="Cerrar el visor de vídeo"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/25 active:scale-95"
            >
              <X size={20} aria-hidden />
            </button>

            <div className="relative aspect-[1401/792] bg-black">
              {src ? (
                /* `key` fuerza un elemento nuevo al cambiar de pieza: reusar el
                   mismo <video> deja el fotograma del anterior congelado
                   mientras el nuevo carga. `autoPlay` aquí sí es correcto —
                   el visor sólo existe tras un clic explícito en play. */
                <video
                  key={src}
                  src={src}
                  poster={poster}
                  className="h-full w-full"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                />
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={poster} alt="" className="h-full w-full object-cover" aria-hidden />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,4,32,0.15)_0%,rgba(8,4,32,0.86)_100%)]"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                    <p className="text-[12px] font-black uppercase leading-[18.63px] tracking-[0.1391em] text-[var(--fig-pink-hot)]">
                      Nuestra cultura
                    </p>
                    <p className="pt-2 text-[clamp(1.25rem,2.2vw,1.75rem)] font-bold leading-tight text-white">
                      {titulo}
                    </p>
                    <p className="max-w-[560px] pt-3 text-[15px] leading-[23.16px] text-white/70">
                      <span className="font-semibold text-white">Contenido pendiente.</span> Aquí
                      irá la pieza de vídeo que nos entregue el equipo de marca.
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

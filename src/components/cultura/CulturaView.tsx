"use client";

import { useState } from "react";
import { CulturaHero } from "./CulturaHero";
import { GuiasCulturales } from "./GuiasCulturales";
import { JetsSection } from "./JetsSection";
import { PorQueLatam } from "./PorQueLatam";
import { PropositoSection } from "./PropositoSection";
import { TestimoniosJets } from "./TestimoniosJets";
import { VideoLightbox } from "./VideoLightbox";

/* ────────────────────────────────────────────────────────────────────────────
 * CulturaView — orquestador de /cultura (marco "Cultura" #3416:11384).
 *
 * Las secciones son autónomas; lo único compartido es el visor de vídeo, que
 * abren tanto el marco del hero como la tarjeta de testimonios. Vive aquí para
 * que exista un solo diálogo en el árbol y el foco no se dispute entre dos.
 * ──────────────────────────────────────────────────────────────────────────── */

type VideoAbierto = null | "testimonio";

/* Ya sólo abre el visor la tarjeta de testimonios: el hero reproduce su bucle
   en el propio marco y se le retiró el botón de play. Sigue sin `src` porque
   marca aún no ha entregado esa pieza, así que muestra el aviso de pendiente. */
const VIDEOS = {
  testimonio: {
    poster: "/images/cultura/cultura-03.jpg",
    titulo: "Conoce a quienes hacen volar a LATAM cada día",
    src: undefined,
  },
} as const;

export function CulturaView() {
  const [video, setVideo] = useState<VideoAbierto>(null);
  // `AnimatePresence` sigue pintando el contenido durante la salida, así que
  // el visor necesita datos aunque `video` ya sea null: de ahí que se lea
  // siempre de `VIDEOS.testimonio` en vez de vaciarlo al cerrar.
  const cerrado = video === null;

  return (
    <div
      className="min-h-screen"
      style={{
        // Relleno del marco raíz "Cultura" (#3416:11384), tal cual el Figma.
        background:
          "radial-gradient(circle at 78% -6%, rgba(242,239,254,1) 0%, rgba(242,239,254,0) 60%), linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,249,255,1) 46%, rgba(243,241,253,1) 100%)",
      }}
    >
      <CulturaHero visorAbierto={!cerrado} />
      <PropositoSection />
      <JetsSection />
      <GuiasCulturales />
      <PorQueLatam />
      <TestimoniosJets onPlay={() => setVideo("testimonio")} />

      <VideoLightbox
        abierto={!cerrado}
        onClose={() => setVideo(null)}
        poster={VIDEOS.testimonio.poster}
        titulo={VIDEOS.testimonio.titulo}
        src={VIDEOS.testimonio.src}
      />
    </div>
  );
}

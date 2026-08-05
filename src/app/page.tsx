import { JobHero } from "@/components/jobs/JobHero";
import { FramerLoopGallery } from "@/components/jobs/FramerLoopGallery";
import { VacancyBoard } from "@/components/jobs/VacancyBoard";
import { EmbarkationTicket } from "@/components/jobs/EmbarkationTicket";
import { Testimonials } from "@/components/jobs/Testimonials";
import { SiteFooter } from "@/components/jobs/SiteFooter";
import { PageTransition } from "@/components/motion";

export default function Home(): React.JSX.Element {
  return (
    <PageTransition>
      <main className="flex-1 bg-white">
        {/* 1. Cinematic Scroll Hero (Cockpit zoom into sky -> fades to white with Nuestro propósito text) */}
        <JobHero />

        {/* 2. "Vida en LATAM" scattered culture collage */}
        <FramerLoopGallery />

        {/* 3. Tablero de embarque: vacantes en vista Lista (split-flap) / Mapa */}
        <VacancyBoard />

        {/* 4. Voces a bordo: testimonios en tarjetas fotográficas en arco */}
        <Testimonials />

        {/* 5. Pase de embarque: proceso de selección en 7 etapas.
            Cierra la página justo antes del footer, como en el Figma de Wave 2
            (frame 3471:10841: Testimonials → Proceso → Footer). */}
        <EmbarkationTicket />
      </main>

      {/* 6. Pie de página del sitio */}
      <SiteFooter />
    </PageTransition>
  );
}

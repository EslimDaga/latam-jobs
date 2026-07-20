import { JobHero } from "@/components/jobs/JobHero";
import { FramerLoopGallery } from "@/components/jobs/FramerLoopGallery";

export default function Home(): React.JSX.Element {
  return (
    <main className="flex-1 bg-white">
      {/* 1. Cinematic Scroll Hero (Cockpit zoom into sky -> fades to white with Nuestro propósito text) */}
      <JobHero />

      {/* 2. "Vida en LATAM" scattered culture collage */}
      <FramerLoopGallery />
    </main>
  );
}

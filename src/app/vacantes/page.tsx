import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/jobs/SiteFooter";
import { PageTransition } from "@/components/motion";
import { VacantesView } from "@/components/vacantes/VacantesView";

export const metadata: Metadata = {
  title: "Vacantes — Empleos LATAM",
  description:
    "Explora las vacantes con postulación abierta en LATAM Airlines. Filtra por área, ubicación, modalidad o estado y postula a tu próximo vuelo.",
};

export default function VacantesPage(): React.JSX.Element {
  return (
    <PageTransition>
      {/* VacantesView lee ?vacante= con useSearchParams, que exige un límite de
          Suspense para no forzar el renderizado dinámico de toda la ruta. */}
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <VacantesView />
      </Suspense>
      <SiteFooter />
    </PageTransition>
  );
}

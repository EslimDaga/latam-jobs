import type { Metadata } from "next";
import { SiteFooter } from "@/components/jobs/SiteFooter";
import { VacantesView } from "@/components/vacantes/VacantesView";

export const metadata: Metadata = {
  title: "Vacantes — Empleos LATAM",
  description:
    "Explora las vacantes con postulación abierta en LATAM Airlines. Filtra por área, ubicación, modalidad o estado y postula a tu próximo vuelo.",
};

export default function VacantesPage(): React.JSX.Element {
  return (
    <>
      <VacantesView />
      <SiteFooter />
    </>
  );
}

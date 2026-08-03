import type { Metadata } from "next";
import { CulturaView } from "@/components/cultura/CulturaView";
import { SiteFooter } from "@/components/jobs/SiteFooter";

export const metadata: Metadata = {
  title: "Nuestra cultura — Empleos LATAM",
  description:
    "Elevar cada viaje, siempre. Conoce el propósito de LATAM Airlines, los atributos JETS, las 9 guías culturales y las razones para volar con nosotros.",
};

export default function CulturaPage(): React.JSX.Element {
  return (
    <>
      <CulturaView />
      <SiteFooter />
    </>
  );
}

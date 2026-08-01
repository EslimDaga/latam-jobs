import type { Metadata } from "next";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CurtainLoader } from "@/components/motion/CurtainLoader";
import "lenis/dist/lenis.css";
import "./globals.css";

// Sin fuentes de Google: el sitio usa exclusivamente Latam Sans, la
// tipográfica de marca, servida desde /public/fonts con @font-face en
// globals.css. Cualquier familia nueva debe entrar por ahí, no por next/font.

export const metadata: Metadata = {
  title: "Empleos LATAM — Despega tu carrera con nosotros",
  description:
    "Explora las vacantes abiertas de LATAM Airlines: tecnología, operaciones, comercial y experiencia de cliente. Filtra y postula al rol ideal para ti.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-PE"
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col">
        <SmoothScroll>
          <CurtainLoader />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

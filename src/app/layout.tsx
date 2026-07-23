import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Manrope,
  Martian_Mono,
  Space_Grotesk,
  Space_Mono,
  Barlow_Condensed,
  Inter,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CurtainLoader } from "@/components/motion/CurtainLoader";
import "lenis/dist/lenis.css";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

// Display font for the giant hero headlines — has the clear two-story "g"
// that LATAM Sans lacks. Body/UI stays on LATAM Sans (the brand typeface).
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

// Fuentes de las secciones "Vacantes con embarque abierto" (Space Grotesk /
// Space Mono) y "Pase de Embarque" (Barlow Condensed / Inter), portadas 1:1
// desde los diseños de Figma. Se exponen como variables CSS para poder
// referenciarlas en los estilos inline de ambos componentes.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// CTA del nav y títulos de columnas del footer, según el Figma
// "LATAM Careers D2".
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700"],
});

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
      className={`${manrope.variable} ${martianMono.variable} ${bricolage.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${barlowCondensed.variable} ${inter.variable} ${plusJakarta.variable} h-full antialiased`}
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

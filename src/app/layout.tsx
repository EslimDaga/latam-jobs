import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope, Martian_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
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
    <html lang="es-PE" className={`${manrope.variable} ${martianMono.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

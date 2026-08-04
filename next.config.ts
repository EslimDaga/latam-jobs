import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Habilita la integración de Next con <ViewTransition> de React: cada
    // navegación de ruta pasa a ser una Transition que dispara la View
    // Transitions API del navegador. Ver src/components/motion/PageTransition.tsx.
    viewTransition: true,
  },
};

export default nextConfig;

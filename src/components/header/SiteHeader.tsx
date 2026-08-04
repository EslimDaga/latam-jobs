"use client";

import { Globe, CaretDown } from "@phosphor-icons/react";
import { motion, type MotionValue, useMotionValue } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { navTransitionTypes } from "@/components/motion";

/* ────────────────────────────────────────────────────────────────────────────
 * Types & Constants
 * ──────────────────────────────────────────────────────────────────────────── */

const MotionLink = motion.create(Link);

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Vacantes", href: "/vacantes" },
  { label: "Cultura", href: "/cultura" },
  { label: "Beneficios", href: "/#beneficios" },
  { label: "Nosotros", href: "/#nosotros" },
] as const;

export interface SiteHeaderProps {
  /** Clases CSS de posicionamiento del header (por defecto: "absolute inset-x-0 top-0 z-40") */
  className?: string;
  /** Enlace del botón CTA "Ver vacantes" (por defecto: "/vacantes") */
  ctaHref?: string;
  /** Texto del botón CTA (por defecto: "Ver vacantes") */
  ctaLabel?: string;
  /** MotionValues opcionales para la transición del color de texto (ej. JobHero en scroll) */
  headerTextColor?: MotionValue<string>;
  headerBorderColor?: MotionValue<string>;
  headerBgColor?: MotionValue<string>;
  whiteLogoOpacity?: MotionValue<number>;
  darkLogoOpacity?: MotionValue<number>;
}

/* ────────────────────────────────────────────────────────────────────────────
 * SiteHeader — Cabecera unificada y premium para todos los Héroes de LATAM
 * ──────────────────────────────────────────────────────────────────────────── */
export function SiteHeader({
  className = "absolute inset-x-0 top-0 z-40",
  ctaHref = "/vacantes",
  ctaLabel = "Ver vacantes",
  headerTextColor,
  headerBorderColor,
  headerBgColor,
  whiteLogoOpacity,
  darkLogoOpacity,
}: SiteHeaderProps): React.JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  /* La ruta activa decide la dirección de la View Transition de cada enlace:
     hacia dentro del sitio desliza a la izquierda, de vuelta a la derecha. */
  const pathname = usePathname();

  /* Valores por defecto (tema claro en fondo oscuro) cuando no se inyectan por scroll */
  const defaultTextColor = useMotionValue("rgba(255, 255, 255, 1)");
  const defaultBorderColor = useMotionValue("rgba(255, 255, 255, 0.2)");
  const defaultBgColor = useMotionValue("rgba(255, 255, 255, 0.05)");
  const defaultWhiteLogoOp = useMotionValue(1);
  const defaultDarkLogoOp = useMotionValue(0);

  const activeTextColor = headerTextColor ?? defaultTextColor;
  const activeBorderColor = headerBorderColor ?? defaultBorderColor;
  const activeBgColor = headerBgColor ?? defaultBgColor;
  const activeWhiteLogoOp = whiteLogoOpacity ?? defaultWhiteLogoOp;
  const activeDarkLogoOp = darkLogoOpacity ?? defaultDarkLogoOp;

  /* Tecla Escape y bloqueo del scroll cuando el menú principal está abierto */
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* ── Menu Overlay a pantalla completa ────────────────────────────── */}
      <motion.div
        initial={false}
        animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: "-100%" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-30 flex flex-col justify-between bg-[#0d091e]/98 px-6 pt-28 pb-10 text-white backdrop-blur-md sm:px-8 sm:pt-32 sm:pb-12 md:px-20 md:pb-20"
        style={{ pointerEvents: menuOpen ? "auto" : "none" }}
      >
        {/* Enlaces principales de navegación */}
        <div className="mt-10 flex flex-col gap-6 md:gap-8">
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">
            Navegación
          </span>
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link, idx) => (
              <MotionLink
                key={link.href}
                href={link.href}
                transitionTypes={navTransitionTypes(pathname, link.href)}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: idx * 0.08 + 0.1, duration: 0.3 }}
                className="text-3xl font-bold tracking-tight text-white transition-colors duration-200 hover:text-red-latam sm:text-4xl md:text-6xl"
              >
                {link.label}
              </MotionLink>
            ))}
          </nav>
        </div>

        {/* Pie del menú */}
        <div className="flex flex-col items-start justify-between gap-8 border-t border-white/10 pt-8 md:flex-row md:items-end">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">
              Contacto
            </span>
            <a
              href="mailto:empleos@latam.com"
              className="text-lg font-semibold transition-colors hover:text-red-latam"
            >
              empleos@latam.com
            </a>
          </div>

          <div className="flex flex-col gap-1 text-sm text-white/60">
            <p>© 2026 LATAM Airlines. Todos los derechos reservados.</p>
            <p>Construyendo el futuro de la aviación en América Latina.</p>
          </div>
        </div>
      </motion.div>

      {/* ── Cabecera / Navegación Oficial LATAM Airlines ──────────────── */}
      {/* `viewTransitionName` saca la cabecera del recorte de la página para que
          no se deslice con el contenido: durante una transición de ruta hace
          falta un punto fijo en pantalla, o se lee como si se moviera la ventana
          entera en vez del contenido. globals.css le anula la animación. */}
      <header className={className} style={{ viewTransitionName: "site-header" }}>
        <div className="relative mx-auto flex max-w-[100rem] items-center justify-between gap-3 px-4 py-5 sm:gap-6 sm:px-6 sm:py-7 lg:px-12">
          {/* Izquierda: Botón de Menú animado (Hamburguesa 3 líneas -> X) */}
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú principal" : "Abrir menú principal"}
            className="z-40 flex cursor-pointer items-center gap-5 rounded-xl border-0 bg-transparent px-2 py-1.5 text-sm font-medium transition hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 lg:gap-6"
            style={{
              color: menuOpen ? "rgba(255, 255, 255, 1)" : activeTextColor,
            }}
          >
            {/* Icono de Hamburguesa Custom en Framer */}
            <div className="relative flex h-[30px] w-[30px] flex-shrink-0 flex-col justify-between overflow-visible">
              {/* Línea superior dividida */}
              <motion.div
                animate={menuOpen ? { y: 9 } : { y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute left-0 top-[4px] flex h-[4px] w-[30px]"
              >
                <motion.div
                  animate={menuOpen ? { rotate: 45 } : { rotate: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{
                    transformOrigin: "right center",
                    backgroundColor: menuOpen ? "rgba(255, 255, 255, 1)" : activeTextColor,
                  }}
                  className="h-[4px] w-[15px] rounded-l-full"
                />
                <motion.div
                  animate={menuOpen ? { rotate: -45 } : { rotate: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{
                    transformOrigin: "left center",
                    backgroundColor: menuOpen ? "rgba(255, 255, 255, 1)" : activeTextColor,
                  }}
                  className="h-[4px] w-[15px] rounded-r-full"
                />
              </motion.div>

              {/* Línea media */}
              <motion.div
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{
                  backgroundColor: menuOpen ? "rgba(255, 255, 255, 1)" : activeTextColor,
                }}
                className="absolute left-0 top-[13px] h-[4px] w-[30px] rounded-full"
              />

              {/* Línea inferior dividida */}
              <motion.div
                animate={menuOpen ? { y: -9 } : { y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute left-0 top-[22px] flex h-[4px] w-[30px]"
              >
                <motion.div
                  animate={menuOpen ? { rotate: -45 } : { rotate: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{
                    transformOrigin: "right center",
                    backgroundColor: menuOpen ? "rgba(255, 255, 255, 1)" : activeTextColor,
                  }}
                  className="h-[4px] w-[15px] rounded-l-full"
                />
                <motion.div
                  animate={menuOpen ? { rotate: 45 } : { rotate: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{
                    transformOrigin: "left center",
                    backgroundColor: menuOpen ? "rgba(255, 255, 255, 1)" : activeTextColor,
                  }}
                  className="h-[4px] w-[15px] rounded-r-full"
                />
              </motion.div>
            </div>

            <span className="min-w-[45px] select-none text-left font-sans text-sm font-medium">
              {menuOpen ? "Cerrar" : "Menú"}
            </span>
          </motion.button>

          {/* Centro: Logotipo LATAM (perfectamente centrado) */}
          <Link
            href="/"
            transitionTypes={navTransitionTypes(pathname, "/")}
            aria-label="Empleos LATAM — inicio"
            className="absolute left-1/2 top-1/2 z-40 h-5 w-32 -translate-x-1/2 -translate-y-1/2 cursor-pointer sm:h-6 sm:w-40 md:h-7 md:w-48"
          >
            <motion.img
              src="/images/latam-logo.svg"
              alt="LATAM Airlines"
              className="absolute inset-0 mx-auto h-full w-auto"
              style={{ opacity: menuOpen ? 1 : activeWhiteLogoOp }}
            />
            <motion.img
              src="/images/latam-logo-dark.svg"
              alt="LATAM Airlines"
              className="absolute inset-0 mx-auto h-full w-auto"
              style={{ opacity: menuOpen ? 0 : activeDarkLogoOp }}
            />
          </Link>

          {/* Derecha: Selector de país & CTA */}
          <div className="z-40 flex items-center gap-2 sm:gap-3">
            <motion.button
              type="button"
              className="hidden cursor-pointer items-center gap-2 rounded-full border px-4 py-2 font-sans text-sm font-medium transition hover:bg-white/10 md:flex"
              style={{
                color: menuOpen ? "rgba(255, 255, 255, 1)" : activeTextColor,
                borderColor: menuOpen ? "rgba(255, 255, 255, 0.2)" : activeBorderColor,
                backgroundColor: menuOpen ? "rgba(255, 255, 255, 0.05)" : activeBgColor,
              }}
            >
              <Globe size={18} />
              <span>Chile</span>
              <CaretDown size={14} />
            </motion.button>

            <Link
              href={ctaHref}
              transitionTypes={navTransitionTypes(pathname, ctaHref)}
              className="animate-pulse-subtle cursor-pointer rounded-full bg-red-latam px-4 py-2 font-sans text-sm font-semibold text-white shadow-md transition hover:bg-red-latam-deep active:scale-95 sm:px-5 sm:text-[15px]"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

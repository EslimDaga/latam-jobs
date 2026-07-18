"use client";

import { useCallback, useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { NavDropdown } from "./NavDropdown";
import { BurgerIcon, ExternalLinkIcon, PeruFlagIcon } from "./icons";
import { menus, utilityLinks } from "./nav-data";

export function Header() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = useCallback((id: string | null) => setOpenMenuId(id), []);

  return (
    <header
      aria-labelledby="header-label-sr-label"
      className="sticky top-0 z-40 bg-indigo-latam text-white"
    >
      <span id="header-label-sr-label" className="sr-only">
        Navegación de secciones de usuario.
      </span>

      <div className="mx-auto flex h-20 max-w-[90rem] items-center gap-8 px-4 sm:px-6 lg:px-10">
        <a
          id="header__homePage"
          href="/pe/es"
          aria-label="Ir al inicio del sitio."
          className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span lang="en" className="sr-only">
            Latam Airlines
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Latam Perú"
            src="https://s.latamairlines.com/images/header/logo/DesktopNegative.svg"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </a>

        <div className="hidden flex-1 items-center justify-between gap-8 lg:flex">
          <nav id="main-navigation" className="flex items-center gap-7">
            {menus.map((menu) => (
              <NavDropdown
                key={menu.id}
                menu={menu}
                openMenuId={openMenuId}
                onToggle={handleToggle}
              />
            ))}
            <a
              id="header__navbar__lnk-help-desk"
              href="/pe/es/centro-ayuda"
              className="group relative flex h-20 items-center text-[0.95rem] font-bold text-white/95 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
            >
              <span className="relative">
                Centro de ayuda
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1.5 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </span>
            </a>
          </nav>

          <div className="flex items-center gap-6">
            {utilityLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="group flex items-center gap-1.5 text-sm font-bold text-white/95 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span className="relative">
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                </span>
                {link.external && <ExternalLinkIcon className="h-3.5 w-3.5 fill-current" />}
              </a>
            ))}

            <button
              type="button"
              id="header__currentCurrency"
              className="flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2 text-sm font-bold text-white transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="grid h-5 w-5 place-items-center overflow-hidden rounded-full">
                <PeruFlagIcon className="h-5 w-5 scale-150" />
              </span>
              <span>USD · USD</span>
              <span className="sr-only">Dólares americanos</span>
            </button>

            <button
              type="button"
              id="header__profile__lnk-sign-in"
              className="cursor-pointer rounded-full bg-white/20 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="sr-only">Ingresar a mi cuenta LATAM.</span>
              Iniciar sesión
            </button>
          </div>
        </div>

        <div className="ml-auto lg:hidden">
          <button
            type="button"
            id="sidebar-mobile-hamburger"
            aria-label="Abrir menú."
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="cursor-pointer rounded-md p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
          >
            <BurgerIcon className="h-6 w-6 fill-current" />
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

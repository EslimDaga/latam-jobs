"use client";

import { useEffect } from "react";
import { ChevronIcon, CloseIcon, ExternalLinkIcon } from "./icons";
import { menus, utilityLinks } from "./nav-data";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Cerrar menú."
        onClick={onClose}
        className={`absolute inset-0 bg-indigo-latam-deep/60 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal={open}
        aria-label="Menú de navegación."
        className={`absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col bg-indigo-latam text-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <span className="text-sm font-bold tracking-[0.18em] uppercase">Menú</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú."
            className="cursor-pointer rounded-full p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
          >
            <CloseIcon className="h-4 w-4 fill-current" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4">
          {menus.map((menu) => (
            <details key={menu.id} className="group border-b border-white/10 py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-base font-bold marker:content-none">
                {menu.label}
                <ChevronIcon className="h-3 w-3 rotate-90 fill-current transition-transform duration-300 group-open:-rotate-90" />
              </summary>
              <div className="pb-3">
                {menu.groups.map((group) => (
                  <div key={group.title} className="mb-3">
                    <p className="mb-1 text-[0.65rem] font-bold tracking-[0.14em] text-white/50 uppercase">
                      {group.title}
                    </p>
                    <ul>
                      {group.links.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            className="block py-1.5 text-sm font-semibold text-white/85 transition-colors hover:text-white"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          ))}

          <a
            href="/pe/es/centro-ayuda"
            className="flex border-b border-white/10 py-4 text-base font-bold"
          >
            Centro de ayuda
          </a>

          {utilityLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="flex items-center gap-2 border-b border-white/10 py-4 text-base font-bold"
            >
              {link.label}
              {link.external && <ExternalLinkIcon className="h-3.5 w-3.5 fill-current" />}
            </a>
          ))}
        </nav>

        <div className="border-t border-white/10 p-5">
          <button
            type="button"
            className="w-full cursor-pointer rounded-full bg-white px-6 py-3 text-sm font-bold text-indigo-latam transition-colors hover:bg-white/90"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

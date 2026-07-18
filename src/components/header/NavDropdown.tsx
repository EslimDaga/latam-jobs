"use client";

import { useEffect, useId, useRef } from "react";
import { ChevronIcon } from "./icons";
import type { NavMenu } from "./nav-data";

type NavDropdownProps = {
  menu: NavMenu;
  openMenuId: string | null;
  onToggle: (id: string | null) => void;
};

export function NavDropdown({ menu, openMenuId, onToggle }: NavDropdownProps) {
  const isOpen = openMenuId === menu.id;
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        onToggle(null);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onToggle(null);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onToggle]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        id={`header__navbar__${menu.id}-dropdown`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={panelId}
        title={menu.label}
        onClick={() => onToggle(isOpen ? null : menu.id)}
        className="group flex h-20 cursor-pointer items-center gap-1.5 text-[0.95rem] font-bold text-white/95 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
      >
        <span className="relative">
          {menu.label}
          <span
            aria-hidden="true"
            className={`absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full bg-white transition-transform duration-300 ease-out ${
              isOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
            }`}
          />
        </span>
        <ChevronIcon
          className={`h-3 w-3 shrink-0 transition-transform duration-300 ease-out ${
            isOpen ? "-rotate-90" : "rotate-90"
          }`}
        />
      </button>

      <div
        id={panelId}
        role="menu"
        aria-labelledby={`header__navbar__${menu.id}-dropdown`}
        className={`absolute top-full left-0 z-50 w-max max-w-[46rem] rounded-b-2xl border-t-4 border-red-latam bg-white p-6 shadow-[0_24px_48px_-12px_rgba(15,0,80,0.35)] transition duration-200 ease-out ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="flex gap-10">
          {menu.groups.map((group) => (
            <div key={group.title} className="min-w-44">
              <p className="mb-3 text-[0.7rem] font-bold tracking-[0.14em] text-indigo-latam/60 uppercase">
                {group.title}
              </p>
              <ul className="space-y-1">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      role="menuitem"
                      href={link.href}
                      tabIndex={isOpen ? 0 : -1}
                      className="-mx-2 flex rounded-lg px-2 py-1.5 text-sm font-semibold text-indigo-latam transition-colors hover:bg-indigo-latam/5 hover:text-pink-latam focus-visible:outline-2 focus-visible:outline-indigo-latam"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

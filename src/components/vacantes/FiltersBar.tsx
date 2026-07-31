"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────────────────────
 * FiltersBar — píldoras de filtro de la vista /vacantes.
 *
 * Cada píldora abre un popover con opciones excluyentes; la píldora activa
 * muestra el valor elegido y se pinta en índigo invertido. "Limpiar filtros"
 * resetea todo. El popover usa la clase global `.ui-popover` para animar su
 * entrada vía @starting-style.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface FilterPillConfig {
  id: string;
  label: string;
  options: string[];
  value: string | null;
}

interface FilterPillProps {
  config: FilterPillConfig;
  onChange: (id: string, value: string | null) => void;
}

export function FilterPill({ config, onChange }: FilterPillProps) {
  const { id, label, options, value } = config;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-[42px] cursor-pointer items-center gap-[8.909px] rounded-[35.636px] border-[1.273px] px-[13.364px] py-[8.909px] text-[16px] font-bold transition sm:text-[17.818px] ${
          value
            ? "border-[var(--fig-indigo)] bg-[var(--fig-indigo)] text-white"
            : "border-[var(--fig-pill-bd)] bg-white text-[var(--fig-indigo)] hover:border-[var(--fig-indigo)]/50"
        }`}
      >
        {value ?? label}
        <CaretDown
          size={17.82}
          aria-hidden
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="ui-popover absolute left-0 top-[calc(100%+8px)] z-30 min-w-[220px] rounded-2xl border border-line-strong bg-white p-1.5 shadow-[0_18px_45px_-18px_rgba(27,0,136,0.35)]"
        >
          {value && (
            <li>
              <button
                type="button"
                onClick={() => {
                  onChange(id, null);
                  setOpen(false);
                }}
                className="w-full cursor-pointer rounded-xl px-3.5 py-2 text-left text-[15px] text-ink-soft transition hover:bg-surface"
              >
                Todos
              </button>
            </li>
          )}
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                role="option"
                aria-selected={opt === value}
                onClick={() => {
                  onChange(id, opt);
                  setOpen(false);
                }}
                className={`w-full cursor-pointer rounded-xl px-3.5 py-2 text-left text-[15px] transition hover:bg-surface ${
                  opt === value ? "font-bold text-indigo-latam-soft" : "text-ink"
                }`}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface FiltersBarProps {
  pills: FilterPillConfig[];
  onChange: (id: string, value: string | null) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function FiltersBar({ pills, onChange, onClear, hasActiveFilters }: FiltersBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-[23.333px] gap-y-3">
      {pills.map((pill) => (
        <FilterPill key={pill.id} config={pill} onChange={onChange} />
      ))}
      {/* "Text" (#3298:16194) — Bricolage Bold 20/35.71px, con 2.976px de aire
          a la derecha para cuadrar la caja con el resto de la fila. */}
      <button
        type="button"
        onClick={onClear}
        disabled={!hasActiveFilters}
        className="h-[35.71px] cursor-pointer pr-[2.976px] text-[20px] font-bold leading-[35.71px] text-[var(--fig-indigo)] transition font-sans hover:text-[var(--fig-red)] disabled:cursor-default disabled:opacity-40"
      >
        Limpiar filtros
      </button>
    </div>
  );
}

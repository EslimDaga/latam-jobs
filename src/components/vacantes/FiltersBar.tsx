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
        className={`flex cursor-pointer items-center gap-2 rounded-full border px-[13px] py-[9px] text-[16px] font-bold transition sm:text-[17px] ${
          value
            ? "border-indigo-latam-soft bg-indigo-latam-soft text-white"
            : "border-[#e2e8f0] bg-white text-indigo-latam-soft hover:border-indigo-latam-soft/50"
        }`}
      >
        {value ?? label}
        <CaretDown
          size={16}
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
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {pills.map((pill) => (
        <FilterPill key={pill.id} config={pill} onChange={onChange} />
      ))}
      <button
        type="button"
        onClick={onClear}
        disabled={!hasActiveFilters}
        className="cursor-pointer text-xl font-bold text-indigo-latam-soft transition [font-family:var(--font-bricolage),sans-serif] hover:text-red-latam disabled:cursor-default disabled:opacity-40"
      >
        Limpiar filtros
      </button>
    </div>
  );
}

"use client";

import { CaretDown, Check } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  label: string;
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
}

/**
 * Dropdown propio en vez de un `<select>` nativo: el nativo no deja estilar el
 * panel ni las opciones, y el diseño lo pide minimalista y consistente en todos
 * los sistemas. A cambio hay que reponer a mano lo que el nativo daba gratis:
 * roles listbox/option, teclado y cierre al salir.
 */
export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectProps<T>): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();
  const labelId = useId();

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent): void => {
      if (containerRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const commit = (next: T): void => {
    onChange(next);
    setOpen(false);
    buttonRef.current?.focus();
  };

  /** Las flechas mueven la selección aunque el panel esté cerrado, como el nativo. */
  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();

    if (!open) {
      setOpen(true);
      return;
    }

    const current = options.findIndex((option) => option.value === value);
    const delta = event.key === "ArrowDown" ? 1 : -1;
    const next = Math.min(Math.max(current + delta, 0), options.length - 1);
    onChange(options[next].value);
  };

  return (
    <div ref={containerRef} className="relative">
      <span id={labelId} className="text-xs font-bold tracking-[-0.02em] text-ink-muted uppercase">
        {label}
      </span>

      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-labelledby={`${labelId} ${listboxId}-value`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleButtonKeyDown}
        className="mt-2 flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-line-strong bg-white px-3 py-2.5 text-left transition-colors duration-200 hover:border-ink-faint focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <span
          id={`${listboxId}-value`}
          className="truncate text-sm font-semibold tracking-[-0.02em] text-ink"
        >
          {selected?.label ?? ""}
        </span>
        <CaretDown
          size={14}
          className={`flex-none text-ink-muted transition-transform duration-200 ease-enter ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          className="ui-popover absolute top-full right-0 left-0 z-30 mt-1.5 overflow-hidden rounded-lg border border-line-strong bg-white p-1 shadow-[0_16px_32px_-12px_rgba(31,33,36,0.2)]"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => commit(option.value)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm font-semibold tracking-[-0.02em] transition-colors duration-150 ease-enter hover:bg-surface focus-visible:bg-surface focus-visible:outline-none ${
                    isSelected ? "text-ink" : "text-ink-soft"
                  }`}
                >
                  {option.label}
                  {isSelected ? <Check size={14} className="flex-none text-ink" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

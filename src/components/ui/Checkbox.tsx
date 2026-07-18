"use client";

import { Check } from "@phosphor-icons/react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Texto secundario alineado a la derecha, p. ej. un contador de resultados. */
  hint?: string;
}

/**
 * El input nativo sigue ahí (sólo visualmente oculto), así que conserva gratis
 * el foco, el teclado, el clic en la etiqueta y la semántica para lectores de
 * pantalla. Lo que se ve es el recuadro de al lado, dibujado con `peer-*`.
 */
export function Checkbox({ checked, onChange, label, hint }: CheckboxProps): React.JSX.Element {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-3 py-1">
      <span className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="flex h-[1.125rem] w-[1.125rem] flex-none items-center justify-center rounded-[0.3rem] border border-line-strong bg-white text-white transition-colors duration-200 group-hover:border-ink-faint peer-checked:border-ink peer-checked:bg-ink peer-checked:[&_svg]:opacity-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
        >
          <Check size={11} weight="bold" className="opacity-0 transition-opacity duration-150" />
        </span>
        <span className="text-sm font-semibold tracking-[-0.02em] text-ink-soft transition-colors duration-200 group-hover:text-ink peer-checked:text-ink">
          {label}
        </span>
      </span>

      {hint === undefined ? null : (
        <span className="text-xs font-semibold text-ink-faint tabular-nums">{hint}</span>
      )}
    </label>
  );
}

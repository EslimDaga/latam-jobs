"use client";

import { AirplaneTakeoff, Briefcase, Calendar, MapPin } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { Vacante, VacanteEstado } from "@/lib/vacantes/vacantes";

/* ────────────────────────────────────────────────────────────────────────────
 * VacancyList — columna izquierda de la vista /vacantes.
 *
 * Tablero "Salidas · En vivo" con reloj corriendo, tarjetas de vacante
 * seleccionables (la activa se pinta en lavanda #dfe2f6 con borde #4658df,
 * como en el Figma) y el botón "Cargar más".
 * ──────────────────────────────────────────────────────────────────────────── */

const ESTADO_CHIP: Record<VacanteEstado, { bg: string; text: string }> = {
  Abierto: { bg: "#d4f4ec", text: "#128f5b" },
  Nuevo: { bg: "#dee1fd", text: "#4f46e5" },
  "Últimos días": { bg: "#ffeecc", text: "#ca8a04" },
};

function LiveClock() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("es-CL", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="text-sm font-bold tracking-[1.48px] text-white tabular-nums">
      {now ?? "--:--:--"}
    </span>
  );
}

interface VacancyCardProps {
  vacante: Vacante;
  selected: boolean;
  index: number;
  onSelect: (id: string) => void;
}

function VacancyCard({ vacante, selected, index, onSelect }: VacancyCardProps) {
  const chip = ESTADO_CHIP[vacante.estado];
  return (
    <button
      type="button"
      onClick={() => onSelect(vacante.id)}
      aria-pressed={selected}
      style={{ "--i": index } as React.CSSProperties}
      className={`list-enter w-full cursor-pointer rounded-2xl border px-[22px] py-6 text-left transition-[border-color,background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 ${
        selected
          ? "border-[#4658df] bg-[#dfe2f6] shadow-[0_12px_35px_-14px_rgba(27,0,136,0.45)]"
          : "border-indigo-latam-soft/40 bg-white shadow-[0_12px_35px_-20px_rgba(27,0,136,0.35)] hover:border-indigo-latam-soft"
      }`}
    >
      <p className="text-xs font-normal uppercase tracking-[1.69px] text-[#5b567a]">
        {vacante.area}
      </p>
      <h3 className="mt-1.5 text-[21px] font-bold tracking-[-0.015em] text-indigo-latam-soft">
        {vacante.titulo}
      </h3>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-2 text-[15px] text-[#5c5c5c]">
          <MapPin size={14} weight="fill" className="text-[#66718a]" aria-hidden />
          {vacante.ubicacion}
        </span>
        <span className="flex items-center gap-2 text-[15px] text-[#5c5c5c]">
          <Briefcase size={14} weight="fill" className="text-[#66718a]" aria-hidden />
          {vacante.modalidad}
        </span>
        {vacante.horas && (
          <span className="flex items-center gap-2 text-[15px] text-[#5c5c5c]">
            <Calendar size={14} className="text-[#66718a]" aria-hidden />
            {vacante.horas}
          </span>
        )}
      </div>

      <div className="mt-3.5">
        <span
          className="inline-flex rounded-full px-3.5 py-[3px] text-[13.5px] font-bold tracking-[0.54px]"
          style={{ backgroundColor: chip.bg, color: chip.text }}
        >
          {vacante.estado}
        </span>
      </div>
    </button>
  );
}

interface VacancyListProps {
  vacantes: Vacante[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  visibleCount: number;
  onLoadMore: () => void;
}

export function VacancyList({
  vacantes,
  selectedId,
  onSelect,
  visibleCount,
  onLoadMore,
}: VacancyListProps) {
  const visibles = vacantes.slice(0, visibleCount);

  return (
    <div className="flex flex-col">
      {/* Cabecera del tablero: Salidas · En vivo + reloj */}
      <div className="flex items-center justify-between rounded-t-[15px] bg-indigo-latam-soft px-[21px] py-3.5">
        <span className="flex items-center gap-[5px]">
          <AirplaneTakeoff size={16} weight="fill" className="text-white" aria-hidden />
          <span className="text-xs font-normal uppercase tracking-[2.5px] text-white">
            Salidas
          </span>
          <span
            aria-hidden
            className="mx-0.5 inline-block h-2 w-2 animate-pulse rounded-full bg-[#fc4a78]"
          />
          <span className="text-xs font-normal uppercase tracking-[2.5px] text-white">
            En vivo
          </span>
        </span>
        <LiveClock />
      </div>

      {/* Tarjetas */}
      <div
        className="mt-4 flex flex-col gap-3 overflow-y-auto pb-1 lg:max-h-[880px] lg:pr-1"
        role="listbox"
        aria-label="Vacantes disponibles"
      >
        {visibles.map((v, i) => (
          <VacancyCard
            key={v.id}
            vacante={v}
            index={i}
            selected={v.id === selectedId}
            onSelect={onSelect}
          />
        ))}
        {visibles.length === 0 && (
          <p className="rounded-2xl border border-line-strong bg-white px-6 py-10 text-center text-[15px] text-ink-soft">
            No encontramos vacantes con esos filtros. Prueba con otra búsqueda.
          </p>
        )}
      </div>

      {/* Cargar más */}
      {visibleCount < vacantes.length && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="cursor-pointer rounded-full border border-indigo-latam-soft bg-white px-[31px] py-3.5 text-base font-bold text-indigo-latam-soft transition hover:bg-indigo-latam-soft hover:text-white active:scale-95"
          >
            Cargar más
          </button>
        </div>
      )}
    </div>
  );
}

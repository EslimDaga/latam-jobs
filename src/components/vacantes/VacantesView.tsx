"use client";

import { useMemo, useState } from "react";
import {
  AREAS,
  ESTADOS,
  MODALIDADES,
  UBICACIONES,
  VACANTES,
  type Vacante,
} from "@/lib/vacantes/vacantes";
import { FilterPill, FiltersBar, type FilterPillConfig } from "./FiltersBar";
import { VacancyDetail } from "./VacancyDetail";
import { VacancyList } from "./VacancyList";
import { VacantesHero, type VacantesSearchState } from "./VacantesHero";

/* ────────────────────────────────────────────────────────────────────────────
 * VacantesView — orquestador de la vista /vacantes.
 *
 * Es dueño de todo el estado: el buscador del hero, las píldoras de filtro,
 * el orden, la paginación de la lista y la vacante seleccionada. El hero y
 * el listado comparten los mismos filtros, así que buscar desde el glass
 * también estrecha el tablero.
 * ──────────────────────────────────────────────────────────────────────────── */

const PAGE_SIZE = 8;

type SortMode = "Relevancia" | "Recientes" | "A – Z";

const SORT_MODES: SortMode[] = ["Relevancia", "Recientes", "A – Z"];

const ESTADO_PRIORIDAD: Record<Vacante["estado"], number> = {
  Nuevo: 0,
  Abierto: 1,
  "Últimos días": 2,
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function VacantesView() {
  const [search, setSearch] = useState<VacantesSearchState>({
    keyword: "",
    lugar: "",
    modalidad: "",
  });
  const [area, setArea] = useState<string | null>(null);
  const [ubicacion, setUbicacion] = useState<string | null>(null);
  const [modalidad, setModalidad] = useState<string | null>(null);
  const [estado, setEstado] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("Relevancia");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<string | null>(VACANTES[0]?.id ?? null);

  const filtradas = useMemo(() => {
    const kw = normalize(search.keyword.trim());
    const lugar = normalize(search.lugar.trim());
    const mod = normalize(search.modalidad.trim());

    const base = VACANTES.filter((v) => {
      if (area && v.area !== area) return false;
      if (ubicacion && v.ubicacion !== ubicacion) return false;
      if (modalidad && v.modalidad !== modalidad) return false;
      if (estado && v.estado !== estado) return false;
      if (kw && !normalize(`${v.titulo} ${v.area}`).includes(kw)) return false;
      if (lugar && !normalize(v.ubicacion).includes(lugar)) return false;
      if (mod && !normalize(v.modalidad).includes(mod)) return false;
      return true;
    });

    if (sort === "Recientes") {
      return [...base].sort(
        (a, b) => ESTADO_PRIORIDAD[a.estado] - ESTADO_PRIORIDAD[b.estado],
      );
    }
    if (sort === "A – Z") {
      return [...base].sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
    }
    return base;
  }, [search, area, ubicacion, modalidad, estado, sort]);

  const seleccionada =
    filtradas.find((v) => v.id === selectedId) ?? filtradas[0] ?? null;

  const pills: FilterPillConfig[] = [
    { id: "area", label: "Área", options: AREAS, value: area },
    { id: "ubicacion", label: "Ubicación", options: UBICACIONES, value: ubicacion },
    { id: "modalidad", label: "Modalidad", options: MODALIDADES, value: modalidad },
    { id: "estado", label: "Estado", options: ESTADOS, value: estado },
  ];

  const hasActiveFilters =
    Boolean(area || ubicacion || modalidad || estado) ||
    Boolean(search.keyword || search.lugar || search.modalidad);

  const setters: Record<string, (v: string | null) => void> = {
    area: setArea,
    ubicacion: setUbicacion,
    modalidad: setModalidad,
    estado: setEstado,
  };

  const handlePillChange = (id: string, value: string | null) => {
    setters[id]?.(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleClear = () => {
    setArea(null);
    setUbicacion(null);
    setModalidad(null);
    setEstado(null);
    setSearch({ keyword: "", lugar: "", modalidad: "" });
    setVisibleCount(PAGE_SIZE);
  };

  const scrollToListado = () => {
    document.getElementById("listado")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    // En móvil el detalle vive debajo de la lista: llevamos al usuario hasta él.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      document.getElementById("detalle-vacante")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(60% 40% at 78% 0%, #f2effe 0%, rgba(242,239,254,0) 60%), linear-gradient(180deg, #ffffff 0%, #faf9ff 14%, #f3f1fd 50%, #f3f1fd 100%)",
      }}
    >
      <VacantesHero
        search={search}
        onSearchChange={(next) => {
          setSearch(next);
          setVisibleCount(PAGE_SIZE);
        }}
        onSubmit={scrollToListado}
      />

      <main id="listado" className="mx-auto w-full max-w-[1242px] scroll-mt-6 px-4 pb-24 pt-12 sm:px-6 lg:px-0">
        {/* Píldoras de filtro */}
        <FiltersBar
          pills={pills}
          onChange={handlePillChange}
          onClear={handleClear}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Contador + ordenar por */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#a2a2a2]/60 pt-6">
          <h2
            aria-live="polite"
            className="text-[19px] font-bold text-indigo-latam-soft [font-family:var(--font-bricolage),sans-serif]"
          >
            {filtradas.length} vacante{filtradas.length === 1 ? "" : "s"} con postulación abierta
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[13px] uppercase tracking-[1.83px] text-[#5b567a]">
              Ordenar por
            </span>
            <FilterPill
              config={{
                id: "sort",
                label: "Relevancia",
                options: SORT_MODES,
                value: sort === "Relevancia" ? null : sort,
              }}
              onChange={(_, value) => setSort((value as SortMode) ?? "Relevancia")}
            />
          </div>
        </div>

        {/* Tablero + detalle */}
        <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[442px_minmax(0,1fr)] lg:items-start">
          <VacancyList
            vacantes={filtradas}
            selectedId={seleccionada?.id ?? null}
            onSelect={handleSelect}
            visibleCount={visibleCount}
            onLoadMore={() => setVisibleCount((c) => c + PAGE_SIZE)}
          />
          {seleccionada ? (
            <VacancyDetail vacante={seleccionada} />
          ) : (
            <div className="rounded-2xl border border-line-strong bg-white px-8 py-16 text-center text-ink-soft">
              Selecciona una vacante para ver el detalle.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

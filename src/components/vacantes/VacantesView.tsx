"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  AREAS,
  ESTADOS,
  MODALIDADES,
  UBICACIONES,
  VACANTES,
  VACANTE_PARAM,
  type Vacante,
} from "@/lib/vacantes/vacantes";
import { EASE_ENTER } from "@/components/motion";
import { FilterPill, FiltersBar, type FilterPillConfig } from "./FiltersBar";
import { VacancyDetail } from "./VacancyDetail";
import { PAGE_SIZE, VacancyList } from "./VacancyList";
import { VacantesHero, type VacantesSearchState } from "./VacantesHero";

/* ────────────────────────────────────────────────────────────────────────────
 * VacantesView — orquestador de la vista /vacantes.
 *
 * Es dueño de todo el estado: el buscador del hero, las píldoras de filtro,
 * el orden, la paginación de la lista y la vacante seleccionada. El hero y
 * el listado comparten los mismos filtros, así que buscar desde el glass
 * también estrecha el tablero.
 * ──────────────────────────────────────────────────────────────────────────── */

type SortMode = "Relevancia" | "Recientes" | "A – Z";

const SORT_MODES: SortMode[] = ["Relevancia", "Recientes", "A – Z"];

const ESTADO_PRIORIDAD: Record<Vacante["estado"], number> = {
  Nuevo: 0,
  Abierto: 1,
  "Últimos días": 2,
};

/* ── Entrada del cuerpo de la página ──────────────────────────────────────
 * Un solo barrido escalonado (filtros → contador → tablero) al cargar. Nada
 * de animaciones por scroll aquí: el contenido ya está sobre la línea de
 * flotación y reaparecer al hacer scroll resultaría molesto. */
const CONTENEDOR: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const SUBE: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_ENTER } },
};

/* Variante para motion reducido. Su `hidden` es idéntico al de SUBE a
   propósito: es lo que se sirve en SSR y `useReducedMotion` difiere entre
   servidor y cliente (mismatch de hidratación). El `y` salta a duración 0,
   así que sólo se percibe el fundido. */
const FADE: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, y: { duration: 0 } } },
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function VacantesView() {
  const reduced = useReducedMotion();
  const searchParams = useSearchParams();

  // Enlace profundo desde el home: /vacantes?vacante=<id> abre esa ficha.
  const deepLinkId = searchParams.get(VACANTE_PARAM);
  const deepLinkValido =
    deepLinkId && VACANTES.some((v) => v.id === deepLinkId) ? deepLinkId : null;

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
  const [selectedId, setSelectedId] = useState<string | null>(
    deepLinkValido ?? VACANTES[0]?.id ?? null,
  );

  // Si el parámetro cambia sin desmontar la vista (navegación cliente entre dos
  // enlaces profundos), reajustamos la selección durante el render en vez de en
  // un efecto: así no hay un frame con la ficha anterior.
  const [ultimoDeepLink, setUltimoDeepLink] = useState(deepLinkValido);
  if (deepLinkValido !== ultimoDeepLink) {
    setUltimoDeepLink(deepLinkValido);
    if (deepLinkValido) setSelectedId(deepLinkValido);
  }

  // Llegando desde el tablero del home, bajamos al listado tras el hero.
  const yaDesplazado = useRef(false);
  useEffect(() => {
    if (!deepLinkValido || yaDesplazado.current) return;
    yaDesplazado.current = true;
    const id = window.setTimeout(() => {
      document.getElementById("listado")?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    }, 450);
    return () => window.clearTimeout(id);
  }, [deepLinkValido, reduced]);

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
        // Relleno del marco raíz "Vacantes" (#3298:16096), tal cual el Figma.
        background:
          "radial-gradient(circle at 78% -6%, rgba(242,239,254,1) 0%, rgba(242,239,254,0) 60%), linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,249,255,1) 14%, rgba(243,241,253,1) 50%, rgba(243,241,253,1) 100%)",
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

      <motion.main
        id="listado"
        // El cuerpo (#3298:16188) arranca en y=760; el glass termina en 696.68,
        // así que quedan 63.3px de aire. Columna con gap 28px.
        className="mx-auto flex w-full max-w-[1242px] scroll-mt-6 flex-col gap-7 px-4 pb-24 pt-10 sm:px-6 lg:px-0 lg:pt-[63.32px]"
        variants={CONTENEDOR}
        initial="hidden"
        animate="show"
      >
        {/* Píldoras de filtro */}
        <motion.div variants={reduced ? FADE : SUBE}>
          <FiltersBar
            pills={pills}
            onChange={handlePillChange}
            onClear={handleClear}
            hasActiveFilters={hasActiveFilters}
          />
        </motion.div>

        {/* Contador + ordenar por (#3298:16196) — padding-top 22.958px sobre
            un filete rgba(162,162,162,.45); el texto va en Latam Sans, con el
            número en índigo y el resto en #171335 (regular). */}
        <motion.div
          variants={reduced ? FADE : SUBE}
          className="flex flex-wrap items-center justify-between gap-5 border-t border-[rgba(162,162,162,0.45)] pt-[22.958px]"
        >
          <h2 aria-live="polite" className="text-[19.387px] leading-[29.08px]">
            {/* El total cambia con los filtros: lo animamos para que se note. */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.strong
                key={filtradas.length}
                className="inline-block font-bold text-[var(--fig-indigo)]"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: 0.22, ease: EASE_ENTER }}
              >
                {filtradas.length}
              </motion.strong>
            </AnimatePresence>{" "}
            <span className="font-normal text-[var(--fig-ink)]">
              vacante{filtradas.length === 1 ? "" : "s"} con postulación abierta
            </span>
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[13px] font-normal uppercase leading-[19.59px] tracking-[0.1407em] text-[var(--fig-muted)]">
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
        </motion.div>

        {/* Tablero + detalle (#3298:16204) — columnas 442.05px y 766px,
            separadas por 30.73px (472.78 − 442.05 en el Figma). */}
        <motion.div
          variants={reduced ? FADE : SUBE}
          className="grid grid-cols-1 gap-8 lg:grid-cols-[442.05px_minmax(0,1fr)] lg:items-start lg:gap-[30.73px]"
        >
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
        </motion.div>
      </motion.main>
    </div>
  );
}

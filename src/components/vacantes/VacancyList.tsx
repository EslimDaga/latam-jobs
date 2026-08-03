"use client";

import { AirplaneTakeoff, Briefcase, Calendar, MapPin } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_ENTER } from "@/components/motion";
import type { Vacante, VacanteEstado } from "@/lib/vacantes/vacantes";

/* ────────────────────────────────────────────────────────────────────────────
 * VacancyList — columna izquierda (#3298:16205), 442.05px de ancho.
 *
 * Cotas del Figma:
 *   · Cabecera (#16206): padding 14.183/21.275, fondo #1B0088, radio superior
 *     15.365px, gap 11.819px. "Salidas"/"En vivo" en Latam Sans 12/18.72 con
 *     tracking 0.208em; el punto vivo mide 8.27px y va en #FC4A78.
 *   · Contenedor de fichas (#16216): padding-top 16.547px, gap 11.819px. En el
 *     Figma la caja mide 881px de alto y recorta: de ahí el carril con scroll
 *     propio. En ≥lg la columna se ancla (sticky) y se limita al alto de la
 *     ventana, así el listado y la ficha terminan a la vez y el detalle deja de
 *     quedar flotando sobre un vacío cuando la lista es más larga que él. En
 *     móvil no hay dos columnas: el listado fluye con la página, sin recorte.
 *   · Ficha (#16217): padding 24/22, radio 16, sombra
 *     0 11.819px 35.458px -23.639px rgba(27,0,136,.5). Seleccionada en
 *     #DFE2F6 con borde #4658DF; en reposo blanca con borde rgba(27,0,136,.1).
 *   · "Cargar más" (#16370): padding 14.183/30.730, borde rgba(27,0,136,.16).
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
    <span className="text-[14px] font-bold leading-[18.72px] tracking-[0.106em] text-white tabular-nums">
      {now ?? "--:--:--"}
    </span>
  );
}

/* Dato con icono de la ficha: gap 8px, icono 14px, texto Latam Sans 14.751 /
   22.13px en #5C5C5C. */
function MetaDato({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-[14.751px] font-normal leading-[22.13px] text-[var(--fig-meta)]">
      <span className="shrink-0 text-[#66718a]">{icon}</span>
      {children}
    </span>
  );
}

/** Fichas por página. Vive aquí (la hoja) y lo importa la vista, para que el
 *  barrido de entrada pueda calcular la posición dentro del lote. */
export const PAGE_SIZE = 8;

interface VacancyCardProps {
  vacante: Vacante;
  selected: boolean;
  index: number;
  reduced: boolean;
  onSelect: (id: string) => void;
}

function VacancyCard({ vacante, selected, index, reduced, onSelect }: VacancyCardProps) {
  const chip = ESTADO_CHIP[vacante.estado];
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(vacante.id)}
      aria-pressed={selected}
      layout={reduced ? false : "position"}
      // El `initial` no ramifica en `reduced`: es lo que se sirve en SSR y
      // `useReducedMotion` difiere entre servidor y cliente (mismatch de
      // hidratación). Con motion reducido, el `y` salta a duración 0.
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        // El barrido va sobre la posición dentro del lote, no sobre el índice
        // absoluto: con el índice absoluto, todas las fichas de "Cargar más"
        // (8ª en adelante) caían del lado del tope y entraban a la vez, con el
        // mismo retardo. Se topa en la 6ª para que el barrido total quede por
        // debajo de 250ms y no se lea como una cascada lenta.
        // Con motion reducido el barrido desaparece: sólo queda el fade, sin
        // retardo (misma trampa que documenta `.list-enter` en globals.css).
        transition: {
          duration: reduced ? 0.2 : 0.32,
          ease: EASE_ENTER,
          delay: reduced ? 0 : Math.min(index % PAGE_SIZE, 6) * 0.04,
          ...(reduced ? { y: { duration: 0 } } : {}),
        },
      }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.16, ease: EASE_ENTER }}
      style={{ boxShadow: "0px 11.819px 35.458px -23.639px rgba(27,0,136,0.5)" }}
      className={`relative w-full cursor-pointer justify-center rounded-[16px] border px-[22px] py-6 text-left transition-[border-color,transform] duration-200 hover:-translate-y-0.5 ${
        selected
          ? "border-transparent"
          : "border-[var(--fig-indigo-border)] bg-white hover:border-[var(--fig-indigo)]/40"
      }`}
    >
      {/* Realce de selección: un único elemento compartido que se desliza de
          una ficha a otra en vez de apagarse aquí y encenderse allá. */}
      {selected && (
        <motion.span
          aria-hidden
          layoutId={reduced ? undefined : "vacante-seleccionada"}
          className="pointer-events-none absolute inset-0 rounded-[16px] border border-[var(--fig-selected-bd)] bg-[var(--fig-selected-bg)]"
          transition={{ type: "spring", stiffness: 420, damping: 40, mass: 0.9 }}
        />
      )}

      <div className="relative">
        {/* "Container" (#16218) — padding 4px 0 */}
        <p className="py-1 text-[12.103px] font-normal uppercase leading-[18px] tracking-[0.14em] text-[var(--fig-muted)]">
          {vacante.area}
        </p>

        {/* "Text" (#16220) — padding-top 6px */}
        <h3 className="pt-1.5 text-[21.559px] font-bold leading-[24.15px] tracking-[-0.015em] text-[var(--fig-indigo)]">
          {vacante.titulo}
        </h3>

        {/* "Text" (#16222) — padding-top 10px, gap 16px */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2.5">
          <MetaDato icon={<MapPin size={14} weight="fill" aria-hidden />}>
            {vacante.ubicacion}
          </MetaDato>
          <MetaDato icon={<Briefcase size={14} weight="fill" aria-hidden />}>
            {vacante.modalidad}
          </MetaDato>
          {vacante.horas && (
            <MetaDato icon={<Calendar size={14} aria-hidden />}>{vacante.horas}</MetaDato>
          )}
        </div>

        {/* "Text:margin" (#16232) — padding-top 13px; chip padding 3/10 */}
        <div className="pt-[13px]">
          <span
            className="inline-flex rounded-full px-2.5 py-[3px] text-[13.616px] font-bold leading-[20.42px] tracking-[0.04em]"
            style={{ backgroundColor: chip.bg, color: chip.text }}
          >
            {vacante.estado}
          </span>
        </div>
      </div>
    </motion.button>
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
  const reduced = useReducedMotion() ?? false;
  const visibles = vacantes.slice(0, visibleCount);

  /* ── Desvanecido de los bordes del carril ───────────────────────────────
     La máscara sólo aparece por el lado que tenga contenido oculto: así el
     recorte se lee como "sigue habiendo lista" en vez de como un corte seco,
     y cuando no hay scroll (móvil, o pocas fichas) no se difumina nada. */
  const carrilRef = useRef<HTMLDivElement>(null);
  const [borde, setBorde] = useState({ arriba: false, abajo: false });

  useEffect(() => {
    const el = carrilRef.current;
    if (!el) return;

    const medir = () => {
      const recorrido = el.scrollHeight - el.clientHeight;
      setBorde({
        arriba: el.scrollTop > 4,
        abajo: recorrido > 4 && el.scrollTop < recorrido - 4,
      });
    };

    medir();
    el.addEventListener("scroll", medir, { passive: true });
    // El alto del carril depende de la ventana (max-h en vh) y su contenido
    // cambia al filtrar o al cargar más: hay que remedir en ambos casos.
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", medir);
      ro.disconnect();
    };
  }, [visibles.length]);

  /* Al cambiar filtros u orden el listado es otro: el carril vuelve arriba
     para no dejar al usuario a mitad de unos resultados que ya no son los
     suyos. Depende de la identidad del array, que "Cargar más" no altera
     (sólo crece `visibleCount`), así que paginar no salta al principio. */
  useEffect(() => {
    carrilRef.current?.scrollTo({ top: 0 });
  }, [vacantes]);

  const mascara =
    borde.arriba || borde.abajo
      ? `linear-gradient(to bottom, transparent 0px, #000 ${
          borde.arriba ? "28px" : "0px"
        }, #000 calc(100% - ${borde.abajo ? "48px" : "0px"}), transparent 100%)`
      : undefined;

  return (
    // En ≥lg la columna se ancla al viewport: la cabecera "Salidas / En vivo"
    // queda siempre a la vista y sólo se desplazan las fichas.
    <div className="flex flex-col lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]">
      {/* Cabecera del tablero (#16206) */}
      <div className="flex items-center justify-between gap-[11.819px] rounded-t-[15.365px] bg-[var(--fig-indigo)] px-[21.275px] py-[14.183px]">
        <span className="flex items-center gap-[4.728px]">
          <AirplaneTakeoff size={16.55} weight="fill" className="text-white" aria-hidden />
          <span className="text-[12px] font-normal uppercase leading-[18.72px] tracking-[0.208em] text-white">
            Salidas
          </span>
          <span
            aria-hidden
            className="inline-block h-[8.27px] w-[8.27px] animate-pulse rounded-full bg-[#fc4a78]"
          />
          <span className="text-[12px] font-normal uppercase leading-[18.72px] tracking-[0.208em] text-white">
            En vivo
          </span>
        </span>
        <LiveClock />
      </div>

      {/* Fichas (#16216) — padding-top 16.547px, gap 11.819px.
          `data-lenis-prevent` cede la rueda al scroll nativo del carril (si no,
          Lenis se la queda para la página) y `overscroll-contain` evita que al
          llegar al final el impulso se encadene y arrastre el documento. El
          `pr/-mr` saca la barra al canalón de 30.73px entre columnas, para que
          las fichas conserven los 442.05px del Figma. */}
      <div
        ref={carrilRef}
        data-lenis-prevent
        style={{ maskImage: mascara, WebkitMaskImage: mascara }}
        className="lista-carril flex flex-col pt-[16.547px] lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-3 lg:-mr-3"
      >
        {/* El `role` vive aquí y no en el carril: así "Cargar más" queda fuera
            del listbox, que sólo debe contener las fichas. */}
        <div
          className="flex flex-col gap-[11.819px]"
          role="listbox"
          aria-label="Vacantes disponibles"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visibles.map((v, i) => (
              <VacancyCard
                key={v.id}
                vacante={v}
                index={i}
                reduced={reduced}
                selected={v.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </AnimatePresence>
          {visibles.length === 0 && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: EASE_ENTER,
                ...(reduced ? { y: { duration: 0 } } : {}),
              }}
              className="rounded-[16px] border border-[var(--fig-indigo-border)] bg-white px-6 py-10 text-center text-[15px] text-[var(--fig-muted)]"
            >
              No encontramos vacantes con esos filtros. Prueba con otra búsqueda.
            </motion.p>
          )}
        </div>

        {/* "Cargar más" (#16369) — padding-top 24px. Va DENTRO del carril: es
            el final de la lista, no un pie fijo de la columna. */}
        {visibleCount < vacantes.length && (
          <div className="flex justify-center pt-6 pb-1">
            <button
              type="button"
              onClick={onLoadMore}
              className="cursor-pointer rounded-full border-[1.182px] border-[rgba(27,0,136,0.16)] bg-white px-[30.73px] py-[14.183px] text-[16px] font-bold leading-[24.96px] text-[var(--fig-indigo)] transition hover:bg-[var(--fig-indigo)] hover:text-white active:scale-95"
            >
              Cargar más
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

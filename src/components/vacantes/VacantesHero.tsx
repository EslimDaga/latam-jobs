"use client";

import {
  AirplaneTakeoff,
  Briefcase,
  CaretDown,
  Globe,
  List,
  MagnifyingGlass,
  MapPin,
} from "@phosphor-icons/react";
import Link from "next/link";

/* ────────────────────────────────────────────────────────────────────────────
 * VacantesHero — cabecera de la vista /vacantes.
 *
 * Reproduce el nodo "Hero" del Figma [RH+] Trabalhe Conosco: fotografía del
 * ala al atardecer bajo un velo radial índigo (#a49550 8% → #1b0088 42% →
 * #0c104f), nav translúcido con el selector de país y el CTA rojo, titular
 * "Se parte de lo que viene" y el buscador glass que cabalga sobre el borde
 * inferior del hero.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface VacantesSearchState {
  keyword: string;
  lugar: string;
  modalidad: string;
}

interface VacantesHeroProps {
  search: VacantesSearchState;
  onSearchChange: (next: VacantesSearchState) => void;
  onSubmit: () => void;
}

interface SearchFieldProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

function SearchField({ icon, label, placeholder, value, onChange }: SearchFieldProps) {
  return (
    <label className="flex flex-1 cursor-text flex-col gap-1.5">
      <span className="flex items-center gap-4">
        <span className="flex items-center gap-2">
          <span className="shrink-0 text-indigo-latam-soft">{icon}</span>
          <span className="whitespace-nowrap text-[15px] font-medium text-[#66718a] [font-family:var(--font-inter),sans-serif]">
            {label}
          </span>
        </span>
        <CaretDown size={16} className="shrink-0 text-[#66718a]" aria-hidden />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-0 bg-transparent p-0 pl-7 text-[13px] font-normal text-ink placeholder:text-[#8b95a8] [font-family:var(--font-inter),sans-serif] focus:outline-none focus:ring-0"
      />
    </label>
  );
}

export function VacantesHero({ search, onSearchChange, onSubmit }: VacantesHeroProps) {
  return (
    <header className="relative">
      {/* ── Fondo: ala al atardecer + velo índigo + sombra interior ── */}
      <div className="relative h-[520px] overflow-hidden bg-indigo-latam-deep sm:h-[560px] lg:h-[614px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero/vacantes-wing.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-[50%_47%]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(115% 165% at 50% -15%, rgba(164,149,80,0.10) 0%, rgba(27,0,136,0.38) 56%, rgba(12,16,79,0.88) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            boxShadow: "inset 0 -70px 100px -50px rgba(6,16,35,0.75)",
          }}
        />

        {/* ── Nav bar ── */}
        <nav className="relative z-20 border-b border-white/15">
          <div className="mx-auto flex h-[74px] w-full max-w-[1441px] items-center justify-between px-4 sm:px-8 lg:px-[100px]">
            {/* Izquierda: menú */}
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-white transition hover:opacity-80 [font-family:var(--font-inter),sans-serif]"
            >
              <List size={18} aria-hidden />
              <span className="hidden sm:inline">Menú</span>
            </Link>

            {/* Centro: logo LATAM */}
            <Link
              href="/"
              aria-label="Empleos LATAM — inicio"
              className="absolute left-1/2 top-1/2 h-6 w-auto -translate-x-1/2 -translate-y-1/2 md:h-7"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/latam-logo.svg" alt="LATAM Airlines" className="h-full w-auto" />
            </Link>

            {/* Derecha: país + CTA */}
            <div className="flex items-center gap-2 sm:gap-3.5">
              <button
                type="button"
                className="hidden items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20 md:flex [font-family:var(--font-inter),sans-serif]"
              >
                <Globe size={14} aria-hidden />
                <span>Chile</span>
                <CaretDown size={14} aria-hidden />
              </button>
              <a
                href="#listado"
                className="rounded-full bg-[#e5175c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-latam-deep active:scale-95 sm:px-[22px] sm:py-[11px] sm:text-[15px] [font-family:var(--font-jakarta),sans-serif]"
              >
                Ver vacantes
              </a>
            </div>
          </div>
        </nav>

        {/* ── Titular ── */}
        <div className="relative z-10 mx-auto w-full max-w-[1242px] px-4 pt-16 sm:px-8 sm:pt-24 lg:px-0 lg:pt-[120px]">
          <p className="text-[13px] font-bold uppercase leading-[22px] tracking-[4.7px] text-[#eceef3] sm:text-[16px]">
            Súmate a latam
          </p>
          <h1 className="mt-2 max-w-[970px] text-[clamp(2.625rem,6.7vw,6rem)] font-bold leading-[0.95] tracking-[-0.019em] text-white">
            Se parte de lo que viene
          </h1>
          <p className="mt-4 max-w-[698px] text-[clamp(1rem,1.4vw,1.25rem)] font-bold leading-[1.6] text-white">
            Cada vacante es un pase de embarque. Filtra por área o busca tu próximo vuelo.
          </p>
        </div>
      </div>

      {/* ── Buscador glass, cabalgando el borde del hero ── */}
      <div className="relative z-20 mx-auto -mt-[52px] w-full max-w-[1290px] px-4 sm:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex w-full flex-col gap-4 rounded-[20px] bg-white/85 px-6 py-5 backdrop-blur-[18px] backdrop-saturate-[1.3] lg:flex-row lg:items-center lg:gap-6 lg:px-[47px] lg:py-[29px]"
          style={{
            boxShadow:
              "0 1px 22px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(255,255,255,0.45)",
          }}
        >
          <SearchField
            icon={<MagnifyingGlass size={20} weight="bold" aria-hidden />}
            label="Cargo, área o palabra clave"
            placeholder="Ej: Tripulación, Tecnología"
            value={search.keyword}
            onChange={(keyword) => onSearchChange({ ...search, keyword })}
          />

          <span aria-hidden className="hidden h-[30px] w-px shrink-0 bg-[#b8b8b8] lg:block" />

          <SearchField
            icon={<MapPin size={20} weight="fill" aria-hidden />}
            label="País o ciudad"
            placeholder="Ej: Chile, São Paulo"
            value={search.lugar}
            onChange={(lugar) => onSearchChange({ ...search, lugar })}
          />

          <span aria-hidden className="hidden h-[30px] w-px shrink-0 bg-[#b8b8b8] lg:block" />

          <SearchField
            icon={<Briefcase size={20} weight="fill" aria-hidden />}
            label="Modalidad"
            placeholder="Ej: Presencial, híbrido"
            value={search.modalidad}
            onChange={(modalidad) => onSearchChange({ ...search, modalidad })}
          />

          <span aria-hidden className="hidden h-[30px] w-px shrink-0 bg-[#b8b8b8] lg:block" />

          <button
            type="submit"
            className="flex h-[52px] w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-red-latam px-5 text-[17px] font-medium text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-red-latam-deep active:scale-[0.98] lg:w-auto [font-family:var(--font-inter),sans-serif]"
          >
            Ver vacantes
            <AirplaneTakeoff size={20} weight="fill" aria-hidden />
          </button>
        </form>
      </div>
    </header>
  );
}

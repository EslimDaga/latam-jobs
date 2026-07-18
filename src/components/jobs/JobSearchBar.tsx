"use client";

import { MagnifyingGlass, MapPin } from "@phosphor-icons/react";

interface JobSearchBarProps {
  search: string;
  location: string;
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSubmit: () => void;
}

const FIELD_CLASS =
  "w-full border-0 bg-transparent py-2.5 text-sm font-semibold tracking-[-0.02em] text-ink outline-none placeholder:font-semibold placeholder:text-ink-faint";

export function JobSearchBar({
  search,
  location,
  onSearchChange,
  onLocationChange,
  onSubmit,
}: JobSearchBarProps): React.JSX.Element {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex flex-col gap-2 rounded-xl border border-line bg-white p-2 sm:flex-row sm:items-center"
    >
      <label className="flex flex-1 cursor-text items-center gap-2.5 px-2.5">
        <MagnifyingGlass size={16} className="flex-none text-ink-faint" />
        <span className="sr-only">Buscar empleos</span>
        <input
          type="text"
          value={search}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
          placeholder="Buscar empleos, áreas o cargos"
          className={FIELD_CLASS}
        />
      </label>

      <span className="hidden h-5 w-px flex-none bg-line sm:block" aria-hidden="true" />

      <label className="flex flex-1 cursor-text items-center gap-2.5 px-2.5">
        <MapPin size={16} className="flex-none text-ink-faint" />
        <span className="sr-only">Buscar por ubicación</span>
        <input
          type="text"
          value={location}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => onLocationChange(event.target.value)}
          placeholder="Ciudad o país"
          className={FIELD_CLASS}
        />
      </label>

      <button
        type="submit"
        className="cursor-pointer rounded-lg bg-ink px-6 py-2.5 text-sm font-bold tracking-[-0.02em] text-white transition-[background-color,transform] duration-150 ease-enter hover:bg-indigo-latam active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        Buscar empleos
      </button>
    </form>
  );
}

"use client";

import type { DatePostedFilter, JobFilterState, JobType, LocationMode } from "@/types/jobs";
import { SALARY_CEILING, SALARY_FLOOR, SALARY_STEP } from "@/lib/jobs/filterJobs";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select, type SelectOption } from "@/components/ui/Select";
import { SalaryRange } from "./SalaryRange";

interface JobFiltersProps {
  filters: JobFilterState;
  activeCount: number;
  jobTypeCounts: Record<string, number>;
  locationModeCounts: Record<string, number>;
  onChange: (next: JobFilterState) => void;
  onClear: () => void;
}

const DATE_OPTIONS: readonly SelectOption<DatePostedFilter>[] = [
  { value: "anytime", label: "Cualquier momento" },
  { value: "today", label: "Últimas 24 horas" },
  { value: "week", label: "Última semana" },
  { value: "month", label: "Último mes" },
];

const JOB_TYPES: JobType[] = ["Full-time", "Freelance", "Internship", "Volunteer"];
const JOB_TYPE_LABELS: Record<JobType, string> = {
  "Full-time": "Tiempo completo",
  Freelance: "Freelance",
  Internship: "Práctica",
  Volunteer: "Voluntariado",
};

const LOCATION_MODES: LocationMode[] = ["Remote", "On-site", "Hybrid"];
const LOCATION_MODE_LABELS: Record<LocationMode, string> = {
  Remote: "Remoto",
  "On-site": "Presencial",
  Hybrid: "Híbrido",
};

const salaryFormatter = new Intl.NumberFormat("es-PE");

const toggleValue = <T,>(collection: T[], value: T): T[] =>
  collection.includes(value) ? collection.filter((item) => item !== value) : [...collection, value];

function FieldsetLegend({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <legend className="text-xs font-bold tracking-[-0.02em] text-ink-muted uppercase">
      {children}
    </legend>
  );
}

export function JobFilters({
  filters,
  activeCount,
  jobTypeCounts,
  locationModeCounts,
  onChange,
  onClear,
}: JobFiltersProps): React.JSX.Element {
  const handleJobTypeToggle = (jobType: JobType): void => {
    onChange({ ...filters, jobTypes: toggleValue(filters.jobTypes, jobType) });
  };

  const handleLocationToggle = (mode: LocationMode): void => {
    onChange({ ...filters, locationModes: toggleValue(filters.locationModes, mode) });
  };

  return (
    <aside
      aria-label="Filtros de empleos"
      className="rounded-xl border border-line bg-white p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-bold tracking-[-0.02em] text-ink">
          Filtros
          {activeCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-[0.625rem] font-bold text-white tabular-nums">
              {activeCount}
            </span>
          ) : null}
        </h2>
        <button
          type="button"
          onClick={onClear}
          disabled={activeCount === 0}
          className="cursor-pointer rounded-md text-xs font-bold tracking-[-0.02em] text-ink-muted transition-colors duration-200 hover:text-red-latam focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-ink-muted"
        >
          Limpiar todo
        </button>
      </div>

      <div className="mt-5">
        <Select
          label="Fecha de publicación"
          value={filters.datePosted}
          options={DATE_OPTIONS}
          onChange={(datePosted) => onChange({ ...filters, datePosted })}
        />
      </div>

      <hr className="my-5 border-line" />

      <fieldset>
        <FieldsetLegend>Tipo de empleo</FieldsetLegend>
        <div className="mt-2 flex flex-col">
          {JOB_TYPES.map((jobType) => (
            <Checkbox
              key={jobType}
              checked={filters.jobTypes.includes(jobType)}
              onChange={() => handleJobTypeToggle(jobType)}
              label={JOB_TYPE_LABELS[jobType]}
              hint={String(jobTypeCounts[jobType] ?? 0)}
            />
          ))}
        </div>
      </fieldset>

      <hr className="my-5 border-line" />

      <div>
        <p className="text-xs font-bold tracking-[-0.02em] text-ink-muted uppercase">
          Rango salarial (USD)
        </p>
        <div className="mt-4">
          <SalaryRange
            min={SALARY_FLOOR}
            max={SALARY_CEILING}
            step={SALARY_STEP}
            value={filters.salaryRange}
            onChange={(salaryRange) => onChange({ ...filters, salaryRange })}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-sm font-bold tracking-[-0.02em] text-ink tabular-nums">
          <span>${salaryFormatter.format(filters.salaryRange[0])}</span>
          <span>${salaryFormatter.format(filters.salaryRange[1])}</span>
        </div>
      </div>

      <hr className="my-5 border-line" />

      <fieldset>
        <FieldsetLegend>Modalidad</FieldsetLegend>
        <div className="mt-2 flex flex-col">
          {LOCATION_MODES.map((mode) => (
            <Checkbox
              key={mode}
              checked={filters.locationModes.includes(mode)}
              onChange={() => handleLocationToggle(mode)}
              label={LOCATION_MODE_LABELS[mode]}
              hint={String(locationModeCounts[mode] ?? 0)}
            />
          ))}
        </div>
      </fieldset>
    </aside>
  );
}

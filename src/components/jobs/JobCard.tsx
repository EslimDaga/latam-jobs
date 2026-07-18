"use client";

import { BookmarkSimple, CurrencyDollar, Users } from "@phosphor-icons/react";
import type { JobPosting } from "@/types/jobs";

interface JobCardProps {
  job: JobPosting;
  saved: boolean;
  onToggleSave: (jobId: string) => void;
  onApply: (jobId: string) => void;
}

const salaryFormatter = new Intl.NumberFormat("es-PE");

const formatSalary = (job: JobPosting): string => {
  if (job.salaryMax === 0) {
    return "Voluntariado";
  }
  return `$${salaryFormatter.format(job.salaryMin)} - $${salaryFormatter.format(job.salaryMax)}`;
};

/**
 * Sólo se animan transform, sombra y color de borde: nada que dispare layout.
 * El variante `hover:` de Tailwind v4 ya va dentro de `@media (hover: hover)`,
 * así que en táctil no se queda pegado tras un tap.
 */
const CARD_CLASS =
  "group relative rounded-xl border border-line bg-white p-5 transition-[transform,box-shadow,border-color] duration-200 ease-enter hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_12px_28px_-16px_rgba(31,33,36,0.25)] sm:p-6";

export function JobCard({ job, saved, onToggleSave, onApply }: JobCardProps): React.JSX.Element {
  return (
    <article className={CARD_CLASS}>
      <button
        type="button"
        onClick={() => onToggleSave(job.id)}
        aria-pressed={saved}
        aria-label={saved ? "Quitar de guardados" : "Guardar vacante"}
        className={`absolute top-5 right-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
          saved ? "text-ink" : "text-ink-faint hover:bg-surface hover:text-ink"
        }`}
      >
        {/* El relleno ya comunica el estado; no hace falta además una pastilla de fondo. */}
        <BookmarkSimple
          size={18}
          weight={saved ? "fill" : "regular"}
          className="transition-transform duration-150 ease-enter active:scale-90"
        />
      </button>

      <div className="flex items-start gap-3.5 pr-10">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-surface text-xs font-bold tracking-[-0.02em] text-ink-soft">
          {job.companyMonogram}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-bold tracking-[-0.02em] text-ink">{job.title}</h3>
            {/* Destacar por tipografía, no por un lavado de color de fondo. */}
            {job.featured ? (
              <span className="text-[0.625rem] font-bold tracking-[0.08em] text-ink-faint uppercase">
                Destacado
              </span>
            ) : null}
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-semibold tracking-[-0.02em] text-ink-muted">
            <span className="text-ink-soft">{job.company}</span>
            <span aria-hidden="true" className="text-ink-faint">
              •
            </span>
            <span>{job.location}</span>
            <span aria-hidden="true" className="text-ink-faint">
              •
            </span>
            <span>{job.postedLabel}</span>
          </p>
        </div>
      </div>

      {/* Etiquetas sin pastilla: la almohadilla ya dice que son etiquetas. */}
      <ul className="mt-3.5 flex flex-wrap gap-x-3 gap-y-1 pl-[3.25rem]">
        {job.tags.map((tag) => (
          <li key={tag} className="text-xs font-semibold tracking-[-0.02em] text-ink-faint">
            #{tag}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pl-[3.25rem]">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1.5 font-bold tracking-[-0.02em] text-ink tabular-nums">
            <CurrencyDollar size={16} className="text-ink-faint" />
            {formatSalary(job)}
            {job.salaryMax > 0 ? <span className="font-semibold text-ink-faint">/ mes</span> : null}
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold tracking-[-0.02em] text-ink-muted">
            <Users size={16} className="text-ink-faint" />
            <span className="text-ink tabular-nums">{job.appliedCount}</span> postularon
          </span>
        </div>

        <button
          type="button"
          onClick={() => onApply(job.id)}
          className="cursor-pointer rounded-lg bg-ink px-5 py-2.5 text-sm font-bold tracking-[-0.02em] text-white transition-[background-color,transform] duration-150 ease-enter hover:bg-indigo-latam active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Postular
        </button>
      </div>
    </article>
  );
}

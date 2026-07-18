"use client";

import { useMemo, useState } from "react";
import type { JobFilterState, JobPosting } from "@/types/jobs";
import {
  DEFAULT_JOB_FILTERS,
  countActiveFilters,
  countByJobType,
  countByLocationMode,
  filterJobs,
} from "@/lib/jobs/filterJobs";
import { JobFilters } from "./JobFilters";
import { JobSearchBar } from "./JobSearchBar";
import { JobCard } from "./JobCard";

interface JobBoardProps {
  jobs: JobPosting[];
}

export function JobBoard({ jobs }: JobBoardProps): React.JSX.Element {
  const [filters, setFilters] = useState<JobFilterState>(DEFAULT_JOB_FILTERS);
  const [submittedSearch, setSubmittedSearch] = useState<{ search: string; location: string }>({
    search: "",
    location: "",
  });
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

  const appliedFilters = useMemo<JobFilterState>(
    () => ({ ...filters, search: submittedSearch.search, location: submittedSearch.location }),
    [filters, submittedSearch],
  );

  const visibleJobs = useMemo<JobPosting[]>(() => filterJobs(jobs, appliedFilters), [jobs, appliedFilters]);
  const activeCount = useMemo<number>(() => countActiveFilters(filters), [filters]);
  const jobTypeCounts = useMemo<Record<string, number>>(() => countByJobType(jobs), [jobs]);
  const locationModeCounts = useMemo<Record<string, number>>(() => countByLocationMode(jobs), [jobs]);

  const handleSearchSubmit = (): void => {
    setSubmittedSearch({ search: filters.search, location: filters.location });
  };

  const handleClearFilters = (): void => {
    setFilters(DEFAULT_JOB_FILTERS);
    setSubmittedSearch({ search: "", location: "" });
  };

  const handleToggleSave = (jobId: string): void => {
    setSavedJobIds((previous) => {
      const next = new Set(previous);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  const handleApply = (jobId: string): void => {
    window.location.assign(`/pe/es/postular/${jobId}`);
  };

  return (
    <section id="vacantes" className="relative z-10 mx-auto max-w-[90rem] scroll-mt-28 px-4 pt-16 pb-24 sm:px-6 lg:px-10">
      <JobSearchBar
        search={filters.search}
        location={filters.location}
        onSearchChange={(value) => setFilters((previous) => ({ ...previous, search: value }))}
        onLocationChange={(value) => setFilters((previous) => ({ ...previous, location: value }))}
        onSubmit={handleSearchSubmit}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <JobFilters
            filters={filters}
            activeCount={activeCount}
            jobTypeCounts={jobTypeCounts}
            locationModeCounts={locationModeCounts}
            onChange={setFilters}
            onClear={handleClearFilters}
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-extrabold tracking-tight text-indigo-latam">Vacantes recientes</h2>
            <p className="text-sm text-indigo-latam/50">
              <span className="font-bold text-indigo-latam/80">{visibleJobs.length}</span> resultados
            </p>
          </div>

          {visibleJobs.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-4">
              {visibleJobs.map((job, index) => (
                <li key={job.id} className="list-enter" style={{ "--i": index } as React.CSSProperties}>
                  <JobCard
                    job={job}
                    saved={savedJobIds.has(job.id)}
                    onToggleSave={handleToggleSave}
                    onApply={handleApply}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-indigo-latam/25 bg-white p-12 text-center">
              <p className="text-base font-extrabold text-indigo-latam">No encontramos vacantes con esos filtros</p>
              <p className="mt-1 text-sm text-indigo-latam/60">
                Ajusta la búsqueda o limpia los filtros para ver más resultados.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 rounded-full bg-indigo-latam px-6 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

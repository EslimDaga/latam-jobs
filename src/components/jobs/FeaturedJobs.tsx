"use client";

import type { JobPosting } from "@/types/jobs";
import { Reveal } from "@/components/motion";

interface FeaturedJobsProps {
  jobs: JobPosting[];
}

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/**
 * Slider horizontal de vacantes destacadas — 3 tarjetas premium con scroll
 * horizontal snap, sin scrollbar visible.
 */
export function FeaturedJobs({ jobs }: FeaturedJobsProps): React.JSX.Element {
  return (
    <section aria-label="Vacantes destacadas" className="px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[100rem]">
        {/* Header */}
        <Reveal className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="text-2xl font-semibold text-foreground lg:text-3xl">
            Vacantes destacadas
          </h2>
          <a
            href="#vacantes"
            className="shrink-0 text-sm font-semibold text-red-latam transition-colors hover:text-red-latam-deep"
          >
            Ver todas las vacantes →
          </a>
        </Reveal>

        {/* Slider */}
        <div
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {jobs.map((job) => (
            <article
              key={job.id}
              className="min-w-[320px] flex-shrink-0 snap-start rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:border-indigo-latam/20 hover:shadow-lg lg:min-w-[380px] lg:p-8"
            >
              {/* Monogram */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-latam text-sm font-bold text-white">
                {job.companyMonogram}
              </div>

              {/* Title */}
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                {job.title}
              </h3>

              {/* Company + location */}
              <p className="mt-2 text-sm text-ink-soft">
                {job.company} · {job.location}
              </p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface px-3 py-1 text-xs text-ink-soft"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Salary */}
              {job.salaryMax > 0 && (
                <p className="mt-4 text-lg font-semibold text-indigo-latam">
                  {fmt.format(job.salaryMin)} – {fmt.format(job.salaryMax)}
                </p>
              )}

              {/* Apply button */}
              <button
                type="button"
                className="mt-6 w-full cursor-pointer rounded-xl bg-indigo-latam py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-latam-soft"
              >
                Postular ahora
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

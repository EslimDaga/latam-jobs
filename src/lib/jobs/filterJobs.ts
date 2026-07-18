import type { DatePostedFilter, JobFilterState, JobPosting } from "@/types/jobs";

export const SALARY_FLOOR = 0;
export const SALARY_CEILING = 12000;
export const SALARY_STEP = 500;

export const DEFAULT_JOB_FILTERS: JobFilterState = {
  search: "",
  location: "",
  datePosted: "anytime",
  jobTypes: [],
  locationModes: [],
  salaryRange: [SALARY_FLOOR, SALARY_CEILING],
};

const matchesDatePosted = (job: JobPosting, datePosted: DatePostedFilter): boolean => {
  switch (datePosted) {
    case "today":
      return job.postedDaysAgo <= 1;
    case "week":
      return job.postedDaysAgo <= 7;
    case "month":
      return job.postedDaysAgo <= 30;
    case "anytime":
    default:
      return true;
  }
};

const matchesText = (haystack: string, needle: string): boolean =>
  haystack.toLowerCase().includes(needle.trim().toLowerCase());

export const filterJobs = (jobs: JobPosting[], filters: JobFilterState): JobPosting[] =>
  jobs.filter((job) => {
    if (filters.search && !matchesText(`${job.title} ${job.company} ${job.description}`, filters.search)) {
      return false;
    }

    if (filters.location && !matchesText(job.location, filters.location)) {
      return false;
    }

    if (!matchesDatePosted(job, filters.datePosted)) {
      return false;
    }

    if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(job.jobType)) {
      return false;
    }

    if (filters.locationModes.length > 0 && !filters.locationModes.includes(job.locationMode)) {
      return false;
    }

    const [minSalary, maxSalary] = filters.salaryRange;
    if (job.salaryMax < minSalary || job.salaryMin > maxSalary) {
      return false;
    }

    return true;
  });

export const countByJobType = (jobs: JobPosting[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  jobs.forEach((job) => {
    counts[job.jobType] = (counts[job.jobType] ?? 0) + 1;
  });
  return counts;
};

export const countByLocationMode = (jobs: JobPosting[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  jobs.forEach((job) => {
    counts[job.locationMode] = (counts[job.locationMode] ?? 0) + 1;
  });
  return counts;
};

export const countActiveFilters = (filters: JobFilterState): number => {
  let count = 0;
  if (filters.datePosted !== "anytime") count += 1;
  count += filters.jobTypes.length;
  count += filters.locationModes.length;
  if (filters.salaryRange[0] !== SALARY_FLOOR || filters.salaryRange[1] !== SALARY_CEILING) count += 1;
  return count;
};

export type JobType = "Full-time" | "Freelance" | "Internship" | "Volunteer";

export type LocationMode = "Remote" | "On-site" | "Hybrid";

export type DatePostedFilter = "anytime" | "today" | "week" | "month";

export type JobCategory =
  | "Technology"
  | "Operations"
  | "Commercial"
  | "Finance"
  | "People"
  | "Customer Experience";

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyMonogram: string;
  location: string;
  locationMode: LocationMode;
  jobType: JobType;
  category: JobCategory;
  salaryMin: number;
  salaryMax: number;
  postedLabel: string;
  postedDaysAgo: number;
  description: string;
  tags: string[];
  appliedCount: number;
  featured: boolean;
}

export interface JobFilterState {
  search: string;
  location: string;
  datePosted: DatePostedFilter;
  jobTypes: JobType[];
  locationModes: LocationMode[];
  salaryRange: [number, number];
}

export interface JobCategoryChip {
  label: JobCategory;
  count: number;
}

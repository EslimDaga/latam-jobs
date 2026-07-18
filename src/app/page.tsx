import { JobHero } from "@/components/jobs/JobHero";
import { JobBoard } from "@/components/jobs/JobBoard";
import { WorkWithUs } from "@/components/jobs/WorkWithUs";
import { PeopleCulture } from "@/components/jobs/PeopleCulture";
import { FeaturedJobs } from "@/components/jobs/FeaturedJobs";
import { MOCK_JOBS } from "@/lib/jobs/mockJobs";

export default function Home(): React.JSX.Element {
  // Get featured jobs or fallback to first 3 jobs
  const featuredJobs = MOCK_JOBS.filter((j) => j.featured).slice(0, 3);
  const fallbackFeatured = featuredJobs.length >= 3 ? featuredJobs : MOCK_JOBS.slice(0, 3);

  return (
    <main className="flex-1">
      {/* 1. Cinematic Scroll Hero (Cockpit zoom to sky) */}
      <JobHero />

      {/* 2. Work With Us Section (Floating images and text) */}
      <WorkWithUs />

      {/* 3. People & Culture Section (Centered indigo block) */}
      <PeopleCulture />

      {/* 4. Featured Jobs Carousel (3 cards) */}
      <FeaturedJobs jobs={fallbackFeatured} />

      {/* 5. Complete Job Board */}
      <div
        id="vacantes"
        className="relative z-10 rounded-t-[2rem] bg-white shadow-[0_-1.5rem_4rem_-1rem_rgba(4,0,30,0.5)]"
      >
        <JobBoard jobs={MOCK_JOBS} />
      </div>
    </main>
  );
}


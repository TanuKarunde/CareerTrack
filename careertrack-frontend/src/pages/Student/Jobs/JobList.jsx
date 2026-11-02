
import { BriefcaseBusiness, Sparkles } from "lucide-react";
import JobCard from "./JobCard";
import NoJobsFound from "./NoJobsFound";

const JobList = ({ jobs = [] }) => {
    if (jobs.length === 0) {
        return <NoJobsFound />;
    }

    return (
        <div className="!ml-0 grid min-w-0 grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:gap-5 2xl:grid-cols-3">
            {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
};

export default JobList;

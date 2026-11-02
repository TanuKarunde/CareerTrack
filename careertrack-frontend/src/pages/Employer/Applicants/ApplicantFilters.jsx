import { Search, BriefcaseBusiness, SlidersHorizontal } from "lucide-react";

const ApplicantFilter = ({
    search,
    setSearch,
    jobFilter,
    setJobFilter,
    jobs = [],
}) => {
    return (
        <div className="rounded-2xl border border-purple-100 bg-white !p-4 sm:!p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
                {/* Search */}
                <div className="relative min-w-0">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search candidates, emails, skills, or job titles..."
                        aria-label="Search applicants"
                        className="
                            h-12 w-full rounded-xl border border-gray-200
                            bg-gray-50/70 !pl-11 !pr-4
                            text-sm text-gray-700
                            placeholder:text-gray-400
                            outline-none transition-all
                            focus:border-purple-400 focus:bg-white
                            focus:ring-4 focus:ring-purple-50
                        "
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg !px-2 !py-1 text-xs font-semibold text-purple-600 hover:bg-purple-50"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Job filter */}
                <div className="relative min-w-0">
                    <BriefcaseBusiness
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500"
                    />

                    <SlidersHorizontal
                        size={15}
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <select
                        value={jobFilter}
                        onChange={(e) => setJobFilter(e.target.value)}
                        aria-label="Filter applicants by job"
                        className="
                            h-12 w-full appearance-none rounded-xl
                            border border-gray-200 bg-white
                            !pl-10 !pr-10
                            text-sm text-gray-700 outline-none
                            transition-all
                            focus:border-purple-400
                            focus:ring-4 focus:ring-purple-50
                        "
                    >
                        <option value="ALL">All job positions</option>

                        {jobs.map((job) => (
                            <option key={job} value={job}>
                                {job}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 !pt-3">
                <p className="text-[11px] text-gray-400">
                    <span className="font-semibold text-gray-600">
                        Tip:
                    </span>{" "}
                    Combine search and job filters to find candidates faster.
                </p>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 !px-2.5 !py-1 text-[10px] font-semibold text-purple-700">
                    <SlidersHorizontal size={11} />
                    Filters ready
                </span>
            </div>
        </div>
    );
};

export default ApplicantFilter;

import {
    CalendarDays,
    ChevronDown,
    BriefcaseBusiness,
    ListFilter,
} from "lucide-react";

const selectClass =
    "h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white !pl-10 !pr-9 text-sm text-gray-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100";

const InterviewFilters = ({
    jobFilter,
    setJobFilter,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    jobTitles = [],
}) => {
    return (
        <section className="rounded-2xl border border-purple-100 bg-white !p-4 sm:!p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                    <ListFilter size={16} />
                </div>

                <div>
                    <h2 className="text-sm font-bold text-gray-900">
                        Find an interview
                    </h2>
                    <p className="text-xs text-gray-500">
                        Narrow down by role, status, or date.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="relative">
                    <label
                        htmlFor="interview-job-filter"
                        className="mb-1.5 block text-xs font-semibold text-gray-600"
                    >
                        Job role
                    </label>

                    <BriefcaseBusiness
                        size={15}
                        className="absolute left-3 top-[42px] -translate-y-1/2 text-purple-500"
                    />

                    <select
                        id="interview-job-filter"
                        value={jobFilter}
                        onChange={(e) => setJobFilter(e.target.value)}
                        className={selectClass}
                    >
                        <option value="ALL">All jobs</option>

                        {jobTitles.map((job) => (
                            <option key={job} value={job}>
                                {job}
                            </option>
                        ))}
                    </select>

                    <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-[42px] -translate-y-1/2 text-gray-400"
                    />
                </div>

                <div className="relative">
                    <label
                        htmlFor="interview-status-filter"
                        className="mb-1.5 block text-xs font-semibold text-gray-600"
                    >
                        Interview status
                    </label>

                    <ListFilter
                        size={15}
                        className="absolute left-3 top-[42px] -translate-y-1/2 text-purple-500"
                    />

                    <select
                        id="interview-status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={selectClass}
                    >
                        <option value="ALL">All statuses</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>

                    <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-[42px] -translate-y-1/2 text-gray-400"
                    />
                </div>

                <div className="relative">
                    <label
                        htmlFor="interview-date-filter"
                        className="mb-1.5 block text-xs font-semibold text-gray-600"
                    >
                        Interview date
                    </label>

                    <CalendarDays
                        size={15}
                        className="absolute left-3 top-[42px] -translate-y-1/2 text-purple-500"
                    />

                    <input
                        id="interview-date-filter"
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className={`${selectClass} !pr-3`}
                    />
                </div>
            </div>

            {(jobFilter !== "ALL" ||
                statusFilter !== "ALL" ||
                dateFilter) && (
                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            setJobFilter("ALL");
                            setStatusFilter("ALL");
                            setDateFilter("");
                        }}
                        className="text-xs font-semibold text-purple-700 hover:text-purple-900 hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </section>
    );
};

export default InterviewFilters;

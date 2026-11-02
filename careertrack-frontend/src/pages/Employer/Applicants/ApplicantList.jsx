import { Search, Users, Sparkles, RefreshCw } from "lucide-react";
import ApplicantCard from "./ApplicantCard";

const ApplicantList = ({
    applicants = [],
    onClearFilters,
    hasFilters = false,
}) => {
    if (!Array.isArray(applicants) || applicants.length === 0) {
        return (
            <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
                <div className="h-1 bg-gradient-to-r from-purple-500 via-fuchsia-400 to-indigo-500" />

                <div className="flex min-h-[300px] flex-col items-center justify-center !px-5 !py-12 text-center">
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-[26px] border border-purple-100 bg-gradient-to-br from-purple-50 to-fuchsia-50">
                        <Users size={31} className="text-purple-500" />
                        <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-white bg-white text-fuchsia-500 shadow-sm">
                            <Search size={15} />
                        </span>
                    </div>

                    <h2 className="mt-5 text-lg font-bold text-gray-900">
                        {hasFilters
                            ? "No matching candidates"
                            : "Your talent pool is waiting"}
                    </h2>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                        {hasFilters
                            ? "No applications match the current search or filters. Try adjusting your selection."
                            : "When candidates apply for your jobs, their application details will appear here."}
                    </p>

                    {hasFilters && onClearFilters && (
                        <button
                            type="button"
                            onClick={onClearFilters}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 !px-4 !py-2.5 text-xs font-semibold text-white shadow-md shadow-purple-100 transition hover:-translate-y-0.5 hover:bg-purple-700"
                        >
                            <RefreshCw size={14} />
                            Clear all filters
                        </button>
                    )}

                    {!hasFilters && (
                        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-purple-50 !px-3 !py-2 text-xs font-medium text-purple-700">
                            <Sparkles size={14} />
                            Ready for your next great hire
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
            {/* List header */}
            <div className="flex flex-col gap-2 border-b border-purple-100 bg-gradient-to-r from-[#faf8ff] to-white !px-5 !py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                        <Users size={19} />
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-900">
                            Applicant records
                        </h3>
                        <p className="mt-0.5 text-[11px] text-gray-500">
                            Candidate information and application actions
                        </p>
                    </div>
                </div>

                <span className="w-fit rounded-full border border-purple-100 bg-white !px-3 !py-1.5 text-[11px] font-semibold text-purple-700">
                    {applicants.length}{" "}
                    {applicants.length === 1 ? "candidate" : "candidates"}
                </span>
            </div>

            {/* Column headings */}
            <div
                className="
                    hidden md:grid
                    grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,200px)]
                    items-center gap-4
                    border-b border-gray-100
                    bg-[#fcfbff] !px-5 !py-3
                    text-[10px] font-bold uppercase tracking-wider text-gray-400
                "
            >
                <div>Candidate</div>
                <div>Applied for</div>
                <div>Status</div>
                <div>Applied on</div>
                <div>Actions</div>
            </div>

            <div>
                {applicants.map((applicant, index) => (
                    <ApplicantCard
                        key={
                            applicant.applicationId ??
                            applicant.id ??
                            index
                        }
                        applicant={applicant}
                    />
                ))}
            </div>
        </div>
    );
};

export default ApplicantList;
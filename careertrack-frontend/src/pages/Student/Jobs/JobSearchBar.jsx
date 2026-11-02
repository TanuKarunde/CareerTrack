
import { Search, X, Sparkles } from "lucide-react";

const JobSearchBar = ({ search, setSearch }) => {
    return (
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-[#fafbfe] !p-2 transition duration-200 focus-within:border-[#a99ce0] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(112,71,232,0.08)] sm:!p-2.5">
            <div className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#344563] text-white shadow-sm">
                <Search size={18} />
            </div>

            <div className="min-w-0 flex-1">
                <label
                    htmlFor="job-search"
                    className="mb-0.5 block text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-400"
                >
                    Search opportunities
                </label>

                <input
                    id="job-search"
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Job title, skill or company..."
                    aria-label="Search jobs"
                    className="w-full min-w-0 bg-transparent text-sm font-medium text-[#27344a] outline-none placeholder:font-normal placeholder:text-slate-400"
                />
            </div>

            {search ? (
                <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                    <X size={17} />
                </button>
            ) : (
                <div className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white !px-2.5 !py-2 text-[10px] font-semibold text-slate-400 sm:flex">
                    <Sparkles size={12} className="text-[#8171c7]" />
                    Find your fit
                </div>
            )}
        </div>
    );
};

export default JobSearchBar;

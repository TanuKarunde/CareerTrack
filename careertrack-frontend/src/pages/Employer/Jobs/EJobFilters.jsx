
import { Search, SlidersHorizontal, BriefcaseBusiness, RotateCcw } from "lucide-react";

const EJobFilter = ({
    search,
    setSearch,
    status,
    setStatus,
    experience,
    setExperience
}) => {
    const resetFilters = () => {
        setSearch("");
        setStatus("ALL");
        setExperience("ALL");
    };

    const selectClass = `
        h-12 w-full sm:w-auto sm:min-w-[155px]
        !px-4 rounded-2xl border border-violet-100
        bg-white/90 text-sm font-medium text-slate-700
        outline-none transition
        hover:border-violet-300
        focus:border-violet-400 focus:ring-4 focus:ring-violet-100
    `;

    return (
        <div className="
            relative overflow-hidden
            rounded-[26px] border border-fuchsia-200/80
            bg-gradient-to-r from-fuchsia-50 via-white to-violet-100
            !p-4 sm:!p-5 mb-6
            shadow-[0_12px_35px_rgba(139,92,246,0.08)]
        ">
            <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full bg-pink-200/30 blur-2xl pointer-events-none" />

            <div className="relative flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200">
                        <SlidersHorizontal size={17} />
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-800">
                            Find your job posting
                        </h3>
                        <p className="text-xs text-slate-500">
                            Search and refine your results
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 lg:flex-row">
                    <div className="relative min-w-0 flex-1">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title, skills, company or location..."
                            className="
                                h-12 w-full !pl-11 !pr-4
                                rounded-2xl border border-violet-100
                                bg-white text-sm text-slate-700
                                placeholder:text-slate-400
                                outline-none transition
                                focus:border-violet-400
                                focus:ring-4 focus:ring-violet-100
                            "
                        />
                    </div>

                    <div className="relative">
                        <BriefcaseBusiness
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none"
                        />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className={`${selectClass} !pl-9`}
                            aria-label="Filter by job status"
                        >
                            <option value="ALL">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="PAUSED">Paused</option>
                        </select>
                    </div>

                    <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className={selectClass}
                        aria-label="Filter by experience"
                    >
                        <option value="ALL">All Experience</option>
                        <option value="0-1">0–1 Years</option>
                        <option value="1-2">1–2 Years</option>
                        <option value="2-5">2–5 Years</option>
                        <option value="5+">5+ Years</option>
                    </select>

                    <button
                        type="button"
                        onClick={resetFilters}
                        className="
                            inline-flex h-12 items-center justify-center gap-2
                            rounded-2xl border border-pink-200
                            bg-white !px-4 text-sm font-semibold
                            text-pink-600 transition
                            hover:border-pink-300 hover:bg-pink-50
                            active:scale-[0.98]
                        "
                    >
                        <RotateCcw size={15} />
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EJobFilter;

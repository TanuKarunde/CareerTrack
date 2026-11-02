
import {
    Search,
    SlidersHorizontal,
    Sparkles,
    ArrowRight,
} from "lucide-react";

const NoJobsFound = () => {
    return (
        <div className="relative mt-4 overflow-hidden rounded-[26px] border border-slate-200 bg-white !px-5 !py-12 text-center shadow-sm sm:!px-8 sm:!py-16">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#eee9ff] opacity-80 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-[#eaf0fa] opacity-80 blur-3xl" />

            <div className="relative mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-[25px] border border-[#e8e3fa] bg-gradient-to-br from-[#f2efff] to-[#f8faff] text-[#6252ae] shadow-sm">
                <Search size={30} strokeWidth={1.8} />

                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-white bg-[#344563] text-white shadow-sm">
                    <Sparkles size={14} />
                </span>
            </div>

            <div className="relative mx-auto mt-6 max-w-md">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f1fc] !px-3 !py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6252ae]">
                    <SlidersHorizontal size={12} />
                    No results
                </span>

                <h2 className="mt-3 text-xl font-extrabold tracking-tight text-[#27344a] sm:text-2xl">
                    No jobs found just yet
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Try changing your search terms or adjusting your filters.
                    Your next opportunity might be one search away.
                </p>
            </div>

            <div className="relative mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-[#fafbfe] !px-4 !py-3 text-xs font-semibold text-slate-500">
                <Sparkles size={15} className="text-[#8171c7]" />
                Try searching for a skill like Java or SQL
                <ArrowRight size={14} className="text-[#8171c7]" />
            </div>
        </div>
    );
};

export default NoJobsFound;

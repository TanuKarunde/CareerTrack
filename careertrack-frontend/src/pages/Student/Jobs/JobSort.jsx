
import { ArrowDownWideNarrow } from "lucide-react";

const JobSort = ({ sort, setSort }) => {
    return (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white !py-1.5 !pl-3 !pr-2 shadow-sm transition focus-within:border-[#b8ace8]">
            <ArrowDownWideNarrow
                size={16}
                className="shrink-0 text-[#6252ae]"
            />

            <label
                htmlFor="job-sort"
                className="hidden text-[11px] font-semibold text-slate-400 sm:block"
            >
                Sort by
            </label>

            <select
                id="job-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="max-w-[165px] cursor-pointer bg-transparent !py-2 text-xs font-bold text-[#344563] outline-none"
            >
                <option value="">Recommended</option>
                <option value="latest">Latest jobs</option>
                <option value="salary-high">Salary: High to Low</option>
                <option value="salary-low">Salary: Low to High</option>
            </select>
        </div>
    );
};

export default JobSort;

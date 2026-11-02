
import { useMemo } from "react";
import {
    SlidersHorizontal,
    BriefcaseBusiness,
    MapPin,
    Clock3,
    X,
    Check,
} from "lucide-react";

const JobFilters = ({
    jobs = [],
    jobType,
    setJobType,
    experience,
    setExperience,
    location,
    setLocation,
}) => {
    const jobTypeOptions = [
        { value: "FULL_TIME", label: "Full Time" },
        { value: "INTERNSHIP", label: "Internship" },
        { value: "PART_TIME", label: "Part Time" },
        { value: "CONTRACT", label: "Contract" },
        { value: "REMOTE", label: "Remote" },
    ];

    const experienceOptions = [
        { value: "FRESHER", label: "Fresher" },
        { value: "ENTRY", label: "1 - 2 Years" },
        { value: "MID", label: "2 - 5 Years" },
        { value: "5+", label: "5+ Years" },
    ];

    const locationOptions = [
        "Pune",
        "Bangalore",
        "Mumbai",
        "Hyderabad",
        "Nagpur",
    ];

    const getJobType = (job) => job?.jobType || job?.jobtype || "";
    const getLocation = (job) => job?.location || "";
    const getExperience = (job) => job?.experienceLevel || "";

    const matchesExperience = (job, value) => {
        const exp = getExperience(job).toUpperCase();

        if (value === "FRESHER") {
            return exp.includes("FRESHER") || exp.includes("ENTRY LEVEL");
        }

        if (value === "ENTRY") {
            return (
                exp.includes("ENTRY") ||
                exp.includes("1 - 2") ||
                exp.includes("1-2") ||
                exp.includes("1 TO 2")
            );
        }

        if (value === "MID") {
            return (
                exp.includes("MID") ||
                exp.includes("2 - 5") ||
                exp.includes("2-5") ||
                exp.includes("2 TO 5")
            );
        }

        if (value === "5+") {
            return (
                exp.includes("5+") ||
                exp.includes("5 +") ||
                exp.includes("5 YEARS")
            );
        }

        return false;
    };

    const getCount = (type, value) =>
        jobs.filter((job) => {
            if (type === "jobType") {
                const jobTypeValue = getJobType(job).toUpperCase();

                if (value === "REMOTE") {
                    return (
                        jobTypeValue.includes("REMOTE") ||
                        getLocation(job).toLowerCase().includes("remote")
                    );
                }

                return jobTypeValue === value;
            }

            if (type === "experience") {
                return matchesExperience(job, value);
            }

            if (type === "location") {
                return getLocation(job).toLowerCase().includes(value.toLowerCase());
            }

            return false;
        }).length;

    const selectedCount = useMemo(
        () => [jobType, experience, location].filter(Boolean).length,
        [jobType, experience, location]
    );

    const clearAll = () => {
        setJobType("");
        setExperience("");
        setLocation("");
    };

    const FilterOption = ({ type, value, label, count, checked, onChange }) => (
        <label className={`group flex cursor-pointer items-center justify-between gap-2 rounded-xl !px-2.5 !py-2.5 transition ${checked ? "bg-[#f3f1fc]" : "hover:bg-slate-50"}`}>
            <span className="flex min-w-0 items-center gap-3">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="peer sr-only"
                    aria-label={label}
                />

                <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border transition ${checked ? "border-[#6252ae] bg-[#6252ae] text-white" : "border-slate-300 bg-white text-transparent group-hover:border-[#a69ad9]"}`}>
                    {checked && <Check size={12} strokeWidth={3} />}
                </span>

                <span className={`truncate text-[13px] font-medium transition ${checked ? "text-[#4f438d]" : "text-slate-600 group-hover:text-slate-900"}`}>
                    {label}
                </span>
            </span>

            <span className={`shrink-0 text-[11px] font-semibold ${checked ? "text-[#6252ae]" : "text-slate-400"}`}>
                {count}
            </span>
        </label>
    );

    return (
        <div className="w-full rounded-[22px] border border-slate-200/80 bg-white !p-4 shadow-[0_4px_18px_rgba(35,45,75,0.035)] sm:!p-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 !pb-4">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2efff] text-[#6252ae]">
                        <SlidersHorizontal size={18} />
                    </span>

                    <div>
                        <h2 className="text-sm font-extrabold text-[#27344a]">
                            Filters
                        </h2>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                            Refine your search
                        </p>
                    </div>
                </div>

                {selectedCount > 0 && (
                    <span className="rounded-full bg-[#f2efff] !px-2.5 !py-1 text-[10px] font-extrabold text-[#6252ae]">
                        {selectedCount} active
                    </span>
                )}
            </div>

            {selectedCount > 0 && (
                <button
                    type="button"
                    onClick={clearAll}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#e7e2f8] bg-[#faf9ff] !px-3 !py-2.5 text-xs font-bold text-[#6252ae] transition hover:border-[#d2c8f5] hover:bg-[#f3f0ff]"
                >
                    <X size={14} />
                    Clear all filters
                </button>
            )}

            {/* Job type */}
            <FilterGroup
                title="Job type"
                icon={<BriefcaseBusiness size={15} />}
            >
                {jobTypeOptions.map((option) => (
                    <FilterOption
                        key={option.value}
                        type="jobType"
                        value={option.value}
                        label={option.label}
                        count={getCount("jobType", option.value)}
                        checked={jobType === option.value}
                        onChange={() =>
                            setJobType(jobType === option.value ? "" : option.value)
                        }
                    />
                ))}
            </FilterGroup>

            {/* Experience */}
            <FilterGroup
                title="Experience level"
                icon={<Clock3 size={15} />}
            >
                {experienceOptions.map((option) => (
                    <FilterOption
                        key={option.value}
                        type="experience"
                        value={option.value}
                        label={option.label}
                        count={getCount("experience", option.value)}
                        checked={experience === option.value}
                        onChange={() =>
                            setExperience(experience === option.value ? "" : option.value)
                        }
                    />
                ))}
            </FilterGroup>

            {/* Location */}
            <FilterGroup
                title="Location"
                icon={<MapPin size={15} />}
                last
            >
                {locationOptions.map((item) => (
                    <FilterOption
                        key={item}
                        type="location"
                        value={item}
                        label={item}
                        count={getCount("location", item)}
                        checked={location === item}
                        onChange={() =>
                            setLocation(location === item ? "" : item)
                        }
                    />
                ))}
            </FilterGroup>

            <div className="mt-4 rounded-xl border border-[#eeebfa] bg-gradient-to-r from-[#f8f6ff] to-[#fbfcff] !p-3">
                <p className="text-[11px] leading-5 text-slate-500">
                    <span className="font-bold text-[#6252ae]">Tip:</span>{" "}
                    Combine your search keywords with filters to narrow down relevant opportunities.
                </p>
            </div>
        </div>
    );
};

const FilterGroup = ({ title, icon, children, last = false }) => (
    <section className={`!pt-5 ${last ? "" : "border-b border-slate-100 !pb-5"}`}>
        <h3 className="mb-2.5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#344563]">
            <span className="text-[#7a6bc1]">{icon}</span>
            {title}
        </h3>

        <div className="space-y-0.5">{children}</div>
    </section>
);

export default JobFilters;

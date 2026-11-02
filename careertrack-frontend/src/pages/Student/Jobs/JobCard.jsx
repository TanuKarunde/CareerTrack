
import { useState } from "react";
import {
    ArrowUpRight,
    BriefcaseBusiness,
    Clock3,
    MapPin,
    Wallet,
    Building2,
    Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
    const navigate = useNavigate();
    const [logoFailed, setLogoFailed] = useState(false);

    const companyName = job?.company || job?.compony || "Company";
    const jobTitle = job?.title || "Job Title";
    const jobType = job?.jobType || job?.jobtype || "Job Type";
    const experience = job?.experienceLevel || "Not specified";

    const skills = Array.isArray(job?.skills)
        ? job.skills
        : typeof job?.skills === "string"
            ? job.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
            : [];

    const formatSalary = () => {
        const min = Number(job?.salaryMin);
        const max = Number(job?.salaryMax);

        if (min > 0 && max > 0) {
            const formatLakhs = (amount) =>
                (amount / 100000).toLocaleString("en-IN", {
                    maximumFractionDigits: 1,
                });

            return `₹${formatLakhs(min)}L – ₹${formatLakhs(max)}L / year`;
        }

        if (min > 0) {
            return `From ₹${min.toLocaleString("en-IN")}`;
        }

        if (max > 0) {
            return `Up to ₹${max.toLocaleString("en-IN")}`;
        }

        return "Salary not disclosed";
    };

    const getPostedTime = (date) => {
        if (!date) return "Recently posted";

        const postedDate = new Date(date);

        if (Number.isNaN(postedDate.getTime())) {
            return "Recently posted";
        }

        const diffMs = Math.max(0, Date.now() - postedDate.getTime());
        const minutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMs / 3600000);
        const days = Math.floor(diffMs / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days === 1) return "Yesterday";
        if (days < 30) return `${days}d ago`;

        return postedDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
        });
    };

    const getJobTypeStyle = () => {
        const type = jobType.toUpperCase();

        if (type.includes("INTERNSHIP")) {
            return "border-sky-100 bg-sky-50 text-sky-700";
        }

        if (type.includes("REMOTE")) {
            return "border-indigo-100 bg-indigo-50 text-indigo-700";
        }

        if (type.includes("CONTRACT")) {
            return "border-amber-100 bg-amber-50 text-amber-700";
        }

        if (type.includes("PART_TIME")) {
            return "border-rose-100 bg-rose-50 text-rose-700";
        }

        return "border-emerald-100 bg-emerald-50 text-emerald-700";
    };

    const logo = job?.logo;
    const logoUrl = logo
        ? logo.startsWith("http")
            ? logo
            : `http://localhost:8080${logo.startsWith("/") ? "" : "/"}${logo}`
        : "";

    const openJob = () => navigate(`/student/jobs/${job.id}`);

    return (
        <article
            onClick={openJob}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openJob();
                }
            }}
            role="link"
            tabIndex={0}
            aria-label={`View ${jobTitle} at ${companyName}`}
            className="group relative flex h-full min-h-[345px] cursor-pointer flex-col overflow-hidden rounded-[22px] border border-slate-200/80 bg-white !p-5 shadow-[0_3px_14px_rgba(35,45,75,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#c9c3e8] hover:shadow-[0_16px_35px_rgba(52,69,99,0.11)] focus:outline-none focus:ring-2 focus:ring-[#8c7bd8] focus:ring-offset-2 sm:!p-5"
        >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#344563] via-[#7663c7] to-[#b8a9ef] opacity-0 transition duration-300 group-hover:opacity-100" />

            {/* Company and job type */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-[#f4f2ff] to-[#f8fafc] shadow-sm">
                    {logoUrl && !logoFailed ? (
                        <img
                            src={logoUrl}
                            alt={`${companyName} logo`}
                            className="h-full w-full object-contain !p-2"
                            onError={() => setLogoFailed(true)}
                        />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center text-[#344563]">
                            {companyName !== "Company" ? (
                                <span className="text-xl font-extrabold">
                                    {companyName.charAt(0).toUpperCase()}
                                </span>
                            ) : (
                                <Building2 size={23} />
                            )}
                        </span>
                    )}
                </div>

                <span
                    className={`max-w-[140px] truncate rounded-full border !px-3 !py-1.5 text-[10px] font-bold tracking-wide ${getJobTypeStyle()}`}
                    title={jobType}
                >
                    {jobType.replaceAll("_", " ")}
                </span>
            </div>

            {/* Title and company */}
            <div className="mt-5">
                <h2
                    className="line-clamp-2 min-h-[48px] text-[17px] font-extrabold leading-6 tracking-tight text-[#27344a] transition group-hover:text-[#6252ae]"
                    title={jobTitle}
                >
                    {jobTitle}
                </h2>

                <p className="mt-1.5 flex items-center gap-1.5 truncate text-sm font-semibold text-slate-500">
                    <Building2 size={14} className="shrink-0 text-slate-400" />
                    <span className="truncate">{companyName}</span>
                </p>
            </div>

            {/* Job information */}
            <div className="mt-5 space-y-3 rounded-2xl bg-[#f8f9fc] !p-3.5">
                <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#6d63b7] shadow-sm">
                        <MapPin size={14} />
                    </span>
                    <span className="truncate text-xs font-medium text-slate-600">
                        {job?.location || "Location not specified"}
                    </span>
                </div>

                <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#6d63b7] shadow-sm">
                        <BriefcaseBusiness size={14} />
                    </span>
                    <span className="truncate text-xs font-medium text-slate-600">
                        {experience}
                    </span>
                </div>

                <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[#6d63b7] shadow-sm">
                        <Wallet size={14} />
                    </span>
                    <span className="truncate text-xs font-bold text-[#344563]" title={formatSalary()}>
                        {formatSalary()}
                    </span>
                </div>
            </div>

            {/* Skills */}
            <div className="mt-4">
                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                    <Sparkles size={12} />
                    Key skills
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {skills.length > 0 ? (
                        <>
                            {skills.slice(0, 3).map((skill, index) => (
                                <span
                                    key={`${skill}-${index}`}
                                    className="max-w-full truncate rounded-lg border border-[#e9e5f8] bg-[#f8f6ff] !px-2.5 !py-1.5 text-[10px] font-semibold text-[#6252ae]"
                                    title={skill}
                                >
                                    {skill}
                                </span>
                            ))}

                            {skills.length > 3 && (
                                <span className="rounded-lg border border-slate-100 bg-slate-50 !px-2.5 !py-1.5 text-[10px] font-bold text-slate-500">
                                    +{skills.length - 3}
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-xs text-slate-400">
                            Skills not specified
                        </span>
                    )}
                </div>
            </div>

            {/* Bottom action */}
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 !pt-4">
                <div className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-slate-400">
                    <Clock3 size={13} className="shrink-0" />
                    <span className="truncate">{getPostedTime(job?.createdAt)}</span>
                </div>

                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        openJob();
                    }}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#344563] !px-3.5 !py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#6252ae] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8c7bd8] focus:ring-offset-2"
                    aria-label={`View ${jobTitle}`}
                >
                    View job
                    <ArrowUpRight size={15} />
                </button>
            </div>
        </article>
    );
};

export default JobCard;

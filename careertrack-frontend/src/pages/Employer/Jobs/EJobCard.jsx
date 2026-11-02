
import { useState, useEffect, useRef } from "react";
import {
    BriefcaseBusiness,
    MapPin,
    Users,
    Clock3,
    MoreVertical,
    Pencil,
    Eye,
    Sparkles,
    Building2,
    ArrowUpRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import EJobStatus from "./EJobStatus";

const EJobCard = ({
    job,
    currentUserId,
    onEdit,
    onStatusChange
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const title =
        job?.title ||
        job?.jobTitle ||
        "Untitled Job";

    const company =
        job?.company ||
        job?.compony ||
        "CareerTrack Company";

    const location =
        job?.location ||
        "Location not specified";

    const jobType =
        job?.jobType ||
        job?.jobtype ||
        "Full Time";

    const experience =
        job?.experienceLevel ||
        job?.experiencelevel ||
        "Not specified";

    const applicants =
        job?.applicationsCount ??
        job?.totalApplications ??
        job?.applicationCount ??
        (Array.isArray(job?.applications) ? job.applications.length : null) ??
        0;

    const createdDate =
        job?.createdAt ||
        job?.createAt ||
        job?.postedAt;

    const isJobOwner =
        currentUserId != null &&
        job?.employerId != null &&
        Number(currentUserId) === Number(job.employerId);

    const isActive =
        job?.active === true ||
        job?.active === "true";

    const getPostedDate = () => {
        if (!createdDate) return "Recently";

        const date = new Date(createdDate);

        if (isNaN(date.getTime())) return "Recently";

        const days = Math.floor(
            (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (days <= 0) return "Today";
        if (days === 1) return "1 day ago";
        if (days < 7) return `${days} days ago`;
        if (days < 14) return "1 week ago";

        return `${Math.floor(days / 7)} weeks ago`;
    };

    const handleViewDetails = () => {
        setMenuOpen(false);
        navigate(`/employer/jobs/${job.id}`);
    };

    const handleEdit = () => {
        setMenuOpen(false);
        onEdit?.(job.id);
    };

    return (
        <article className={`
    group relative overflow-visible
    ${menuOpen ? "z-50" : "z-0"}
            rounded-[24px] border border-violet-100
            bg-white !p-4 sm:!p-5
            shadow-[0_5px_22px_rgba(91,75,160,0.05)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:border-violet-200
            hover:shadow-[0_14px_32px_rgba(91,75,160,0.12)]
        `}>
            <div className={`
                absolute right-0 top-0 h-full w-1.5 rounded-r-[24px]
                ${isActive
                    ? "bg-gradient-to-b from-emerald-300 to-teal-400"
                    : "bg-gradient-to-b from-orange-300 to-amber-400"}
            `} />

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                    <div className="
                        flex h-14 w-14 shrink-0 items-center justify-center
                        rounded-2xl border border-violet-100
                        bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-100
                        text-violet-600 shadow-inner
                        transition-transform duration-300
                        group-hover:scale-105
                    ">
                        <BriefcaseBusiness size={25} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="
                                max-w-full truncate text-base sm:text-lg
                                font-extrabold tracking-tight text-slate-800
                            ">
                                {title}
                            </h2>

                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                            <Building2 size={13} className="text-violet-500" />
                            <span className="font-semibold text-slate-600">
                                {company}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span>{job?.employerName || "Employer posting"}</span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 !px-2.5 !py-1.5 text-xs font-medium text-slate-600">
                                <BriefcaseBusiness size={13} className="text-violet-500" />
                                {jobType}
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 !px-2.5 !py-1.5 text-xs font-medium text-slate-600">
                                <Users size={13} className="text-blue-500" />
                                {experience}
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 !px-2.5 !py-1.5 text-xs font-medium text-slate-600">
                                <MapPin size={13} className="text-pink-500" />
                                {location}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 !pt-3 xl:justify-end xl:border-l xl:border-t-0 xl:!pl-5 xl:!pt-0">
                    <div className="flex items-center gap-3 sm:gap-5">
                        <div className="min-w-[80px]">
                            <div className="flex items-center gap-1.5 text-violet-600">
                                <Users size={16} />
                                <span className="text-lg font-extrabold text-slate-800">
                                    {applicants}
                                </span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                                Applicants
                            </p>
                        </div>

                        <div className="hidden h-9 w-px bg-slate-100 sm:block" />

                        <div className="min-w-[86px]">
                            <div className="flex items-center gap-1.5 text-blue-500">
                                <Clock3 size={15} />
                                <span className="text-xs font-bold text-slate-700">
                                    {getPostedDate()}
                                </span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                                Posted date
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isJobOwner && (
                            <EJobStatus
                                job={job}
                                onStatusChange={onStatusChange}
                            />
                        )}

                        <div className="relative" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setMenuOpen((previous) => !previous)}
                                aria-label="Job options"
                                aria-expanded={menuOpen}
                                className="
                                    flex h-10 w-10 items-center justify-center
                                    rounded-xl border border-slate-100
                                    bg-white text-slate-500 transition
                                    hover:border-violet-200 hover:bg-violet-50
                                    hover:text-violet-600
                                "
                            >
                                <MoreVertical size={19} />
                            </button>

                            {menuOpen && (
                                <div className="
                                    absolute right-0 top-full z-[100] mt-2 w-56
        rounded-2xl border border-violet-100
        bg-white !p-2
        shadow-[0_16px_40px_rgba(60,40,100,0.16)]
                                ">
                                    <button
                                        type="button"
                                        onClick={handleViewDetails}
                                        className="
                                            flex w-full items-center gap-3
                                            rounded-xl !px-3 !py-3 text-left
                                            text-sm font-medium text-slate-700
                                            transition hover:bg-violet-50 hover:text-violet-700
                                        "
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                                            <Eye size={16} />
                                        </span>
                                        View Details
                                        <ArrowUpRight size={14} className="ml-auto" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            navigate(`/employer/jobs/${job.id}/smart-matches`);
                                        }}
                                        className="
                                            flex w-full items-center gap-3
                                            rounded-xl !px-3 !py-3 text-left
                                            text-sm font-semibold text-violet-700
                                            transition hover:bg-violet-50
                                        "
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                                            <Sparkles size={16} />
                                        </span>
                                        Smart Candidate Match
                                        <ArrowUpRight size={14} className="ml-auto" />
                                    </button>

                                    {isJobOwner && (
                                        <button
                                            type="button"
                                            onClick={handleEdit}
                                            className="
                                                flex w-full items-center gap-3
                                                rounded-xl !px-3 !py-3 text-left
                                                text-sm font-medium text-slate-700
                                                transition hover:bg-pink-50 hover:text-pink-700
                                            "
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                                                <Pencil size={16} />
                                            </span>
                                            Edit Job
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default EJobCard;

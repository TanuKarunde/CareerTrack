
import { useState } from "react";
import {
    MapPin, Briefcase, BriefcaseBusiness, Bookmark,
    Clock3, IndianRupee, Sparkles
} from "lucide-react";
import ApplyButton from "./ApplyButton";

const JobHeader = ({ job }) => {
    const [saved, setSaved] = useState(false);

    const skills = Array.isArray(job?.skills)
        ? job.skills
        : typeof job?.skills === "string"
        ? job.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [];

    const companyName = job?.company || job?.compony || "Company";
    const jobType = job?.jobType || job?.jobtype || "Full-time";
    const experience = job?.experienceLevel || job?.experiencelevel || "Fresher";

    return (
        <section className="relative overflow-hidden border-b border-[#ECE9F8] bg-gradient-to-br from-white via-white to-[#F6F3FF] !px-6 !py-7 md:!px-8">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-purple-100/60 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-1/3 h-24 w-24 rounded-full bg-pink-100/50 blur-2xl" />

            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
                        {job?.logo ? (
                            <img
                                src={`http://localhost:8080${job.logo}`}
                                alt={companyName}
                                className="h-full w-full object-contain !p-2"
                            />
                        ) : (
                            <span className="text-2xl font-black text-purple-700">
                                {companyName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-purple-100 !px-3 !py-1 text-[11px] font-bold uppercase tracking-wide text-purple-700">
                                {jobType}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 !px-3 !py-1 text-[11px] font-semibold text-emerald-700">
                                <Sparkles size={12} /> Opportunity
                            </span>
                        </div>

                        <h1 className="break-words text-2xl font-extrabold leading-tight tracking-tight text-[#202044] md:text-3xl">
                            {job?.title || "Job Opportunity"}
                        </h1>
                        <p className="mt-2 text-base font-semibold text-[#6252AE]">{companyName}</p>

                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-2">
                                <MapPin size={16} className="text-purple-600" />
                                {job?.location || "Location not specified"}
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <BriefcaseBusiness size={16} className="text-purple-600" />
                                {experience}
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <Briefcase size={16} className="text-purple-600" />
                                {jobType}
                            </span>
                            {(job?.salaryMin || job?.salaryMax) && (
                                <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                                    <IndianRupee size={15} className="text-purple-600" />
                                    {Number(job?.salaryMin || 0).toLocaleString("en-IN")}
                                    {" – "}
                                    {Number(job?.salaryMax || 0).toLocaleString("en-IN")}
                                    <span className="font-normal text-slate-500">/ year</span>
                                </span>
                            )}
                            {job?.createdAt && (
                                <span className="inline-flex items-center gap-2">
                                    <Clock3 size={15} className="text-purple-600" />
                                    Posted {new Date(job.createdAt).toLocaleDateString("en-IN")}
                                </span>
                            )}
                        </div>

                        {skills.length > 0 && (
                            <div className="mt-5 flex flex-wrap gap-2">
                                {skills.slice(0, 5).map((skill, index) => (
                                    <span key={`${skill}-${index}`} className="rounded-lg border border-purple-100 bg-white/80 !px-3 !py-1.5 text-xs font-semibold text-[#6252AE]">
                                        {skill}
                                    </span>
                                ))}
                                {skills.length > 5 && (
                                    <span className="rounded-lg bg-slate-100 !px-3 !py-1.5 text-xs font-semibold text-slate-600">
                                        +{skills.length - 5} more
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 flex-row gap-3 xl:w-44 xl:flex-col">
                    <ApplyButton jobId={job?.id} />
                    <button
                        type="button"
                        onClick={() => setSaved(!saved)}
                        className={`inline-flex items-center justify-center gap-2 rounded-xl border !px-5 !py-2.5 text-sm font-semibold transition ${
                            saved
                                ? "border-purple-300 bg-purple-50 text-purple-700"
                                : "border-slate-200 bg-white text-slate-600 hover:border-purple-200 hover:bg-purple-50"
                        }`}
                    >
                        <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
                        {saved ? "Saved" : "Save Job"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default JobHeader;


import {
    FileText,
    Code2,
    MapPin,
    BriefcaseBusiness,
    Clock3,
    IndianRupee,
    ArrowUpRight
} from "lucide-react";

const JobDetailCard = ({ job }) => {
    if (!job) {
        return (
            <div className="rounded-[28px] border border-purple-100 bg-white p-7 shadow-sm">
                <p className="text-sm text-gray-500">
                    Job details are unavailable for this application.
                </p>
            </div>
        );
    }

    const skillsList = Array.isArray(job.skills)
        ? job.skills
        : typeof job.skills === "string"
        ? job.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [];

    const salary =
        job.salaryMin != null && job.salaryMax != null
            ? `₹${Number(job.salaryMin).toLocaleString("en-IN")} – ₹${Number(job.salaryMax).toLocaleString("en-IN")}`
            : job.salaryMin != null
            ? `From ₹${Number(job.salaryMin).toLocaleString("en-IN")}`
            : job.salaryMax != null
            ? `Up to ₹${Number(job.salaryMax).toLocaleString("en-IN")}`
            : "Not specified";

    const jobType = job.jobType || job.jobtype || "Not specified";
    const experience = job.experienceLevel || "Not specified";
    const location = job.location || "Not specified";

    const metadata = [
        { label: "Experience", value: experience, Icon: Clock3 },
        {
            label: "Job type",
            value: jobType.replaceAll("_", " "),
            Icon: BriefcaseBusiness
        },
        { label: "Location", value: location, Icon: MapPin },
        { label: "Salary range", value: salary, Icon: IndianRupee }
    ];

    return (
        <section className="min-w-0 rounded-[28px] border border-purple-100 bg-white !p-5 shadow-[0_8px_35px_rgba(76,29,149,0.05)] sm:p-7">
            {/* Section heading */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                        <FileText size={22} />
                    </span>
                    <div>
                        <h2 className="text-lg font-extrabold text-[#211936] sm:text-xl">
                            Job Details
                        </h2>
                        <p className="mt-0.5 text-xs text-gray-500">
                            Role overview and requirements
                        </p>
                    </div>
                </div>

                <span className="rounded-xl border border-purple-100 bg-white !px-3 !py-2 text-xs font-semibold text-purple-700">
                    Application role
                </span>
            </div>

            {/* Description */}
            <div className="mt-7">
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                        <FileText size={16} />
                    </span>
                    <h3 className="text-sm font-bold text-gray-900">
                        Job description
                    </h3>
                </div>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                    {job.description || "No job description available."}
                </p>
            </div>

            {/* Skills */}
            <div className="mt-7 border-t border-dashed border-purple-100 pt-6">
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                        <Code2 size={17} />
                    </span>
                    <h3 className="text-sm font-bold text-gray-900">
                        Required skills
                    </h3>
                    <span className="ml-auto text-xs text-gray-400">
                        {skillsList.length} skills
                    </span>
                </div>

                {skillsList.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {skillsList.map((skill, index) => (
                            <span
                                key={`${skill}-${index}`}
                                className="rounded-full border border-purple-100 bg-[#F7F3FF] !px-3.5 !py-2 text-xs font-semibold text-[#6941B2] transition hover:border-purple-300 hover:bg-purple-100"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="mt-3 text-sm text-gray-500">
                        No specific skills listed.
                    </p>
                )}
            </div>

            {/* Metadata grid */}
            <div className="mt-7 grid grid-cols-1 gap-3 border-t border-dashed border-purple-100 pt-6 sm:grid-cols-2">
                {metadata.map(({ label, value, Icon }) => (
                    <div
                        key={label}
                        className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#F0ECF7] bg-[#FCFBFE] !p-3.5"
                    >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100/70 text-purple-700">
                            <Icon size={17} />
                        </span>

                        <div className="min-w-0">
                            <p className="text-xs text-gray-500">{label}</p>
                            <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                                {value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default JobDetailCard;

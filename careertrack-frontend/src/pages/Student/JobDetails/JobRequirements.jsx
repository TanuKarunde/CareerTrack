
import {
    GraduationCap, BriefcaseBusiness, CodeXml, CheckCircle2, ClipboardCheck
} from "lucide-react";

const JobRequirements = ({ job }) => {
    const skills = Array.isArray(job?.skills)
        ? job.skills
        : typeof job?.skills === "string"
        ? job.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [];

    const requirements = Array.isArray(job?.requirements)
        ? job.requirements
        : typeof job?.requirements === "string"
        ? job.requirements.split("\n").map((item) => item.trim()).filter(Boolean)
        : [];

    const details = [
        {
            icon: <GraduationCap size={21} />,
            label: "Education",
            value: job?.education || "Bachelor's degree",
            tint: "bg-indigo-50 text-indigo-700"
        },
        {
            icon: <BriefcaseBusiness size={21} />,
            label: "Experience",
            value: job?.experienceLevel || job?.experiencelevel || "Fresher",
            tint: "bg-purple-50 text-purple-700"
        }
    ];

    return (
        <section className="!p-5 md:!p-6">
            <div className="flex items-start gap-3">
                <div className="rounded-xl bg-purple-100 !p-3 text-purple-700">
                    <ClipboardCheck size={22} />
                </div>
                <div>
                    <h2 className="text-xl font-extrabold text-[#202044]">Requirements & Qualifications</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        Review the qualifications and skills for this position.
                    </p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {details.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-100 bg-white !p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-100 hover:shadow-md">
                        <span className={`inline-flex rounded-xl !p-3 ${item.tint}`}>{item.icon}</span>
                        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">{item.label}</p>
                        <p className="mt-1 text-base font-bold text-[#202044]">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[#202044]">
                    <CodeXml size={20} className="text-purple-600" /> Required Skills
                </h3>
                {skills.length ? (
                    <div className="mt-4 flex flex-wrap gap-2.5">
                        {skills.map((skill, index) => (
                            <span key={`${skill}-${index}`} className="rounded-lg border border-purple-100 bg-[#F7F4FF] !px-3.5 !py-2 text-sm font-semibold text-purple-800">
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="mt-3 text-sm text-slate-500">No skills specified.</p>
                )}
            </div>

            {requirements.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-[#202044]">Additional Requirements</h3>
                    <div className="mt-4 space-y-3">
                        {requirements.map((requirement, index) => (
                            <div key={index} className="flex items-start gap-3 rounded-xl bg-slate-50 !p-3 text-sm leading-6 text-slate-600">
                                <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-600" />
                                <span>{requirement}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default JobRequirements;


import { CheckCircle2, Code2, ListChecks, FileText } from "lucide-react";

const JobDescription = ({ description, responsibilities, skills }) => {
    const skillsList = Array.isArray(skills)
        ? skills
        : typeof skills === "string"
        ? skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [];

    const defaultResponsibilities = [
        "Develop and maintain applications.",
        "Write clean, efficient and reusable code.",
        "Troubleshoot and debug issues.",
        "Collaborate with cross-functional teams."
    ];

    const responsibilityList = Array.isArray(responsibilities)
        ? responsibilities
        : typeof responsibilities === "string"
        ? responsibilities.split("\n").map((item) => item.trim()).filter(Boolean)
        : defaultResponsibilities;

    return (
        <section className="space-y-8 !p-5 md:!p-6">
            <div>
                <div className="mb-4 flex items-center gap-3">
                    <span className="rounded-xl bg-purple-100 !p-2.5 text-purple-700">
                        <FileText size={20} />
                    </span>
                    <div>
                        <h2 className="text-lg font-bold text-[#202044]">About this role</h2>
                        <p className="text-xs text-slate-500">What you will work on</p>
                    </div>
                </div>
                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                    {description || "We are looking for a motivated candidate to join our team and work on meaningful projects."}
                </p>
            </div>

            <div>
                <div className="mb-4 flex items-center gap-3">
                    <span className="rounded-xl bg-indigo-50 !p-2.5 text-indigo-700">
                        <ListChecks size={20} />
                    </span>
                    <h2 className="text-lg font-bold text-[#202044]">Responsibilities</h2>
                </div>
                <ul className="space-y-3">
                    {responsibilityList.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white !p-3 text-sm leading-6 text-slate-600 transition hover:border-purple-100 hover:bg-purple-50/40">
                            <CheckCircle2 size={17} className="mt-1 shrink-0 text-purple-600" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <div className="mb-4 flex items-center gap-3">
                    <span className="rounded-xl bg-fuchsia-50 !p-2.5 text-fuchsia-700">
                        <Code2 size={20} />
                    </span>
                    <h2 className="text-lg font-bold text-[#202044]">Skills you'll use</h2>
                </div>
                {skillsList.length ? (
                    <div className="flex flex-wrap gap-2.5">
                        {skillsList.map((skill, index) => (
                            <span key={`${skill}-${index}`} className="rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-white !px-3.5 !py-2 text-xs font-bold text-purple-800 shadow-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="rounded-xl bg-slate-50 !p-4 text-sm text-slate-500">No specific skills were listed for this job.</p>
                )}
            </div>
        </section>
    );
};

export default JobDescription;

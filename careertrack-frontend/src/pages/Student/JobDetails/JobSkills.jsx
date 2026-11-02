
import { Code2, Sparkles } from "lucide-react";

const JobSkills = ({ skills }) => {
    const skillsList = Array.isArray(skills)
        ? skills
        : typeof skills === "string"
        ? skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [];

    return (
        <section className="rounded-2xl border border-[#EAE6FA] bg-white !p-6 shadow-sm">
            <div className="flex items-start gap-3">
                <span className="rounded-xl bg-purple-100 !p-3 text-purple-700">
                    <Code2 size={21} />
                </span>
                <div>
                    <h2 className="text-lg font-extrabold text-[#202044]">Skills & Technologies</h2>
                    <p className="mt-1 text-sm text-slate-500">Core skills associated with this role.</p>
                </div>
            </div>

            {skillsList.length > 0 ? (
                <>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                        {skillsList.map((skill, index) => (
                            <span
                                key={`${skill}-${index}`}
                                className="inline-flex items-center gap-2 rounded-xl border border-purple-100 bg-gradient-to-r from-[#F7F4FF] to-white !px-3.5 !py-2 text-sm font-semibold text-[#5841A8] transition hover:border-purple-300 hover:shadow-sm"
                            >
                                <Sparkles size={13} className="text-purple-500" />
                                {skill}
                            </span>
                        ))}
                    </div>
                    <p className="mt-5 text-xs text-slate-400">
                        {skillsList.length} {skillsList.length === 1 ? "skill" : "skills"} listed for this position
                    </p>
                </>
            ) : (
                <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 !p-5 text-center">
                    <Code2 size={25} className="mx-auto text-slate-400" />
                    <p className="mt-2 text-sm font-semibold text-slate-600">No skills listed yet</p>
                    <p className="mt-1 text-xs text-slate-400">Check the job requirements for more details.</p>
                </div>
            )}
        </section>
    );
};

export default JobSkills;

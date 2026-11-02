import {
    Code2,
    Sparkles,
    CheckCircle2,
} from "lucide-react";

const EJobSkills = ({ skills }) => {
    const skillList = skills
        ? skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
        : [];

    const skillColors = [
        "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
        "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100",
        "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
        "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100",
        "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
    ];

    return (
        <section className="relative overflow-hidden bg-white border border-purple-100 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300">

            {/* Decorative background */}
            <div className="absolute -top-14 -right-12 w-36 h-36 bg-fuchsia-100/40 rounded-full blur-3xl pointer-events-none" />

            {/* Heading */}
            <div className="relative flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 text-white shadow-md shadow-purple-200">
                    <Code2 size={21} />
                </div>

                <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Required Skills
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Technical skills for this opportunity
                    </p>
                </div>

                {skillList.length > 0 && (
                    <div className="ml-auto shrink-0 flex items-center justify-center min-w-9 h-9 px-2.5 rounded-xl bg-purple-50 border border-purple-100">
                        <span className="text-sm font-bold text-purple-700">
                            {skillList.length}
                        </span>
                    </div>
                )}
            </div>

            {/* Skills */}
            {skillList.length === 0 ? (
                <div className="relative mt-6 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-purple-200 bg-gradient-to-br from-purple-50/70 to-white px-4 py-8">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-100 text-purple-500 mb-3">
                        <Code2 size={23} />
                    </div>

                    <p className="text-sm font-semibold text-gray-700">
                        No skills specified
                    </p>

                    <p className="text-xs text-gray-500 mt-1 max-w-xs">
                        Required skills haven't been added for this job yet.
                    </p>
                </div>
            ) : (
                <>
                    <div className="relative mt-6 flex flex-wrap gap-2.5">
                        {skillList.map((skill, index) => (
                            <span
                                key={`${skill}-${index}`}
                                className={`group inline-flex items-center gap-2 max-w-full px-3.5 py-2 rounded-xl border text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                                    skillColors[index % skillColors.length]
                                }`}
                            >
                                <span className="break-words">
                                    {skill}
                                </span>

                                <CheckCircle2
                                    size={15}
                                    className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
                                />
                            </span>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="relative mt-6 pt-4 border-t border-purple-100 flex items-start gap-2.5">
                        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-amber-50 text-amber-600">
                            <Sparkles size={16} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800">
                                Build your skill set
                            </p>

                            <p className="text-xs leading-relaxed text-gray-500 mt-1">
                                Highlight these skills in your profile and projects to demonstrate your suitability for the role.
                            </p>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};

export default EJobSkills;
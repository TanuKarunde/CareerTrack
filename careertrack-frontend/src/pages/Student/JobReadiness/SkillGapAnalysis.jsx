import {
    CheckCircle2,
    AlertCircle,
    Code2,
    Sparkles
} from "lucide-react";

const SkillGapAnalysis = ({ report }) => {

    const matchedSkills = report?.matchedSkills ?? [];
    const missingSkills = report?.missingSkills ?? [];

    const totalSkills = matchedSkills.length + missingSkills.length;

    const matchPercentage = totalSkills > 0
        ? Math.round((matchedSkills.length / totalSkills) * 100)
        : 0;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white !p-6 shadow-sm">

            {/* Header */}
            <div className="mb-6 flex items-start gap-3">

                <div className="rounded-xl bg-purple-100 !p-3">
                    <Code2 size={24} className="text-purple-700" />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        Skill Gap Analysis
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Compare your skills with the job requirements.
                    </p>
                </div>

            </div>

            {/* Match summary */}
            <div className="mb-6 rounded-xl bg-purple-50 !p-4">

                <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-purple-900">
                        Required skills matched
                    </span>

                    <span className="text-sm font-bold text-purple-800">
                        {matchedSkills.length} / {totalSkills}
                    </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-purple-200">
                    <div
                        className="h-full rounded-full bg-purple-600 transition-all duration-500"
                        style={{ width: `${matchPercentage}%` }}
                    />
                </div>

                <p className="mt-2 text-xs text-purple-700">
                    {totalSkills === 0
                        ? "No skill requirements are available for comparison."
                        : `${matchPercentage}% of the listed job skills match your profile.`}
                </p>

            </div>

            {/* Skills lists */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Matched skills */}
                <div className="rounded-xl border border-green-100 !p-4">

                    <div className="mb-4 flex items-center gap-2">
                        <CheckCircle2
                            size={20}
                            className="text-green-600"
                        />

                        <h3 className="font-semibold text-gray-900">
                            Matched Skills
                        </h3>

                        <span className="ml-auto rounded-full bg-green-100 !px-2.5 !py-1 text-xs font-semibold text-green-700">
                            {matchedSkills.length}
                        </span>
                    </div>

                    {matchedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {matchedSkills.map((skill, index) => (
                                <span
                                    key={`${skill}-${index}`}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 !px-3 !py-2 text-sm font-medium text-green-800"
                                >
                                    <CheckCircle2 size={14} />
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm leading-6 text-gray-500">
                            No matching skills found yet. Add your existing
                            skills to your student profile.
                        </p>
                    )}

                </div>

                {/* Missing skills */}
                <div className="rounded-xl border border-amber-100 !p-4">

                    <div className="mb-4 flex items-center gap-2">
                        <AlertCircle
                            size={20}
                            className="text-amber-600"
                        />

                        <h3 className="font-semibold text-gray-900">
                            Skills to Develop
                        </h3>

                        <span className="ml-auto rounded-full bg-amber-100 !px-2.5 !py-1 text-xs font-semibold text-amber-700">
                            {missingSkills.length}
                        </span>
                    </div>

                    {missingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {missingSkills.map((skill, index) => (
                                <span
                                    key={`${skill}-${index}`}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 !px-3 !py-2 text-sm font-medium text-amber-800"
                                >
                                    <AlertCircle size={14} />
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-start gap-2 rounded-lg bg-green-50 !p-3">
                            <Sparkles
                                size={18}
                                className="mt-0.5 shrink-0 text-green-600"
                            />

                            <p className="text-sm leading-6 text-green-800">
                                Great! No missing skills were reported for
                                this job. Keep practising and building projects.
                            </p>
                        </div>
                    )}

                </div>

            </div>

            {/* Footer */}
            <p className="mt-5 text-xs leading-5 text-gray-400">
                Skill matching depends on the skills recorded in your profile
                and the requirements listed by the employer. Review the job
                description to confirm the exact requirements.
            </p>

        </div>
    );
};

export default SkillGapAnalysis;

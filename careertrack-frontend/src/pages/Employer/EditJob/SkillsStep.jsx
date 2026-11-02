
import { useMemo } from "react";
import {
    Code2,
    Sparkles,
    Plus,
    CheckCircle2,
    Tags,
} from "lucide-react";

const SUGGESTIONS = [
    "Java",
    "Spring Boot",
    "MySQL",
    "React",
    "REST API",
    "Git",
];

const SkillsStep = ({ formData, handleChange }) => {
    const skills = useMemo(
        () =>
            (formData.skills || "")
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean),
        [formData.skills]
    );

    const addSuggestion = (skill) => {
        if (
            skills.some(
                (existing) =>
                    existing.toLowerCase() === skill.toLowerCase()
            )
        ) {
            return;
        }

        const updatedSkills = [...skills, skill].join(", ");

        handleChange({
            target: {
                name: "skills",
                value: updatedSkills,
            },
        });
    };

    return (
        <div className="min-h-[430px]">
            <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-purple-200">
                    <Code2 size={23} />
                </div>

                <div>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-purple-600">
                        Step 03 · Candidate skills
                    </span>
                    <h2 className="mt-1 text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                        What skills matter most?
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Add the technologies and capabilities candidates should bring to this role.
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-violet-50 !p-4 sm:!p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <label
                        htmlFor="edit-skills"
                        className="flex items-center gap-2 text-sm font-extrabold text-gray-800"
                    >
                        <Tags size={17} className="text-purple-600" />
                        Required skills
                    </label>

                    <span className="rounded-full bg-white !px-3 !py-1 text-xs font-bold text-purple-700 shadow-sm">
                        {skills.length} added
                    </span>
                </div>

                <textarea
                    id="edit-skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Java, Spring Boot, MySQL, React, REST API..."
                    className="w-full resize-y rounded-xl border border-purple-100 bg-white !px-4 !py-4 text-sm leading-6 text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-50"
                />

                <p className="mt-2 text-xs leading-5 text-gray-400">
                    Separate each skill with a comma. Duplicate skills are displayed as entered.
                </p>
            </div>

            <div className="mt-6">
                <div className="mb-3 flex items-center gap-2">
                    <Sparkles size={17} className="text-amber-500" />
                    <h3 className="text-sm font-extrabold text-gray-800">
                        Popular skill suggestions
                    </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((skill) => {
                        const alreadyAdded = skills.some(
                            (existing) =>
                                existing.toLowerCase() === skill.toLowerCase()
                        );

                        return (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => addSuggestion(skill)}
                                disabled={alreadyAdded}
                                className={`inline-flex items-center gap-2 rounded-xl border !px-3 !py-2 text-xs font-bold transition ${
                                    alreadyAdded
                                        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                                }`}
                            >
                                {alreadyAdded ? (
                                    <CheckCircle2 size={14} />
                                ) : (
                                    <Plus size={14} />
                                )}
                                {skill}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 !p-4">
                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                        <Code2 size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-purple-900">
                            Your skills preview
                        </p>

                        {skills.length ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span
                                        key={`${skill}-${index}`}
                                        className="rounded-lg border border-purple-100 bg-white !px-3 !py-1.5 text-xs font-semibold text-purple-700"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-1 text-xs leading-5 text-purple-600">
                                Add skills above or select a suggestion to see your skill tags here.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillsStep;

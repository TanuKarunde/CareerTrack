
import {
    Code2,
    Sparkles,
    CheckCircle2,
    Lightbulb,
    Tags
} from "lucide-react";

const JobSkills = ({ formData, handleChange }) => {
    const skills = formData.skills
        ? formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [];

    const examples = [
        "Java",
        "Spring Boot",
        "MySQL",
        "REST API",
        "React",
        "Git"
    ];

    const addExample = (skill) => {
        const existing = skills.map((item) => item.toLowerCase());

        if (existing.includes(skill.toLowerCase())) return;

        const updatedSkills = [...skills, skill].join(", ");

        handleChange({
            target: {
                name: "skills",
                value: updatedSkills
            }
        });
    };

    return (
        <div className="!p-5 sm:!p-7 lg:!p-8">
            <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-200">
                    <Code2 size={23} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                            Required skills
                        </h2>
                        <span className="rounded-full bg-purple-50 !px-2.5 !py-1 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                            Step 03
                        </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Highlight the technical skills and tools candidates should know for this position.
                    </p>
                </div>
            </div>

            {/* Skill editor */}
            <section className="overflow-hidden rounded-2xl border border-purple-100">
                <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-purple-50 to-fuchsia-50 !px-4 !py-4 sm:!px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                            <Tags size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-gray-800">
                                Skill editor
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                                Add skills separated by commas
                            </p>
                        </div>
                    </div>

                    <span className="rounded-full border border-purple-100 bg-white !px-3 !py-1.5 text-xs font-bold text-purple-700">
                        {skills.length} {skills.length === 1 ? "skill" : "skills"}
                    </span>
                </div>

                <div className="!p-4 sm:!p-5">
                    <label htmlFor="skills" className="mb-2 block text-sm font-bold text-gray-700">
                        Technical skills
                    </label>

                    <textarea
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="Java, Spring Boot, Hibernate, MySQL, React, Git..."
                        rows={5}
                        className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50/70 !px-4 !py-4 text-sm leading-6 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                    />

                    <p className="mt-2 text-xs leading-5 text-gray-400">
                        Use commas between skills. These keywords help candidates understand the technical expectations of the role.
                    </p>
                </div>
            </section>

            {/* Live preview */}
            <section className="mt-5 rounded-2xl border border-gray-200 bg-white !p-4 sm:!p-5">
                <div className="mb-4 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <h3 className="text-sm font-extrabold text-gray-800">
                        Live skills preview
                    </h3>
                </div>

                {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <span
                                key={`${skill}-${index}`}
                                className="inline-flex items-center gap-2 rounded-xl border border-purple-100 bg-purple-50 !px-3 !py-2 text-sm font-semibold text-purple-800 transition hover:border-purple-300 hover:bg-purple-100"
                            >
                                <Code2 size={14} className="text-purple-500" />
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 !p-5 text-center">
                        <Code2 size={25} className="mx-auto text-gray-300" />
                        <p className="mt-2 text-sm font-semibold text-gray-500">
                            Your skills will appear here
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                            Add a few skills in the editor above to get started.
                        </p>
                    </div>
                )}
            </section>

            {/* Quick add */}
            <section className="mt-5 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white !p-4 sm:!p-5">
                <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-500 shadow-sm">
                        <Lightbulb size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-extrabold text-gray-800">
                            Need some inspiration?
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                            Select an example to add it to your skill list.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {examples.map((skill) => {
                        const added = skills.some(
                            (item) => item.toLowerCase() === skill.toLowerCase()
                        );

                        return (
                            <button
                                key={skill}
                                type="button"
                                disabled={added}
                                onClick={() => addExample(skill)}
                                className={`rounded-xl border !px-3 !py-2 text-xs font-bold transition ${
                                    added
                                        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                        : "border-purple-100 bg-white text-purple-700 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-sm"
                                }`}
                            >
                                {added ? "✓ " : "+ "}
                                {skill}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-purple-700">
                    <Sparkles size={15} className="mt-0.5 shrink-0" />
                    Choose only skills relevant to this job, rather than adding every available technology.
                </div>
            </section>
        </div>
    );
};

export default JobSkills;

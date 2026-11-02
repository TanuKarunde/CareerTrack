
import {
    Sparkles,
    Code2,
    Search,
    Layers3,
    CheckCircle2,
} from "lucide-react";
import { useMemo, useState } from "react";

const SkillsSection = ({ skills = [] }) => {
    const [search, setSearch] = useState("");

    const skillList = useMemo(() => {
        const normalized = (
            Array.isArray(skills)
                ? skills
                : typeof skills === "string"
                    ? skills.split(",")
                    : []
        )
            .map((skill) =>
                typeof skill === "string"
                    ? skill.trim()
                    : skill?.name || skill?.skillName || ""
            )
            .filter(Boolean);

        return [...new Set(normalized)];
    }, [skills]);

    const filteredSkills = skillList.filter((skill) =>
        skill.toLowerCase().includes(search.trim().toLowerCase())
    );

    return (
        <section className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
            {/* HEADER */}
            <div className="relative overflow-hidden border-b border-purple-100 bg-gradient-to-r from-purple-50 via-white to-fuchsia-50 !p-5 sm:!p-6">
                <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-fuchsia-100/60 blur-2xl pointer-events-none" />

                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-md shadow-purple-200">
                            <Sparkles size={20} />
                        </div>

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-600">
                                Candidate capabilities
                            </p>
                            <h2 className="mt-1 text-base font-bold text-gray-900">
                                Skills & Expertise
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">
                                Skills listed in the student's profile.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-purple-100 bg-white/90 !px-4 !py-3 shadow-sm">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <Layers3 size={17} />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400">Total skills</p>
                            <p className="text-xl font-bold leading-none text-purple-800">
                                {skillList.length}
                            </p>
                        </div>
                    </div>
                </div>

                {skillList.length > 0 && (
                    <div className="relative mt-5">
                        <div className="relative">
                            <Search
                                size={15}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search candidate skills..."
                                aria-label="Search candidate skills"
                                className="w-full rounded-xl border border-purple-100 bg-white !py-3 !pl-10 !pr-4 text-xs text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* SKILLS */}
            <div className="!p-5 sm:!p-6">
                {filteredSkills.length > 0 ? (
                    <>
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold text-gray-700">
                                {search ? "Search results" : "Skill collection"}
                            </p>
                            <span className="text-[10px] text-gray-400">
                                {filteredSkills.length} shown
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {filteredSkills.map((skill, index) => (
                                <div
                                    key={`${skill}-${index}`}
                                    className="group flex min-w-0 items-center gap-3 rounded-xl border border-purple-100 bg-white !p-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-purple-300 hover:bg-purple-50/40 hover:shadow-sm"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition group-hover:bg-purple-100">
                                        <Code2 size={16} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="break-words text-xs font-semibold text-gray-800">
                                            {skill}
                                        </p>
                                        <p className="mt-1 text-[9px] text-gray-400">
                                            Candidate skill
                                        </p>
                                    </div>

                                    <CheckCircle2
                                        size={15}
                                        className="shrink-0 text-purple-300 group-hover:text-purple-600"
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                ) : skillList.length > 0 ? (
                    <div className="rounded-xl border border-dashed border-purple-200 !px-5 !py-10 text-center">
                        <Search size={24} className="mx-auto text-gray-300" />
                        <p className="mt-3 text-sm font-semibold text-gray-700">
                            No matching skills
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                            Try another keyword.
                        </p>
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="mt-4 rounded-lg bg-purple-50 !px-3 !py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-purple-200 bg-[#fcfbff] !px-5 !py-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-300">
                            <Sparkles size={26} />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-gray-700">
                            Skills will appear here
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-gray-400">
                            The student has not added any skills to their profile yet.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SkillsSection;

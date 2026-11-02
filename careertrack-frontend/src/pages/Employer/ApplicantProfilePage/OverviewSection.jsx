
import {
    Briefcase,
    GraduationCap,
    MapPin,
    UserRound,
    Sparkles,
    Languages,
    School,
    Award,
    ArrowUpRight,
} from "lucide-react";

const OverviewSection = ({ student = {}, skills = [] }) => {
    const experience = student?.experience;

    const experiences = Array.isArray(experience)
        ? experience
        : experience && typeof experience === "object"
            ? [experience]
            : [];

    const experienceText =
        typeof experience === "string" && experience.trim()
            ? experience
            : experiences.length > 0
                ? experiences
                    .map((item) =>
                        [item.jobTitle, item.companyName]
                            .filter(Boolean)
                            .join(" at ")
                    )
                    .filter(Boolean)
                    .join(", ") || `${experiences.length} experience record(s)`
                : "No experience information provided";

    const skillList = (
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

    const hasCgpa =
        student.cgpa !== null &&
        student.cgpa !== undefined &&
        student.cgpa !== "";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* LEFT COLUMN */}
            <div className="space-y-5">
                {/* ABOUT */}
                <section className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-fuchsia-100/60 blur-2xl pointer-events-none" />

                    <div className="relative !p-5 sm:!p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                <UserRound size={18} />
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-purple-600">
                                    Introduction
                                </p>
                                <h2 className="mt-1 text-sm font-bold text-gray-900">
                                    About Student
                                </h2>
                            </div>
                        </div>

                        <p className="mt-4 whitespace-pre-line text-xs leading-6 text-gray-600">
                            {typeof student.bio === "string" && student.bio.trim()
                                ? student.bio
                                : "This candidate has not added a biography yet."}
                        </p>
                    </div>
                </section>

                {/* CANDIDATE DETAILS */}
                <section className="rounded-2xl border border-purple-100 bg-white shadow-sm !p-5 sm:!p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <MapPin size={18} />
                        </div>

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-purple-600">
                                Personal information
                            </p>
                            <h2 className="mt-1 text-sm font-bold text-gray-900">
                                Candidate Details
                            </h2>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3">
                        <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#fcfbff] !p-3.5">
                            <MapPin size={15} className="mt-0.5 shrink-0 text-purple-600" />
                            <div className="min-w-0">
                                <p className="text-[10px] text-gray-400">Location</p>
                                <p className="mt-1 break-words text-xs font-medium text-gray-700">
                                    {student.location || "Not provided"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#fcfbff] !p-3.5">
                            <Languages size={15} className="mt-0.5 shrink-0 text-purple-600" />
                            <div className="min-w-0">
                                <p className="text-[10px] text-gray-400">Languages</p>
                                <p className="mt-1 break-words text-xs font-medium text-gray-700">
                                    {typeof student.languages === "string" &&
                                    student.languages.trim()
                                        ? student.languages
                                        : "Not provided"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#fcfbff] !p-3.5">
                            <Briefcase size={15} className="mt-0.5 shrink-0 text-purple-600" />
                            <div className="min-w-0">
                                <p className="text-[10px] text-gray-400">Experience</p>
                                <p className="mt-1 break-words text-xs leading-5 font-medium text-gray-700">
                                    {experienceText}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* KEY SKILLS */}
                <section className="rounded-2xl border border-purple-100 bg-white shadow-sm !p-5 sm:!p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-600">
                                <Sparkles size={18} />
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-purple-600">
                                    Capabilities
                                </p>
                                <h2 className="mt-1 text-sm font-bold text-gray-900">
                                    Key Skills
                                </h2>
                            </div>
                        </div>

                        <span className="rounded-full bg-purple-50 !px-2.5 !py-1 text-[10px] font-bold text-purple-700">
                            {skillList.length}
                        </span>
                    </div>

                    {skillList.length > 0 ? (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {skillList.map((skill, index) => (
                                <span
                                    key={`${skill}-${index}`}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-white !px-3 !py-2 text-[10px] font-semibold text-purple-700 transition hover:border-purple-300 hover:shadow-sm"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-xs text-gray-400">
                            No skills provided by the student.
                        </p>
                    )}
                </section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5">
                {/* EDUCATION */}
                <section className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
                    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-purple-100/70 blur-2xl pointer-events-none" />

                    <div className="relative !p-5 sm:!p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                <GraduationCap size={19} />
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-purple-600">
                                    Academic profile
                                </p>
                                <h2 className="mt-1 text-sm font-bold text-gray-900">
                                    Education
                                </h2>
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 !p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                                    <School size={18} />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="break-words text-sm font-bold text-gray-900">
                                        {student.degree || "Course not provided"}
                                    </h3>
                                    <p className="mt-1 break-words text-xs font-medium text-purple-700">
                                        {student.branch || "Branch not provided"}
                                    </p>
                                    <p className="mt-2 break-words text-[11px] leading-5 text-gray-500">
                                        {student.college || "College not provided"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="rounded-xl border border-gray-100 !p-4">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <GraduationCap size={13} />
                                    <p className="text-[10px]">Graduation year</p>
                                </div>
                                <p className="mt-2 text-sm font-bold text-gray-800">
                                    {student.graduationYear || "Not provided"}
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-100 !p-4">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Award size={13} />
                                    <p className="text-[10px]">CGPA</p>
                                </div>
                                <p className="mt-2 text-sm font-bold text-gray-800">
                                    {hasCgpa ? student.cgpa : "Not provided"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* EXPERIENCE SNAPSHOT */}
                <section className="rounded-2xl border border-purple-100 bg-white shadow-sm !p-5 sm:!p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                            <Briefcase size={18} />
                        </div>

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-purple-600">
                                Career history
                            </p>
                            <h2 className="mt-1 text-sm font-bold text-gray-900">
                                Experience Snapshot
                            </h2>
                        </div>
                    </div>

                    {experiences.length > 0 ? (
                        <div className="mt-4 space-y-3">
                            {experiences.slice(0, 3).map((item, index) => (
                                <div
                                    key={item.id ?? index}
                                    className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#fcfbff] !p-3.5"
                                >
                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-purple-600 shadow-sm">
                                        <Briefcase size={14} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="break-words text-xs font-bold text-gray-800">
                                            {item.jobTitle || "Job title not provided"}
                                        </p>
                                        <p className="mt-1 break-words text-[10px] text-gray-500">
                                            {item.companyName || "Company not provided"}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {experiences.length > 3 && (
                                <p className="text-[10px] font-medium text-purple-600">
                                    +{experiences.length - 3} more experience records
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="mt-4 rounded-xl border border-dashed border-gray-200 !p-4">
                            <p className="text-xs text-gray-500">
                                {experienceText}
                            </p>
                        </div>
                    )}

                    <p className="mt-4 flex items-center gap-1.5 text-[10px] text-gray-400">
                        <ArrowUpRight size={12} />
                        View the Experience tab for full details.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default OverviewSection;

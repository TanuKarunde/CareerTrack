
import {
    Briefcase,
    Building2,
    MapPin,
    CalendarDays,
    Clock3,
    Sparkles,
} from "lucide-react";

const ExperienceSection = ({ student = {} }) => {
    const experience = student?.experience;

    const experiences = Array.isArray(experience)
        ? experience
        : experience && typeof experience === "object"
            ? [experience]
            : [];

    const experienceLevel =
        typeof experience === "string" ? experience.trim() : "";

    const hasExperience = experiences.length > 0 || Boolean(experienceLevel);

    return (
        <section className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 !p-5 sm:!p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-md shadow-purple-200">
                        <Briefcase size={20} />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-600">
                            Professional journey
                        </p>
                        <h2 className="mt-1 text-base font-bold text-gray-900">
                            Experience
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            Work history and professional experience.
                        </p>
                    </div>
                </div>

                {hasExperience && (
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50 !px-3 !py-1.5 text-[10px] font-semibold text-purple-700">
                        <Sparkles size={12} />
                        {experiences.length > 0
                            ? `${experiences.length} record${experiences.length === 1 ? "" : "s"}`
                            : "Experience level"}
                    </span>
                )}
            </div>

            <div className="!p-5 sm:!p-6">
                {experiences.length > 0 ? (
                    <div className="space-y-4">
                        {experiences.map((item, index) => (
                            <article
                                key={item.id ?? index}
                                className="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-white to-purple-50/70 !p-5 transition hover:border-purple-200 hover:shadow-sm"
                            >
                                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-500 to-fuchsia-400" />

                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-100 bg-white text-purple-600">
                                        <Briefcase size={18} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="break-words text-sm font-bold text-gray-900">
                                            {item.jobTitle || "Job title not provided"}
                                        </h3>

                                        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-purple-700">
                                            <Building2 size={13} className="shrink-0" />
                                            {item.companyName || "Company not provided"}
                                        </p>

                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {item.employmentType && (
                                                <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white !p-3">
                                                    <Clock3 size={14} className="shrink-0 text-purple-500" />
                                                    <span className="text-[10px] text-gray-600">
                                                        {item.employmentType}
                                                    </span>
                                                </div>
                                            )}

                                            {item.location && (
                                                <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white !p-3">
                                                    <MapPin size={14} className="shrink-0 text-purple-500" />
                                                    <span className="text-[10px] text-gray-600">
                                                        {item.location}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {(item.startDate || item.endDate || item.currentlyWorking) && (
                                            <div className="mt-3 flex items-start gap-2 text-[10px] text-gray-500">
                                                <CalendarDays size={13} className="mt-0.5 shrink-0 text-purple-500" />
                                                <span>
                                                    {item.startDate || "Start date unavailable"}
                                                    {" — "}
                                                    {item.currentlyWorking
                                                        ? "Present"
                                                        : item.endDate || "End date unavailable"}
                                                </span>
                                            </div>
                                        )}

                                        {item.description && (
                                            <div className="mt-4 border-t border-purple-100 pt-3">
                                                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                                    Responsibilities
                                                </p>
                                                <p className="whitespace-pre-line text-xs leading-6 text-gray-600">
                                                    {item.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : experienceLevel ? (
                    <div className="rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-white !p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                                <Briefcase size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500">
                                    Experience level
                                </p>
                                <p className="mt-1 text-sm font-bold text-gray-900">
                                    {experienceLevel}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-purple-200 bg-[#fcfbff] !px-6 !py-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-300">
                            <Briefcase size={26} />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-gray-700">
                            A fresh professional journey
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-gray-400">
                            No experience details have been added to this candidate's profile yet.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ExperienceSection;


import {
    BriefcaseBusiness,
    MapPin,
    Building2,
    Clock3,
    IndianRupee,
    Code2,
    Sparkles,
    CheckCircle2,
    FileText,
    TrendingUp,
    Eye
} from "lucide-react";

const formatJobType = (type) => {
    if (!type) return "Not specified";

    return type
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatCurrency = (value) => {
    if (value === "" || value === null || value === undefined) {
        return null;
    }

    return `₹${Number(value).toLocaleString("en-IN")}`;
};

const JobPreview = ({ formData }) => {
    const skills = formData.skills
        ? formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [];

    const salaryMin = formatCurrency(formData.salaryMin);
    const salaryMax = formatCurrency(formData.salaryMax);

    const salaryText = (() => {
        if (salaryMin && salaryMax) {
            return `${salaryMin} – ${salaryMax} / year`;
        }

        if (salaryMin) {
            return `From ${salaryMin} / year`;
        }

        if (salaryMax) {
            return `Up to ${salaryMax} / year`;
        }

        return "Not specified";
    })();

    const jobType = formatJobType(formData.jobtype);

    const details = [
        {
            label: "Company",
            value: formData.compony || "Not specified",
            icon: Building2
        },
        {
            label: "Location",
            value: formData.location || "Not specified",
            icon: MapPin
        },
        {
            label: "Employment type",
            value: jobType,
            icon: Clock3
        },
        {
            label: "Experience",
            value: formData.experienceLevel || "Not specified",
            icon: TrendingUp
        },
        {
            label: "Annual compensation",
            value: salaryText,
            icon: IndianRupee
        }
    ];

    const checklist = [
        {
            label: "Job title added",
            done: Boolean(formData.title.trim())
        },
        {
            label: "Company name added",
            done: Boolean(formData.compony.trim())
        },
        {
            label: "Job description added",
            done: Boolean(formData.description.trim())
        },
        {
            label: "Location selected",
            done: Boolean(formData.location.trim())
        },
        {
            label: "Skills included",
            done: skills.length > 0
        }
    ];

    const completedItems = checklist.filter((item) => item.done).length;

    return (
        <div className="!p-4 sm:!p-6 lg:!p-8">
            {/* Intro */}
            <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-200">
                    <Eye size={23} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                            Review your job
                        </h2>
                        <span className="rounded-full bg-purple-50 !px-2.5 !py-1 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                            Step 04
                        </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        This is how your job information is organized before you submit it.
                    </p>
                </div>
            </div>

            {/* JOB HERO */}
            <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#34206c] via-[#6436b7] to-[#9155e9] !p-5 text-white shadow-xl shadow-purple-200/50 sm:!p-7">
                <div className="pointer-events-none absolute -right-12 -top-14 h-48 w-48 rounded-full border-[28px] border-white/10" />
                <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-fuchsia-300/20 blur-2xl" />

                <div className="relative z-10">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-1.5 text-xs font-bold text-purple-50 backdrop-blur">
                            <Sparkles size={14} />
                            JOB POST PREVIEW
                        </span>

                        <span className="rounded-full border border-white/20 bg-white/10 !px-3 !py-1.5 text-xs font-semibold text-white/90">
                            Not published yet
                        </span>
                    </div>

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur-sm">
                            <BriefcaseBusiness size={30} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h1 className="break-words text-2xl font-black tracking-tight sm:text-3xl">
                                {formData.title || "Your job title"}
                            </h1>

                            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-purple-100">
                                <Building2 size={16} />
                                {formData.compony || "Your company name"}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 !px-3 !py-2 text-xs font-semibold text-white">
                                    <MapPin size={14} />
                                    {formData.location || "Location not set"}
                                </span>

                                <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 !px-3 !py-2 text-xs font-semibold text-white">
                                    <Clock3 size={14} />
                                    {jobType}
                                </span>

                                <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 !px-3 !py-2 text-xs font-semibold text-white">
                                    <IndianRupee size={14} />
                                    {salaryText}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT GRID */}
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.9fr)]">
                {/* LEFT COLUMN */}
                <div className="min-w-0 space-y-5">
                    {/* Description */}
                    <section className="rounded-2xl border border-gray-200 bg-white !p-5 transition hover:border-purple-200 sm:!p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                <FileText size={19} />
                            </div>

                            <div>
                                <h3 className="text-base font-extrabold text-gray-900">
                                    About the role
                                </h3>
                                <p className="mt-1 text-xs text-gray-400">
                                    Job description
                                </p>
                            </div>
                        </div>

                        {formData.description.trim() ? (
                            <p className="whitespace-pre-line break-words text-sm leading-7 text-gray-600">
                                {formData.description}
                            </p>
                        ) : (
                            <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 !p-4 text-sm text-gray-400">
                                Your job description will appear here.
                            </p>
                        )}
                    </section>

                    {/* Skills */}
                    <section className="rounded-2xl border border-gray-200 bg-white !p-5 transition hover:border-purple-200 sm:!p-6">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Code2 size={19} />
                                </div>

                                <div>
                                    <h3 className="text-base font-extrabold text-gray-900">
                                        Required skills
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Technical keywords
                                    </p>
                                </div>
                            </div>

                            <span className="rounded-full bg-purple-50 !px-3 !py-1.5 text-xs font-bold text-purple-700">
                                {skills.length} total
                            </span>
                        </div>

                        {skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span
                                        key={`${skill}-${index}`}
                                        className="inline-flex items-center gap-2 rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white !px-3 !py-2 text-sm font-semibold text-purple-800"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 !p-4 text-sm text-gray-400">
                                No skills added yet. Return to the Skills step to add some.
                            </div>
                        )}
                    </section>
                </div>

                {/* RIGHT COLUMN */}
                <div className="min-w-0 space-y-5">
                    {/* Job Details */}
                    <section className="rounded-2xl border border-gray-200 bg-white !p-5 sm:!p-6">
                        <div className="mb-5">
                            <h3 className="text-base font-extrabold text-gray-900">
                                Job details
                            </h3>
                            <p className="mt-1 text-xs text-gray-400">
                                At a glance
                            </p>
                        </div>

                        <div className="space-y-4">
                            {details.map((detail) => {
                                const Icon = detail.icon;

                                return (
                                    <div
                                        key={detail.label}
                                        className="flex min-w-0 items-start gap-3"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                            <Icon size={17} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-gray-400">
                                                {detail.label}
                                            </p>
                                            <p className="mt-1 break-words text-sm font-bold leading-5 text-gray-800">
                                                {detail.value}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Checklist */}
                    <section className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white !p-5 sm:!p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                                <CheckCircle2 size={19} />
                            </div>

                            <div>
                                <h3 className="text-sm font-extrabold text-gray-900">
                                    Publishing checklist
                                </h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    {completedItems} of {checklist.length} items completed
                                </p>
                            </div>
                        </div>

                        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-purple-100">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 transition-all"
                                style={{
                                    width: `${(completedItems / checklist.length) * 100}%`
                                }}
                            />
                        </div>

                        <div className="space-y-3">
                            {checklist.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center gap-2.5"
                                >
                                    <CheckCircle2
                                        size={16}
                                        className={
                                            item.done
                                                ? "shrink-0 text-emerald-500"
                                                : "shrink-0 text-gray-300"
                                        }
                                    />
                                    <span
                                        className={`text-xs font-medium ${
                                            item.done
                                                ? "text-gray-700"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Publish note */}
                    <section className="rounded-2xl border border-emerald-100 bg-emerald-50 !p-4">
                        <div className="flex items-start gap-3">
                            <Sparkles size={19} className="mt-0.5 shrink-0 text-emerald-600" />
                            <div>
                                <h3 className="text-sm font-extrabold text-emerald-900">
                                    Almost ready!
                                </h3>
                                <p className="mt-1 text-xs leading-5 text-emerald-800">
                                    When you're happy with the details, click Create Job below to submit your posting.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default JobPreview;

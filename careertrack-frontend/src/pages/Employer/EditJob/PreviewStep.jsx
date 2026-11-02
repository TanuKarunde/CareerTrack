
import {
    BriefcaseBusiness,
    MapPin,
    Building2,
    Clock3,
    IndianRupee,
    Code2,
    FileText,
    Sparkles,
    Users,
} from "lucide-react";

const formatJobType = (type) => {
    if (!type) return "Not specified";

    return type
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatSalary = (value) => {
    if (value === "" || value === null || value === undefined) {
        return null;
    }

    return Number(value).toLocaleString("en-IN");
};

const PreviewRow = ({ icon: Icon, label, value }) => (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-gray-100 bg-white !p-4 transition hover:border-purple-100 hover:shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-400">{label}</p>
            <p className="mt-1 break-words text-sm font-bold text-gray-800">
                {value || "Not specified"}
            </p>
        </div>
    </div>
);

const PreviewStep = ({ formData }) => {
    const skills = (formData.skills || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

    const minSalary = formatSalary(formData.salaryMin);
    const maxSalary = formatSalary(formData.salaryMax);

    const salaryText =
        minSalary || maxSalary
            ? `₹${minSalary || "—"} – ₹${maxSalary || "—"}`
            : "Not specified";

    return (
        <div>
            <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-violet-500 text-white shadow-lg shadow-purple-200">
                    <FileText size={23} />
                </div>

                <div>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-purple-600">
                        Step 04 · Final review
                    </span>
                    <h2 className="mt-1 text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                        Your job, ready to shine
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Review the details below before saving your changes.
                    </p>
                </div>
            </div>

            {/* Job listing preview */}
            <div className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#32106b] via-purple-700 to-violet-500 !p-5 text-white sm:!p-7">
                    <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border-[30px] border-white/10" />
                    <div className="pointer-events-none absolute bottom-0 right-28 h-24 w-24 rounded-full bg-fuchsia-300/15 blur-2xl" />

                    <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                        <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur">
                                <BriefcaseBusiness size={26} />
                            </div>

                            <div className="min-w-0">
                                <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-purple-100">
                                    Job opportunity
                                </p>
                                <h1 className="break-words text-2xl font-black leading-tight sm:text-3xl">
                                    {formData.title || "Your job title"}
                                </h1>
                                <p className="mt-2 flex items-center gap-2 text-sm text-purple-100">
                                    <Building2 size={16} />
                                    {formData.compony || "Company name"}
                                </p>
                            </div>
                        </div>

                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-2 text-xs font-bold text-white">
                            <Sparkles size={14} />
                            Preview mode
                        </span>
                    </div>

                    <div className="relative mt-6 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 !px-3 !py-2 text-xs font-semibold text-purple-50">
                            <MapPin size={15} />
                            {formData.location || "Location"}
                        </span>

                        <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 !px-3 !py-2 text-xs font-semibold text-purple-50">
                            <Clock3 size={15} />
                            {formatJobType(formData.jobtype)}
                        </span>

                        <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 !px-3 !py-2 text-xs font-semibold text-purple-50">
                            <Users size={15} />
                            {formData.experienceLevel || "Experience not specified"}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 !p-4 sm:!p-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="min-w-0 space-y-6">
                        <section>
                            <div className="mb-3 flex items-center gap-2">
                                <FileText size={18} className="text-purple-600" />
                                <h3 className="font-extrabold text-gray-900">
                                    About this role
                                </h3>
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 !p-4 sm:!p-5">
                                <p className="whitespace-pre-line break-words text-sm leading-7 text-gray-600">
                                    {formData.description ||
                                        "No job description has been added yet."}
                                </p>
                            </div>
                        </section>

                        <section>
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <Code2 size={18} className="text-purple-600" />
                                    <h3 className="font-extrabold text-gray-900">
                                        Skills & technologies
                                    </h3>
                                </div>

                                <span className="rounded-full bg-purple-50 !px-2.5 !py-1 text-xs font-bold text-purple-700">
                                    {skills.length}
                                </span>
                            </div>

                            <div className="rounded-2xl border border-purple-100 !p-4 sm:!p-5">
                                {skills.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <span
                                                key={`${skill}-${index}`}
                                                className="rounded-xl border border-purple-100 bg-purple-50 !px-3 !py-2 text-xs font-bold text-purple-700"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">
                                        No skills have been added.
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>

                    <aside className="min-w-0 space-y-3">
                        <div className="mb-2 flex items-center gap-2">
                            <BriefcaseBusiness size={18} className="text-purple-600" />
                            <h3 className="font-extrabold text-gray-900">
                                Job information
                            </h3>
                        </div>

                        <PreviewRow
                            icon={Building2}
                            label="Company"
                            value={formData.compony}
                        />

                        <PreviewRow
                            icon={MapPin}
                            label="Location"
                            value={formData.location}
                        />

                        <PreviewRow
                            icon={Clock3}
                            label="Employment type"
                            value={formatJobType(formData.jobtype)}
                        />

                        <PreviewRow
                            icon={Users}
                            label="Experience"
                            value={formData.experienceLevel}
                        />

                        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white !p-4">
                            <div className="flex items-center gap-2 text-emerald-700">
                                <IndianRupee size={18} />
                                <p className="text-xs font-bold uppercase tracking-wide">
                                    Salary range
                                </p>
                            </div>

                            <p className="mt-2 break-words text-lg font-black text-emerald-800">
                                {salaryText}
                            </p>
                            <p className="mt-1 text-xs text-emerald-700/70">
                                Annual salary · INR
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 !p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                    <Sparkles size={18} />
                </div>
                <div>
                    <p className="text-sm font-extrabold text-amber-900">
                        Ready to save your changes?
                    </p>
                    <p className="mt-1 text-xs leading-5 text-amber-800">
                        Check the job title, description, skills, and salary. Use the Back button to make changes, or select Save Changes below.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PreviewStep;

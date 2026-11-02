
import { useState } from "react";
import {
    BriefcaseBusiness,
    MapPin,
    Clock3,
    Users,
    ChevronRight,
    ChevronLeft,
    Check,
    RotateCcw,
    Save,
    Sparkles,
    CircleDollarSign,
    FileText,
    Code2,
} from "lucide-react";

import JobBasicInfo from "./JobBasicInfo";
import JobRequirement from "./JobRequirement";
import SkillsStep from "./SkillsStep";
import PreviewStep from "./PreviewStep";

const STEPS = [
    { number: 1, title: "Basic Info", subtitle: "Role essentials", icon: BriefcaseBusiness },
    { number: 2, title: "Requirements", subtitle: "Role details", icon: FileText },
    { number: 3, title: "Skills", subtitle: "What you need", icon: Code2 },
    { number: 4, title: "Preview", subtitle: "Final review", icon: Check },
];

const getInitialFormData = (data = {}) => ({
    title: data.title || "",
    compony: data.compony || data.company || "",
    description: data.description || "",
    location: data.location || "",
    jobtype: data.jobtype || data.jobType || "",
    experienceLevel: data.experienceLevel || "",
    skills: Array.isArray(data.skills)
        ? data.skills.join(", ")
        : data.skills || "",
    salaryMin: data.salaryMin ?? "",
    salaryMax: data.salaryMax ?? "",
});

const EditJobForm = ({ initialData, onSubmit, loading }) => {
    const [formData, setFormData] = useState(() =>
        getInitialFormData(initialData)
    );
    const [currentStep, setCurrentStep] = useState(1);
    const [saveStatus, setSaveStatus] = useState("idle");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setSaveStatus("idle");
    };

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep((previous) => previous + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1 && !loading) {
            setCurrentStep((previous) => previous - 1);
        }
    };

    const handleReset = () => {
        if (loading) return;

        setFormData(getInitialFormData(initialData));
        setCurrentStep(1);
        setSaveStatus("idle");
    };

    const handleSubmit = async () => {
        if (currentStep !== 4 || loading || saveStatus === "saving") {
            return;
        }

        setSaveStatus("saving");

        const payload = {
            ...formData,
            salaryMin:
                formData.salaryMin === ""
                    ? null
                    : Number(formData.salaryMin),
            salaryMax:
                formData.salaryMax === ""
                    ? null
                    : Number(formData.salaryMax),
        };

        try {
            const result = await onSubmit(payload);
            setSaveStatus(result === true ? "saved" : "idle");
        } catch (error) {
            console.error("UPDATE JOB ERROR:", error);
            setSaveStatus("idle");
        }
    };

    return (
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_310px] 2xl:grid-cols-[minmax(0,1fr)_340px]">
            <section className="min-w-0 overflow-hidden rounded-[26px] border border-purple-100/80 bg-white shadow-xl shadow-purple-100/40">
                {/* Stepper */}
                <div className="border-b border-purple-50 bg-gradient-to-r from-white via-purple-50/60 to-white !px-4 !py-6 sm:!px-7">
                    <div className="mb-6 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600">
                                Job editor
                            </p>
                            <h2 className="mt-1 text-lg font-extrabold text-gray-900 sm:text-xl">
                                Build a better job post
                            </h2>
                        </div>

                        <div className="rounded-xl border border-purple-100 bg-white !px-3 !py-2 text-right shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Progress
                            </p>
                            <p className="text-sm font-extrabold text-purple-700">
                                {Math.round((currentStep / 4) * 100)}%
                            </p>
                        </div>
                    </div>

                    <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-purple-100">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-700 via-violet-500 to-fuchsia-400 transition-all duration-500"
                            style={{ width: `${(currentStep / 4) * 100}%` }}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                        {STEPS.map((step) => {
                            const Icon = step.icon;
                            const active = currentStep === step.number;
                            const completed = currentStep > step.number;

                            return (
                                <button
                                    type="button"
                                    key={step.number}
                                    onClick={() => {
                                        if (!loading && step.number < currentStep) {
                                            setCurrentStep(step.number);
                                        }
                                    }}
                                    disabled={loading}
                                    className={`group min-w-0 rounded-2xl !px-2 !py-3 text-left transition sm:!px-3 ${
                                        active
                                            ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                                            : completed
                                            ? "bg-purple-50 text-purple-800"
                                            : "bg-white text-gray-400 hover:bg-purple-50"
                                    }`}
                                >
                                    <div className="flex flex-col items-center gap-2 sm:flex-row">
                                        <span
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                                active
                                                    ? "bg-white/15"
                                                    : completed
                                                    ? "bg-purple-100"
                                                    : "bg-gray-100 group-hover:bg-purple-100"
                                            }`}
                                        >
                                            {completed ? (
                                                <Check size={17} />
                                            ) : (
                                                <Icon size={17} />
                                            )}
                                        </span>

                                        <span className="min-w-0">
                                            <span className="block text-center text-[10px] font-bold uppercase tracking-wider opacity-75 sm:text-left">
                                                Step {step.number}
                                            </span>
                                            <span className="mt-0.5 block truncate text-[11px] font-bold sm:text-sm">
                                                {step.title}
                                            </span>
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Form step */}
                <div className="!p-4 sm:!p-7 lg:!p-8">
                    {currentStep === 1 && (
                        <JobBasicInfo
                            formData={formData}
                            handleChange={handleChange}
                        />
                    )}

                    {currentStep === 2 && (
                        <JobRequirement
                            formData={formData}
                            handleChange={handleChange}
                        />
                    )}

                    {currentStep === 3 && (
                        <SkillsStep
                            formData={formData}
                            handleChange={handleChange}
                        />
                    )}

                    {currentStep === 4 && (
                        <PreviewStep formData={formData} />
                    )}
                </div>

                {/* Footer actions */}
                <div className="border-t border-gray-100 bg-gray-50/70 !px-4 !py-5 sm:!px-7">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={currentStep === 1 || loading}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white !px-4 !py-3 text-sm font-bold text-gray-600 transition hover:border-purple-200 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={17} />
                            Back
                        </button>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={loading}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white !px-3 !py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50 sm:!px-4"
                            >
                                <RotateCcw size={15} />
                                <span className="hidden sm:inline">Reset</span>
                            </button>

                            {currentStep < 4 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-violet-600 !px-5 !py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 sm:!px-6"
                                >
                                    Continue
                                    <ChevronRight size={17} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading || saveStatus === "saving"}
                                    className={`inline-flex items-center gap-2 rounded-xl !px-5 !py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 sm:!px-6 ${
                                        saveStatus === "saved"
                                            ? "bg-emerald-600 shadow-emerald-100"
                                            : "bg-gradient-to-r from-purple-700 to-violet-600 shadow-purple-200 hover:shadow-xl"
                                    }`}
                                >
                                    {saveStatus === "saving" ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Saving...
                                        </>
                                    ) : saveStatus === "saved" ? (
                                        <>
                                            <Check size={17} />
                                            Saved
                                        </>
                                    ) : (
                                        <>
                                            <Save size={17} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="mt-4 text-right text-xs text-gray-400">
                        {currentStep === 4
                            ? "Review everything before saving."
                            : `Step ${currentStep} of 4 · Your changes stay here while you edit.`}
                    </p>
                </div>
            </section>

            <aside className="min-w-0 xl:sticky xl:top-6">
                <CurrentDetails formData={formData} />
            </aside>
        </div>
    );
};

const CurrentDetails = ({ formData }) => {
    const jobType = (formData.jobtype || "")
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

    const skills = (formData.skills || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

    const details = [
        {
            icon: BriefcaseBusiness,
            label: "Job title",
            value: formData.title,
        },
        {
            icon: Clock3,
            label: "Job type",
            value: jobType,
        },
        {
            icon: Users,
            label: "Experience",
            value: formData.experienceLevel,
        },
        {
            icon: MapPin,
            label: "Location",
            value: formData.location,
        },
    ];

    return (
        <div className="overflow-hidden rounded-[26px] border border-purple-100 bg-white shadow-xl shadow-purple-100/40">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#32106b] to-violet-600 !p-5 text-white">
                <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full border-[18px] border-white/10" />

                <div className="relative flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                        <Sparkles size={21} />
                    </div>
                    <div>
                        <h3 className="font-extrabold">Live job snapshot</h3>
                        <p className="mt-1 text-xs text-purple-100">
                            Updates as you edit
                        </p>
                    </div>
                </div>

                <div className="relative mt-5 rounded-2xl border border-white/15 bg-white/10 !p-4 backdrop-blur">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-100">
                        Position
                    </p>
                    <p className="mt-2 break-words text-lg font-extrabold leading-snug">
                        {formData.title || "Your job title"}
                    </p>
                    <p className="mt-1 truncate text-sm text-purple-100">
                        {formData.compony || "Company name"}
                    </p>
                </div>
            </div>

            <div className="!p-5">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-gray-900">
                        Posting details
                    </h3>
                    <span className="rounded-full bg-purple-50 !px-2.5 !py-1 text-[10px] font-bold text-purple-700">
                        LIVE
                    </span>
                </div>

                <div className="space-y-5">
                    {details.map(({ icon: Icon, label, value }) => (
                        <div className="flex items-start gap-3" key={label}>
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                <Icon size={18} />
                            </div>
                            <div className="min-w-0 flex-1 pt-0.5">
                                <p className="text-xs font-medium text-gray-400">
                                    {label}
                                </p>
                                <p className="mt-1 break-words text-sm font-bold text-gray-700">
                                    {value || "Not specified"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 !p-4">
                    <div className="flex items-center gap-2 text-emerald-700">
                        <CircleDollarSign size={18} />
                        <p className="text-xs font-bold uppercase tracking-wide">
                            Salary range
                        </p>
                    </div>
                    <p className="mt-2 text-base font-extrabold text-emerald-800">
                        {formData.salaryMin !== "" || formData.salaryMax !== ""
                            ? `₹${formData.salaryMin ? Number(formData.salaryMin).toLocaleString("en-IN") : "—"} – ₹${formData.salaryMax ? Number(formData.salaryMax).toLocaleString("en-IN") : "—"}`
                            : "Not specified"}
                    </p>
                </div>

                <div className="mt-5">
                    <div className="mb-3 flex items-center gap-2">
                        <Code2 size={16} className="text-purple-600" />
                        <h4 className="text-sm font-bold text-gray-800">
                            Skills added
                        </h4>
                        <span className="ml-auto rounded-full bg-gray-100 !px-2 !py-0.5 text-xs font-bold text-gray-600">
                            {skills.length}
                        </span>
                    </div>

                    {skills.length ? (
                        <div className="flex flex-wrap gap-2">
                            {skills.slice(0, 8).map((skill, index) => (
                                <span
                                    key={`${skill}-${index}`}
                                    className="max-w-full break-words rounded-lg border border-purple-100 bg-purple-50 !px-2.5 !py-1.5 text-xs font-semibold text-purple-700"
                                >
                                    {skill}
                                </span>
                            ))}
                            {skills.length > 8 && (
                                <span className="rounded-lg bg-gray-100 !px-2.5 !py-1.5 text-xs font-bold text-gray-500">
                                    +{skills.length - 8} more
                                </span>
                            )}
                        </div>
                    ) : (
                        <p className="rounded-xl border border-dashed border-gray-200 !p-3 text-xs leading-5 text-gray-400">
                            Your added skills will appear here.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditJobForm;

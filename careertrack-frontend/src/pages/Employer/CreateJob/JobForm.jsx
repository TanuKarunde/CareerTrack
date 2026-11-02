
import { useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CircleCheck,
    Code2,
    Eye,
    FileText,
    ListChecks,
    Sparkles
} from "lucide-react";

import JobBasicInfo from "./JobBasicInfo";
import JobRequirements from "./JobRequirements";
import JobSkills from "./JobSkills";
import JobPreview from "./JobPreview";

const steps = [
    {
        id: 1,
        title: "Basic Info",
        subtitle: "The essentials",
        icon: FileText
    },
    {
        id: 2,
        title: "Requirements",
        subtitle: "Experience & salary",
        icon: ListChecks
    },
    {
        id: 3,
        title: "Skills",
        subtitle: "What candidates need",
        icon: Code2
    },
    {
        id: 4,
        title: "Preview",
        subtitle: "Review your post",
        icon: Eye
    }
];

const JobForm = ({
    formData,
    handleChange,
    handleSubmit,
    loading
}) => {
    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = () => {
        setCurrentStep((previous) => Math.min(previous + 1, 4));
    };

    const previousStep = () => {
        setCurrentStep((previous) => Math.max(previous - 1, 1));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (loading) return;

        if (currentStep < 4) {
            nextStep();
            return;
        }

        handleSubmit();
    };

    const ActiveIcon = steps[currentStep - 1].icon;

    return (
        <form onSubmit={handleFormSubmit} className="min-w-0">
            {/* STEP NAVIGATION */}
            <section className="mb-5 overflow-hidden rounded-[24px] border border-purple-100 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-gray-100 !px-5 !py-5 sm:flex-row sm:items-center sm:justify-between sm:!px-7">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                            <ActiveIcon size={21} />
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                                STEP {currentStep} OF {steps.length}
                            </p>
                            <h3 className="mt-1 text-lg font-extrabold text-gray-900">
                                {steps[currentStep - 1].title}
                            </h3>
                        </div>
                    </div>

                    <div className="sm:text-right">
                        <p className="text-sm font-semibold text-gray-700">
                            {Math.round((currentStep / steps.length) * 100)}% through
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                            {currentStep === 4
                                ? "Ready for your final review"
                                : "Complete each step to publish"}
                        </p>
                    </div>
                </div>

                <div className="!px-5 !py-5 sm:!px-7">
                    {/* Progress bar */}
                    <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-purple-50">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 transition-all duration-500"
                            style={{
                                width: `${(currentStep / steps.length) * 100}%`
                            }}
                        />
                    </div>

                    {/* Desktop stepper */}
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                        {steps.map((step) => {
                            const Icon = step.icon;
                            const active = currentStep === step.id;
                            const completed = currentStep > step.id;

                            return (
                                <button
                                    key={step.id}
                                    type="button"
                                    disabled={loading || step.id > currentStep}
                                    onClick={() => {
                                        if (step.id < currentStep) {
                                            setCurrentStep(step.id);
                                        }
                                    }}
                                    className={`group min-w-0 rounded-2xl border !p-2.5 text-left transition-all duration-200 sm:!p-3 ${
                                        active
                                            ? "border-purple-300 bg-purple-50 shadow-sm shadow-purple-100"
                                            : completed
                                                ? "border-emerald-100 bg-emerald-50/60"
                                                : "border-transparent bg-gray-50"
                                    } ${
                                        step.id < currentStep
                                            ? "cursor-pointer hover:border-purple-200"
                                            : step.id > currentStep
                                                ? "cursor-not-allowed"
                                                : ""
                                    }`}
                                >
                                    <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
                                        <span
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                                                active
                                                    ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                                                    : completed
                                                        ? "bg-emerald-500 text-white"
                                                        : "bg-white text-gray-400 ring-1 ring-gray-200"
                                            }`}
                                        >
                                            {completed ? (
                                                <Check size={17} />
                                            ) : (
                                                <Icon size={17} />
                                            )}
                                        </span>

                                        <span className="min-w-0 text-center sm:text-left">
                                            <span
                                                className={`block truncate text-[11px] font-bold sm:text-sm ${
                                                    active
                                                        ? "text-purple-800"
                                                        : completed
                                                            ? "text-emerald-700"
                                                            : "text-gray-500"
                                                }`}
                                            >
                                                {step.title}
                                            </span>
                                            <span className="mt-1 hidden text-[10px] text-gray-400 lg:block">
                                                {step.subtitle}
                                            </span>
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* STEP CONTENT */}
            <section className="overflow-hidden rounded-[26px] border border-purple-100 bg-white shadow-sm shadow-purple-100/40">
                {currentStep === 1 && (
                    <JobBasicInfo
                        formData={formData}
                        handleChange={handleChange}
                    />
                )}

                {currentStep === 2 && (
                    <JobRequirements
                        formData={formData}
                        handleChange={handleChange}
                    />
                )}

                {currentStep === 3 && (
                    <JobSkills
                        formData={formData}
                        handleChange={handleChange}
                    />
                )}

                {currentStep === 4 && (
                    <JobPreview formData={formData} />
                )}
            </section>

            {/* ACTION BAR */}
            <section className="mt-5 rounded-[22px] border border-purple-100 bg-white !p-4 shadow-sm sm:!p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={previousStep}
                        disabled={currentStep === 1 || loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 !px-5 !py-3 text-sm font-bold text-gray-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ArrowLeft size={17} />
                        Back
                    </button>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            disabled={loading}
                            className="rounded-xl border border-gray-200 !px-5 !py-3 text-sm font-bold text-gray-500 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        {currentStep < 4 ? (
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 !px-6 !py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-200"
                            >
                                Continue
                                <ArrowRight size={17} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 !px-6 !py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={17} />
                                        Create Job
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {currentStep === 4 && (
                    <div className="mt-4 flex items-start gap-2 border-t border-gray-100 pt-4 text-xs leading-5 text-gray-400">
                        <CircleCheck size={15} className="mt-0.5 shrink-0 text-purple-500" />
                        Review the job details carefully before publishing.
                    </div>
                )}
            </section>
        </form>
    );
};

export default JobForm;

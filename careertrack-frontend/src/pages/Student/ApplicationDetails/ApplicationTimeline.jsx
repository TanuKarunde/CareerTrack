
import {
    Check,
    ClipboardCheck,
    Users,
    Flag,
    CircleX,
    Sparkles
} from "lucide-react";

const stages = [
    { label: "Applied", value: "APPLIED", Icon: Check },
    { label: "Reviewed", value: "SHORTLISTED", Icon: ClipboardCheck },
    { label: "Interview", value: "INTERVIEW", Icon: Users },
    { label: "Decision", value: "SELECTED", Icon: Flag }
];

const formatDate = (date) => {
    if (!date) return null;

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return null;

    return parsed.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
};

const getStageDate = (application, stage) => {
    const dateFields = {
        APPLIED: application.appliedAt,
        SHORTLISTED: application.shortlistedAt,
        INTERVIEW: application.interviewAt,
        SELECTED: application.selectedAt
    };

    return formatDate(dateFields[stage]);
};

const ApplicationTimeline = ({ application }) => {
    if (!application) return null;

    const status = application.status?.toUpperCase();
    const rejected = status === "REJECTED";

    const statusIndexes = {
        APPLIED: 0,
        SHORTLISTED: 1,
        INTERVIEW: 2,
        SELECTED: 3
    };

    const currentIndex = statusIndexes[status] ?? 0;
    const progress = rejected ? 0 : (currentIndex / (stages.length - 1)) * 100;

    const currentLabel = rejected
        ? "Application closed"
        : stages[currentIndex]?.label || "Applied";

    const description = {
        APPLIED: "Your application has been submitted successfully.",
        SHORTLISTED: "Your profile has progressed to the shortlist stage.",
        INTERVIEW: "Your application has reached the interview stage.",
        SELECTED: "Congratulations! You have been selected.",
        REJECTED: "This application has been closed. Keep going—another opportunity may be waiting."
    };

    return (
        <section className="overflow-hidden rounded-[28px] border border-purple-100 bg-white !p-5 shadow-[0_8px_35px_rgba(76,29,149,0.05)] sm:p-7 lg:p-8">
            {/* Heading */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                            <Sparkles size={18} />
                        </span>
                        <h2 className="text-xl font-extrabold tracking-tight text-[#211936] sm:text-2xl">
                            Application Progress
                        </h2>
                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                        {rejected
                            ? "Your application journey has ended."
                            : "Every milestone brings you closer to your next opportunity."}
                    </p>
                </div>

                {!rejected && (
                    <span className="rounded-xl bg-purple-50 !px-3 !py-2 text-xs font-bold text-purple-700">
                        Step {currentIndex + 1} of {stages.length}
                    </span>
                )}
            </div>

            {/* Progress bar */}
            {!rejected && (
                <div className="mt-7">
                    <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-500">
                            Overall progress
                        </span>
                        <span className="font-bold text-purple-700">
                            {Math.round((currentIndex + 1) / stages.length * 100)}%
                        </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#EEEAF6]">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-500 transition-all duration-500"
                            style={{
                                width: `${((currentIndex + 1) / stages.length) * 100}%`
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Horizontal timeline */}
            <div className="mt-8">
                {rejected ? (
                    <div className="flex items-start gap-4 rounded-2xl border border-red-100 bg-red-50/70 !p-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                            <CircleX size={23} />
                        </div>
                        <div>
                            <p className="font-bold text-red-700">
                                Application not selected
                            </p>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                {description.REJECTED}
                            </p>
                            {formatDate(application.rejectedAt) && (
                                <p className="mt-2 text-xs font-medium text-red-600">
                                    Updated {formatDate(application.rejectedAt)}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-4">
                        {stages.map((stage, index) => {
                            const completed = index < currentIndex;
                            const current = index === currentIndex;
                            const reached = index <= currentIndex;
                            const Icon = stage.Icon;

                            return (
                                <div
                                    key={stage.value}
                                    className="relative flex min-w-0 flex-col items-center text-center"
                                >
                                    {/* Connector */}
                                    {index < stages.length - 1 && (
                                        <div
                                            className={`absolute left-1/2 top-[21px] h-[3px] w-full ${
                                                index < currentIndex
                                                    ? "bg-purple-500"
                                                    : "bg-[#E9E5F1]"
                                            }`}
                                        />
                                    )}

                                    {/* Milestone icon */}
                                    <div
                                        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition sm:h-12 sm:w-12 ${
                                            current
                                                ? "bg-gradient-to-br from-violet-500 to-purple-700 text-white ring-4 ring-purple-100 shadow-lg shadow-purple-200"
                                                : completed
                                                ? "bg-purple-600 text-white"
                                                : "border-2 border-[#E5E0EF] bg-[#F5F3F9] text-gray-400"
                                        }`}
                                    >
                                        <Icon size={current ? 21 : 18} />
                                    </div>

                                    <p
                                        className={`mt-3 text-[11px] font-bold sm:text-sm ${
                                            reached
                                                ? "text-[#29213D]"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {stage.label}
                                    </p>

                                    <p className="mt-1 min-h-8 text-[10px] leading-4 text-gray-500 sm:text-xs">
                                        {completed || current
                                            ? getStageDate(application, stage.value) ||
                                              (current ? "Current stage" : "Completed")
                                            : "Pending"}
                                    </p>

                                    {current && (
                                        <span className="mt-1 rounded-full bg-purple-100 !px-2 !py-1 text-[9px] font-bold text-purple-700 sm:text-[10px]">
                                            CURRENT
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Current status message */}
            <div
                className={`mt-7 flex items-start gap-3 rounded-2xl !p-4 ${
                    rejected
                        ? "bg-red-50"
                        : status === "SELECTED"
                        ? "bg-emerald-50"
                        : "bg-gradient-to-r from-[#F5F0FF] to-[#FAF7FF]"
                }`}
            >
                <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        rejected
                            ? "bg-red-100 text-red-600"
                            : status === "SELECTED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-white text-purple-700 shadow-sm"
                    }`}
                >
                    <Sparkles size={16} />
                </span>

                <div>
                    <p className="text-sm font-bold text-[#35264F]">
                        {rejected
                            ? "Keep moving forward"
                            : status === "SELECTED"
                            ? "A great milestone!"
                            : `Current stage: ${currentLabel}`}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-600 sm:text-sm">
                        {description[status] || description.APPLIED}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ApplicationTimeline;

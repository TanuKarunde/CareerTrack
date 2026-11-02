
import {
    CalendarDays,
    FileText,
    Building2,
    BriefcaseBusiness,
    MapPin,
    Lightbulb,
    ArrowRight,
    CheckCircle2,
    CircleX
} from "lucide-react";

const formatDate = (date) => {
    if (!date) return "Not available";

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "Not available";

    return parsed.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
};

const ApplicationInformation = ({ application, job }) => {
    if (!application) return null;

    const title =
        job?.title ||
        application.job?.title ||
        application.jobTitle ||
        application.title ||
        "Not available";

    const company =
        job?.company ||
        job?.compony ||
        application.job?.company ||
        application.job?.compony ||
        application.company ||
        application.compony ||
        "Not available";

    const location =
        job?.location ||
        application.job?.location ||
        application.location ||
        "Not available";

    const status = application.status?.toUpperCase();

    const nextStep = {
        APPLIED: {
            title: "What happens next?",
            message: "Your application is submitted. Keep an eye on your notifications and email for updates.",
            Icon: Lightbulb,
            style: "bg-purple-50 text-purple-700"
        },
        SHORTLISTED: {
            title: "Get interview-ready",
            message: "Your profile has been shortlisted. Review the job requirements and prepare relevant examples.",
            Icon: Lightbulb,
            style: "bg-purple-50 text-purple-700"
        },
        INTERVIEW: {
            title: "Prepare for your interview",
            message: "Check your email and notifications for interview scheduling and instructions.",
            Icon: Lightbulb,
            style: "bg-purple-50 text-purple-700"
        },
        SELECTED: {
            title: "Congratulations!",
            message: "You've been selected. Check your email for the next steps from the employer.",
            Icon: CheckCircle2,
            style: "bg-emerald-50 text-emerald-700"
        },
        REJECTED: {
            title: "Your next opportunity awaits",
            message: "This application has closed. Continue exploring suitable roles on CareerTrack.",
            Icon: CircleX,
            style: "bg-red-50 text-red-700"
        }
    };

    const tip = nextStep[status] || nextStep.APPLIED;
    const TipIcon = tip.Icon;

    const details = [
        {
            label: "Applied on",
            value: formatDate(application.appliedAt),
            Icon: CalendarDays
        },
        {
            label: "Application ID",
            value: application.id ?? application.applicationId ?? "Not available",
            Icon: FileText
        },
        {
            label: "Current status",
            value: status
                ? status.charAt(0) + status.slice(1).toLowerCase()
                : "Not available",
            Icon: CheckCircle2,
            highlight: true
        },
        {
            label: "Job role",
            value: title,
            Icon: BriefcaseBusiness
        },
        {
            label: "Company",
            value: company,
            Icon: Building2
        },
        {
            label: "Location",
            value: location,
            Icon: MapPin
        }
    ];

    return (
        <aside className="flex min-w-0 flex-col rounded-[28px] border border-purple-100 bg-white !p-5 shadow-[0_8px_35px_rgba(76,29,149,0.05)] sm:p-7">
            <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-100 bg-white text-purple-700 shadow-sm">
                    <BriefcaseBusiness size={21} />
                </span>
                <div>
                    <h2 className="text-lg font-extrabold text-[#211936] sm:text-xl">
                        Application Information
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500">
                        Your application at a glance
                    </p>
                </div>
            </div>

            <div className="mt-6 space-y-5">
                {details.map(({ label, value, Icon, highlight }) => (
                    <div key={label} className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F0FC] text-purple-600">
                            <Icon size={18} />
                        </span>

                        <div className="min-w-0 flex-1 pt-0.5">
                            <p className="text-xs text-gray-500">{label}</p>

                            {highlight ? (
                                <span className="mt-1 inline-flex rounded-full bg-purple-100 !px-2.5 !py-1 text-xs font-bold text-purple-700">
                                    {value}
                                </span>
                            ) : (
                                <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                                    {value}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Next step */}
            <div className={`mt-7 rounded-2xl !p-4 ${tip.style}`}>
                <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80">
                        <TipIcon size={18} />
                    </span>

                    <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold">{tip.title}</h3>
                        <p className="mt-2 text-xs leading-5 opacity-90">
                            {tip.message}
                        </p>

                        {status !== "REJECTED" && status !== "SELECTED" && (
                            <div className="mt-3 flex items-center gap-1 text-xs font-bold">
                                Stay prepared
                                <ArrowRight size={14} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default ApplicationInformation;

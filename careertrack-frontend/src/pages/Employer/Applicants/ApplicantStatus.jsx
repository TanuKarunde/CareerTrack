import {
    CircleCheck,
    Clock3,
    UserCheck,
    CalendarClock,
    XCircle,
    CircleDot,
} from "lucide-react";

const ApplicantStatus = ({ status }) => {
    const normalizedStatus = (status || "APPLIED").toUpperCase();

    const statusConfig = {
        APPLIED: {
            label: "Applied",
            style: "border-sky-100 bg-sky-50 text-sky-700",
            icon: Clock3,
        },
        SHORTLISTED: {
            label: "Shortlisted",
            style: "border-emerald-100 bg-emerald-50 text-emerald-700",
            icon: UserCheck,
        },
        INTERVIEW: {
            label: "Interview",
            style: "border-amber-100 bg-amber-50 text-amber-700",
            icon: CalendarClock,
        },
        SELECTED: {
            label: "Selected",
            style: "border-purple-100 bg-purple-50 text-purple-700",
            icon: CircleCheck,
        },
        REJECTED: {
            label: "Rejected",
            style: "border-rose-100 bg-rose-50 text-rose-700",
            icon: XCircle,
        },
    };

    const config = statusConfig[normalizedStatus] || {
        label: status || "Unknown",
        style: "border-gray-200 bg-gray-50 text-gray-600",
        icon: CircleDot,
    };

    const Icon = config.icon;

    return (
        <span
            className={`
                inline-flex max-w-full items-center gap-1.5
                rounded-full border !px-3 !py-1.5
                text-[10px] font-bold whitespace-nowrap
                ${config.style}
            `}
        >
            <Icon size={12} className="shrink-0" />
            {config.label}
        </span>
    );
};

export default ApplicantStatus;
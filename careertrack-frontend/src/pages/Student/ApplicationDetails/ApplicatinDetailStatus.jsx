
import {
    CheckCircle2,
    Clock3,
    CalendarCheck,
    CircleX,
    CircleCheck
} from "lucide-react";

const ApplicationDetailStatus = ({ status }) => {
    const styles = {
        APPLIED: {
            label: "Applied",
            className: "border-blue-200 bg-blue-50 text-blue-700",
            dot: "bg-blue-500",
            Icon: Clock3
        },
        SHORTLISTED: {
            label: "Shortlisted",
            className: "border-emerald-200 bg-emerald-50 text-emerald-700",
            dot: "bg-emerald-500",
            Icon: CheckCircle2
        },
        INTERVIEW: {
            label: "Interview",
            className: "border-purple-200 bg-purple-50 text-purple-700",
            dot: "bg-purple-500",
            Icon: CalendarCheck
        },
        SELECTED: {
            label: "Selected",
            className: "border-green-200 bg-green-50 text-green-700",
            dot: "bg-green-500",
            Icon: CircleCheck
        },
        REJECTED: {
            label: "Not selected",
            className: "border-red-200 bg-red-50 text-red-700",
            dot: "bg-red-500",
            Icon: CircleX
        }
    };

    const normalizedStatus = status?.toUpperCase();
    const config = styles[normalizedStatus] || {
        label: status || "Pending",
        className: "border-gray-200 bg-gray-50 text-gray-600",
        dot: "bg-gray-400",
        Icon: Clock3
    };

    const Icon = config.Icon;

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full border !px-4 !py-2 text-sm font-semibold shadow-sm ${config.className}`}
        >
            <Icon size={16} />
            {config.label}
        </span>
    );
};

export default ApplicationDetailStatus;

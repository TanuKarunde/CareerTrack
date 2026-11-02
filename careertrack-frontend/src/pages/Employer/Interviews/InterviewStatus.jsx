
import {
    CalendarClock,
    CheckCircle2,
    Clock3,
    CircleAlert,
    XCircle,
} from "lucide-react";

const statusConfig = {
    SCHEDULED: {
        label: "Scheduled",
        classes: "bg-blue-50 text-blue-700 border-blue-100",
        Icon: CalendarClock,
    },
    CONFIRMED: {
        label: "Confirmed",
        classes: "bg-purple-50 text-purple-700 border-purple-100",
        Icon: CheckCircle2,
    },
    PENDING: {
        label: "Pending",
        classes: "bg-amber-50 text-amber-700 border-amber-100",
        Icon: Clock3,
    },
    COMPLETED: {
        label: "Completed",
        classes: "bg-green-50 text-green-700 border-green-100",
        Icon: CheckCircle2,
    },
    CANCELLED: {
        label: "Cancelled",
        classes: "bg-red-50 text-red-700 border-red-100",
        Icon: XCircle,
    },
};

const InterviewStatus = ({ status }) => {
    const normalizedStatus = (status || "PENDING").toUpperCase();
    const config = statusConfig[normalizedStatus] || {
        label: status || "Unknown",
        classes: "bg-gray-50 text-gray-600 border-gray-200",
        Icon: CircleAlert,
    };

    const { label, classes, Icon } = config;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border !px-3 !py-1.5 text-[11px] font-semibold ${classes}`}
        >
            <Icon size={12} />
            {label}
        </span>
    );
};

export default InterviewStatus;

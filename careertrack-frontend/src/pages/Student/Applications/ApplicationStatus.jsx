
const ApplicationStatus = ({ status }) => {

    const styles = {
        APPLIED: {
            label: "Applied",
            className: "bg-blue-200 text-blue-600",
            dot: "bg-blue-500",
        },

        SHORTLISTED: {
            label: "Shortlisted",
            className: "bg-green-50 text-green-600",
            dot: "bg-green-500",
        },

        INTERVIEW: {
            label: "Interview",
            className: "bg-green-50 text-green-600",
            dot: "bg-green-400",
        },

        REJECTED: {
            label: "Rejected",
            className: "bg-red-50 text-red-600",
            dot: "bg-red-500",
        },

        SELECTED: {
            label: "Selected",
            className: "bg-emerald-50 text-emerald-700",
            dot: "bg-emerald-600",
        },
    };


    const normalizedStatus =status?.toUpperCase();

    const config = styles[normalizedStatus] || {
        label: styles || "Unknown",
        className: "bg-gray-50 text-gray-900",
        dot: "bg-gray-400",
    };

    return (
        <span
            className={`
                inline-flex
                items-center
                gap-2
                !px-4
                !py-1
                rounded-full
                text-sm
                font-medium
                whitespace-nowrap
                ${config.className}
            `}
        >
            <span
                className={`
                    !w-2
                    !h-2
                    rounded-full
                    ${config.dot}
                `}
            />

            {config.label}
        </span>
    );
};

export default ApplicationStatus;


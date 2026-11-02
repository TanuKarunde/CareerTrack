import { Check, Clock, X } from "lucide-react";

const StatusStep = ({
    label,
    date,
    active,
    pending,
    rejected,
    last
}) => {

    return (
        <div className="flex gap-4">

            {/* Timeline column */}
            <div className="flex flex-col items-center">

                {/* Status circle */}
                <div
                    className={`
                        w-10 h-10 rounded-full
                        flex items-center justify-center
                        shrink-0
                        ${
                            rejected
                                ? "bg-red-100 text-red-600"
                                : active
                                    ? "bg-purple-100 text-purple-600"
                                    : "bg-gray-100 text-gray-400 border-2 border-gray-400"
                        }
                    `}
                >
                    {rejected ? (
                        <X size={18} />
                    ) : active ? (
                        <Check size={18} />
                    ) : (
                        <Clock size={17} />
                    )}
                </div>

                {/* Connecting line */}
                {!last && (
                    <div
                        className={`w-px h-16 ${
                            active
                                ? "bg-purple-200"
                                : "bg-gray-400"
                        }`}
                    />
                )}

            </div>

            {/* Step information */}
            <div className="pb-8">

                {/* Step name */}
                <p
                    className={`
                        text-sm font-semibold
                        ${
                            rejected
                                ? "text-red-600"
                                : active
                                    ? "text-gray-900"
                                    : "text-gray-400"
                        }
                    `}
                >
                    {label}
                </p>

                {/* DATE DIRECTLY BELOW STEP */}
                {active && date && (
                    <p className="mt-1 text-xs text-gray-500">
                        {date}
                    </p>
                )}

                {/* Pending directly below step */}
                {pending && (
                    <p className="mt-1 text-xs text-gray-400">
                        Pending
                    </p>
                )}

            </div>

        </div>
    );
};

export default StatusStep;
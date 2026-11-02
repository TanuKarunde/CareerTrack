
import {
    CalendarDays,
    Clock3,
    Eye,
    MapPin,
    Video,
    ArrowUpRight,
    UserRound,
} from "lucide-react";

import InterviewStatus from "./InterviewStatus";

const InterviewCard = ({ interview, onView }) => {
    const candidateName =
        interview.candidateName ||
        interview.studentName ||
        "Unknown Candidate";

    const jobTitle = interview.jobTitle || "Job";

    const date = interview.interviewDate
        ? new Date(interview.interviewDate)
        : null;

    const initials = candidateName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();

    const formattedDate =
        date && !Number.isNaN(date.getTime())
            ? date.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
              })
            : "Date not set";

    return (
        <article className="group relative overflow-hidden border border-gray-100 bg-white !p-4 sm:!p-5 rounded-2xl hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300">
            <div className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full bg-gradient-to-b from-purple-500 to-fuchsia-400 opacity-70 group-hover:opacity-100 transition" />

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                {/* Date and time */}
                <div className="flex items-center gap-3 xl:w-48 xl:shrink-0">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
                        <CalendarDays size={17} />
                        <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wide">
                            Date
                        </span>
                    </div>

                    <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800">
                            {formattedDate}
                        </p>

                        <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock3 size={12} />
                            {interview.interviewTime || "Time not set"}
                        </p>
                    </div>
                </div>

                {/* Candidate details */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-bold text-white shadow-md shadow-purple-200">
                        {initials || <UserRound size={18} />}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-bold text-gray-900">
                            {candidateName}
                        </h3>

                        <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="truncate">{jobTitle}</span>
                        </p>

                        {interview.location && (
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
                                <MapPin size={11} />
                                {interview.location}
                            </p>
                        )}
                    </div>
                </div>

                {/* Status and actions */}
                <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                    <InterviewStatus status={interview.status} />

                    {interview.meetingLink && (
                        <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-green-100 bg-green-50 !px-3 !py-2 text-xs font-semibold text-green-700 hover:bg-green-100 transition"
                        >
                            <Video size={14} />
                            Join
                        </a>
                    )}

                    <button
                        type="button"
                        onClick={() => onView?.(interview)}
                        className="inline-flex items-center gap-2 rounded-xl bg-gray-900 !px-3.5 !py-2.5 text-xs font-semibold text-white hover:bg-purple-700 transition"
                    >
                        <Eye size={14} />
                        View details
                        <ArrowUpRight size={13} />
                    </button>
                </div>
            </div>
        </article>
    );
};

export default InterviewCard;

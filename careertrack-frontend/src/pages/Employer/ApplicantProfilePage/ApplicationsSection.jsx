
import {
    Briefcase,
    Building2,
    CheckCircle,
    Clock,
    MapPin,
    Sparkles,
    ArrowUpRight,
    CalendarDays,
    CircleDot,
    LoaderCircle,
    RefreshCw,
    XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ApplicationsSection = ({
    applications = [],
    applicationsLoading,
    applicationsError,
    applicationId,
    updating,
    changeStatus,
    getApplicationId,
    getApplicationJobTitle,
    getApplicationCompany,
    getApplicationLocation,
    getApplicationStatus,
    getApplicationDate,
    getStatusClass,
    formatDate,
}) => {
    const navigate = useNavigate();

    const handleInterview = async (application) => {
        const currentApplicationId = getApplicationId(application);

        if (!currentApplicationId) {
            console.error("Application ID not found", application);
            return;
        }

        try {
            await changeStatus("INTERVIEW", currentApplicationId);

            navigate(`/employer/interviews/schedule/${currentApplicationId}`);
        } catch (error) {
            console.error("Failed to move application to interview:", error);
        }
    };

    const handleStatusChange = async (status, targetApplicationId) => {
        try {
            await changeStatus(status, targetApplicationId);
        } catch (error) {
            console.error(`Failed to update application to ${status}:`, error);
        }
    };

    const statusLabel = (status) =>
        String(status || "PENDING")
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase());

    return (
        <div className="space-y-5">
            {/* HEADER */}
            <section className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
                <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-purple-100/70 blur-2xl pointer-events-none" />

                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 !p-5 sm:!p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-md shadow-purple-200">
                            <Briefcase size={19} />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold text-gray-900">
                                    Application Journey
                                </h2>
                                <Sparkles size={14} className="text-fuchsia-500" />
                            </div>

                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                Track this candidate's applications and take action.
                            </p>
                        </div>
                    </div>

                    {!applicationsLoading && !applicationsError && (
                        <div className="flex items-center gap-3 rounded-xl border border-purple-100 bg-purple-50/80 !px-4 !py-3">
                            <div>
                                <p className="text-[10px] font-medium text-purple-600">
                                    Total applications
                                </p>
                                <p className="mt-0.5 text-2xl font-bold leading-none text-purple-800">
                                    {applications.length}
                                </p>
                            </div>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                                <Briefcase size={17} />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* LOADING */}
            {applicationsLoading && (
                <div className="rounded-2xl border border-purple-100 bg-white !p-12 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50">
                        <LoaderCircle size={25} className="animate-spin text-purple-600" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-gray-700">
                        Loading applications
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Gathering the candidate's application history...
                    </p>
                </div>
            )}

            {/* ERROR */}
            {!applicationsLoading && applicationsError && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 !p-5">
                    <XCircle size={19} className="mt-0.5 shrink-0 text-red-500" />
                    <div>
                        <p className="text-sm font-semibold text-red-700">
                            Applications couldn't be loaded
                        </p>
                        <p className="mt-1 text-xs leading-5 text-red-600">
                            {applicationsError}
                        </p>
                    </div>
                </div>
            )}

            {/* EMPTY */}
            {!applicationsLoading &&
                !applicationsError &&
                applications.length === 0 && (
                    <div className="relative overflow-hidden rounded-2xl border border-dashed border-purple-200 bg-white !px-6 !py-12 text-center">
                        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-purple-50" />
                        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-600">
                            <Briefcase size={25} />
                        </div>
                        <h3 className="relative mt-4 text-sm font-bold text-gray-800">
                            No applications yet
                        </h3>
                        <p className="relative mx-auto mt-2 max-w-sm text-xs leading-5 text-gray-500">
                            This candidate's application history will appear here when available.
                        </p>
                    </div>
                )}

            {/* APPLICATION LIST */}
            {!applicationsLoading &&
                !applicationsError &&
                applications.length > 0 && (
                    <div className="space-y-4">
                        {applications.map((application, index) => {
                            const jobTitle = getApplicationJobTitle(application);
                            const company = getApplicationCompany(application);
                            const location = getApplicationLocation(application);
                            const status = getApplicationStatus(application);
                            const appliedDate = getApplicationDate(application);
                            const currentId = getApplicationId(application);

                            const isCurrentApplication =
                                String(currentId) === String(applicationId);

                            return (
                                <article
                                    key={currentId ?? index}
                                    className={`
                                        relative overflow-hidden rounded-2xl bg-white transition-all duration-200
                                        ${
                                            isCurrentApplication
                                                ? "border-2 border-purple-300 shadow-md shadow-purple-100/70"
                                                : "border border-gray-200 shadow-sm hover:border-purple-200 hover:shadow-md"
                                        }
                                    `}
                                >
                                    {isCurrentApplication && (
                                        <div className="h-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-300" />
                                    )}

                                    <div className="!p-4 sm:!p-5">
                                        {isCurrentApplication && (
                                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                                <span className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 !px-3 !py-1.5 text-[10px] font-bold text-purple-700">
                                                    <CircleDot size={12} />
                                                    Currently selected application
                                                </span>
                                                <span className="text-[10px] font-medium text-purple-500">
                                                    Application #{currentId}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                            <div className="flex min-w-0 items-start gap-3">
                                                <div className={`
                                                    flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl
                                                    ${
                                                        isCurrentApplication
                                                            ? "bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-700"
                                                            : "bg-gray-50 text-gray-500"
                                                    }
                                                `}>
                                                    <Briefcase size={20} />
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="break-words text-sm font-bold text-gray-900">
                                                        {jobTitle || "Job title not provided"}
                                                    </h3>

                                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                                                        {company && (
                                                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                                                <Building2 size={13} className="shrink-0 text-purple-500" />
                                                                {company}
                                                            </span>
                                                        )}

                                                        {location && (
                                                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                                                <MapPin size={13} className="shrink-0 text-purple-500" />
                                                                {location}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {status && (
                                                <span className={`
                                                    inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border !px-3 !py-1.5
                                                    text-[10px] font-bold
                                                    ${getStatusClass(status)}
                                                `}>
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    {statusLabel(status)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                                <CalendarDays size={13} className="text-purple-500" />
                                                {formatDate(appliedDate) ? (
                                                    <span>
                                                        Applied on{" "}
                                                        <strong className="font-semibold text-gray-700">
                                                            {formatDate(appliedDate)}
                                                        </strong>
                                                    </span>
                                                ) : (
                                                    <span>Application date unavailable</span>
                                                )}
                                            </div>

                                            {!isCurrentApplication && (
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/employer/applicants/${currentId}`)}
                                                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-600 hover:text-purple-800"
                                                >
                                                    View application
                                                    <ArrowUpRight size={13} />
                                                </button>
                                            )}
                                        </div>

                                        {/* CURRENT APPLICATION ACTIONS */}
                                        {isCurrentApplication && (
                                            <div className="mt-5 rounded-xl border border-purple-100 bg-[#faf8ff] !p-4">
                                                <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <div>
                                                        <h4 className="text-xs font-bold text-gray-900">
                                                            Candidate decision
                                                        </h4>
                                                        <p className="mt-1 text-[10px] leading-4 text-gray-500">
                                                            Update this application or arrange an interview.
                                                        </p>
                                                    </div>

                                                    {status && (
                                                        <span className={`
                                                            w-fit rounded-full border !px-2.5 !py-1
                                                            text-[9px] font-bold
                                                            ${getStatusClass(status)}
                                                        `}>
                                                            Current: {statusLabel(status)}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                    <button
                                                        type="button"
                                                        disabled={updating}
                                                        onClick={() => handleStatusChange("SHORTLISTED", currentId)}
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 !px-3 !py-3 text-xs font-semibold text-white shadow-sm shadow-purple-200 transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {updating ? (
                                                            <LoaderCircle size={14} className="animate-spin" />
                                                        ) : (
                                                            <CheckCircle size={14} />
                                                        )}
                                                        {updating ? "Updating..." : "Shortlist"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={updating}
                                                        onClick={() => handleInterview(application)}
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 !px-3 !py-3 text-xs font-semibold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <CalendarDays size={14} />
                                                        Move to Interview
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={updating}
                                                        onClick={() => handleStatusChange("SELECTED", currentId)}
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 !px-3 !py-3 text-xs font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <CheckCircle size={14} />
                                                        Select Candidate
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={updating}
                                                        onClick={() => handleStatusChange("REJECTED", currentId)}
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 !px-3 !py-3 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <XCircle size={14} />
                                                        Reject
                                                    </button>
                                                </div>

                                                <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-400">
                                                    <RefreshCw size={11} />
                                                    Status updates are saved to the application.
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
        </div>
    );
};

export default ApplicationsSection;

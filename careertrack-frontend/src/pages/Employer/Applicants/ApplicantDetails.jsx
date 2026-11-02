import { useState } from "react";
import {
    UserRound,
    BriefcaseBusiness,
    Mail,
    FileText,
    Download,
    Eye,
    LoaderCircle,
    UserCheck,
    CalendarClock,
    CheckCircle2,
    XCircle,
    Sparkles,
    Clock3,
} from "lucide-react";
import { toast } from "react-toastify";

import ApplicantStatus from "./ApplicantStatus";
import {
    updateApplicationStatus,
    viewApplicationResume,
    downloadApplicationResume,
} from "../../../services/employerService";

const ApplicantDetails = ({ applicant, onUpdated }) => {
    const [loadingStatus, setLoadingStatus] = useState("");
    const [resumeLoading, setResumeLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [error, setError] = useState("");

    const applicationId =
        applicant?.applicationId ?? applicant?.id;

    const name =
        applicant?.studentName ||
        applicant?.name ||
        "Unknown Applicant";

    const email = applicant?.email || "No email available";
    const jobTitle = applicant?.jobTitle || "Job not available";
    const status = (applicant?.status || "APPLIED").toUpperCase();

    const initials =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join("") || "?";

    const appliedDate = applicant?.appliedAt
        ? new Date(applicant.appliedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "Date unavailable";

    const changeStatus = async (nextStatus) => {
        if (applicationId == null || loadingStatus) {
            if (applicationId == null) {
                setError("Application ID is missing.");
            }
            return;
        }

        try {
            setLoadingStatus(nextStatus);
            setError("");

            const updated = await updateApplicationStatus(
                applicationId,
                nextStatus
            );

            if (typeof onUpdated === "function") {
                onUpdated(updated);
            }

            toast.success(`Application updated to ${nextStatus}.`);
        } catch (err) {
            console.error("Unable to update application status:", err);

            const message =
                err.message || "Unable to update application status.";

            setError(message);
            toast.error(message);
        } finally {
            setLoadingStatus("");
        }
    };

    const handleViewResume = async () => {
        if (applicationId == null || resumeLoading) return;

        const resumeWindow = window.open("about:blank", "_blank");

        if (!resumeWindow) {
            toast.error("Please allow pop-ups to view the resume.");
            return;
        }

        try {
            setError("");
            setResumeLoading(true);

            const resumeUrl = await viewApplicationResume(applicationId);

            if (!resumeUrl) {
                throw new Error("The resume could not be opened.");
            }

            resumeWindow.location.href = resumeUrl;

            window.setTimeout(() => {
                URL.revokeObjectURL(resumeUrl);
            }, 60000);
        } catch (err) {
            resumeWindow.close();

            console.error("Unable to open resume:", err);

            const message = err.message || "Unable to open resume.";
            setError(message);
            toast.error(message);
        } finally {
            setResumeLoading(false);
        }
    };

    const handleDownloadResume = async () => {
        if (applicationId == null || downloadLoading) return;

        try {
            setError("");
            setDownloadLoading(true);

            await downloadApplicationResume(
                applicationId,
                applicant?.resumeName || "resume.pdf"
            );

            toast.success("Resume download started.");
        } catch (err) {
            console.error("Unable to download resume:", err);

            const message = err.message || "Unable to download resume.";
            setError(message);
            toast.error(message);
        } finally {
            setDownloadLoading(false);
        }
    };

    const statusActions = [
        {
            value: "SHORTLISTED",
            label: "Shortlist",
            icon: UserCheck,
            style: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
        },
        {
            value: "INTERVIEW",
            label: "Move to Interview",
            icon: CalendarClock,
            style: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
        },
        {
            value: "SELECTED",
            label: "Select Candidate",
            icon: CheckCircle2,
            style: "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100",
        },
        {
            value: "REJECTED",
            label: "Reject",
            icon: XCircle,
            style: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
        },
    ];

    return (
        <div className="space-y-5">
            {/* Candidate profile header */}
            <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#30205f] via-[#5635a1] to-[#8153dc] !p-6 sm:!p-8 shadow-lg shadow-purple-100">
                <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[26px] border border-white/20 bg-white/15 text-2xl font-bold text-white shadow-lg backdrop-blur">
                        {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 !px-3 !py-1 text-[10px] font-semibold uppercase tracking-wider text-purple-100">
                            <Sparkles size={12} />
                            Candidate profile
                        </div>

                        <h2 className="break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            {name}
                        </h2>

                        <p className="mt-2 flex items-center gap-2 break-all text-sm text-purple-100">
                            <Mail size={15} className="shrink-0" />
                            {email}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <ApplicantStatus status={status} />

                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 !px-3 !py-1.5 text-[10px] text-white">
                                <Clock3 size={12} />
                                Applied {appliedDate}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application information */}
            <section className="rounded-2xl border border-purple-100 bg-white !p-5 sm:!p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                        <BriefcaseBusiness size={19} />
                    </div>

                    <div>
                        <h3 className="text-base font-bold text-gray-900">
                            Application overview
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                            Position and application information
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="min-w-0 rounded-xl border border-gray-100 bg-gradient-to-br from-white to-purple-50/50 !p-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <BriefcaseBusiness
                                size={14}
                                className="text-purple-500"
                            />
                            Applied for
                        </div>
                        <p className="mt-2 break-words text-sm font-bold text-gray-900">
                            {jobTitle}
                        </p>
                    </div>

                    <div className="min-w-0 rounded-xl border border-gray-100 bg-gradient-to-br from-white to-purple-50/50 !p-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FileText
                                size={14}
                                className="text-purple-500"
                            />
                            Application ID
                        </div>
                        <p className="mt-2 break-all text-sm font-bold text-gray-900">
                            {applicationId ?? "Unavailable"}
                        </p>
                    </div>
                </div>
            </section>

            {/* Status management */}
            <section className="rounded-2xl border border-purple-100 bg-white !p-5 sm:!p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <UserRound size={19} />
                    </div>

                    <div>
                        <h3 className="text-base font-bold text-gray-900">
                            Manage application
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                            Update this candidate's hiring stage.
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {statusActions.map((action) => {
                        const Icon = action.icon;
                        const isCurrent = status === action.value;
                        const isLoading = loadingStatus === action.value;

                        return (
                            <button
                                key={action.value}
                                type="button"
                                onClick={() => changeStatus(action.value)}
                                disabled={
                                    Boolean(loadingStatus) ||
                                    isCurrent ||
                                    applicationId == null
                                }
                                className={`
                                    inline-flex min-h-12 items-center justify-center
                                    gap-2 rounded-xl border !px-4 !py-3
                                    text-xs font-semibold transition-all
                                    hover:-translate-y-0.5
                                    disabled:cursor-not-allowed disabled:opacity-50
                                    ${action.style}
                                `}
                            >
                                {isLoading ? (
                                    <LoaderCircle
                                        size={15}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Icon size={15} />
                                )}

                                {isLoading
                                    ? "Updating..."
                                    : isCurrent
                                      ? `${action.label} (Current)`
                                      : action.label}
                            </button>
                        );
                    })}
                </div>

                {error && (
                    <p className="mt-4 rounded-xl border border-rose-100 bg-rose-50 !p-3 text-xs text-rose-700">
                        {error}
                    </p>
                )}
            </section>

            {/* Submitted resume */}
            <section className="rounded-2xl border border-purple-100 bg-white !p-5 sm:!p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-700">
                        <FileText size={19} />
                    </div>

                    <div>
                        <h3 className="text-base font-bold text-gray-900">
                            Submitted resume
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                            Resume attached to this application
                        </p>
                    </div>
                </div>

                {applicant?.hasResume ? (
                    <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50/70 to-white !p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-purple-700 shadow-sm ring-1 ring-purple-100">
                                <FileText size={22} />
                            </div>

                            <div className="min-w-0">
                                <p className="break-words text-sm font-bold text-gray-900">
                                    {applicant.resumeName || "Candidate resume"}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Submitted with this application
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={handleViewResume}
                                disabled={resumeLoading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white !px-4 !py-2.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-50 disabled:opacity-50"
                            >
                                {resumeLoading ? (
                                    <LoaderCircle
                                        size={14}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Eye size={14} />
                                )}
                                View resume
                            </button>

                            <button
                                type="button"
                                onClick={handleDownloadResume}
                                disabled={downloadLoading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 !px-4 !py-2.5 text-xs font-semibold text-white shadow-md shadow-purple-100 transition hover:bg-purple-700 disabled:opacity-50"
                            >
                                {downloadLoading ? (
                                    <LoaderCircle
                                        size={14}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Download size={14} />
                                )}
                                Download
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 !p-6 text-center">
                        <FileText
                            size={27}
                            className="mx-auto text-gray-300"
                        />
                        <p className="mt-3 text-sm font-semibold text-gray-700">
                            No resume attached
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            This application has no submitted resume available.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ApplicantDetails;
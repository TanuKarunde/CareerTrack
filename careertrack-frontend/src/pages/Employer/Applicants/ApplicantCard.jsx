import { useState } from "react";
import {
    Eye,
    FileText,
    Download,
    LoaderCircle,
    BriefcaseBusiness,
    CalendarDays,
    ChevronRight,
    AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ApplicantStatus from "./ApplicantStatus";
import {
    viewApplicationResume,
    downloadApplicationResume,
} from "../../../services/employerService";

const ApplicantCard = ({ applicant }) => {
    const navigate = useNavigate();

    const [resumeLoading, setResumeLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);

    const name =
        applicant?.studentName ||
        applicant?.name ||
        "Unknown Applicant";

    const email = applicant?.email || "No email available";
    const jobTitle = applicant?.jobTitle || "Job not available";
    const status = (applicant?.status || "APPLIED").toUpperCase();

    const applicationId =
        applicant?.applicationId ?? applicant?.id;

    const appliedDate = applicant?.appliedAt
        ? new Date(applicant.appliedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "Recently";

    const initials =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join("") || "?";

    const handleView = () => {
        if (applicationId == null) {
            console.error("Application ID is missing:", applicant);
            toast.error("Application ID is missing.");
            return;
        }

        navigate(`/employer/applicants/${applicationId}`);
    };

    const handleViewResume = async () => {
        if (applicationId == null || resumeLoading) return;

        const resumeWindow = window.open("about:blank", "_blank");

        if (!resumeWindow) {
            toast.error("Please allow pop-ups to view the resume.");
            return;
        }

        setResumeLoading(true);

        try {
            const resumeUrl = await viewApplicationResume(applicationId);

            if (!resumeUrl) {
                throw new Error("The resume could not be opened.");
            }

            resumeWindow.location.href = resumeUrl;

            window.setTimeout(() => {
                URL.revokeObjectURL(resumeUrl);
            }, 60000);
        } catch (error) {
            resumeWindow.close();

            console.error("Unable to view application resume:", error);
            toast.error(
                error.message || "Unable to open application resume."
            );
        } finally {
            setResumeLoading(false);
        }
    };

    const handleDownloadResume = async () => {
        if (applicationId == null || downloadLoading) return;

        setDownloadLoading(true);

        try {
            await downloadApplicationResume(
                applicationId,
                applicant?.resumeName || "resume.pdf"
            );

            toast.success("Resume download started.");
        } catch (error) {
            console.error("Unable to download application resume:", error);
            toast.error(
                error.message || "Unable to download application resume."
            );
        } finally {
            setDownloadLoading(false);
        }
    };

    return (
        <div
            className="
                group relative grid grid-cols-1
                md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,200px)]
                items-center gap-4
                border-b border-gray-100
                !px-5 !py-5 sm:!py-6
                transition-all duration-200
                hover:bg-purple-50/50
            "
        >
            <span className="absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100" />

            {/* Candidate identity */}
            <div className="flex min-w-0 items-center gap-3">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8dcff] via-[#e9e1ff] to-[#f8ddff] text-sm font-bold text-purple-800 ring-1 ring-purple-100 transition-transform group-hover:scale-105">
                    {initials}

                    <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
                </div>

                <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-purple-700">
                        {name}
                    </h3>

                    <p className="mt-1 break-all text-xs text-gray-500">
                        {email}
                    </p>

                    {applicant?.hasResume ? (
                        <p className="mt-1.5 flex min-w-0 items-center gap-1 text-[10px] font-medium text-emerald-700">
                            <FileText size={12} className="shrink-0" />
                            <span className="truncate">
                                {applicant?.resumeName || "Resume available"}
                            </span>
                        </p>
                    ) : (
                        <p className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-400">
                            <AlertCircle size={11} />
                            No submitted resume
                        </p>
                    )}
                </div>
            </div>

            {/* Applied position */}
            <div className="min-w-0">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 md:hidden">
                    Applied for
                </p>

                <div className="flex min-w-0 items-start gap-2">
                    <BriefcaseBusiness
                        size={15}
                        className="mt-0.5 shrink-0 text-purple-500"
                    />
                    <p className="break-words text-sm font-medium text-gray-700">
                        {jobTitle}
                    </p>
                </div>
            </div>

            {/* Status */}
            <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 md:hidden">
                    Application status
                </p>
                <ApplicantStatus status={status} />
            </div>

            {/* Applied date */}
            <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 md:hidden">
                    Applied on
                </p>

                <p className="flex items-center gap-2 text-xs text-gray-600">
                    <CalendarDays size={14} className="shrink-0 text-gray-400" />
                    {appliedDate}
                </p>
            </div>

            {/* Actions */}
            <div className="flex min-w-0 flex-wrap items-center gap-2 md:justify-end">
                <button
                    type="button"
                    onClick={handleView}
                    disabled={applicationId == null}
                    className="
                        inline-flex items-center gap-1.5
                        rounded-xl border border-purple-200
                        bg-purple-50 !px-3 !py-2
                        text-xs font-semibold text-purple-700
                        transition-all hover:-translate-y-0.5
                        hover:border-purple-600 hover:bg-purple-600 hover:text-white
                        disabled:cursor-not-allowed disabled:opacity-50
                    "
                >
                    <Eye size={14} />
                    Details
                    <ChevronRight size={13} />
                </button>

                {applicant?.hasResume && (
                    <>
                        <button
                            type="button"
                            onClick={handleViewResume}
                            disabled={applicationId == null || resumeLoading}
                            title="View submitted application resume"
                            aria-label={`View resume for ${name}`}
                            className="
                                inline-flex h-9 w-9 items-center justify-center
                                rounded-xl border border-emerald-100
                                bg-emerald-50 text-emerald-700
                                transition hover:bg-emerald-100
                                disabled:opacity-50
                            "
                        >
                            {resumeLoading ? (
                                <LoaderCircle
                                    size={15}
                                    className="animate-spin"
                                />
                            ) : (
                                <FileText size={15} />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleDownloadResume}
                            disabled={applicationId == null || downloadLoading}
                            title="Download submitted application resume"
                            aria-label={`Download resume for ${name}`}
                            className="
                                inline-flex h-9 w-9 items-center justify-center
                                rounded-xl border border-gray-200
                                bg-white text-gray-600
                                transition hover:border-purple-200
                                hover:bg-purple-50 hover:text-purple-700
                                disabled:opacity-50
                            "
                        >
                            {downloadLoading ? (
                                <LoaderCircle
                                    size={15}
                                    className="animate-spin"
                                />
                            ) : (
                                <Download size={15} />
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ApplicantCard;
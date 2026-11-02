
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    FileText, Upload, X, Loader2, ShieldCheck, CheckCircle2
} from "lucide-react";

import {
    applyForjob,
    getMyApplications
} from "../../../services/applicationService";
import { getStudentProfile } from "../../../services/studentProfileService";
import { getReadiness } from "../../../services/readinessService";

const ApplyButton = ({ jobId }) => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [applied, setApplied] = useState(false);
    const [checking, setChecking] = useState(true);
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [profile, setProfile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [useProfileResume, setUseProfileResume] = useState(true);

    const hasResume = (data) =>
        data?.hasResume === true ||
        data?.resumeUploaded === true ||
        Boolean(
            data?.resumeName ||
            data?.resumeFileName ||
            data?.resumeUrl ||
            data?.resume
        );

    useEffect(() => {
        let cancelled = false;

        const checkApplicationStatus = async () => {
            const token =
                localStorage.getItem("token") ||
                localStorage.getItem("careertrack_token");

            if (!token || !jobId) {
                setChecking(false);
                return;
            }

            try {
                const applications = await getMyApplications();
                if (cancelled) return;

                setApplied(
                    applications.some((application) =>
                        Number(application.job?.id ?? application.jobId) ===
                        Number(jobId)
                    )
                );
            } catch (error) {
                console.error("Error checking application status:", error);
            } finally {
                if (!cancelled) setChecking(false);
            }
        };

        checkApplicationStatus();
        return () => { cancelled = true; };
    }, [jobId]);

    const handleResumeChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!/\.(pdf|doc|docx)$/i.test(file.name)) {
            toast.error("Please upload a PDF, DOC, or DOCX file.");
            event.target.value = "";
            return;
        }

        if (file.size === 0) {
            toast.error("The selected resume is empty.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Resume size must not exceed 5 MB.");
            event.target.value = "";
            return;
        }

        setResumeFile(file);
        setUseProfileResume(false);
        event.target.value = "";
    };

    const handleApply = async () => {
        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("careertrack_token");

        if (!token) {
            toast.error("Please login to apply for this job.");
            navigate("/login");
            return;
        }

        let user;
        try {
            user = JSON.parse(localStorage.getItem("careertrack_user") || "null");
        } catch (error) {
            console.error("Invalid user data:", error);
            toast.error("Please login again.");
            navigate("/login");
            return;
        }

        const role = String(user?.role || user?.userRole || "")
            .toUpperCase()
            .replace(/^ROLE_/, "");

        if (role !== "STUDENT") {
            toast.error("Only students can apply for jobs.");
            navigate("/login");
            return;
        }

        if (applied) {
            toast.info("You have already applied for this job.");
            return;
        }

        try {
            setLoading(true);

            const studentProfile = await getStudentProfile();

            const fullName =
                studentProfile?.fullName ||
                studentProfile?.name ||
                studentProfile?.user?.fullName ||
                studentProfile?.user?.name || "";

            const email =
                studentProfile?.email ||
                studentProfile?.user?.email || "";

            const requiredFields = [
                ["Full Name", fullName],
                ["Email", email],
                ["Phone Number", studentProfile?.phone],
                ["Location", studentProfile?.location],
                ["Date of Birth", studentProfile?.dob || studentProfile?.dateOfBirth],
                ["Gender", studentProfile?.gender],
                ["Skills", studentProfile?.skills]
            ];

            const missingFields = requiredFields
                .filter(([, value]) => !String(value ?? "").trim())
                .map(([label]) => label);

            if (missingFields.length) {
                toast.error(
                    `Complete your profile first. Missing: ${missingFields.join(", ")}`,
                    { autoClose: 5000 }
                );
                navigate("/student/profile/edit");
                return;
            }

            let readinessReport;
            try {
                readinessReport = await getReadiness(jobId);
            } catch (readinessError) {
                console.error("Error checking job readiness:", readinessError);
                toast.info("Calculate your Job Readiness Score before applying.");
                navigate(`/student/jobs/${jobId}/readiness`);
                return;
            }

            const readinessScore = Number(readinessReport?.readinessScore);

            if (!Number.isFinite(readinessScore) || readinessScore < 20) {
                toast.warning(
                    `Your readiness score is ${
                        Number.isFinite(readinessScore) ? readinessScore : "unavailable"
                    }/100. You need at least 20 to apply.`,
                    { autoClose: 5000 }
                );
                navigate(`/student/jobs/${jobId}/readiness`);
                return;
            }

            setProfile(studentProfile);
            setResumeFile(null);
            setUseProfileResume(hasResume(studentProfile));
            setShowResumeModal(true);
        } catch (error) {
            console.error("Apply error:", error);
            toast.error(error?.message || "Failed to check application eligibility.", {
                autoClose: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmApplication = async () => {
        if (useProfileResume && !hasResume(profile)) {
            toast.error("No profile resume found. Please upload a resume.");
            return;
        }

        if (!useProfileResume && !resumeFile) {
            toast.error("Please select or upload a resume.");
            return;
        }

        try {
            setLoading(true);

            await applyForjob(jobId, {
                resumeFile: useProfileResume ? null : resumeFile,
                useProfileResume
            });

            setApplied(true);
            setShowResumeModal(false);
            setResumeFile(null);
            toast.success("Application submitted successfully!");
        } catch (error) {
            console.error("Application submission error:", error);

            if (error?.status === 409) {
                setApplied(true);
                setShowResumeModal(false);
                toast.info("You have already applied for this job.");
            } else if (error?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("careertrack_token");
                localStorage.removeItem("careertrack_user");
                toast.error("Your session has expired. Please login again.");
                navigate("/login");
            } else {
                toast.error(error?.message || "Failed to submit application. Please try again.", {
                    autoClose: 5000
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={handleApply}
                disabled={loading || checking || applied}
                className={`!px-6 !py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm ${
                    applied
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed"
                        : loading || checking
                        ? "bg-purple-300 text-white cursor-wait"
                        : "bg-gradient-to-r from-[#5841D8] to-[#7864EB] text-white hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5"
                }`}
            >
                {checking ? "Checking..." : loading ? "Please wait..." : applied ? "✓ Applied" : "Apply Now"}
            </button>

            {showResumeModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17102F]/60 backdrop-blur-sm !p-4"
                    onClick={(event) => {
                        if (event.target === event.currentTarget && !loading) {
                            setShowResumeModal(false);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="resume-modal-title"
                        className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl"
                    >
                        <div className="relative overflow-hidden bg-gradient-to-br from-[#30205F] via-[#5141B7] to-[#8875F1] !px-6 !py-6 text-white">
                            <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10" />
                            <div className="relative flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-2xl bg-white/15 !p-3">
                                        <FileText size={25} />
                                    </div>
                                    <div>
                                        <h2 id="resume-modal-title" className="text-xl font-bold">
                                            Choose your resume
                                        </h2>
                                        <p className="mt-1 text-sm text-purple-100">
                                            Select the best version for this application.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => setShowResumeModal(false)}
                                    aria-label="Close resume dialog"
                                    className="rounded-xl !p-2 text-white/80 transition hover:bg-white/15 hover:text-white disabled:opacity-50"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 !p-6">
                            {hasResume(profile) && (
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => {
                                        setUseProfileResume(true);
                                        setResumeFile(null);
                                    }}
                                    className={`flex w-full items-start gap-3 rounded-2xl border !p-4 text-left transition ${
                                        useProfileResume
                                            ? "border-purple-400 bg-purple-50 ring-2 ring-purple-100"
                                            : "border-slate-200 bg-white hover:border-purple-200"
                                    }`}
                                >
                                    <span className={`rounded-xl !p-2.5 ${useProfileResume ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"}`}>
                                        <FileText size={22} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                            Profile resume
                                            {useProfileResume && <CheckCircle2 size={16} className="text-purple-600" />}
                                        </span>
                                        <span className="mt-1 block break-all text-xs text-slate-500">
                                            {profile?.resumeName || profile?.resumeFileName || "Resume saved in your profile"}
                                        </span>
                                    </span>
                                    <span className={`mt-1 h-4 w-4 rounded-full border-2 ${useProfileResume ? "border-purple-600 bg-purple-600 ring-2 ring-purple-100" : "border-slate-300"}`} />
                                </button>
                            )}

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => setUseProfileResume(false)}
                                className={`flex w-full items-start gap-3 rounded-2xl border !p-4 text-left transition ${
                                    !useProfileResume
                                        ? "border-purple-400 bg-purple-50 ring-2 ring-purple-100"
                                        : "border-slate-200 bg-white hover:border-purple-200"
                                }`}
                            >
                                <span className={`rounded-xl !p-2.5 ${!useProfileResume ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"}`}>
                                    <Upload size={22} />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                        Upload a different resume
                                        {!useProfileResume && <CheckCircle2 size={16} className="text-purple-600" />}
                                    </span>
                                    <span className="mt-1 block text-xs text-slate-500">
                                        PDF, DOC, or DOCX · Maximum 5 MB
                                    </span>
                                </span>
                                <span className={`mt-1 h-4 w-4 rounded-full border-2 ${!useProfileResume ? "border-purple-600 bg-purple-600 ring-2 ring-purple-100" : "border-slate-300"}`} />
                            </button>

                            {!useProfileResume && (
                                <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-purple-200 bg-[#FAF9FF] !p-5 text-center transition hover:border-purple-400 hover:bg-purple-50">
                                    <Upload size={24} className="mx-auto text-purple-600" />
                                    <span className="mt-2 block text-sm font-semibold text-slate-800">
                                        {resumeFile ? "Choose another file" : "Click to choose your resume"}
                                    </span>
                                    <span className="mt-1 block break-all text-xs text-slate-500">
                                        {resumeFile ? resumeFile.name : "Your uploaded file will be attached to this application only"}
                                    </span>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        disabled={loading}
                                        onChange={handleResumeChange}
                                        className="sr-only"
                                    />
                                </label>
                            )}

                            <p className="flex items-start gap-2 rounded-xl bg-slate-50 !p-3 text-xs leading-5 text-slate-500">
                                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                                A newly uploaded resume is intended for this application and will not replace your profile resume.
                            </p>

                            <div className="flex gap-3 !pt-2">
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => setShowResumeModal(false)}
                                    className="flex-1 rounded-xl border border-slate-200 !px-4 !py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmApplication}
                                    disabled={loading || (!useProfileResume && !resumeFile)}
                                    className="flex-1 rounded-xl bg-gradient-to-r from-[#5841D8] to-[#7864EB] !px-4 !py-3 text-sm font-bold text-white shadow-md shadow-purple-100 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 size={16} className="animate-spin" />
                                            Submitting...
                                        </span>
                                    ) : "Confirm Apply"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ApplyButton;

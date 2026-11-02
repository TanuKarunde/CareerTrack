
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Mail,
    MapPin,
    Phone,
    BriefcaseBusiness,
    GraduationCap,
    Download,
    Eye,
    FileText,
    Sparkles,
    UserRound,
    LoaderCircle,
    CheckCircle2,
} from "lucide-react";

import {
    getEmployerApplicant,
    getStudentApplications,
    updateApplicationStatus,
    downloadApplicationResume,
    viewStudentProfileResume,
    downloadStudentProfileResume,
    getApplicantProfileImage,
} from "../../../services/employerService";

import Sidebar from "../../../components/Sidebar/Sidebar";

import OverviewSection from "./OverviewSection";
import EducationSection from "./EducationSection";
import SkillsSection from "./SkillsSection";
import ExperienceSection from "./ExperienceSection";
import ApplicationsSection from "./ApplicationsSection";
import EmployerNavbar from "../ENavbar/EmployerNavbar";

const ApplicantProfilePage = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [applications, setApplications] = useState([]);
    const [activeTab, setActiveTab] = useState("applications");

    const [loading, setLoading] = useState(true);
    const [applicationsLoading, setApplicationsLoading] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [profileImage, setProfileImage] = useState("");

    const [resumeLoading, setResumeLoading] = useState(false);
    const [profileResumeLoading, setProfileResumeLoading] = useState(false);

    const [error, setError] = useState("");
    const [applicationsError, setApplicationsError] = useState("");
    const [resumeError, setResumeError] = useState("");
    const [profileResumeError, setProfileResumeError] = useState("");

    const [isOpen, setIsOpen] = useState(false);

    // Load the selected applicant
    useEffect(() => {
        let cancelled = false;

        const loadStudent = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getEmployerApplicant(applicationId);

                if (!cancelled) {
                    setStudent(data);
                }
            } catch (err) {
                console.error("Error loading student:", err);

                if (!cancelled) {
                    setError(err.message || "Unable to load student details.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        if (applicationId) {
            loadStudent();
        }

        return () => {
            cancelled = true;
        };
    }, [applicationId]);

    // Load applicant profile image
    useEffect(() => {
        if (!student?.studentId || !student?.hasProfileImage) {
            setProfileImage("");
            return;
        }

        let cancelled = false;
        let imageUrl = "";

        const loadImage = async () => {
            try {
                const blob = await getApplicantProfileImage(student.studentId);
                const url = URL.createObjectURL(blob);

                if (cancelled) {
                    URL.revokeObjectURL(url);
                    return;
                }

                imageUrl = url;
                setProfileImage(url);
            } catch (err) {
                console.error("Failed to load applicant image:", err);
                setProfileImage("");
            }
        };

        loadImage();

        return () => {
            cancelled = true;

            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [student?.studentId, student?.hasProfileImage]);

    // Application helpers
    const getApplicationId = (application) =>
        application?.id ?? application?.applicationId;

    const getApplicationJobTitle = (application) =>
        application?.jobTitle ?? application?.job?.title ?? "";

    const getApplicationCompany = (application) =>
        application?.compony ??
        application?.company ??
        application?.job?.compony ??
        application?.job?.company ??
        "";

    const getApplicationLocation = (application) =>
        application?.jobLocation ??
        application?.location ??
        application?.job?.location ??
        "";

    const getApplicationStatus = (application) =>
        application?.status ?? "";

    const getApplicationDate = (application) =>
        application?.appliedAt ?? application?.applicationDate;

    // Load all applications belonging to this student
    const loadApplications = async () => {
        if (!student?.studentId) return;

        try {
            setApplicationsLoading(true);
            setApplicationsError("");

            const data = await getStudentApplications(student.studentId);
            let applicationList = Array.isArray(data) ? data : [];

            applicationList = [...applicationList].sort((a, b) => {
                const currentId = String(applicationId);
                const aId = String(getApplicationId(a));
                const bId = String(getApplicationId(b));

                if (aId === currentId) return -1;
                if (bId === currentId) return 1;

                return 0;
            });

            setApplications(applicationList);
        } catch (err) {
            console.error("Error loading applications:", err);
            setApplicationsError(err.message || "Unable to load applications.");
        } finally {
            setApplicationsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "applications" && student?.studentId) {
            loadApplications();
        }
    }, [activeTab, student?.studentId]);

    // Update the current application status
    const changeStatus = async (status) => {
        try {
            setUpdating(true);
            setError("");

            const updated = await updateApplicationStatus(applicationId, status);
            setStudent(updated);

            if (activeTab === "applications") {
                await loadApplications();
            }
        } catch (err) {
            console.error("Error updating application:", err);
            setError(err.message || "Unable to update application status.");
            throw err;
        } finally {
            setUpdating(false);
        }
    };

    // View application resume
    const handleViewResume = () => {
        if (applicationId) {
            navigate(`/employer/applicants/${applicationId}/resume`);
        }
    };

    // Download application resume
    const handleDownloadResume = async () => {
        if (!applicationId) return;

        try {
            setResumeLoading(true);
            setResumeError("");

            await downloadApplicationResume(
                applicationId,
                student?.resumeName || "resume.pdf"
            );
        } catch (err) {
            console.error("Error downloading application resume:", err);
            setResumeError(err.message || "Unable to download application resume.");
        } finally {
            setResumeLoading(false);
        }
    };

    // View the resume uploaded to the student's profile
    const handleViewProfileResume = async () => {
        if (!applicationId) return;

        let fileUrl = "";

        try {
            setProfileResumeLoading(true);
            setProfileResumeError("");

            fileUrl = await viewStudentProfileResume(applicationId);

            const openedWindow = window.open(
                fileUrl,
                "_blank",
                "noopener,noreferrer"
            );

            if (!openedWindow) {
                URL.revokeObjectURL(fileUrl);
                setProfileResumeError(
                    "Your browser blocked the resume window. Allow pop-ups and try again."
                );
                return;
            }

            window.setTimeout(() => {
                URL.revokeObjectURL(fileUrl);
            }, 60000);
        } catch (err) {
            if (fileUrl) URL.revokeObjectURL(fileUrl);

            console.error("Error viewing profile resume:", err);
            setProfileResumeError(err.message || "Unable to view profile resume.");
        } finally {
            setProfileResumeLoading(false);
        }
    };

    // Download the student's profile resume
    const handleDownloadProfileResume = async () => {
        if (!applicationId) return;

        try {
            setProfileResumeLoading(true);
            setProfileResumeError("");

            await downloadStudentProfileResume(
                applicationId,
                student?.profileResumeName || "profile-resume.pdf"
            );
        } catch (err) {
            console.error("Error downloading profile resume:", err);
            setProfileResumeError(err.message || "Unable to download profile resume.");
        } finally {
            setProfileResumeLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return null;

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return null;

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusClass = (status) => {
        switch (String(status || "").toUpperCase()) {
            case "SHORTLISTED":
                return "bg-purple-50 text-purple-700 border-purple-100";
            case "INTERVIEW":
                return "bg-orange-50 text-orange-700 border-orange-100";
            case "SELECTED":
                return "bg-green-50 text-green-700 border-green-100";
            case "REJECTED":
                return "bg-red-50 text-red-700 border-red-100";
            case "APPLIED":
                return "bg-blue-50 text-blue-700 border-blue-100";
            default:
                return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    const skills = student?.skills
        ? student.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [];

    const tabs = [
        { key: "overview", label: "Overview", icon: UserRound },
        { key: "education", label: "Education", icon: GraduationCap },
        { key: "skills", label: "Skills", icon: Sparkles },
        { key: "experience", label: "Experience", icon: BriefcaseBusiness },
        { key: "applications", label: "Applications", icon: FileText },
    ];

    const experienceSummary =
        typeof student?.experience === "string"
            ? student.experience
            : Array.isArray(student?.experience)
                ? `${student.experience.length} experience record(s)`
                : student?.experience && typeof student.experience === "object"
                    ? student.experience.jobTitle ||
                      student.experience.companyName ||
                      "Experience available"
                    : "Not provided";

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f5ff] flex items-center justify-center">
                <div className="text-center rounded-2xl border border-purple-100 bg-white !px-10 !py-8 shadow-sm">
                    <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-sm font-medium text-gray-700">
                        Loading applicant profile...
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Preparing candidate information
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !student) {
        return (
            <div className="min-h-screen bg-[#f7f5ff] !p-6">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-700"
                >
                    <ArrowLeft size={16} />
                    Back to applicants
                </button>

                <div className="max-w-2xl mx-auto mt-8 rounded-2xl border border-red-200 bg-white !p-6">
                    <p className="font-semibold text-red-600">
                        Unable to load applicant
                    </p>
                    <p className="mt-2 text-sm text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-[#f7f5ff] flex items-center justify-center">
                <p className="text-sm text-gray-500">Student not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f5ff] text-gray-800">
            <div className="grid grid-cols-[250px_minmax(0,1fr)] min-h-screen">

                {/* FIXED SIDEBAR */}
                <aside className="sticky top-0 h-screen self-start z-30">
                    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                </aside>

                {/* MAIN WORKSPACE */}
                <main className="min-w-0">

                    {/* STICKY EMPLOYER NAVBAR */}
                    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-purple-100">
                        <EmployerNavbar />
                    </div>

                    <div className="max-w-[1600px] mx-auto !px-4 sm:!px-6 xl:!px-8 !py-6">

                        {/* PAGE INTRO */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div>

                                <div className="flex items-center gap-2 mt-4">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-100 text-purple-700">
                                        <Sparkles size={16} />
                                    </span>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-600">
                                            Talent Workspace
                                        </p>
                                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                                            Applicant Profile
                                        </h1>
                                    </div>
                                </div>
                            </div>

                            {student.openToWork === true && (
                                <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 !px-4 !py-2 text-xs font-semibold text-green-700">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Available for opportunities
                                </span>
                            )}
                        </div>

                        {/* PROFILE HERO */}
                        <section className="relative overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
                            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-400" />
                            <div className="absolute -right-12 -top-20 w-64 h-64 rounded-full bg-purple-100/60 blur-3xl pointer-events-none" />
                            <div className="absolute right-40 bottom-0 w-36 h-36 rounded-full bg-fuchsia-100/40 blur-3xl pointer-events-none" />

                            <div className="relative !p-5 sm:!p-7">
                                <div className="flex flex-col xl:flex-row xl:items-start gap-6">

                                    {/* IDENTITY */}
                                    <div className="flex items-start gap-4 min-w-0 flex-1">
                                        <div className="w-[76px] h-[76px] sm:w-24 sm:h-24 shrink-0 rounded-2xl bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-100 border border-purple-200 !p-1 shadow-sm">
                                            <div className="w-full h-full rounded-xl overflow-hidden bg-white flex items-center justify-center">
                                                {profileImage ? (
                                                    <img
                                                        src={profileImage}
                                                        alt={student.studentName || "Applicant"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-3xl sm:text-4xl font-bold text-purple-700">
                                                        {student.studentName?.charAt(0)?.toUpperCase() || "S"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                                                    {student.studentName || "Applicant"}
                                                </h2>

                                                {student.openToWork === true && (
                                                    <span className="rounded-full bg-green-50 border border-green-100 !px-2.5 !py-1 text-[10px] font-semibold text-green-700">
                                                        Open to Work
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {student.degree || "Course not provided"}
                                                {student.branch ? ` · ${student.branch}` : ""}
                                            </p>

                                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                                                {student.location && (
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                                        <MapPin size={13} className="text-purple-600" />
                                                        {student.location}
                                                    </span>
                                                )}

                                                {student.email && (
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 break-all">
                                                        <Mail size={13} className="text-purple-600 shrink-0" />
                                                        {student.email}
                                                    </span>
                                                )}

                                                {student.phone && (
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                                        <Phone size={13} className="text-purple-600" />
                                                        {student.phone}
                                                    </span>
                                                )}
                                            </div>

                                            {student.bio && (
                                                <p className="max-w-3xl mt-4 text-xs leading-6 text-gray-500 line-clamp-3">
                                                    {student.bio}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* QUICK SUMMARY — TWO COLUMNS MAX */}
                                    <div className="w-full xl:w-[310px] shrink-0 grid grid-cols-2 gap-3">
                                        <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white !p-4">
                                            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                                                <BriefcaseBusiness size={16} />
                                            </div>
                                            <p className="mt-3 text-[10px] text-gray-500">
                                                Experience
                                            </p>
                                            <p className="mt-1 text-sm font-bold text-gray-900 break-words">
                                                {experienceSummary}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white !p-4">
                                            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                                                <GraduationCap size={16} />
                                            </div>
                                            <p className="mt-3 text-[10px] text-gray-500">
                                                Academic Score
                                            </p>
                                            <p className="mt-1 text-sm font-bold text-gray-900">
                                                {student.cgpa !== null &&
                                                student.cgpa !== undefined
                                                    ? student.cgpa
                                                    : "Not provided"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* RESUME ACTIONS */}
                                <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 shrink-0 rounded-xl bg-fuchsia-50 border border-fuchsia-100 flex items-center justify-center text-fuchsia-700">
                                            <FileText size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-gray-800">
                                                Student Profile Resume
                                            </p>
                                            <p className="mt-1 text-[10px] text-gray-500 break-all">
                                                {student.hasProfileResume
                                                    ? student.profileResumeName || "Uploaded resume"
                                                    : "No resume uploaded to the student profile"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {student.hasProfileResume ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={handleViewProfileResume}
                                                    disabled={profileResumeLoading}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white !px-4 !py-2.5 text-xs font-semibold text-purple-700 hover:bg-purple-50 disabled:opacity-50 transition"
                                                >
                                                    {profileResumeLoading ? (
                                                        <LoaderCircle size={14} className="animate-spin" />
                                                    ) : (
                                                        <Eye size={14} />
                                                    )}
                                                    View Profile Resume
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={handleDownloadProfileResume}
                                                    disabled={profileResumeLoading}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 !px-4 !py-2.5 text-xs font-semibold text-white shadow-sm shadow-purple-200 hover:bg-purple-700 disabled:opacity-50 transition"
                                                >
                                                    <Download size={14} />
                                                    Download
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-[10px] text-gray-400">
                                                Profile resume unavailable
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {profileResumeError && (
                                    <p className="mt-3 rounded-lg bg-red-50 border border-red-100 !p-3 text-xs text-red-600">
                                        {profileResumeError}
                                    </p>
                                )}
                            </div>
                        </section>

                        {/* APPLICATION RESUME */}
                        {(student.hasResume || student.resumeName) && (
                            <section className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/60 !p-4 sm:!p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-blue-700">
                                            <FileText size={17} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800">
                                                Application Resume
                                            </p>
                                            <p className="text-[10px] text-gray-500 mt-1">
                                                {student.resumeName || "Resume attached to this application"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={handleViewResume}
                                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white !px-3 !py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100/60 transition"
                                        >
                                            <Eye size={14} />
                                            View Resume
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleDownloadResume}
                                            disabled={resumeLoading}
                                            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 !px-3 !py-2 text-xs font-semibold text-white hover:bg-blue-800 disabled:opacity-50 transition"
                                        >
                                            {resumeLoading ? (
                                                <LoaderCircle size={14} className="animate-spin" />
                                            ) : (
                                                <Download size={14} />
                                            )}
                                            {resumeLoading ? "Downloading..." : "Download"}
                                        </button>
                                    </div>
                                </div>

                                {resumeError && (
                                    <p className="mt-3 text-xs text-red-600">{resumeError}</p>
                                )}
                            </section>
                        )}

                        {/* STATUS UPDATE FEEDBACK */}
                        {error && (
                            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 !p-4 text-xs text-red-700">
                                <span className="font-bold">Notice:</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* SECTION NAVIGATION */}
                        <section className="mt-6 rounded-2xl border border-purple-100 bg-white shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between gap-3 border-b border-gray-100 !px-4 sm:!px-6 !pt-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-purple-600">
                                        Candidate Details
                                    </p>
                                    <p className="mt-1 mb-3 text-xs text-gray-500">
                                        Explore the applicant's profile
                                    </p>
                                </div>

                                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-100 !px-3 !py-1.5 text-[10px] font-medium text-purple-700">
                                    <CheckCircle2 size={12} />
                                    Profile loaded
                                </span>
                            </div>

                            <div
                                className="flex items-center gap-2 overflow-x-auto !px-3 sm:!px-5"
                                style={{
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                }}
                            >
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const active = activeTab === tab.key;

                                    return (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`
    relative inline-flex shrink-0 items-center gap-2 !px-4 sm:!px-5 !py-3
    text-[11px] font-semibold whitespace-nowrap transition-all duration-300
    ${
        active
            ? "text-violet-600"
            : "text-gray-500 hover:bg-purple-50 hover:text-purple-700"
    }
`}
                                        >
                                            <Icon size={14} />
                                            {tab.label}

                                            {tab.key === "applications" && (
                                                <span className="rounded-full bg-gray-100 !px-1.5 !py-0.5 text-[9px] text-gray-600">
                                                    {applications.length || "↗"}
                                                </span>
                                            )}

                                            {active && (
    <span className="absolute bottom-0 left-3 right-3 h-[3px] rounded-t-full bg-gradient-to-r from-purple-600 to-fuchsia-500" />
)}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* TAB CONTENT */}
                        <div className="!py-5">
                            {activeTab === "overview" && (
                                <OverviewSection student={student} skills={skills} />
                            )}

                            {activeTab === "education" && (
                                <EducationSection student={student} />
                            )}

                            {activeTab === "skills" && (
                                <SkillsSection skills={skills} />
                            )}

                            {activeTab === "experience" && (
                                <ExperienceSection student={student} />
                            )}

                            {activeTab === "applications" && (
                                <ApplicationsSection
                                    applications={applications}
                                    applicationsLoading={applicationsLoading}
                                    applicationsError={applicationsError}
                                    applicationId={applicationId}
                                    updating={updating}
                                    changeStatus={changeStatus}
                                    getApplicationId={getApplicationId}
                                    getApplicationJobTitle={getApplicationJobTitle}
                                    getApplicationCompany={getApplicationCompany}
                                    getApplicationLocation={getApplicationLocation}
                                    getApplicationStatus={getApplicationStatus}
                                    getApplicationDate={getApplicationDate}
                                    getStatusClass={getStatusClass}
                                    formatDate={formatDate}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ApplicantProfilePage;

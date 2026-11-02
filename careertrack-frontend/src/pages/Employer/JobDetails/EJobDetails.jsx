
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Search,
    MapPin,
    Briefcase,
    User,
    Pencil,
    Sparkles,
    Users,
    UserCheck,
    CalendarClock,
    Clock3,
    Building2,
    IndianRupee,
    Code2,
    FileText,
    ChevronRight,
    SlidersHorizontal,
    MoreHorizontal,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Eye,
    TrendingUp,
    CircleDot,
} from "lucide-react";

import {
    getJobById,
    getEmployerApplicants,
} from "../../../services/employerService";

import Sidebar from "../../../components/Sidebar/Sidebar";

const EJobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [activeTab, setActiveTab] = useState("APPLICANTS");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const storedUser = useMemo(() => {
        try {
            return JSON.parse(
                localStorage.getItem("careertrack_user") || "null"
            );
        } catch {
            return null;
        }
    }, []);

    const currentUserId = storedUser?.id;

    useEffect(() => {
        let cancelled = false;

        const loadJobDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const [jobData, applicantsData] = await Promise.all([
                    getJobById(id),
                    getEmployerApplicants(),
                ]);

                if (cancelled) return;

                setJob(jobData);

                const jobApplicants = Array.isArray(applicantsData)
                    ? applicantsData.filter((applicant) => {
                          const applicantJobId =
                              applicant.jobId ??
                              applicant.application?.jobId ??
                              applicant.job?.id;

                          return Number(applicantJobId) === Number(id);
                      })
                    : [];

                setApplicants(jobApplicants);
            } catch (err) {
                if (!cancelled) {
                    console.error("Job details error:", err);
                    setError(
                        err.message || "Unable to load job details."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadJobDetails();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const jobType =
        job?.jobtype || job?.jobType || "Full Time";

    const experienceValue =
        job?.experiencelevel ?? job?.experienceLevel;

    const experience =
        typeof experienceValue === "string" ||
        typeof experienceValue === "number"
            ? experienceValue
            : "Not specified";

    const company =
        job?.compony || job?.company || "Company";

    const isActive =
        job?.active === true || job?.active === "true";

    const isJobOwner =
        Number(currentUserId) === Number(job?.employerId);

    const filteredApplicants = useMemo(() => {
        return applicants.filter((applicant) => {
            const name =
                applicant.studentName || applicant.name || "";

            const email = applicant.email || "";

            const matchesSearch =
                name.toLowerCase().includes(search.toLowerCase()) ||
                email.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                status === "ALL" || applicant.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [applicants, search, status]);

    const statusCounts = useMemo(() => {
        const count = (value) =>
            applicants.filter((applicant) => {
                const current = (
                    applicant.status || "APPLIED"
                ).toUpperCase();

                return current === value;
            }).length;

        return {
            applied: count("APPLIED"),
            shortlisted: count("SHORTLISTED"),
            interviews: count("INTERVIEW"),
            selected: count("SELECTED"),
            rejected: count("REJECTED"),
        };
    }, [applicants]);

    const getStatusStyle = (applicantStatus) => {
        switch (applicantStatus) {
            case "SHORTLISTED":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";

            case "INTERVIEW":
                return "bg-amber-50 text-amber-700 border-amber-100";

            case "SELECTED":
                return "bg-purple-50 text-purple-700 border-purple-100";

            case "REJECTED":
                return "bg-rose-50 text-rose-700 border-rose-100";

            case "APPLIED":
            default:
                return "bg-sky-50 text-sky-700 border-sky-100";
        }
    };

    const getStatusLabel = (applicantStatus) => {
        switch (applicantStatus) {
            case "SHORTLISTED":
                return "Shortlisted";
            case "INTERVIEW":
                return "Interview";
            case "SELECTED":
                return "Selected";
            case "REJECTED":
                return "Rejected";
            case "APPLIED":
                return "Applied";
            default:
                return applicantStatus || "Applied";
        }
    };

    const getApplicantName = (applicant) =>
        applicant.studentName || applicant.name || "Unknown";

    const getApplicantExperience = (applicant) => {
        const value =
            applicant.experience ?? applicant.experienceLevel;

        if (typeof value === "string" || typeof value === "number") {
            return value || "—";
        }

        if (Array.isArray(value)) {
            return (
                value
                    .map((item) =>
                        typeof item === "string"
                            ? item
                            : item?.jobTitle || item?.companyName
                    )
                    .filter(Boolean)
                    .join(", ") || "—"
            );
        }

        if (value && typeof value === "object") {
            return (
                value.jobTitle ||
                value.companyName ||
                "Experience available"
            );
        }

        return "—";
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return "—";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) return "—";

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatSalary = (value) => {
        if (value === null || value === undefined || value === "") {
            return "—";
        }

        return Number(value).toLocaleString("en-IN");
    };

    const tabs = [
        { id: "OVERVIEW", label: "Overview", icon: FileText },
        { id: "APPLICANTS", label: "Applicants", icon: Users },
        { id: "DETAILS", label: "Job Details", icon: Briefcase },
    ];

    const stats = [
        {
            label: "Total Applicants",
            value: applicants.length,
            icon: Users,
            iconBg: "bg-violet-100",
            iconColor: "text-violet-600",
            accent: "from-violet-500 to-purple-500",
            note: "For this job",
        },
        {
            label: "Shortlisted",
            value: statusCounts.shortlisted,
            icon: UserCheck,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            accent: "from-emerald-400 to-teal-500",
            note: "Candidates shortlisted",
        },
        {
            label: "Interviews",
            value: statusCounts.interviews,
            icon: CalendarClock,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            accent: "from-amber-400 to-orange-500",
            note: "Interview stage",
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center animate-pulse">
                        <Briefcase className="text-purple-600" size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                        Preparing your job workspace...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#faf8ff] !p-6">
                <div className="max-w-3xl mx-auto mt-10 bg-white border border-rose-100 rounded-3xl !p-8 text-center shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                        <XCircle size={28} />
                    </div>
                    <h2 className="mt-4 text-lg font-bold text-gray-900">
                        Unable to load job details
                    </h2>
                    <p className="mt-2 text-sm text-rose-600">{error}</p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            onClick={() => navigate("/employer/jobs")}
                            className="flex items-center gap-2 !px-4 !py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                        >
                            <ArrowLeft size={15} />
                            Back to Jobs
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 !px-4 !py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
                        >
                            <RefreshCw size={15} />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center !p-6">
                <div className="bg-white border border-purple-100 rounded-3xl !p-8 text-center shadow-sm">
                    <Briefcase className="mx-auto text-purple-400" size={32} />
                    <h2 className="mt-4 text-lg font-bold text-gray-900">
                        Job not found
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        This job may have been removed or is unavailable.
                    </p>
                    <button
                        onClick={() => navigate("/employer/jobs")}
                        className="mt-5 !px-5 !py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
                    >
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf8ff] grid grid-cols-[250px_minmax(0,1fr)] gap-4 lg:gap-7 !pr-2">
            {/* Sidebar */}
            <aside className="h-screen sticky top-0 self-start z-20">
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            </aside>

            {/* Main content */}
            <main className="min-w-0 w-full max-w-[1500px] mx-auto !px-2 sm:px-4 lg:px-5 !py-6 lg:py-8">

                {/* Hero header */}
                <section className="relative overflow-hidden bg-gradient-to-br from-[#38216F] via-[#5937A7] to-[#7C4DDA] rounded-3xl !p-5 sm:p-7 lg:p-8 shadow-xl shadow-purple-200/50">
                    <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                    <div className="absolute right-24 -bottom-28 w-60 h-60 rounded-full bg-fuchsia-300/10 blur-3xl pointer-events-none" />
                    <div className="absolute right-8 top-8 opacity-10 pointer-events-none hidden sm:block">
                        <Briefcase size={150} />
                    </div>

                    <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                        <div className="flex items-start gap-4 min-w-0">
                            <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg">
                                <Briefcase size={27} />
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-[0.16em] font-semibold text-purple-100">
                                        <Sparkles size={13} />
                                        Employer Workspace
                                    </span>
                                    <span className="text-purple-200/70">/</span>
                                    <span className="text-xs text-purple-100/80">
                                        Job #{job.id}
                                    </span>
                                </div>

                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight break-words">
                                    {job.title || "Untitled Job"}
                                </h1>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs sm:text-sm text-purple-100">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Building2 size={14} />
                                        {company}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin size={14} />
                                        {job.location || "Location not specified"}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mt-4">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/15 !px-3 !py-1.5 text-xs text-white">
                                        <Briefcase size={12} />
                                        {jobType}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/15 !px-3 !py-1.5 text-xs text-white">
                                        <User size={12} />
                                        {experience}
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full border !px-3 !py-1.5 text-xs font-semibold ${
                                            isActive
                                                ? "bg-emerald-400/15 text-emerald-100 border-emerald-200/30"
                                                : "bg-orange-400/15 text-orange-100 border-orange-200/30"
                                        }`}
                                    >
                                        <CircleDot size={11} />
                                        {isActive ? "Active Job" : "Inactive Job"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex flex-wrap items-center gap-3 xl:justify-end">
                            <div className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm !px-4 !py-3 min-w-[145px]">
                                <p className="text-xs text-purple-100">Salary Range</p>
                                <p className="text-lg font-bold text-white mt-1">
                                    ₹{formatSalary(job.salaryMin)}
                                    {" - "}
                                    ₹{formatSalary(job.salaryMax)}
                                </p>
                            </div>

                            {isJobOwner && (
                                <button
                                    onClick={() =>
                                        navigate(`/employer/jobs/edit/${job.id}`)
                                    }
                                    className="inline-flex items-center justify-center gap-2 !px-4 !py-3 rounded-xl bg-white text-purple-700 text-sm font-semibold shadow-lg hover:bg-purple-50 hover:-translate-y-0.5 transition-all"
                                >
                                    <Pencil size={15} />
                                    Edit Job
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Applicant statistics */}
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="group relative overflow-hidden bg-white border border-purple-100 rounded-2xl !p-5 shadow-sm hover:shadow-lg hover:shadow-purple-100/50 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <div
                                    className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${stat.accent}`}
                                />
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm font-medium text-gray-500">
                                            {stat.label}
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mt-2 tabular-nums">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {stat.note}
                                        </p>
                                    </div>
                                    <div
                                        className={`shrink-0 w-12 h-12 rounded-2xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
                                    >
                                        <Icon size={23} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* Candidate pipeline */}
                <section className="mt-5 bg-white border border-purple-100 rounded-2xl !p-5 sm:!p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                Candidate Pipeline
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Track applicants as they move through your hiring process.
                            </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-100 rounded-full !px-3 !py-1.5 w-fit">
                            <TrendingUp size={13} />
                            Hiring overview
                        </span>
                    </div>

                    {applicants.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-purple-200 bg-purple-50/40 !p-5 text-center">
                            <Users size={25} className="mx-auto text-purple-300" />
                            <p className="text-sm font-semibold text-gray-700 mt-2">
                                Your candidate pipeline is ready
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Applicant statistics will appear here when candidates apply.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex h-3 overflow-hidden rounded-full bg-gray-100 gap-0.5">
                                {[
                                    {
                                        key: "applied",
                                        count: statusCounts.applied,
                                        color: "bg-violet-500",
                                    },
                                    {
                                        key: "shortlisted",
                                        count: statusCounts.shortlisted,
                                        color: "bg-emerald-400",
                                    },
                                    {
                                        key: "interviews",
                                        count: statusCounts.interviews,
                                        color: "bg-amber-400",
                                    },
                                    {
                                        key: "selected",
                                        count: statusCounts.selected,
                                        color: "bg-sky-400",
                                    },
                                    {
                                        key: "rejected",
                                        count: statusCounts.rejected,
                                        color: "bg-rose-400",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.key}
                                        className={`${item.color} transition-all duration-300`}
                                        style={{
                                            width: `${(item.count / applicants.length) * 100}%`,
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-5">
                                {[
                                    {
                                        label: "Applied",
                                        count: statusCounts.applied,
                                        dot: "bg-violet-500",
                                    },
                                    {
                                        label: "Shortlisted",
                                        count: statusCounts.shortlisted,
                                        dot: "bg-emerald-400",
                                    },
                                    {
                                        label: "Interview",
                                        count: statusCounts.interviews,
                                        dot: "bg-amber-400",
                                    },
                                    {
                                        label: "Selected",
                                        count: statusCounts.selected,
                                        dot: "bg-sky-400",
                                    },
                                    {
                                        label: "Rejected",
                                        count: statusCounts.rejected,
                                        dot: "bg-rose-400",
                                    },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.dot}`} />
                                        <div className="min-w-0">
                                            <p className="text-xs text-gray-500">
                                                {item.label}
                                            </p>
                                            <p className="text-lg font-bold text-gray-800 tabular-nums">
                                                {item.count}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </section>

                {/* Tabs */}
                <section className="mt-6">
                    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto border-b border-purple-100">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isSelected = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative shrink-0 inline-flex items-center gap-2 !px-4 sm:!px-5 !py-4 text-xs sm:text-sm font-semibold transition ${
                                        isSelected
                                            ? "text-purple-700"
                                            : "text-gray-500 hover:text-purple-600"
                                    }`}
                                >
                                    <Icon size={15} />
                                    {tab.label}

                                    {tab.id === "APPLICANTS" && (
                                        <span
                                            className={`rounded-full !px-2 !py-0.5 text-[10px] ${
                                                isSelected
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}
                                        >
                                            {applicants.length}
                                        </span>
                                    )}

                                    <span
                                        className={`absolute bottom-0 left-3 right-3 h-[3px] rounded-t-full transition ${
                                            isSelected
                                                ? "bg-purple-600"
                                                : "bg-transparent"
                                        }`}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Applicants tab */}
                {activeTab === "APPLICANTS" && (
                    <section className="mt-5 bg-white border border-purple-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="!p-5 sm:!p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                                            <Users size={18} />
                                        </div>
                                        <h2 className="text-base sm:text-lg font-bold text-gray-900">
                                            Applicants
                                        </h2>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Review and explore candidates who applied for this position.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 border border-purple-100 !px-3 !py-2 text-xs font-medium text-purple-700">
                                        <Users size={13} />
                                        {filteredApplicants.length} shown
                                    </span>
                                </div>
                            </div>

                            {/* Search and filters */}
                            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_210px] gap-3 mt-5">
                                <div className="relative">
                                    <Search
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by candidate name or email..."
                                        className="w-full h-11 !pl-11 !pr-4 border border-gray-200 rounded-xl bg-gray-50/60 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-50 transition"
                                    />
                                </div>

                                <div className="relative">
                                    <SlidersHorizontal
                                        size={15}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none"
                                    />
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full h-11 !pl-10 !pr-3 border border-gray-200 rounded-xl bg-white text-sm text-gray-600 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 transition appearance-none"
                                    >
                                        <option value="ALL">All Statuses</option>
                                        <option value="APPLIED">Applied</option>
                                        <option value="SHORTLISTED">Shortlisted</option>
                                        <option value="INTERVIEW">Interview</option>
                                        <option value="SELECTED">Selected</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Applicant table */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[780px]">
                                <thead>
                                    <tr className="bg-[#FAF8FF] border-y border-purple-100">
                                        <th className="!px-5 !py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            Candidate
                                        </th>
                                        <th className="!px-4 !py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            Experience
                                        </th>
                                        <th className="!px-4 !py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            Application Status
                                        </th>
                                        <th className="!px-4 !py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            Applied On
                                        </th>
                                        <th className="!px-5 !py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredApplicants.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="!px-5 !py-14">
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="w-16 h-16 rounded-3xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                                                        <Search size={25} className="text-purple-400" />
                                                    </div>
                                                    <h3 className="mt-4 text-sm font-bold text-gray-800">
                                                        No applicants found
                                                    </h3>
                                                    <p className="mt-1.5 text-xs text-gray-500 max-w-sm">
                                                        {applicants.length === 0
                                                            ? "No candidates have applied for this job yet."
                                                            : "Try a different name, email, or application status."}
                                                    </p>

                                                    {(search || status !== "ALL") && (
                                                        <button
                                                            onClick={() => {
                                                                setSearch("");
                                                                setStatus("ALL");
                                                            }}
                                                            className="mt-4 inline-flex items-center gap-2 !px-4 !py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition"
                                                        >
                                                            <RefreshCw size={13} />
                                                            Clear Filters
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredApplicants.map((applicant) => {
                                            const name = getApplicantName(applicant);
                                            const initials = name
                                                .split(/\s+/)
                                                .filter(Boolean)
                                                .slice(0, 2)
                                                .map((part) => part.charAt(0).toUpperCase())
                                                .join("");

                                            return (
                                                <tr
                                                    key={
                                                        applicant.applicationId ??
                                                        applicant.id
                                                    }
                                                    className="group border-b border-gray-100 last:border-0 hover:bg-purple-50/40 transition-colors"
                                                >
                                                    <td className="!px-5 !py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-fuchsia-100 border border-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                                                                {initials || "?"}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition break-words">
                                                                    {name}
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-1 break-all">
                                                                    {applicant.email || "Email not provided"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="!px-4 !py-4">
                                                        <div className="flex items-start gap-2 text-xs text-gray-600 max-w-[200px]">
                                                            <Briefcase size={14} className="text-purple-400 shrink-0 mt-0.5" />
                                                            <span className="break-words">
                                                                {getApplicantExperience(applicant)}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="!px-4 !py-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 !px-3 !py-1.5 rounded-full border text-[10px] font-semibold whitespace-nowrap ${getStatusStyle(
                                                                applicant.status
                                                            )}`}
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                            {getStatusLabel(applicant.status)}
                                                        </span>
                                                    </td>

                                                    <td className="!px-4 !py-4">
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
                                                            <Clock3 size={14} className="text-gray-400" />
                                                            {formatDate(applicant.appliedAt)}
                                                        </div>
                                                    </td>

                                                    <td className="!px-5 !py-4">
                                                        <div className="flex items-center justify-end">
                                                            <button
                                                                onClick={() => {
    const applicantId =
        applicant.applicationId ?? applicant.id;

    if (applicantId != null) {
        navigate(`/employer/applicants/${applicantId}`);
    }
}}
                                                                className="inline-flex items-center gap-2 !px-3 !py-2 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold hover:bg-purple-600 hover:text-white hover:border-purple-600 transition"
                                                            >
                                                                <Eye size={14} />
                                                                View
                                                                <ChevronRight size={13} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Table footer */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 !px-5 !py-4 bg-gray-50/60 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                                Showing{" "}
                                <span className="font-semibold text-gray-700">
                                    {filteredApplicants.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-gray-700">
                                    {applicants.length}
                                </span>{" "}
                                applicants
                            </p>
                            <p className="text-[10px] text-gray-400">
                                Candidate records for this job
                            </p>
                        </div>
                    </section>
                )}

                {/* Overview tab */}
                {activeTab === "OVERVIEW" && (
                    <section className="mt-5 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-5">
                        <div className="bg-white border border-purple-100 rounded-2xl !p-5 sm:!p-7 shadow-sm">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                                    <FileText size={19} />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-gray-900">
                                        Job Overview
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Role summary and responsibilities
                                    </p>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 leading-7 whitespace-pre-line break-words">
                                {job.description ||
                                    "No job description available."}
                            </div>
                        </div>

                        <div className="bg-white border border-purple-100 rounded-2xl !p-5 shadow-sm h-fit">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <UserCheck size={19} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">
                                        Hiring Summary
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Current candidate progress
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 space-y-4">
                                {[
                                    {
                                        label: "Total applicants",
                                        value: applicants.length,
                                    },
                                    {
                                        label: "Shortlisted",
                                        value: statusCounts.shortlisted,
                                    },
                                    {
                                        label: "Interview stage",
                                        value: statusCounts.interviews,
                                    },
                                    {
                                        label: "Selected",
                                        value: statusCounts.selected,
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between gap-3"
                                    >
                                        <span className="text-xs text-gray-500">
                                            {item.label}
                                        </span>
                                        <span className="text-sm font-bold text-gray-800 tabular-nums">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setActiveTab("APPLICANTS")}
                                className="w-full mt-6 flex items-center justify-center gap-2 !px-4 !py-3 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition"
                            >
                                View Applicants
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </section>
                )}

                {/* Details tab */}
                {activeTab === "DETAILS" && (
                    <section className="mt-5 bg-white border border-purple-100 rounded-2xl !p-5 sm:!p-7 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                                <Briefcase size={19} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-gray-900">
                                    Job Details
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Position information and requirements
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {[
                                {
                                    label: "Company",
                                    value: company,
                                    icon: Building2,
                                    theme: "bg-purple-50 text-purple-600",
                                },
                                {
                                    label: "Location",
                                    value: job.location || "—",
                                    icon: MapPin,
                                    theme: "bg-cyan-50 text-cyan-600",
                                },
                                {
                                    label: "Job Type",
                                    value: jobType,
                                    icon: Briefcase,
                                    theme: "bg-pink-50 text-pink-600",
                                },
                                {
                                    label: "Experience Level",
                                    value: experience,
                                    icon: User,
                                    theme: "bg-amber-50 text-amber-600",
                                },
                                {
                                    label: "Minimum Salary",
                                    value:
                                        job.salaryMin != null
                                            ? `₹${formatSalary(job.salaryMin)}`
                                            : "—",
                                    icon: IndianRupee,
                                    theme: "bg-emerald-50 text-emerald-600",
                                },
                                {
                                    label: "Maximum Salary",
                                    value:
                                        job.salaryMax != null
                                            ? `₹${formatSalary(job.salaryMax)}`
                                            : "—",
                                    icon: IndianRupee,
                                    theme: "bg-teal-50 text-teal-600",
                                },
                            ].map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.label}
                                        className="group min-w-0 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-purple-50/40 !p-4 hover:border-purple-200 hover:shadow-md transition"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.theme}`}
                                        >
                                            <Icon size={18} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-4">
                                            {item.label}
                                        </p>
                                        <p className="text-sm font-bold text-gray-800 mt-1 break-words">
                                            {item.value}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50/40 !p-4">
                            <div className="flex items-center gap-2">
                                <Code2 size={17} className="text-purple-600" />
                                <h3 className="text-sm font-bold text-gray-800">
                                    Required Skills
                                </h3>
                            </div>

                            {job.skills ? (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {job.skills
                                        .split(",")
                                        .map((skill) => skill.trim())
                                        .filter(Boolean)
                                        .map((skill, index) => (
                                            <span
                                                key={`${skill}-${index}`}
                                                className="inline-flex items-center gap-1.5 !px-3 !py-1.5 rounded-lg bg-white border border-purple-100 text-xs font-medium text-purple-700"
                                            >
                                                <CheckCircle2 size={12} />
                                                {skill}
                                            </span>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 mt-3">
                                    No required skills specified.
                                </p>
                            )}
                        </div>

                        <div className="mt-5 rounded-2xl border border-gray-100 !p-4">
                            <div className="flex items-center gap-2">
                                <FileText size={17} className="text-purple-600" />
                                <h3 className="text-sm font-bold text-gray-800">
                                    Job Description
                                </h3>
                            </div>
                            <p className="mt-3 text-sm text-gray-600 leading-7 whitespace-pre-line break-words">
                                {job.description ||
                                    "No job description available."}
                            </p>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default EJobDetails;

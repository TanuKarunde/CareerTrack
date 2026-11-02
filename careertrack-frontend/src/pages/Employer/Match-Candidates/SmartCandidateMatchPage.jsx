
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ArrowUpRight,
    BrainCircuit,
    BriefcaseBusiness,
    CheckCircle2,
    CircleAlert,
    FileSearch,
    LoaderCircle,
    RefreshCw,
    Sparkles,
    Target,
    UserRound,
    XCircle,
    Mail,
    Trophy,
    Users,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    Zap,
    GraduationCap,
} from "lucide-react";

import { getSmartCandidateMatches } from "../../../services/employerService";
import Sidebar from "../../../components/Sidebar/Sidebar";
import EmployerNavbar from "../ENavbar/EmployerNavbar";

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const formatLabel = (value) => {
    if (!value) return "Unknown";

    return String(value)
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getInitials = (name) => {
    if (!name) return "NA";

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
};

const getScoreColor = (score) => {
    if (score >= 75) return "text-emerald-700";
    if (score >= 50) return "text-amber-700";
    return "text-rose-700";
};

const getScoreBarColor = (score) => {
    if (score >= 75) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
};

const getMatchLabel = (score) => {
    if (score >= 75) return "Strong match";
    if (score >= 50) return "Moderate match";
    return "Skills gap";
};

const normalizeList = (value) => {
    if (Array.isArray(value)) {
        return value.filter(
            (item) => typeof item === "string" && item.trim()
        );
    }

    return [];
};

const getScore = (value) =>
    typeof value === "number" && Number.isFinite(value)
        ? Math.max(0, Math.min(100, value))
        : null;

// --------------------------------------------------
// SCORE BAR
// --------------------------------------------------

function ScoreBar({ label, score, icon: Icon }) {
    const safeScore = getScore(score);
    const available = safeScore !== null;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
                    {Icon && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                            <Icon size={15} />
                        </div>
                    )}

                    <span>{label}</span>
                </div>

                <span
                    className={`shrink-0 text-sm font-bold ${
                        available
                            ? getScoreColor(safeScore)
                            : "text-gray-400"
                    }`}
                >
                    {available ? `${safeScore}/100` : "N/A"}
                </span>
            </div>

            <div
                className="h-2 overflow-hidden rounded-full bg-gray-100"
                role="progressbar"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={available ? safeScore : undefined}
            >
                <div
                    className={`h-full rounded-full transition-all duration-700 ${
                        available
                            ? getScoreBarColor(safeScore)
                            : "bg-gray-300"
                    }`}
                    style={{ width: `${safeScore ?? 0}%` }}
                />
            </div>
        </div>
    );
}

// --------------------------------------------------
// MATCH SCORE RING
// --------------------------------------------------

function MatchRing({ score }) {
    const safeScore = getScore(score);
    const available = safeScore !== null;

    const color =
        !available
            ? "#d1d5db"
            : safeScore >= 75
              ? "#10b981"
              : safeScore >= 50
                ? "#f59e0b"
                : "#f43f5e";

    return (
        <div
            className="relative flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-full"
            style={{
                background: `conic-gradient(${color} ${
                    (safeScore ?? 0) * 3.6
                }deg, #f3f4f6 0deg)`,
            }}
            role="img"
            aria-label={
                available
                    ? `Match score ${safeScore}%`
                    : "Match score unavailable"
            }
        >
            <div className="flex h-[78px] w-[78px] flex-col items-center justify-center rounded-full bg-white shadow-inner">
                <span
                    className={`text-2xl font-extrabold tracking-tight ${
                        available
                            ? getScoreColor(safeScore)
                            : "text-gray-400"
                    }`}
                >
                    {available ? `${safeScore}%` : "—"}
                </span>

                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Match
                </span>
            </div>
        </div>
    );
}

// --------------------------------------------------
// SKILL TAG
// --------------------------------------------------

function SkillTag({ children, type }) {
    const styles = {
        matched:
            "border-emerald-200 bg-emerald-50 text-emerald-800",
        missing:
            "border-rose-200 bg-rose-50 text-rose-800",
        neutral:
            "border-gray-200 bg-gray-50 text-gray-700",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-lg border !px-2.5 !py-1.5 text-xs font-medium ${
                styles[type] || styles.neutral
            }`}
        >
            {type === "matched" && <CheckCircle2 size={12} />}
            {type === "missing" && <XCircle size={12} />}
            {children}
        </span>
    );
}

// --------------------------------------------------
// APPLICATION STATUS
// --------------------------------------------------

function ApplicationStatus({ status }) {
    const normalized = String(status || "UNKNOWN").toUpperCase();

    const styles = {
        APPLIED:
            "bg-blue-50 text-blue-700 ring-blue-600/20",
        SHORTLISTED:
            "bg-violet-50 text-violet-700 ring-violet-600/20",
        INTERVIEW:
            "bg-amber-50 text-amber-700 ring-amber-600/20",
        SELECTED:
            "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        REJECTED:
            "bg-rose-50 text-rose-700 ring-rose-600/20",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full !px-2.5 !py-1 text-[11px] font-bold ring-1 ring-inset ${
                styles[normalized] ||
                "bg-gray-100 text-gray-700 ring-gray-300"
            }`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {formatLabel(normalized)}
        </span>
    );
}

// --------------------------------------------------
// CANDIDATE CARD
// --------------------------------------------------

function CandidateCard({ candidate, rank, onViewProfile }) {
    const [showDetails, setShowDetails] = useState(false);

    const matchedSkills = normalizeList(candidate.matchedSkills);
    const missingSkills = normalizeList(candidate.missingSkills);
    const matchReasons = normalizeList(candidate.matchReasons);

    const matchScore = getScore(candidate.matchScore);

    const isTopCandidate = rank === 1 && matchScore !== null;

    return (
        <article className="group relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/60">
            {/* Decorative top accent */}
            <div
                className={`absolute left-0 top-0 h-1 w-full ${
                    isTopCandidate
                        ? "bg-gradient-to-r from-amber-400 via-purple-500 to-fuchsia-500"
                        : "bg-gradient-to-r from-purple-400 to-fuchsia-400 opacity-40 group-hover:opacity-100"
                }`}
            />

            {/* Candidate identity */}
            <div className="!p-5 sm:!p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                        <div className="relative shrink-0">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-base font-extrabold text-white shadow-lg shadow-purple-200">
                                {getInitials(candidate.studentName)}
                            </div>

                            {isTopCandidate && (
                                <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-amber-400 text-amber-950 shadow-sm">
                                    <Trophy size={13} />
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-lg bg-gray-100 !px-2 !py-1 text-[10px] font-extrabold tracking-wider text-gray-500">
                                    RANK #{rank}
                                </span>

                                {isTopCandidate && (
                                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 !px-2 !py-1 text-[10px] font-bold text-amber-700">
                                        <Sparkles size={11} />
                                        TOP MATCH
                                    </span>
                                )}
                            </div>

                            <h2 className="mt-2 break-words text-lg font-extrabold tracking-tight text-gray-900 sm:text-xl">
                                {candidate.studentName ||
                                    "Unnamed candidate"}
                            </h2>

                            <p className="mt-1 flex min-w-0 items-center gap-2 break-all text-sm text-gray-500">
                                <Mail
                                    size={14}
                                    className="shrink-0 text-gray-400"
                                />
                                {candidate.email || "Email unavailable"}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <ApplicationStatus
                                    status={candidate.applicationStatus}
                                />

                                <span className="text-xs text-gray-400">
                                    Application #
                                    {candidate.applicationId ?? "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Score display */}
                    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gradient-to-r from-gray-50 to-purple-50/60 !p-4 xl:min-w-[245px] xl:justify-between">
                        <MatchRing score={matchScore} />

                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-500">
                                Overall compatibility
                            </p>

                            <p
                                className={`mt-1 text-sm font-extrabold ${
                                    matchScore === null
                                        ? "text-gray-400"
                                        : getScoreColor(matchScore)
                                }`}
                            >
                                {matchScore === null
                                    ? "Not available"
                                    : getMatchLabel(matchScore)}
                            </p>

                            <p className="mt-2 text-[11px] leading-5 text-gray-500">
                                Based on available job and candidate data
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Skills comparison */}
            <div className="grid grid-cols-1 gap-6 !p-5 sm:!p-6 lg:grid-cols-2">
                <section>
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CheckCircle2 size={16} />
                            </div>
                            Matched skills
                        </h3>

                        <span className="rounded-full bg-emerald-50 !px-2.5 !py-1 text-xs font-bold text-emerald-700">
                            {matchedSkills.length}
                        </span>
                    </div>

                    {matchedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {matchedSkills.map((skill) => (
                                <SkillTag
                                    key={skill}
                                    type="matched"
                                >
                                    {skill}
                                </SkillTag>
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-xl border border-dashed border-gray-200 !p-3 text-xs text-gray-400">
                            No matched skills reported.
                        </p>
                    )}
                </section>

                <section>
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                                <Target size={16} />
                            </div>
                            Skills to develop
                        </h3>

                        <span className="rounded-full bg-rose-50 !px-2.5 !py-1 text-xs font-bold text-rose-700">
                            {missingSkills.length}
                        </span>
                    </div>

                    {missingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {missingSkills.map((skill) => (
                                <SkillTag
                                    key={skill}
                                    type="missing"
                                >
                                    {skill}
                                </SkillTag>
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 !p-3 text-xs text-emerald-700">
                            No missing required skills reported.
                        </p>
                    )}
                </section>
            </div>

            {/* Assessment scores */}
            <div className="!px-5 !pb-5 sm:!px-6 sm:!pb-6">
                <section className="rounded-2xl border border-gray-100 bg-[#faf9ff] !p-4 sm:!p-5">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-sm font-extrabold text-gray-900">
                                Candidate assessment
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                                Breakdown of available evaluation scores
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                            <BrainCircuit size={20} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
                        <ScoreBar
                            label="Job readiness"
                            score={candidate.readinessScore}
                            icon={BrainCircuit}
                        />

                        <ScoreBar
                            label="Resume score"
                            score={candidate.resumeScore}
                            icon={FileSearch}
                        />

                        <ScoreBar
                            label="Resume job match"
                            score={candidate.resumeJobMatchScore}
                            icon={BriefcaseBusiness}
                        />
                    </div>

                    {candidate.readinessReportAvailable === false && (
                        <p className="mt-4 text-xs text-gray-500">
                            Job-readiness report is not available.
                        </p>
                    )}

                    {candidate.resumeAnalysisAvailable === false && (
                        <p className="mt-2 text-xs text-gray-500">
                            Resume analysis is not available.
                        </p>
                    )}
                </section>
            </div>

            {/* Reasons accordion */}
            <div className="!px-5 !pb-5 sm:!px-6 sm:!pb-6">
                <button
                    type="button"
                    onClick={() =>
                        setShowDetails((previous) => !previous)
                    }
                    aria-expanded={showDetails}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 !px-4 !py-3.5 text-left transition hover:border-purple-200 hover:bg-purple-50/50"
                >
                    <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                            <Sparkles size={17} />
                        </span>

                        <span>
                            <span className="block text-sm font-bold text-gray-800">
                                Why this candidate matches
                            </span>

                            <span className="mt-0.5 block text-xs text-gray-500">
                                View the available match explanations
                            </span>
                        </span>
                    </span>

                    {showDetails ? (
                        <ChevronUp
                            size={18}
                            className="shrink-0 text-purple-600"
                        />
                    ) : (
                        <ChevronDown
                            size={18}
                            className="shrink-0 text-purple-600"
                        />
                    )}
                </button>

                {showDetails && (
                    <div className="mt-3 rounded-2xl border border-purple-100 bg-purple-50/50 !p-4 sm:!p-5">
                        {matchReasons.length > 0 ? (
                            <ul className="space-y-3">
                                {matchReasons.map((reason, index) => (
                                    <li
                                        key={`${index}-${reason}`}
                                        className="flex items-start gap-3 text-sm leading-6 text-gray-700"
                                    >
                                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-purple-600 shadow-sm">
                                            <CheckCircle2 size={14} />
                                        </span>

                                        <span>{reason}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">
                                No match explanation is available for this candidate.
                            </p>
                        )}

                        <p className="mt-4 border-t border-purple-100 pt-3 text-xs leading-5 text-gray-500">
                            Scores are decision-support indicators based on
                            available data. Review the applicant's full
                            qualifications before making a hiring decision.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-4 border-t border-gray-100 bg-gray-50/70 !p-5 sm:flex-row sm:items-center sm:justify-between sm:!px-6">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <GraduationCap size={15} className="text-purple-500" />
                        Student ID: {candidate.studentId ?? "N/A"}
                    </span>

                    <span className="flex items-center gap-1.5">
                        <ShieldCheck size={15} className="text-emerald-600" />
                        Application data
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        onViewProfile(candidate.applicationId)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 !px-5 !py-3 text-sm font-bold text-white shadow-md transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                    View applicant profile
                    <ArrowUpRight size={16} />
                </button>
            </div>
        </article>
    );
}

// --------------------------------------------------
// SUMMARY CARD
// --------------------------------------------------

function SummaryCard({ title, value, description, icon: Icon, color }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white !p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100/50">
            <div
                className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-2xl ${color}`}
            />

            <div className="relative flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        {title}
                    </p>

                    <p className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
                        {value}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                        {description}
                    </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700 ring-1 ring-purple-100">
                    <Icon size={21} />
                </div>
            </div>
        </div>
    );
}

// --------------------------------------------------
// MAIN PAGE
// --------------------------------------------------

export default function SmartCandidateMatchPage() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCandidates = useCallback(async () => {
        if (!jobId || !/^\d+$/.test(jobId)) {
            setError(
                "Invalid job ID. Please open Smart Match from a valid job."
            );
            setCandidates([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await getSmartCandidateMatches(jobId);

            const result = Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                  ? response.data
                  : null;

            if (!result) {
                throw new Error(
                    "The server returned an unexpected response."
                );
            }

            const ranked = [...result].sort((a, b) => {
                const scoreA = getScore(a.matchScore);
                const scoreB = getScore(b.matchScore);

                return (scoreB ?? -1) - (scoreA ?? -1);
            });

            setCandidates(ranked);
        } catch (err) {
            console.error(
                "Failed to load smart candidate matches:",
                err
            );

            const status =
                err?.response?.status ?? err?.status;

            if (status === 401) {
                setError(
                    "Your session may have expired. Please sign in again."
                );
            } else if (status === 403) {
                setError(
                    "You don't have permission to view matches for this job."
                );
            } else if (status === 404) {
                setError("This job could not be found.");
            } else {
                setError(
                    err?.message ||
                        "Unable to load candidate matches. Please try again."
                );
            }

            setCandidates([]);
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    useEffect(() => {
        loadCandidates();
    }, [loadCandidates]);

    const handleViewProfile = (applicationId) => {
        if (applicationId == null) return;

        navigate(`/employer/applicants/${applicationId}`);
    };

    const totalCandidates = candidates.length;

    const strongMatches = candidates.filter(
        (candidate) =>
            getScore(candidate.matchScore) !== null &&
            getScore(candidate.matchScore) >= 75
    ).length;

    const assessedCandidates = candidates.filter(
        (candidate) =>
            candidate.readinessReportAvailable ||
            candidate.resumeAnalysisAvailable
    ).length;

    const averageScore =
        candidates.filter(
            (candidate) => getScore(candidate.matchScore) !== null
        ).length > 0
            ? Math.round(
                  candidates.reduce(
                      (total, candidate) =>
                          total + (getScore(candidate.matchScore) ?? 0),
                      0
                  ) /
                      candidates.filter(
                          (candidate) =>
                              getScore(candidate.matchScore) !== null
                      ).length
              )
            : null;

    return (
        <div className="min-h-screen bg-[#f8f7ff] text-gray-900">
            <div className="grid min-h-screen grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)]">
                {/* Sidebar: separate column to avoid navbar overlap */}
                <aside className="hidden md:block">
                    <div className="sticky top-0 h-screen overflow-y-auto">
                        <Sidebar />
                    </div>
                </aside>

                {/* Main employer workspace */}
                <main className="min-w-0">
                    <EmployerNavbar />

                    <div className="mx-auto max-w-[1600px] !p-4 sm:!p-6 xl:!p-8">
                        {/* Back navigation */}
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-purple-700"
                        >
                            <ArrowLeft size={17} />
                            Back to previous page
                        </button>

                        {/* Hero */}
                        <section className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-br from-[#28175f] via-[#5427a9] to-[#9146df] !p-6 text-white shadow-xl shadow-purple-200/60 sm:!p-8">
                            <div className="pointer-events-none absolute -right-10 -top-16 h-60 w-60 rounded-full border-[32px] border-white/10" />
                            <div className="pointer-events-none absolute bottom-[-70px] right-[25%] h-48 w-48 rounded-full bg-fuchsia-400/20 blur-3xl" />

                            <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
                                <div className="max-w-2xl">
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-1.5 text-xs font-semibold text-purple-100">
                                        <Sparkles size={14} />
                                        AI-POWERED HIRING ASSISTANT
                                    </div>

                                    <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl xl:text-4xl">
                                        Smart Candidate Match
                                    </h1>

                                    <p className="mt-3 max-w-xl text-sm leading-6 text-purple-100 sm:text-base">
                                        Discover promising applicants by
                                        comparing their skills, job readiness,
                                        and available resume assessments.
                                    </p>

                                    <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-purple-100">
                                        <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 !px-3 !py-2">
                                            <BriefcaseBusiness size={14} />
                                            Job ID: {jobId || "N/A"}
                                        </span>

                                        <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 !px-3 !py-2">
                                            <Zap size={14} />
                                            Ranked by match score
                                        </span>
                                    </div>
                                </div>

                                <div className="relative flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 !p-4 backdrop-blur-sm xl:min-w-[230px]">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                                        <Target size={25} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-purple-100">
                                            Average match score
                                        </p>

                                        <p className="mt-1 text-3xl font-extrabold">
                                            {loading
                                                ? "—"
                                                : averageScore === null
                                                  ? "N/A"
                                                  : `${averageScore}%`}
                                        </p>

                                        <p className="mt-1 text-[11px] text-purple-100">
                                            Based on available scores
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Error state */}
                        {!loading && error && (
                            <div
                                className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-white !p-5"
                                role="alert"
                            >
                                <div className="rounded-xl bg-rose-50 !p-3 text-rose-600">
                                    <CircleAlert size={22} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h2 className="font-bold text-gray-900">
                                        Couldn't load candidate matches
                                    </h2>

                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                        {error}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={loadCandidates}
                                        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-purple-600 !px-4 !py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                                    >
                                        <RefreshCw size={15} />
                                        Try again
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Loading state */}
                        {loading && (
                            <div
                                className="rounded-3xl border border-gray-100 bg-white !px-6 !py-16 text-center shadow-sm"
                                role="status"
                            >
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                                    <LoaderCircle
                                        size={32}
                                        className="animate-spin"
                                    />
                                </div>

                                <h2 className="mt-5 text-lg font-bold text-gray-900">
                                    Finding your best candidates
                                </h2>

                                <p className="mt-2 text-sm text-gray-500">
                                    Loading applications and assessment scores...
                                </p>

                                <div className="mx-auto mt-6 h-1.5 max-w-xs overflow-hidden rounded-full bg-gray-100">
                                    <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500" />
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        {!loading && !error && (
                            <>
                                {/* Summary statistics */}
                                <section className="mb-7">
                                    <div className="mb-4">
                                        <h2 className="text-lg font-extrabold text-gray-900">
                                            Matching overview
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Your candidate pool at a glance
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                                        <SummaryCard
                                            title="Total candidates"
                                            value={totalCandidates}
                                            description="Applicants for this job"
                                            icon={Users}
                                            color="bg-blue-200"
                                        />

                                        <SummaryCard
                                            title="Strong matches"
                                            value={strongMatches}
                                            description="Match score of 75% or above"
                                            icon={Trophy}
                                            color="bg-emerald-200"
                                        />

                                        <SummaryCard
                                            title="Candidates assessed"
                                            value={assessedCandidates}
                                            description="At least one assessment report"
                                            icon={BrainCircuit}
                                            color="bg-violet-200"
                                        />

                                        <SummaryCard
                                            title="Average match"
                                            value={
                                                averageScore === null
                                                    ? "N/A"
                                                    : `${averageScore}%`
                                            }
                                            description="Average available match score"
                                            icon={Target}
                                            color="bg-fuchsia-200"
                                        />
                                    </div>
                                </section>

                                {/* Explanation banner */}
                                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-fuchsia-50 !p-4 sm:!p-5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-purple-700 shadow-sm">
                                        <Sparkles size={19} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-bold text-gray-900">
                                            Your candidate shortlist starts here
                                        </h3>

                                        <p className="mt-1 text-sm leading-6 text-gray-600">
                                            Candidates are shown in descending
                                            order of their available match
                                            scores. Review skills, assessment
                                            scores, and profile details before
                                            making hiring decisions.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={loadCandidates}
                                        disabled={loading}
                                        aria-label="Refresh candidate matches"
                                        className="rounded-xl border border-purple-100 bg-white !p-2.5 text-purple-700 transition hover:bg-purple-100 disabled:opacity-50"
                                    >
                                        <RefreshCw size={16} />
                                    </button>
                                </div>

                                {/* Candidate list */}
                                {candidates.length === 0 ? (
                                    <section className="rounded-3xl border border-dashed border-gray-300 bg-white !px-6 !py-16 text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                                            <UserRound size={29} />
                                        </div>

                                        <h2 className="mt-5 text-lg font-extrabold text-gray-900">
                                            No applicants found
                                        </h2>

                                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                            No applications were returned for
                                            this job yet. Candidates will
                                            appear here when applications are
                                            available.
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => navigate(-1)}
                                            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-gray-200 !px-4 !py-2.5 text-sm font-semibold text-gray-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                                        >
                                            <ArrowLeft size={15} />
                                            Return to jobs
                                        </button>
                                    </section>
                                ) : (
                                    <section className="space-y-5">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                            <div>
                                                <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
                                                    Ranked applicants
                                                </h2>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Review each candidate's
                                                    strengths and skill gaps.
                                                </p>
                                            </div>

                                            <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white !px-3 !py-2 text-xs font-bold text-gray-600">
                                                <Users
                                                    size={14}
                                                    className="text-purple-600"
                                                />
                                                {candidates.length} candidate
                                                {candidates.length === 1
                                                    ? ""
                                                    : "s"}
                                            </span>
                                        </div>

                                        {candidates.map(
                                            (candidate, index) => (
                                                <CandidateCard
                                                    key={
                                                        candidate.applicationId ??
                                                        candidate.studentId ??
                                                        index
                                                    }
                                                    candidate={candidate}
                                                    rank={index + 1}
                                                    onViewProfile={
                                                        handleViewProfile
                                                    }
                                                />
                                            )
                                        )}
                                    </section>
                                )}

                                <p className="mt-7 text-center text-xs leading-5 text-gray-400">
                                    CareerTrack · Smart Candidate Matching
                                    <br />
                                    Match scores support decision-making; they
                                    do not replace a full review of candidate
                                    qualifications.
                                </p>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

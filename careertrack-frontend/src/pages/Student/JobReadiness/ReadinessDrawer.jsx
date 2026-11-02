import { useEffect, useState } from "react";
import {
    X,
    CheckCircle2,
    AlertCircle,
    Plus,
    ExternalLink,
    BarChart3,
    Target,
    Lightbulb,
    RefreshCw
} from "lucide-react";

import {
    calculateReadiness,
    getReadiness
} from "../../../services/readinessService";

const ReadinessDrawer = ({ isOpen, onClose, jobId }) => {

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen || !jobId) return;

        let cancelled = false;

        const loadReport = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getReadiness(jobId);

                if (!cancelled) {
                    setReport(data);
                }
            } catch {
                // A saved report may not exist yet.
                if (!cancelled) {
                    setReport(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadReport();

        return () => {
            cancelled = true;
        };
    }, [isOpen, jobId]);

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const matchedSkills = report?.matchedSkills ?? [];
    const missingSkills = report?.missingSkills ?? [];
    const score = Math.max(
        0,
        Math.min(100, Number(report?.readinessScore) || 0)
    );

    const handleCalculate = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await calculateReadiness(jobId);
            setReport(data);
        } catch (err) {
            setError(
                err?.message || "Unable to calculate job readiness."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleFullAnalysis = () => {
        onClose();
        window.location.href = `/student/jobs/${jobId}/readiness`;
    };

    return (
        <div className="fixed inset-0 z-[100]">

            {/* Dimmed background */}
            <button
                type="button"
                aria-label="Close readiness panel"
                onClick={onClose}
                className="absolute inset-0 h-full w-full cursor-default bg-slate-950/30 backdrop-blur-[3px]"
            />

            {/* Right-side drawer */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="readiness-drawer-title"
                className={`absolute right-0 top-0 flex h-full w-full max-w-[620px] flex-col bg-white shadow-2xl transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto !p-5 sm:p-7">

                    {/* Gradient header */}
                    <div className="relative rounded-2xl bg-gradient-to-r from-[#302D7D] via-[#82329A] to-[#E52DA2] !p-6 !pr-14 text-white">

                        <h2
                            id="readiness-drawer-title"
                            className="text-xl font-bold sm:text-2xl"
                        >
                            Boost Your Job Readiness
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-white/90">
                            Close your skill gaps and become a stronger
                            match for this role.
                        </p>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute right-4 top-4 rounded-full !p-2 transition hover:bg-black/50"
                        >
                            <X size={19} />
                        </button>
                    </div>

                    {/* Initial state */}
                    {!report && !loading && (
                        <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50 !p-6 text-center">

                            <Target
                                size={38}
                                className="mx-auto text-purple-600"
                            />

                            <h3 className="mt-3 font-semibold text-gray-900">
                                Check your job readiness
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Calculate your score to see matching skills,
                                missing skills, and ways to improve your profile.
                            </p>

                            <button
                                type="button"
                                onClick={handleCalculate}
                                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#5141D9] !px-5 !py-3 text-sm font-semibold text-white hover:bg-[#4332C5]"
                            >
                                <Target size={17} />
                                Check My Readiness
                            </button>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="flex flex-col items-center !py-16 text-center">
                            <RefreshCw
                                size={32}
                                className="animate-spin text-purple-600"
                            />

                            <p className="mt-4 font-medium text-gray-700">
                                Analyzing your profile...
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 !p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Report */}
                    {report && !loading && (
                        <>
                            {/* Score gauge */}
                            <div className="flex flex-col items-center !py-7">

                                <div className="relative h-[145px] w-[260px]">
                                    <svg
                                        viewBox="0 0 260 150"
                                        className="h-full w-full"
                                        role="img"
                                        aria-label={`Job readiness score ${score} out of 100`}
                                    >
                                        <path
                                            d="M 30 130 A 100 100 0 0 1 230 130"
                                            fill="none"
                                            stroke="#F8E5F2"
                                            strokeWidth="19"
                                            strokeLinecap="round"
                                        />

                                        <path
                                            d="M 30 130 A 100 100 0 0 1 230 130"
                                            fill="none"
                                            stroke="#E5008A"
                                            strokeWidth="19"
                                            strokeLinecap="round"
                                            pathLength="100"
                                            strokeDasharray={`${score} 100`}
                                        />
                                    </svg>

                                    <div className="absolute inset-x-0 bottom-1 text-center">
                                        <p className="text-sm font-medium text-gray-600">
                                            Job Readiness
                                        </p>

                                        <p className="mt-1 text-3xl font-bold text-gray-900">
                                            {score}
                                            <span className="text-lg text-gray-400">
                                                /100
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-1 text-sm text-gray-500">
                                    Based on your current profile and job requirements
                                </p>
                            </div>

                            {/* Required skills */}
                            <section>
                                <h3 className="border-b border-gray-100 !pb-3 text-lg font-bold text-gray-900">
                                    Skills required
                                </h3>

                                {/* Matched */}
                                <div className="mb-3 mt-4 flex items-center gap-2">
                                    <CheckCircle2
                                        size={19}
                                        className="text-green-600"
                                    />

                                    <h4 className="font-semibold text-gray-800">
                                        Matched Skills
                                    </h4>

                                    <span className="text-sm text-gray-400">
                                        ({matchedSkills.length})
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {matchedSkills.length > 0 ? (
                                        matchedSkills.map((skill) => (
                                            <div
                                                key={skill}
                                                className="flex items-center justify-between gap-3"
                                            >
                                                <span className="rounded-full bg-[#F0EBFF] !px-4 !py-2 text-sm font-medium text-[#3D327E]">
                                                    {skill}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 !px-3 !py-2 text-sm font-medium text-green-700">
                                                    <CheckCircle2 size={16} />
                                                    Matched
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            No matching skills found yet.
                                        </p>
                                    )}
                                </div>

                                {/* Missing */}
                                <div className="mb-3 mt-6 flex items-center gap-2">
                                    <AlertCircle
                                        size={19}
                                        className="text-purple-600"
                                    />

                                    <h4 className="font-semibold text-gray-800">
                                        Missing Skills
                                    </h4>

                                    <span className="text-sm text-gray-400">
                                        ({missingSkills.length})
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {missingSkills.length > 0 ? (
                                        missingSkills.map((skill) => (
                                            <div
                                                key={skill}
                                                className="flex flex-wrap items-center justify-between gap-3"
                                            >
                                                <span className="rounded-full bg-[#F0EBFF] !px-4 !py-2 text-sm font-medium text-[#3D327E]">
                                                    {skill}
                                                </span>

                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            onClose();
                                                            window.location.href =
                                                                "/student/profile";
                                                        }}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-[#39358B] !px-3 !py-2 text-sm font-medium text-white hover:bg-[#29256D]"
                                                    >
                                                        <Plus size={16} />
                                                        Add
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const query = encodeURIComponent(
                                                                `Learn ${skill} for a Java developer role`
                                                            );

                                                            window.open(
                                                                `https://www.google.com/search?q=${query}`,
                                                                "_blank",
                                                                "noopener,noreferrer"
                                                            );
                                                        }}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-[#39358B] !px-3 !py-2 text-sm font-medium text-white hover:bg-[#29256D]"
                                                    >
                                                        Learn
                                                        <ExternalLink size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="rounded-xl bg-green-50 !p-4 text-sm text-green-700">
                                            Great! No missing skills were reported.
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* Suggestions */}
                            {report.suggestions?.length > 0 && (
                                <section className="mt-7 border-t border-gray-100 !pt-5">
                                    <div className="mb-3 flex items-center gap-2">
                                        <Lightbulb
                                            size={20}
                                            className="text-purple-600"
                                        />

                                        <h3 className="font-bold text-gray-900">
                                            Your next steps
                                        </h3>
                                    </div>

                                    <div className="space-y-2">
                                        {report.suggestions.slice(0, 2).map(
                                            (suggestion, index) => (
                                                <p
                                                    key={index}
                                                    className="rounded-xl bg-purple-50 !p-3 text-sm leading-6 text-gray-700"
                                                >
                                                    {suggestion}
                                                </p>
                                            )
                                        )}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </div>

                {/* Sticky bottom action */}
                {report && !loading && (
                    <div className="border-t border-gray-100 bg-white !p-5 sm:px-7">
                        <button
                            type="button"
                            onClick={handleFullAnalysis}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5141D9] to-[#6939D4] !px-5 !py-3.5 font-semibold text-white shadow-sm transition hover:brightness-110"
                        >
                            <BarChart3 size={19} />
                            View Full Analysis
                            <ExternalLink size={17} />
                        </button>
                    </div>
                )}
            </aside>
        </div>
    );
};

export default ReadinessDrawer;

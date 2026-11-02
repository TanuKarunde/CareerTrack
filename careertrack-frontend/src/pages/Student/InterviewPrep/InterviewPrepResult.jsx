
import { useEffect, useState } from "react";
import {
    Trophy,
    Target,
    CheckCircle,
    ArrowLeft,
    RotateCcw,
    BarChart3,
    Sparkles,
    Award,
    Zap,
    CircleCheck,
    GraduationCap,
    ChartNoAxesCombined,
    ArrowUpRight,
    BrainCircuit,
    Medal,
    XCircle,
    TrendingUp
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getInterviewPrepResult } from "../../../services/interviewPrepService";

const InterviewPrepResult = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadResult();
    }, [sessionId]);

    const loadResult = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getInterviewPrepResult(sessionId);
            console.log("INTERVIEW PREP RESULT:", data);
            setResult(data);
        } catch (err) {
            console.error("Result error:", err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load Interview Prep result."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center !px-4">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-5">
                        <div className="absolute inset-0 rounded-2xl bg-purple-200 animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <BrainCircuit size={30} className="text-[#7545e8]" />
                        </div>
                    </div>

                    <h2 className="text-lg font-bold text-gray-800">
                        Preparing your results
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                        Analyzing your interview performance...
                    </p>

                    <div className="w-48 h-1.5 rounded-full bg-purple-100 overflow-hidden mx-auto mt-5">
                        <div className="h-full w-2/3 rounded-full bg-[#7545e8] animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center !px-4 !py-8">
                <div className="bg-white rounded-3xl shadow-xl border border-purple-100 !p-8 text-center max-w-md w-full">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
                        <Target size={30} className="text-red-500" />
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Unable to load results
                    </h2>

                    <p className="text-gray-500 text-sm leading-6 mb-6">
                        {error}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={loadResult}
                            className="!px-5 !py-3 bg-[#7545e8] text-white rounded-xl font-semibold hover:bg-[#6537d3] transition-colors"
                        >
                            Try Again
                        </button>

                        <button
                            onClick={() => navigate("/student/interview-prep")}
                            className="!px-5 !py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Back to Practice
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!result) {
        return null;
    }

    const percentage = Math.max(
        0,
        Math.min(100, Number(result.percentage) || 0)
    );

    const totalQuestions = Number(result.totalQuestions) || 0;
    const attemptedQuestions = Number(result.attemptedQuestions) || 0;

    const correctAnswers = Number(result.correctAnswers) || 0;
    const wrongAnswers = Number(result.wrongAnswers) || 0;

    const skippedQuestions = Math.max(
        0,
        totalQuestions - attemptedQuestions
    );

    const score = Number(result.totalScore) || 0;
    const maxScore = Number(result.maxScore) || 0;

    const accuracyRate =
        attemptedQuestions > 0
            ? (correctAnswers / attemptedQuestions) * 100
            : 0;

    const performance =
        percentage >= 85
            ? {
                title: "Outstanding Performance",
                subtitle: "You're interview-ready!",
                icon: Trophy,
                color: "text-emerald-600",
                badge: "bg-emerald-50 border-emerald-200 text-emerald-700",
                message:
                    "Excellent work! Keep practicing to maintain your momentum."
            }
            : percentage >= 70
                ? {
                    title: "Great Progress",
                    subtitle: "You're getting stronger!",
                    icon: Award,
                    color: "text-[#7545e8]",
                    badge: "bg-purple-50 border-purple-200 text-purple-700",
                    message:
                        "You're building a strong foundation. A little more practice can take you further."
                }
                : percentage >= 40
                    ? {
                        title: "Good Start",
                        subtitle: "Every attempt makes you better.",
                        icon: Zap,
                        color: "text-amber-600",
                        badge: "bg-amber-50 border-amber-200 text-amber-700",
                        message:
                            "Review the concepts you found difficult and try another practice session."
                    }
                    : {
                        title: "Your Growth Starts Here",
                        subtitle: "Keep learning, keep improving.",
                        icon: Target,
                        color: "text-blue-600",
                        badge: "bg-blue-50 border-blue-200 text-blue-700",
                        message:
                            "Focus on understanding the fundamentals. Progress comes with consistent practice."
                    };

    const PerformanceIcon = performance.icon;

    const stats = [
        {
            label: "Total Questions",
            value: totalQuestions,
            detail: "In this session",
            icon: Target,
            iconBg: "bg-violet-50",
            iconColor: "text-violet-600",
            progress: 100,
            barColor: "bg-violet-500"
        },
        {
            label: "Attempted",
            value: attemptedQuestions,
            detail: `${skippedQuestions} skipped`,
            icon: CircleCheck,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            progress:
                totalQuestions > 0
                    ? (attemptedQuestions / totalQuestions) * 100
                    : 0,
            barColor: "bg-emerald-500"
        },
        {
            label: "Your Score",
            value: `${percentage.toFixed(1)}%`,
            detail: `${score} of ${maxScore} points`,
            icon: ChartNoAxesCombined,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            progress: percentage,
            barColor: "bg-blue-500"
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8f7ff] text-gray-900 !px-4 sm:!px-6 !py-6 sm:!py-8">
            <div className="max-w-6xl mx-auto">

                {/* Top navigation */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
                    <div>
                        <button
                            onClick={() => navigate("/student/interview-prep")}
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#7545e8] transition-colors mb-4"
                        >
                            <ArrowLeft size={17} />
                            Back to Interview Prep
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7545e8] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-purple-200">
                                <GraduationCap size={23} className="text-white" />
                            </div>

                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    Your Interview Results
                                </h1>

                                <p className="text-sm text-gray-500 mt-1">
                                    Review your performance and plan your next step.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/student/interview-prep/scoreboard")}
                        className="inline-flex items-center justify-center gap-2 !px-5 !py-3 bg-white border border-purple-100 rounded-xl text-gray-700 text-sm font-semibold hover:border-[#7545e8] hover:text-[#7545e8] hover:shadow-md transition-all"
                    >
                        <BarChart3 size={18} />
                        View Scoreboard
                        <ArrowUpRight size={15} />
                    </button>
                </div>

                {/* Hero score card */}
                <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#24134f] via-[#4b268f] to-[#7545e8] !p-6 sm:!p-9 lg:!p-10 mb-7 shadow-xl shadow-purple-200/60">
                    <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full border border-white/10" />
                    <div className="absolute -top-12 -right-4 w-52 h-52 rounded-full border border-white/10" />
                    <div className="absolute -bottom-32 left-1/3 w-64 h-64 rounded-full bg-white/[0.04]" />

                    <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-9 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 !px-3 !py-1.5 rounded-full bg-white/10 border border-white/15 text-purple-100 text-xs font-semibold mb-5">
                                <Sparkles size={14} />
                                INTERVIEW SESSION COMPLETED
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                                    <PerformanceIcon size={25} className="text-yellow-300" />
                                </div>

                                <div>
                                    <p className="text-purple-200 text-sm">
                                        {result.topic || "Interview Practice"}
                                    </p>

                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                                        {performance.title}
                                    </h2>
                                </div>
                            </div>

                            <p className="text-purple-100 text-base sm:text-lg font-medium mb-3">
                                {performance.subtitle}
                            </p>

                            <p className="text-purple-100/75 text-sm leading-6 max-w-xl mb-7">
                                {performance.message}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 !px-3 !py-2 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-medium">
                                    <BrainCircuit size={15} />
                                    {result.experienceLevel || "Practice"}
                                </span>

                                <span className="inline-flex items-center gap-1.5 !px-3 !py-2 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-medium">
                                    <Target size={15} />
                                    {result.difficulty || "Mixed"} difficulty
                                </span>

                                <span className="inline-flex items-center gap-1.5 !px-3 !py-2 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-medium">
                                    <CheckCircle size={15} />
                                    {result.status || "COMPLETED"}
                                </span>
                            </div>
                        </div>

                        {/* Score ring */}
                        <div className="order-1 lg:order-2 flex justify-center">
                            <div
                                className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full flex items-center justify-center"
                                style={{
                                    background: `conic-gradient(#c4b5fd ${percentage * 3.6}deg, rgba(255,255,255,0.13) 0deg)`
                                }}
                            >
                                <div className="absolute inset-[10px] rounded-full bg-gradient-to-br from-[#321764] to-[#542ca0] flex items-center justify-center border border-white/10 shadow-inner">
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 mb-2">
                                            <Trophy size={19} className="text-yellow-300" />
                                        </div>

                                        <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                                            {percentage.toFixed(1)}
                                            <span className="text-2xl text-purple-200">%</span>
                                        </p>

                                        <p className="text-xs uppercase tracking-[0.2em] text-purple-200 mt-2">
                                            Overall Score
                                        </p>
                                    </div>
                                </div>

                                <div className="absolute top-3 right-5 w-3 h-3 rounded-full bg-yellow-300 shadow-lg shadow-yellow-300/50" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score summary strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
                    <div className="bg-white rounded-2xl border border-gray-100 !px-5 !py-5 shadow-sm">
                        <p className="text-sm text-gray-500 mb-2">Points earned</p>

                        <div className="flex items-end justify-between gap-3">
                            <p className="text-3xl font-extrabold text-gray-900">
                                {score}
                                <span className="text-base font-medium text-gray-400">
                                    {" "}/ {maxScore}
                                </span>
                            </p>

                            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                                <Medal size={21} className="text-violet-600" />
                            </div>
                        </div>

                        <div className="h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-700"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 !px-5 !py-5 shadow-sm">
                        <p className="text-sm text-gray-500 mb-2">Questions attempted</p>

                        <div className="flex items-end justify-between gap-3">
                            <p className="text-3xl font-extrabold text-gray-900">
                                {attemptedQuestions}
                                <span className="text-base font-medium text-gray-400">
                                    {" "}/ {totalQuestions}
                                </span>
                            </p>

                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <CheckCircle size={21} className="text-emerald-600" />
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 mt-3">
                            {totalQuestions > 0
                                ? `${((attemptedQuestions / totalQuestions) * 100).toFixed(0)}% of questions attempted`
                                : "No questions available"}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 !px-5 !py-5 shadow-sm">
                        <p className="text-sm text-gray-500 mb-2">Questions skipped</p>

                        <div className="flex items-end justify-between gap-3">
                            <p className="text-3xl font-extrabold text-gray-900">
                                {skippedQuestions}
                            </p>

                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                <Target size={21} className="text-amber-600" />
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 mt-3">
                            Every skipped question is another chance to improve.
                        </p>
                    </div>
                </div>

                {/* NEW: Correct / Wrong / Accuracy cards */}
                <div className="mb-7">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            Answer Breakdown
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            See how you performed on the questions you attempted.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                        {/* Correct Answers */}
                        <div className="relative overflow-hidden bg-white rounded-2xl border border-emerald-100 shadow-sm !p-6">
                            <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-emerald-50" />

                            <div className="relative flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Correct Questions
                                    </p>

                                    <h3 className="text-4xl font-extrabold text-emerald-600 !mt-3">
                                        {correctAnswers}
                                    </h3>

                                    <p className="text-xs text-gray-400 !mt-2">
                                        Score of 70% or above
                                    </p>
                                </div>

                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                                    <CheckCircle size={29} className="text-emerald-600" />
                                </div>
                            </div>

                            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden !mt-5">
                                <div
                                    className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                                    style={{
                                        width: `${attemptedQuestions > 0
                                            ? (correctAnswers / attemptedQuestions) * 100
                                            : 0}%`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Wrong Answers */}
                        <div className="relative overflow-hidden bg-white rounded-2xl border border-red-100 shadow-sm !p-6">
                            <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-red-50" />

                            <div className="relative flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Wrong Questions
                                    </p>

                                    <h3 className="text-4xl font-extrabold text-red-500 !mt-3">
                                        {wrongAnswers}
                                    </h3>

                                    <p className="text-xs text-gray-400 !mt-2">
                                        Score below 70%
                                    </p>
                                </div>

                                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                                    <XCircle size={29} className="text-red-500" />
                                </div>
                            </div>

                            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden !mt-5">
                                <div
                                    className="h-full rounded-full bg-red-500 transition-all duration-700"
                                    style={{
                                        width: `${attemptedQuestions > 0
                                            ? (wrongAnswers / attemptedQuestions) * 100
                                            : 0}%`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Accuracy */}
                        <div className="relative overflow-hidden bg-white rounded-2xl border border-purple-100 shadow-sm !p-6 sm:col-span-2 xl:col-span-1">
                            <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full bg-purple-50" />

                            <div className="relative flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Answer Accuracy
                                    </p>

                                    <h3 className="text-4xl font-extrabold text-[#7545e8] !mt-3">
                                        {accuracyRate.toFixed(1)}%
                                    </h3>

                                    <p className="text-xs text-gray-400 !mt-2">
                                        Correct out of attempted
                                    </p>
                                </div>

                                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                                    <TrendingUp size={29} className="text-[#7545e8]" />
                                </div>
                            </div>

                            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden !mt-5">
                                <div
                                    className="h-full rounded-full bg-[#7545e8] transition-all duration-700"
                                    style={{ width: `${accuracyRate}%` }}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Performance breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 mb-7">

                    {/* Statistics cards */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm !p-6 sm:!p-7">
                        <div className="flex items-center justify-between mb-7">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Performance Overview
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    A quick breakdown of your session
                                </p>
                            </div>

                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                <ChartNoAxesCombined size={21} className="text-[#7545e8]" />
                            </div>
                        </div>

                        <div className="space-y-7">
                            {stats.map((stat) => {
                                const Icon = stat.icon;

                                return (
                                    <div key={stat.label}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}>
                                                <Icon size={20} className={stat.iconColor} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {stat.label}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {stat.detail}
                                                </p>
                                            </div>

                                            <p className="text-xl font-extrabold text-gray-900">
                                                {stat.value}
                                            </p>
                                        </div>

                                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${stat.barColor} transition-all duration-700`}
                                                style={{
                                                    width: `${Math.max(0, Math.min(100, stat.progress))}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Personalized encouragement */}
                    <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm !p-6 sm:!p-7 flex flex-col">
                        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-purple-50" />

                        <div className="absolute top-7 right-7 w-10 h-10 rounded-xl border border-purple-100 bg-white/80 flex items-center justify-center">
                            <Sparkles size={19} className="text-[#7545e8]" />
                        </div>

                        <div className="relative">
                            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7545e8] bg-purple-50 !px-3 !py-2 rounded-full mb-5">
                                <Zap size={14} />
                                Next step
                            </span>

                            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight max-w-xs mb-3">
                                Turn practice into progress.
                            </h2>

                            <p className="text-sm text-gray-500 leading-6 mb-7">
                                {percentage >= 70
                                    ? "You're making good progress. Challenge yourself with a different topic or a higher difficulty."
                                    : "Revisit the concepts you found challenging, then try another session to build confidence."}
                            </p>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 !p-3 rounded-xl bg-gray-50">
                                    <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                                        <BrainCircuit size={18} className="text-[#7545e8]" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Practice consistently
                                        </p>

                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Build confidence one session at a time.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 !p-3 rounded-xl bg-gray-50">
                                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                                        <Target size={18} className="text-emerald-600" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Focus on improvement
                                        </p>

                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Review difficult questions and concepts.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/student/interview-prep")}
                                className="w-full flex items-center justify-center gap-2 !px-5 !py-3.5 rounded-xl bg-[#7545e8] text-white font-semibold hover:bg-[#6537d3] shadow-lg shadow-purple-200 transition-all hover:-translate-y-0.5"
                            >
                                <RotateCcw size={18} />
                                Start Another Practice
                                <ArrowUpRight size={17} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom call to action */}
                <div className="rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-violet-50 !p-5 sm:!p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-purple-100 flex items-center justify-center shadow-sm shrink-0">
                            <Trophy size={23} className="text-[#7545e8]" />
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900">
                                Keep your momentum going
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Track your progress and see how you rank.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/student/interview-prep/scoreboard")}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 !px-5 !py-3 rounded-xl bg-white border border-purple-200 text-[#7545e8] font-semibold hover:bg-purple-100 transition-colors"
                    >
                        <BarChart3 size={18} />
                        Explore Scoreboard
                        <ArrowUpRight size={17} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default InterviewPrepResult;

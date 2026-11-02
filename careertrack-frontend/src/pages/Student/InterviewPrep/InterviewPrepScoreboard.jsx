
import { useEffect, useState } from "react";
import {
    Trophy,
    Target,
    Award,
    BarChart3,
    ArrowLeft,
    RefreshCw,
    Sparkles,
    CheckCircle2,
    XCircle,
    BrainCircuit,
    TrendingUp,
    Medal,
    ArrowUpRight,
    Zap,
    ChartNoAxesCombined,
    GraduationCap,
    Flame,
    CircleHelp
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
    getInterviewPrepScoreboard
} from "../../../services/interviewPrepService";

import Sidebar from "../../../components/Sidebar/Sidebar";
import UserNavbar from "../Navbar/UserNavbar";

const InterviewPrepScoreboard = () => {
    const navigate = useNavigate();

    const [scoreboard, setScoreboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadScoreboard();
    }, []);

    const loadScoreboard = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getInterviewPrepScoreboard();

            console.log("INTERVIEW PREP SCOREBOARD:", data);

            setScoreboard(data);
        } catch (err) {
            console.error("Scoreboard error:", err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load Interview Prep scoreboard."
            );
        } finally {
            setLoading(false);
        }
    };

    const totalAttempts = Number(scoreboard?.totalAttempts) || 0;
    const overallAverage = Number(scoreboard?.overallAverage) || 0;
    const bestPercentage = Number(scoreboard?.bestPercentage) || 0;
    const topicScores = scoreboard?.topicScores ?? [];

    /*
     * These counts are calculated across completed sessions.
     * The backend must return these fields for the totals to appear.
     */
    const correctAnswers = Number(scoreboard?.correctAnswers) || 0;
    const wrongAnswers = Number(scoreboard?.wrongAnswers) || 0;
    const attemptedAnswers = correctAnswers + wrongAnswers;

    const accuracyRate =
        attemptedAnswers > 0
            ? (correctAnswers / attemptedAnswers) * 100
            : 0;

    const safePercentage = (value) =>
        Math.min(100, Math.max(0, Number(value) || 0));

    const getPerformance = (percentage) => {
        if (percentage >= 85) {
            return {
                title: "Outstanding!",
                subtitle: "You're building interview-ready skills.",
                message: "Your consistency is paying off. Keep challenging yourself.",
                icon: Trophy,
                color: "text-emerald-300",
                label: "Excellent performance"
            };
        }

        if (percentage >= 70) {
            return {
                title: "Great Progress!",
                subtitle: "You're getting stronger with every session.",
                message: "Keep practicing to turn your strengths into expertise.",
                icon: Award,
                color: "text-yellow-300",
                label: "Strong progress"
            };
        }

        if (percentage >= 40) {
            return {
                title: "Keep Growing!",
                subtitle: "Every practice session is a step forward.",
                message: "Review difficult concepts and aim for a new personal best.",
                icon: TrendingUp,
                color: "text-orange-300",
                label: "Room to improve"
            };
        }

        return {
            title: "Your Journey Starts Here!",
            subtitle: "Every expert starts with practice.",
            message: "Focus on the fundamentals and keep building your confidence.",
            icon: Zap,
            color: "text-sky-300",
            label: "Keep practicing"
        };
    };

    const performance = getPerformance(overallAverage);
    const PerformanceIcon = performance.icon;

    const summaryCards = [
        {
            label: "Practice Sessions",
            value: totalAttempts,
            description: "Completed attempts",
            icon: Trophy,
            iconBg: "bg-violet-100",
            iconColor: "text-violet-700",
            accent: "from-violet-500 to-purple-400"
        },
        {
            label: "Average Score",
            value: `${overallAverage.toFixed(1)}%`,
            description: "Across your sessions",
            icon: ChartNoAxesCombined,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-700",
            accent: "from-blue-500 to-indigo-400"
        },
        {
            label: "Personal Best",
            value: `${bestPercentage.toFixed(1)}%`,
            description: "Your highest score",
            icon: Medal,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-700",
            accent: "from-amber-400 to-orange-400"
        }
    ];

    return (
        <div className="flex min-h-screen bg-[#f7f5ff]">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Application */}
            <div className="flex min-w-0 flex-1 flex-col">

                {/* Top Navbar */}
                <UserNavbar />

                <main className="flex-1 !px-4 !py-6 sm:!px-6 lg:!px-8">
                    <div className="max-w-7xl mx-auto">

                        {/* Loading State */}
                        {loading ? (
                            <div className="min-h-[65vh] flex items-center justify-center">
                                <div className="bg-white rounded-3xl border border-purple-100 shadow-sm !p-10 text-center max-w-sm w-full">
                                    <div className="relative w-16 h-16 mx-auto mb-5">
                                        <div className="absolute inset-0 rounded-2xl bg-purple-100 animate-pulse" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <BrainCircuit
                                                size={30}
                                                className="text-[#7545e8]"
                                            />
                                        </div>
                                    </div>

                                    <h2 className="text-lg font-bold text-gray-900">
                                        Preparing your scoreboard
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-2">
                                        Gathering your practice statistics...
                                    </p>

                                    <RefreshCw
                                        size={18}
                                        className="animate-spin text-[#7545e8] mx-auto mt-5"
                                    />
                                </div>
                            </div>
                        ) : error ? (
                            /* Error State */
                            <div className="min-h-[65vh] flex items-center justify-center !px-4">
                                <div className="bg-white rounded-3xl shadow-sm border border-red-100 !p-8 text-center max-w-md w-full">
                                    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
                                        <Target
                                            className="text-red-500"
                                            size={30}
                                        />
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                                        Unable to load scoreboard
                                    </h2>

                                    <p className="text-gray-500 text-sm mb-6">
                                        {error}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={loadScoreboard}
                                        className="!px-5 !py-3 rounded-xl bg-[#7545e8] text-white font-semibold hover:bg-[#6537d3] transition"
                                    >
                                        <RefreshCw
                                            size={16}
                                            className="inline mr-2"
                                        />
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between !mb-7">
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate("/student/interview-prep")
                                            }
                                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#7545e8] transition-colors !mb-4"
                                        >
                                            <ArrowLeft size={17} />
                                            Back to Interview Prep
                                        </button>

                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7545e8] to-[#a78bfa] flex items-center justify-center shadow-lg shadow-purple-200">
                                                <GraduationCap
                                                    size={25}
                                                    className="text-white"
                                                />
                                            </div>

                                            <div>
                                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                                                    Your Scoreboard
                                                </h1>

                                                <p className="text-sm text-gray-500 mt-1">
                                                    Your practice, your progress, your next milestone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={loadScoreboard}
                                        className="self-start sm:self-auto inline-flex items-center gap-2 !px-4 !py-2.5 bg-white border border-purple-100 rounded-xl text-gray-600 font-medium hover:border-[#7545e8] hover:text-[#7545e8] hover:shadow-sm transition"
                                    >
                                        <RefreshCw size={17} />
                                        Refresh Stats
                                    </button>
                                </div>

                                {/* Hero Section */}
                                <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#211344] via-[#432477] to-[#7545e8] !p-6 sm:!p-8 lg:!p-10 !mb-7 shadow-xl shadow-purple-200/60">
                                    <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full border border-white/10" />
                                    <div className="absolute -top-10 -right-2 w-56 h-56 rounded-full border border-white/10" />
                                    <div className="absolute -bottom-28 left-1/3 w-64 h-64 rounded-full bg-white/[0.04]" />

                                    <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8 items-center">
                                        <div>
                                            <span className="inline-flex items-center gap-2 !px-3 !py-2 rounded-full bg-white/10 border border-white/15 text-purple-100 text-xs font-bold tracking-wide !mb-5">
                                                <Sparkles size={14} />
                                                YOUR LEARNING JOURNEY
                                            </span>

                                            <div className="flex items-center gap-3 !mb-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                                                    <PerformanceIcon
                                                        size={25}
                                                        className={performance.color}
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-purple-200 text-sm">
                                                        Overall performance
                                                    </p>
                                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                                                        {performance.title}
                                                    </h2>
                                                </div>
                                            </div>

                                            <p className="text-purple-100 text-base font-medium !mb-2">
                                                {performance.subtitle}
                                            </p>

                                            <p className="text-purple-100/75 text-sm leading-6 max-w-xl !mb-6">
                                                {performance.message}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                <span className="inline-flex items-center gap-2 !px-3 !py-2 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-semibold">
                                                    <Flame size={15} className="text-orange-300" />
                                                    {totalAttempts} sessions completed
                                                </span>

                                                <span className="inline-flex items-center gap-2 !px-3 !py-2 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-semibold">
                                                    <Target size={15} className="text-purple-200" />
                                                    {performance.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Average Score Ring */}
                                        <div className="flex justify-center">
                                            <div
                                                className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center"
                                                style={{
                                                    background: `conic-gradient(#c4b5fd ${safePercentage(overallAverage) * 3.6}deg, rgba(255,255,255,0.12) 0deg)`
                                                }}
                                            >
                                                <div className="absolute inset-[9px] rounded-full bg-gradient-to-br from-[#321764] to-[#542ca0] border border-white/10 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto !mb-2">
                                                            <Trophy
                                                                size={21}
                                                                className="text-yellow-300"
                                                            />
                                                        </div>

                                                        <p className="text-4xl sm:text-5xl font-black text-white">
                                                            {overallAverage.toFixed(1)}
                                                            <span className="text-xl text-purple-200">%</span>
                                                        </p>

                                                        <p className="text-[10px] uppercase tracking-[0.2em] text-purple-200 !mt-2">
                                                            Average Score
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="absolute top-3 right-5 w-3 h-3 rounded-full bg-yellow-300 shadow-lg shadow-yellow-300/50" />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Summary Cards */}
                                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 !mb-7">
                                    {summaryCards.map((card) => {
                                        const Icon = card.icon;

                                        return (
                                            <div
                                                key={card.label}
                                                className="group relative overflow-hidden bg-white rounded-2xl border border-gray-100 !p-5 sm:!p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-purple-100 transition-all duration-300"
                                            >
                                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.accent}`} />

                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm text-gray-500 font-medium">
                                                            {card.label}
                                                        </p>

                                                        <h2 className="text-3xl font-extrabold text-gray-900 !mt-3">
                                                            {card.value}
                                                        </h2>

                                                        <p className="text-xs text-gray-400 !mt-2">
                                                            {card.description}
                                                        </p>
                                                    </div>

                                                    <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                        <Icon
                                                            size={23}
                                                            className={card.iconColor}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </section>


                                {/* Category Performance */}
                                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden !mb-7">
                                    <div className="relative overflow-hidden !p-6 sm:!p-7 border-b border-gray-100">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -translate-y-1/2 translate-x-1/3" />

                                        <div className="relative flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                                                <BarChart3
                                                    size={22}
                                                    className="text-[#7545e8]"
                                                />
                                            </div>

                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    Category Performance
                                                </h2>
                                                <p className="text-sm text-gray-500 !mt-1">
                                                    Compare your progress across practice categories.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {topicScores.length === 0 ? (
                                        <div className="!p-8 sm:!p-12 text-center">
                                            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto !mb-4">
                                                <BrainCircuit
                                                    size={32}
                                                    className="text-[#7545e8]"
                                                />
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-800">
                                                Your first milestone awaits
                                            </h3>

                                            <p className="text-sm text-gray-500 max-w-md mx-auto !mt-2 !mb-5">
                                                Complete an Interview Prep session to see your category averages, personal bests, and latest scores here.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate("/student/interview-prep")
                                                }
                                                className="inline-flex items-center gap-2 !px-5 !py-3 bg-[#7545e8] text-white rounded-xl font-semibold hover:bg-[#6537d3] transition"
                                            >
                                                Start Practicing
                                                <ArrowUpRight size={17} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-100">
                                            {topicScores.map((topic, index) => {
                                                const averageScore =
                                                    Number(topic.averageScore) || 0;

                                                const bestScore =
                                                    Number(topic.bestScore) || 0;

                                                const latestScore =
                                                    Number(topic.latestScore) || 0;

                                                return (
                                                    <div
                                                        key={topic.topicId || index}
                                                        className="group !p-5 sm:!p-6 hover:bg-purple-50/40 transition-colors"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-50 border border-purple-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                                <span className="text-lg font-extrabold text-[#7545e8]">
                                                                    {index + 1}
                                                                </span>
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 !mb-4">
                                                                    <div className="min-w-0">
                                                                        <h3 className="font-bold text-gray-900 break-words">
                                                                            {topic.topicName || "Practice Category"}
                                                                        </h3>

                                                                        <p className="text-xs text-gray-500 !mt-1">
                                                                            {Number(topic.attempts) || 0} practice{" "}
                                                                            {(Number(topic.attempts) || 0) === 1
                                                                                ? "session"
                                                                                : "sessions"}
                                                                        </p>
                                                                    </div>

                                                                    <div className="sm:text-right shrink-0">
                                                                        <p className="text-2xl font-extrabold text-[#7545e8]">
                                                                            {averageScore.toFixed(1)}%
                                                                        </p>
                                                                        <p className="text-xs text-gray-400">
                                                                            Average score
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-[#7545e8] to-[#a78bfa] rounded-full transition-all duration-700"
                                                                        style={{
                                                                            width: `${safePercentage(averageScore)}%`
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-3 !mt-4">
                                                                    <div className="rounded-xl bg-gray-50 !p-3">
                                                                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                                                            <Medal size={14} className="text-amber-500" />
                                                                            Personal best
                                                                        </p>

                                                                        <p className="text-sm font-bold text-gray-800 !mt-1">
                                                                            {bestScore.toFixed(1)}%
                                                                        </p>
                                                                    </div>

                                                                    <div className="rounded-xl bg-gray-50 !p-3">
                                                                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                                                            <TrendingUp size={14} className="text-blue-500" />
                                                                            Latest result
                                                                        </p>

                                                                        <p className="text-sm font-bold text-gray-800 !mt-1">
                                                                            {latestScore.toFixed(1)}%
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </section>

                                {/* Improvement Tip */}
                                <section className="relative overflow-hidden rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-violet-50 !p-5 sm:!p-6 !mb-7">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-purple-100 shadow-sm flex items-center justify-center shrink-0">
                                            <Sparkles
                                                size={23}
                                                className="text-[#7545e8]"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900">
                                                Your next improvement starts with one session
                                            </h3>

                                            <p className="text-sm text-gray-500 leading-6 !mt-1">
                                                {overallAverage >= 80
                                                    ? "You're performing well. Try a harder difficulty or a new topic to keep growing."
                                                    : "Review your feedback, revisit difficult concepts, and practice again to improve your average."}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate("/student/interview-prep")
                                            }
                                            className="inline-flex items-center justify-center gap-2 !px-5 !py-3 rounded-xl bg-[#7545e8] text-white font-semibold hover:bg-[#6537d3] shadow-md shadow-purple-200 transition shrink-0"
                                        >
                                            Practice More
                                            <ArrowUpRight size={17} />
                                        </button>
                                    </div>
                                </section>

                                {/* Footer */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 !pb-4">
                                    <p className="text-xs text-gray-400">
                                        Keep showing up. Every attempt helps you grow.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/student/interview-prep")
                                        }
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#7545e8] hover:text-[#6537d3] transition"
                                    >
                                        <ArrowLeft size={16} />
                                        Back to Interview Prep
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InterviewPrepScoreboard;

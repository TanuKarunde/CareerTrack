
import { useMemo, useState } from "react";
import {
    Target,
    Flame,
    Trophy,
    Zap,
    CheckCircle2,
    Circle,
    Code2,
    Database,
    BookOpen,
    BriefcaseBusiness,
    ArrowRight,
    Sparkles,
    CalendarDays,
    RotateCcw,
} from "lucide-react";

const initialMissions = [
    {
        id: 1,
        title: "Master Java Collections",
        description: "Revise List, Set, Map and solve 3 practice questions.",
        category: "Java",
        difficulty: "Medium",
        xp: 50,
        duration: "25 min",
        icon: Code2,
        completed: false,
    },
    {
        id: 2,
        title: "SQL Query Sprint",
        description: "Practise JOIN, GROUP BY and aggregate functions.",
        category: "SQL",
        difficulty: "Easy",
        xp: 30,
        duration: "15 min",
        icon: Database,
        completed: false,
    },
    {
        id: 3,
        title: "Upgrade Your Project Story",
        description: "Improve one project description with your role and technologies.",
        category: "Projects",
        difficulty: "Easy",
        xp: 40,
        duration: "20 min",
        icon: BriefcaseBusiness,
        completed: false,
    },
    {
        id: 4,
        title: "Interview Warm-up",
        description: "Answer 5 beginner Java interview questions.",
        category: "Interview",
        difficulty: "Medium",
        xp: 60,
        duration: "20 min",
        icon: BookOpen,
        completed: false,
    },
];

const CareerMissionControl = () => {
    const [missions, setMissions] = useState(initialMissions);
    const [activeFilter, setActiveFilter] = useState("All");
    const [showCompleted, setShowCompleted] = useState(false);

    const completedCount = missions.filter(
        (mission) => mission.completed
    ).length;

    const earnedXP = missions.reduce(
        (total, mission) =>
            total + (mission.completed ? mission.xp : 0),
        0
    );

    const totalXP = missions.reduce(
        (total, mission) => total + mission.xp,
        0
    );

    const progress = missions.length
        ? Math.round((completedCount / missions.length) * 100)
        : 0;

    const filters = ["All", "Java", "SQL", "Projects", "Interview"];

    const visibleMissions = useMemo(() => {
        return missions.filter((mission) => {
            const matchesFilter =
                activeFilter === "All" ||
                mission.category === activeFilter;

            const matchesStatus = showCompleted
                ? mission.completed
                : !mission.completed;

            return matchesFilter && matchesStatus;
        });
    }, [missions, activeFilter, showCompleted]);

    const toggleMission = (missionId) => {
        setMissions((current) =>
            current.map((mission) =>
                mission.id === missionId
                    ? { ...mission, completed: !mission.completed }
                    : mission
            )
        );
    };

    const resetMissions = () => {
        setMissions((current) =>
            current.map((mission) => ({
                ...mission,
                completed: false,
            }))
        );
        setShowCompleted(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-7">

                {/* Welcome section */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5141D9] via-[#7838CE] to-[#D52DA2] p-6 text-white shadow-lg md:p-9">
                    <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
                    <div className="absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-white/10" />

                    <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm">
                                <Sparkles size={16} />
                                Your personal placement coach
                            </div>

                            <h1 className="text-3xl font-bold md:text-4xl">
                                Career Mission Control
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 md:text-base">
                                Small missions. Real skills. Better
                                placement preparation. Complete your
                                missions and build momentum every day.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="rounded-xl bg-amber-300 p-3 text-amber-950">
                                <Zap size={27} fill="currentColor" />
                            </div>
                            <div>
                                <p className="text-sm text-white/80">
                                    XP earned
                                </p>
                                <p className="text-3xl font-bold">
                                    {earnedXP}
                                    <span className="ml-1 text-sm font-medium text-white/70">
                                        / {totalXP}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        icon={Target}
                        label="Missions completed"
                        value={`${completedCount}/${missions.length}`}
                        detail="Your current mission set"
                        iconClass="bg-violet-100 text-violet-700"
                    />
                    <StatCard
                        icon={Zap}
                        label="XP earned"
                        value={earnedXP}
                        detail="Earn more by completing missions"
                        iconClass="bg-amber-100 text-amber-700"
                    />
                    <StatCard
                        icon={Flame}
                        label="Daily streak"
                        value="—"
                        detail="Connect your activity history"
                        iconClass="bg-orange-100 text-orange-700"
                    />
                    <StatCard
                        icon={Trophy}
                        label="Mission progress"
                        value={`${progress}%`}
                        detail="Based on the missions below"
                        iconClass="bg-emerald-100 text-emerald-700"
                    />
                </section>

                {/* Progress */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="font-bold text-slate-900">
                                Your launch progress
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Every completed mission moves you forward.
                            </p>
                        </div>

                        <span className="rounded-full bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-700">
                            {completedCount} of {missions.length} done
                        </span>
                    </div>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#5141D9] to-[#D52DA2] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="mt-3 flex justify-between text-xs text-slate-500">
                        <span>Mission started</span>
                        <span>{progress}% complete</span>
                    </div>
                </section>

                {/* Mission list */}
                <section className="space-y-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <div className="flex items-center gap-2">
                                <Target className="text-violet-600" size={23} />
                                <h2 className="text-xl font-bold text-slate-900">
                                    Your missions
                                </h2>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">
                                Complete a task to earn its XP reward.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowCompleted(!showCompleted)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            {showCompleted
                                ? "View pending missions"
                                : "View completed missions"}
                        </button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveFilter(filter)}
                                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                                    activeFilter === filter
                                        ? "bg-violet-600 text-white shadow-sm"
                                        : "border border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {visibleMissions.map((mission) => {
                            const Icon = mission.icon;

                            return (
                                <article
                                    key={mission.id}
                                    className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                                        mission.completed
                                            ? "border-emerald-200"
                                            : "border-slate-200"
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
                                            <Icon size={24} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                    {mission.category}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {mission.duration}
                                                </span>
                                            </div>

                                            <h3 className={`mt-3 font-bold ${
                                                mission.completed
                                                    ? "text-emerald-700"
                                                    : "text-slate-900"
                                            }`}>
                                                {mission.title}
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                                {mission.description}
                                            </p>

                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600">
                                                    <Zap size={16} />
                                                    +{mission.xp} XP
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleMission(mission.id)
                                                    }
                                                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                                        mission.completed
                                                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                            : "bg-violet-600 text-white hover:bg-violet-700"
                                                    }`}
                                                >
                                                    {mission.completed ? (
                                                        <>
                                                            <CheckCircle2 size={17} />
                                                            Completed
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Circle size={17} />
                                                            Complete mission
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {visibleMissions.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                            <CheckCircle2
                                className="mx-auto text-emerald-500"
                                size={38}
                            />
                            <h3 className="mt-3 font-bold text-slate-900">
                                No missions in this view
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Choose another category or switch mission status.
                            </p>
                        </div>
                    )}
                </section>

                {/* Weekly goal */}
                <section className="flex flex-col justify-between gap-4 rounded-2xl border border-violet-100 bg-violet-50 p-5 sm:flex-row sm:items-center md:p-6">
                    <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-white p-3 text-violet-700 shadow-sm">
                            <CalendarDays size={23} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">
                                Your next milestone
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                Complete all four missions to finish this
                                sample mission set and earn up to {totalXP} XP.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={resetMissions}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-100"
                    >
                        <RotateCcw size={16} />
                        Reset demo
                    </button>
                </section>

                <p className="text-center text-xs text-slate-400">
                    CareerTrack LaunchPad · Demo missions · Progress is not
                    saved to the backend yet.
                </p>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, detail, iconClass }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
            </div>
            <div className={`rounded-xl p-3 ${iconClass}`}>
                <Icon size={22} />
            </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">{detail}</p>
    </div>
);

export default CareerMissionControl;

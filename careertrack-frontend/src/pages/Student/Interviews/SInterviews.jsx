
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    Clock3,
    Video,
    Search,
    ArrowUpRight,
    BriefcaseBusiness,
    CalendarCheck,
    CalendarClock,
    CircleCheck,
    XCircle,
    Sparkles,
    MapPin,
    RefreshCw,
    Timer,
    ChevronRight,
    Radio,
    Trophy,
    Layers3,
    Command,
    Zap,
    CalendarRange,
    FileText,
} from "lucide-react";

import Sidebar from "../../../components/Sidebar/Sidebar";
import UserNavbar from "../Navbar/UserNavbar";
import { getAllStudentInterviews } from "../../../services/dashboardService";

const FILTERS = ["All", "Scheduled", "Completed", "Cancelled"];

const STATUS_CONFIG = {
    SCHEDULED: {
        label: "Scheduled",
        className:
            "border-violet-200 bg-violet-50 text-violet-700",
        icon: CalendarClock,
        dot: "bg-violet-500",
    },
    COMPLETED: {
        label: "Completed",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: CircleCheck,
        dot: "bg-emerald-500",
    },
    CANCELLED: {
        label: "Cancelled",
        className:
            "border-rose-200 bg-rose-50 text-rose-700",
        icon: XCircle,
        dot: "bg-rose-500",
    },
};

const formatDate = (date) => {
    if (!date) return "Date not available";

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
        return "Date not available";
    }

    return parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatTime = (time) => {
    if (!time) return "Time not available";

    const [hours, minutes] = time.split(":").map(Number);

    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
    ) {
        return time;
    }

    const parsed = new Date();
    parsed.setHours(hours, minutes, 0, 0);

    return parsed.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

const getInterviewTimestamp = (interview) => {
    if (!interview.interviewDate) return Number.POSITIVE_INFINITY;

    const time = interview.interviewTime || "23:59:00";
    const parsed = new Date(
        `${interview.interviewDate}T${time.length === 5 ? `${time}:00` : time}`
    );

    return Number.isNaN(parsed.getTime())
        ? Number.POSITIVE_INFINITY
        : parsed.getTime();
};

const getStatus = (status) => {
    const normalized = status?.toUpperCase();

    return (
        STATUS_CONFIG[normalized] || {
            label: status || "Unknown",
            className: "border-slate-200 bg-slate-100 text-slate-600",
            icon: CalendarDays,
            dot: "bg-slate-400",
        }
    );
};

const SInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [retryKey, setRetryKey] = useState(0);

    const loadInterviews = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllStudentInterviews();
            setInterviews(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load interviews:", err);
            setError(err?.message || "Unable to load your interviews.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAllStudentInterviews();

                if (active) {
                    setInterviews(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Failed to load interviews:", err);

                if (active) {
                    setError(
                        err?.message || "Unable to load your interviews."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        load();

        return () => {
            active = false;
        };
    }, [retryKey]);

    const counts = useMemo(
        () => ({
            All: interviews.length,
            Scheduled: interviews.filter(
                (item) => item.status?.toUpperCase() === "SCHEDULED"
            ).length,
            Completed: interviews.filter(
                (item) => item.status?.toUpperCase() === "COMPLETED"
            ).length,
            Cancelled: interviews.filter(
                (item) => item.status?.toUpperCase() === "CANCELLED"
            ).length,
        }),
        [interviews]
    );

    const filteredInterviews = useMemo(() => {
        const query = search.trim().toLowerCase();

        return interviews
            .filter((interview) => {
                const status = interview.status?.toUpperCase() || "";
                const matchesFilter =
                    filter === "All" || status === filter.toUpperCase();

                const matchesSearch =
                    !query ||
                    interview.jobTitle?.toLowerCase().includes(query) ||
                    interview.notes?.toLowerCase().includes(query) ||
                    interview.status?.toLowerCase().includes(query) ||
                    String(interview.applicationId ?? "").includes(query);

                return matchesFilter && matchesSearch;
            })
            .sort(
                (a, b) =>
                    getInterviewTimestamp(a) - getInterviewTimestamp(b)
            );
    }, [interviews, filter, search]);

    const nextInterview = useMemo(() => {
        const now = Date.now();

        return interviews
            .filter(
                (item) =>
                    item.status?.toUpperCase() === "SCHEDULED" &&
                    getInterviewTimestamp(item) >= now
            )
            .sort(
                (a, b) =>
                    getInterviewTimestamp(a) - getInterviewTimestamp(b)
            )[0];
    }, [interviews]);

    const handleRetry = () => {
        setRetryKey((previous) => previous + 1);
    };

    const clearFilters = () => {
        setSearch("");
        setFilter("All");
    };

    return (
        <div className="min-h-screen bg-[#F7F6FC] text-slate-800 lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
            {/* Sidebar stays in its own grid column */}
            <aside className="sticky top-0 z-30 h-screen">
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            </aside>

            {/* Main content */}
            <div className="min-w-0">
                {/* Navbar stays inside the main column */}
                <div className="sticky top-0 z-20">
                    <UserNavbar />
                </div>

                <main className="min-w-0 !px-4 !pb-10 !pt-5 sm:!px-6 lg:!px-8 xl:!px-10">
                    <div className="mx-auto max-w-7xl">
                        {/* Breadcrumb and heading */}
                        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                            <div>
                                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                                    <span className="flex items-center gap-1.5 rounded-lg border border-violet-100 bg-white !px-3 !py-2 text-slate-500 shadow-sm">
                                        <Command size={13} className="text-violet-600" />
                                        CareerTrack
                                    </span>
                                    <ChevronRight size={14} className="text-slate-400" />
                                    <span className="rounded-lg bg-violet-100/70 !px-3 !py-2 text-violet-700">
                                        My Interviews
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200">
                                        <CalendarDays size={23} />
                                    </div>

                                    <div>
                                        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                                            Interview Command Center
                                        </h1>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Your schedule, your preparation, your next opportunity.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleRetry}
                                disabled={loading}
                                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-violet-100 bg-white !px-4 !py-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
                            >
                                <RefreshCw
                                    size={15}
                                    className={loading ? "animate-spin" : ""}
                                />
                                Refresh schedule
                            </button>
                        </div>

                        {/* Hero banner */}
                        <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#32106B] via-[#5B21B6] to-[#7047E8] !p-6 text-white shadow-xl shadow-violet-200/60 sm:!p-8 lg:!p-9">
                            <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full border-[38px] border-white/[0.07]" />
                            <div className="pointer-events-none absolute -bottom-28 right-1/4 -z-10 h-64 w-64 rounded-full bg-fuchsia-400/10 blur-3xl" />
                            <div className="pointer-events-none absolute right-12 top-10 -z-10 hidden rotate-12 text-white/[0.07] sm:block">
                                <CalendarRange size={145} strokeWidth={1} />
                            </div>

                            <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
                                <div>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-1.5 text-xs font-semibold text-violet-100 backdrop-blur-sm">
                                        <Sparkles size={14} />
                                        YOUR CAREER, IN MOTION
                                    </span>

                                    <h2 className="mt-5 max-w-xl text-2xl font-black leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                                        Every interview is a{" "}
                                        <span className="text-violet-200">
                                            new possibility.
                                        </span>
                                    </h2>

                                    <p className="mt-3 max-w-lg text-sm leading-6 text-violet-100/85 sm:text-base">
                                        Stay on top of your schedule, revisit employer notes,
                                        and be ready when your next opportunity arrives.
                                    </p>

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 !px-3 !py-2.5 backdrop-blur-sm">
                                            <CalendarCheck size={16} className="text-violet-200" />
                                            <span className="text-xs font-semibold">
                                                {loading
                                                    ? "Checking schedule..."
                                                    : `${counts.Scheduled} scheduled`}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 !px-3 !py-2.5 backdrop-blur-sm">
                                            <Trophy size={16} className="text-amber-200" />
                                            <span className="text-xs font-semibold">
                                                {loading
                                                    ? "Loading..."
                                                    : `${counts.Completed} completed`}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/15 bg-white/10 !p-5 backdrop-blur-md sm:!p-6">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-violet-100">
                                            <Zap size={16} className="text-amber-300" />
                                            Next up
                                        </div>
                                        <span className="rounded-full bg-emerald-400/15 !px-2.5 !py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                                            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />
                                            Upcoming
                                        </span>
                                    </div>

                                    {loading ? (
                                        <div className="mt-5 space-y-3">
                                            <div className="h-5 w-2/3 animate-pulse rounded bg-white/15" />
                                            <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
                                            <div className="h-12 animate-pulse rounded-xl bg-white/10" />
                                        </div>
                                    ) : nextInterview ? (
                                        <>
                                            <h3 className="mt-5 break-words text-xl font-bold text-white">
                                                {nextInterview.jobTitle || "Interview"}
                                            </h3>

                                            <p className="mt-1 text-xs text-violet-200">
                                                Application #{nextInterview.applicationId ?? "—"}
                                            </p>

                                            <div className="mt-5 grid grid-cols-2 gap-3">
                                                <div className="rounded-xl border border-white/10 bg-black/10 !p-3">
                                                    <CalendarDays size={16} className="text-violet-200" />
                                                    <p className="mt-2 text-[11px] text-violet-200">
                                                        Date
                                                    </p>
                                                    <p className="mt-1 text-sm font-bold text-white">
                                                        {formatDate(nextInterview.interviewDate)}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-white/10 bg-black/10 !p-3">
                                                    <Clock3 size={16} className="text-violet-200" />
                                                    <p className="mt-2 text-[11px] text-violet-200">
                                                        Time
                                                    </p>
                                                    <p className="mt-1 text-sm font-bold text-white">
                                                        {formatTime(nextInterview.interviewTime)}
                                                    </p>
                                                </div>
                                            </div>

                                            {nextInterview.meetingLink && (
                                                <a
                                                    href={nextInterview.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white !px-4 !py-3 text-sm font-bold text-violet-800 transition hover:bg-violet-50"
                                                >
                                                    <Video size={16} />
                                                    Join upcoming interview
                                                    <ArrowUpRight size={15} />
                                                </a>
                                            )}
                                        </>
                                    ) : (
                                        <div className="mt-5">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                                                <CalendarCheck size={23} className="text-violet-100" />
                                            </div>
                                            <h3 className="mt-4 text-lg font-bold">
                                                No upcoming interviews
                                            </h3>
                                            <p className="mt-2 text-sm leading-6 text-violet-100/80">
                                                Your next scheduled interview will appear here.
                                                Keep preparing for your next opportunity.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Statistics */}
                        <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                                {
                                    label: "Total interviews",
                                    value: counts.All,
                                    icon: Layers3,
                                    theme: "violet",
                                    caption: "Your interview activity",
                                },
                                {
                                    label: "Scheduled",
                                    value: counts.Scheduled,
                                    icon: CalendarClock,
                                    theme: "indigo",
                                    caption: "Planned opportunities",
                                },
                                {
                                    label: "Completed",
                                    value: counts.Completed,
                                    icon: CircleCheck,
                                    theme: "emerald",
                                    caption: "Steps you've completed",
                                },
                                {
                                    label: "Cancelled",
                                    value: counts.Cancelled,
                                    icon: XCircle,
                                    theme: "rose",
                                    caption: "Cancelled appointments",
                                },
                            ].map((item) => {
                                const Icon = item.icon;

                                const themes = {
                                    violet: {
                                        icon: "bg-violet-100 text-violet-700",
                                        accent: "bg-violet-500",
                                        glow: "group-hover:shadow-violet-100",
                                    },
                                    indigo: {
                                        icon: "bg-indigo-100 text-indigo-700",
                                        accent: "bg-indigo-500",
                                        glow: "group-hover:shadow-indigo-100",
                                    },
                                    emerald: {
                                        icon: "bg-emerald-100 text-emerald-700",
                                        accent: "bg-emerald-500",
                                        glow: "group-hover:shadow-emerald-100",
                                    },
                                    rose: {
                                        icon: "bg-rose-100 text-rose-700",
                                        accent: "bg-rose-500",
                                        glow: "group-hover:shadow-rose-100",
                                    },
                                };

                                const theme = themes[item.theme];

                                return (
                                    <div
                                        key={item.label}
                                        className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white !p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${theme.glow}`}
                                    >
                                        <div className={`absolute inset-x-0 top-0 h-1 ${theme.accent} opacity-80`} />

                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500">
                                                    {item.label}
                                                </p>
                                                <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                                                    {loading ? "—" : item.value}
                                                </p>
                                            </div>

                                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition duration-300 group-hover:rotate-3 group-hover:scale-105 ${theme.icon}`}>
                                                <Icon size={22} />
                                            </div>
                                        </div>

                                        <p className="mt-4 border-t border-slate-100 !pt-3 text-xs text-slate-500">
                                            {item.caption}
                                        </p>
                                    </div>
                                );
                            })}
                        </section>

                        {/* Search and filters */}
                        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                            <div className="flex flex-col gap-4 !p-4 sm:!p-5 xl:flex-row xl:items-center xl:justify-between">
                                <div>
                                    <h2 className="flex items-center gap-2 font-bold text-slate-900">
                                        <CalendarRange size={18} className="text-violet-600" />
                                        Your interview schedule
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Filter and find the details you need.
                                    </p>
                                </div>

                                <div className="relative w-full xl:max-w-sm">
                                    <Search
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search job, status, application..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 !py-3 !pl-10 !pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100/70"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50/60 !px-4 !py-3 sm:!px-5">
                                {FILTERS.map((item) => {
                                    const selected = filter === item;

                                    return (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setFilter(item)}
                                            className={`inline-flex items-center gap-2 rounded-xl border !px-3.5 !py-2.5 text-sm font-semibold transition duration-200 ${
                                                selected
                                                    ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-200"
                                                    : "border-transparent bg-white text-slate-600 hover:border-violet-100 hover:bg-violet-50 hover:text-violet-700"
                                            }`}
                                        >
                                            {item === "All" && <Layers3 size={14} />}
                                            {item === "Scheduled" && <CalendarClock size={14} />}
                                            {item === "Completed" && <CircleCheck size={14} />}
                                            {item === "Cancelled" && <XCircle size={14} />}

                                            {item}

                                            <span className={`min-w-5 rounded-md !px-1.5 !py-0.5 text-[11px] ${
                                                selected
                                                    ? "bg-white/15 text-white"
                                                    : "bg-slate-100 text-slate-500"
                                            }`}>
                                                {loading ? "—" : counts[item]}
                                            </span>
                                        </button>
                                    );
                                })}

                                {(search || filter !== "All") && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="ml-auto text-xs font-semibold text-violet-700 transition hover:text-violet-900"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* Interview list states */}
                        <section className="mt-6">
                            {loading ? (
                                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div
                                            key={item}
                                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                                        >
                                            <div className="h-1.5 animate-pulse bg-violet-200" />
                                            <div className="!p-5">
                                                <div className="flex gap-3">
                                                    <div className="h-12 w-12 animate-pulse rounded-2xl bg-violet-100" />
                                                    <div className="flex-1 space-y-2 !pt-1">
                                                        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                                                        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                                                    </div>
                                                </div>
                                                <div className="mt-6 grid grid-cols-2 gap-3">
                                                    <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
                                                    <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
                                                </div>
                                                <div className="mt-5 h-10 animate-pulse rounded-xl bg-slate-100" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="rounded-3xl border border-rose-100 bg-white !px-6 !py-12 text-center shadow-sm">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                                        <XCircle size={30} />
                                    </div>
                                    <h2 className="mt-4 text-lg font-bold text-slate-900">
                                        Couldn't load your interviews
                                    </h2>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                        {error}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleRetry}
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 !px-5 !py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
                                    >
                                        <RefreshCw size={15} />
                                        Try again
                                    </button>
                                </div>
                            ) : filteredInterviews.length === 0 ? (
                                <div className="relative overflow-hidden rounded-3xl border border-violet-100 bg-white !px-5 !py-14 text-center shadow-sm sm:!py-16">
                                    <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-50" />
                                    <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-indigo-50/70" />

                                    <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 text-violet-600 shadow-sm">
                                        {search || filter !== "All" ? (
                                            <Search size={30} />
                                        ) : (
                                            <CalendarCheck size={30} />
                                        )}
                                    </div>

                                    <h2 className="relative mt-5 text-xl font-black text-slate-900">
                                        {search || filter !== "All"
                                            ? "No matching interviews"
                                            : "Your next opportunity starts here"}
                                    </h2>

                                    <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                        {search || filter !== "All"
                                            ? "We couldn't find an interview matching your search. Try a different keyword or status."
                                            : "When an employer schedules an interview for one of your applications, the details will appear here."}
                                    </p>

                                    {(search || filter !== "All") && (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="relative mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 !px-4 !py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                                        >
                                            <RefreshCw size={14} />
                                            Reset filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">
                                                All your interviews
                                            </h2>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Your appointments, organized in one place.
                                            </p>
                                        </div>

                                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-100 bg-white !px-3 !py-2 text-xs font-semibold text-violet-700">
                                            <span className="h-2 w-2 rounded-full bg-violet-500" />
                                            {filteredInterviews.length} result
                                            {filteredInterviews.length !== 1 ? "s" : ""}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                                        {filteredInterviews.map((interview) => {
                                            const status = getStatus(interview.status);
                                            const StatusIcon = status.icon;
                                            const isScheduled =
                                                interview.status?.toUpperCase() === "SCHEDULED";

                                            return (
                                                <article
                                                    key={interview.id}
                                                    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/70"
                                                >
                                                    <div className="h-1.5 bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-400" />

                                                    <div className="!p-5 sm:!p-6">
                                                        {/* Card heading */}
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex min-w-0 items-start gap-3">
                                                                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700 ring-1 ring-violet-100 transition duration-300 group-hover:scale-105">
                                                                    <BriefcaseBusiness size={21} />
                                                                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-lg border-2 border-white bg-violet-600 text-white">
                                                                        <CalendarDays size={10} />
                                                                    </span>
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <h3 className="break-words text-base font-bold text-slate-900 transition group-hover:text-violet-800 sm:text-lg">
                                                                        {interview.jobTitle || "Interview"}
                                                                    </h3>
                                                                    <p className="mt-1 text-xs text-slate-500">
                                                                        Application{" "}
                                                                        <span className="font-semibold text-slate-700">
                                                                            #{interview.applicationId ?? "—"}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border !px-2.5 !py-1.5 text-[11px] font-bold ${status.className}`}>
                                                                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                                                                {status.label}
                                                            </span>
                                                        </div>

                                                        {/* Date and time */}
                                                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                            <div className="rounded-xl border border-slate-100 bg-slate-50/80 !p-3.5 transition group-hover:border-violet-100 group-hover:bg-violet-50/40">
                                                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                                    <CalendarDays size={15} className="text-violet-600" />
                                                                    Interview date
                                                                </div>
                                                                <p className="mt-2 text-sm font-bold text-slate-900">
                                                                    {formatDate(interview.interviewDate)}
                                                                </p>
                                                            </div>

                                                            <div className="rounded-xl border border-slate-100 bg-slate-50/80 !p-3.5 transition group-hover:border-violet-100 group-hover:bg-violet-50/40">
                                                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                                    <Clock3 size={15} className="text-violet-600" />
                                                                    Interview time
                                                                </div>
                                                                <p className="mt-2 text-sm font-bold text-slate-900">
                                                                    {formatTime(interview.interviewTime)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Employer notes */}
                                                        {interview.notes && (
                                                            <div className="mt-4 rounded-xl border border-violet-100/80 bg-gradient-to-r from-violet-50/90 to-indigo-50/60 !p-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm">
                                                                        <FileText size={14} />
                                                                    </div>
                                                                    <p className="text-xs font-bold text-violet-900">
                                                                        Interview notes
                                                                    </p>
                                                                    <Sparkles size={13} className="ml-auto text-violet-500" />
                                                                </div>
                                                                <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                                                                    {interview.notes}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Footer and meeting action */}
                                                        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 !pt-4 sm:flex-row sm:items-center sm:justify-between">
                                                            <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
                                                                {interview.meetingLink ? (
                                                                    <>
                                                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                                                            <Radio size={15} />
                                                                        </span>
                                                                        <span>
                                                                            <span className="block font-semibold text-slate-700">
                                                                                Online interview
                                                                            </span>
                                                                            <span className="mt-0.5 block text-[11px]">
                                                                                Meeting link available
                                                                            </span>
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                                                            <MapPin size={15} />
                                                                        </span>
                                                                        <span>
                                                                            <span className="block font-semibold text-slate-700">
                                                                                Meeting details
                                                                            </span>
                                                                            <span className="mt-0.5 block text-[11px]">
                                                                                Link not provided
                                                                            </span>
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>

                                                            {interview.meetingLink ? (
                                                                <a
                                                                    href={interview.meetingLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`inline-flex items-center justify-center gap-2 rounded-xl !px-4 !py-3 text-sm font-bold transition duration-200 ${
                                                                        isScheduled
                                                                            ? "bg-violet-600 text-white shadow-md shadow-violet-200 hover:bg-violet-700 hover:shadow-lg"
                                                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                                    }`}
                                                                >
                                                                    <Video size={16} />
                                                                    Join interview
                                                                    <ArrowUpRight size={15} />
                                                                </a>
                                                            ) : (
                                                                <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-50 !px-4 !py-3 text-xs font-semibold text-slate-400">
                                                                    <Timer size={15} />
                                                                    Await meeting details
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </section>

                        {/* Closing footer */}
                        {!loading && !error && interviews.length > 0 && (
                            <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-violet-100 bg-gradient-to-r from-white via-violet-50/50 to-indigo-50/50 !p-4 sm:flex-row sm:items-center sm:justify-between sm:!px-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                                        <Sparkles size={19} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            A little preparation goes a long way.
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Review your notes and check your meeting details before each interview.
                                        </p>
                                    </div>
                                </div>

                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700">
                                    Keep moving forward
                                    <ArrowUpRight size={14} />
                                </span>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SInterviews;

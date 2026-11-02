
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Plus,
    CalendarDays,
    Clock3,
    CheckCircle2,
    Users,
    RefreshCw,
    Sparkles,
    CalendarCheck2,
    X,
    Video,
    BriefcaseBusiness,
    MapPin,
    FileText,
} from "lucide-react";

import { getEmployerInterviews } from "../../../services/employerService";
import Sidebar from "../../../components/Sidebar/Sidebar";

import InterviewFilters from "./InterviewFilters";
import InterviewCard from "./InterviewCard";
import InterviewStatus from "./InterviewStatus";
import ScheduleInterview from "./ScheduleInterview";
import EmployerNavbar from "../ENavbar/EmployerNavbar";

const formatDate = (value) => {
    if (!value) return "Not specified";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Not specified";

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const StatCard = ({ title, value, description, Icon, accent }) => (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white !p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100/60">
        <div className={`absolute -right-5 -top-5 h-24 w-24 rounded-full ${accent} opacity-40 blur-2xl transition group-hover:opacity-70`} />

        <div className="relative flex items-start justify-between gap-3">
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {title}
                </p>

                <p className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
                    {value}
                </p>

                <p className="mt-2 text-xs text-gray-500">{description}</p>
            </div>

            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent.replace("bg-", "bg-")} text-purple-700 ring-1 ring-purple-100`}>
                <Icon size={20} />
            </div>
        </div>
    </div>
);

const Interviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [jobFilter, setJobFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [dateFilter, setDateFilter] = useState("");
    const [showSchedule, setShowSchedule] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadInterviews = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data = await getEmployerInterviews();
            setInterviews(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Unable to load interviews.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadInterviews();
    }, [loadInterviews]);

    const jobTitles = useMemo(
        () => [
            ...new Set(
                interviews
                    .map((interview) => interview.jobTitle)
                    .filter(Boolean)
            ),
        ],
        [interviews]
    );

    const filteredInterviews = useMemo(
        () =>
            interviews.filter((interview) => {
                const matchesJob =
                    jobFilter === "ALL" ||
                    interview.jobTitle === jobFilter;

                const matchesStatus =
                    statusFilter === "ALL" ||
                    (interview.status || "").toUpperCase() === statusFilter;

                const interviewDate = interview.interviewDate
                    ? String(interview.interviewDate).slice(0, 10)
                    : "";

                const matchesDate =
                    !dateFilter || interviewDate === dateFilter;

                return matchesJob && matchesStatus && matchesDate;
            }),
        [interviews, jobFilter, statusFilter, dateFilter]
    );

    const today = new Date();
    const todayKey = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-");

    const stats = useMemo(() => {
        const count = (status) =>
            interviews.filter(
                (item) => (item.status || "").toUpperCase() === status
            ).length;

        const upcoming = interviews.filter((item) => {
            const date = item.interviewDate
                ? String(item.interviewDate).slice(0, 10)
                : "";

            return (
                date >= todayKey &&
                !["COMPLETED", "CANCELLED"].includes(
                    (item.status || "").toUpperCase()
                )
            );
        }).length;

        return {
            total: interviews.length,
            upcoming,
            completed: count("COMPLETED"),
            pending: count("PENDING"),
        };
    }, [interviews, todayKey]);

    const handleScheduled = (newInterview) => {
        if (newInterview) {
            setInterviews((previous) => {
                const newId = newInterview.id;

                if (
                    newId != null &&
                    previous.some((item) => item.id === newId)
                ) {
                    return previous;
                }

                return [newInterview, ...previous];
            });
        }

        setShowSchedule(false);
        loadInterviews(true);
    };

    return (
        <div className="min-h-screen bg-[#f8f7ff] text-gray-900">
            <div className="grid min-h-screen grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)]">
                {/* Sidebar stays in its own column */}
                <aside className="hidden md:block">
                    <div className="sticky top-0 h-screen overflow-y-auto">
                        <Sidebar />
                    </div>
                </aside>

                {/* Employer dashboard content */}
                <main className="min-w-0">
                    <EmployerNavbar />

                    <div className="mx-auto max-w-[1600px] !p-4 sm:!p-6 xl:!p-8">
                        {/* Hero heading */}
                        <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#30206f] via-[#5429a9] to-[#8b45dc] !p-6 sm:!p-8 text-white shadow-xl shadow-purple-200/60">
                            <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[30px] border-white/10" />
                            <div className="pointer-events-none absolute bottom-[-70px] right-[22%] h-40 w-40 rounded-full bg-fuchsia-400/20 blur-2xl" />

                            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                                <div className="max-w-2xl">
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-1.5 text-xs font-medium text-purple-100">
                                        <Sparkles size={14} />
                                        Employer workspace
                                    </div>

                                    <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                                        Interview Center
                                    </h1>

                                    <p className="mt-2 max-w-xl text-sm leading-6 text-purple-100 sm:text-base">
                                        Keep every candidate conversation organized.
                                        Review schedules, track progress, and make
                                        your next great hire.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowSchedule(true)}
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white !px-5 !py-3 text-sm font-bold text-purple-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-purple-50"
                                >
                                    <Plus size={17} />
                                    Schedule interview
                                </button>
                            </div>

                            <div className="relative mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/15 !pt-4 text-xs text-purple-100">
                                <span className="flex items-center gap-2">
                                    <CalendarCheck2 size={14} />
                                    One place for your interview schedule
                                </span>
                                <span className="flex items-center gap-2">
                                    <Users size={14} />
                                    Candidate-focused hiring workflow
                                </span>
                            </div>
                        </section>

                        {/* Error notice */}
                        {error && (
                            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50 !p-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-red-700">{error}</p>

                                <button
                                    type="button"
                                    onClick={() => loadInterviews(true)}
                                    className="inline-flex items-center gap-2 self-start rounded-lg border border-red-200 bg-white !px-3 !py-2 text-xs font-semibold text-red-700 hover:bg-red-100 sm:self-auto"
                                >
                                    <RefreshCw size={13} />
                                    Try again
                                </button>
                            </div>
                        )}

                        {/* Statistics */}
                        <section className="mb-6">
                            <div className="mb-4 flex items-end justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Your overview
                                    </h2>
                                    <p className="mt-1 text-xs text-gray-500">
                                        A quick snapshot of your hiring activity
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => loadInterviews(true)}
                                    disabled={refreshing}
                                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white !px-3 !py-2 text-xs font-semibold text-gray-600 transition hover:border-purple-200 hover:text-purple-700 disabled:opacity-60"
                                >
                                    <RefreshCw
                                        size={13}
                                        className={refreshing ? "animate-spin" : ""}
                                    />
                                    Refresh
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                                <StatCard
                                    title="Total interviews"
                                    value={loading ? "—" : stats.total}
                                    description="All interview records"
                                    Icon={CalendarDays}
                                    accent="bg-purple-100"
                                />
                                <StatCard
                                    title="Upcoming"
                                    value={loading ? "—" : stats.upcoming}
                                    description="Not yet completed or cancelled"
                                    Icon={Clock3}
                                    accent="bg-blue-100"
                                />
                                <StatCard
                                    title="Completed"
                                    value={loading ? "—" : stats.completed}
                                    description="Interviews completed"
                                    Icon={CheckCircle2}
                                    accent="bg-green-100"
                                />
                                <StatCard
                                    title="Pending"
                                    value={loading ? "—" : stats.pending}
                                    description="Awaiting progress"
                                    Icon={Users}
                                    accent="bg-amber-100"
                                />
                            </div>
                        </section>

                        {/* Filters */}
                        <div className="mb-6">
                            <InterviewFilters
                                jobTitles={jobTitles}
                                jobFilter={jobFilter}
                                setJobFilter={setJobFilter}
                                statusFilter={statusFilter}
                                setStatusFilter={setStatusFilter}
                                dateFilter={dateFilter}
                                setDateFilter={setDateFilter}
                            />
                        </div>

                        {/* Interview list */}
                        <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                            <div className="flex flex-col gap-3 border-b border-gray-100 !p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-gray-900">
                                        Interview schedule
                                    </h2>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {loading
                                            ? "Loading your interviews..."
                                            : `${filteredInterviews.length} ${
                                                  filteredInterviews.length === 1
                                                      ? "interview"
                                                      : "interviews"
                                              } matching your filters`}
                                    </p>
                                </div>

                                <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-purple-50 !px-3 !py-2 text-xs font-semibold text-purple-700">
                                    <CalendarDays size={14} />
                                    Live records
                                </div>
                            </div>

                            <div className="space-y-3 bg-[#fcfbff] !p-3 sm:!p-5">
                                {loading ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((item) => (
                                            <div
                                                key={item}
                                                className="h-24 animate-pulse rounded-2xl border border-gray-100 bg-white"
                                            />
                                        ))}
                                    </div>
                                ) : filteredInterviews.length === 0 ? (
                                    <div className="flex flex-col items-center !px-5 !py-14 text-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                                            <CalendarDays size={28} />
                                        </div>

                                        <h3 className="mt-5 text-base font-bold text-gray-900">
                                            {interviews.length === 0
                                                ? "Your interview calendar is ready"
                                                : "No matching interviews"}
                                        </h3>

                                        <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                                            {interviews.length === 0
                                                ? "Schedule an interview with a shortlisted candidate to start building your calendar."
                                                : "Try changing your filters, or clear them to see your other interviews."}
                                        </p>

                                        {interviews.length === 0 ? (
                                            <button
                                                type="button"
                                                onClick={() => setShowSchedule(true)}
                                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 !px-4 !py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                                            >
                                                <Plus size={15} />
                                                Schedule your first interview
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setJobFilter("ALL");
                                                    setStatusFilter("ALL");
                                                    setDateFilter("");
                                                }}
                                                className="mt-5 rounded-xl border border-purple-200 bg-white !px-4 !py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-50"
                                            >
                                                Clear filters
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    filteredInterviews.map((interview, index) => (
                                        <InterviewCard
                                            key={
                                                interview.id ??
                                                `${interview.applicationId ?? "application"}-${interview.interviewDate ?? "date"}-${index}`
                                            }
                                            interview={interview}
                                            onView={setSelectedInterview}
                                        />
                                    ))
                                )}
                            </div>
                        </section>

                        <p className="mt-5 text-center text-[11px] text-gray-400">
                            CareerTrack · Employer Interview Management
                        </p>
                    </div>
                </main>
            </div>

            {/* Schedule modal */}
            {showSchedule && (
                <ScheduleInterview
                    onClose={() => setShowSchedule(false)}
                    onScheduled={handleScheduled}
                />
            )}

            {/* Interview details modal */}
            {selectedInterview && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-gray-950/50 !p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setSelectedInterview(null);
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="interview-details-title"
                        className="my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl"
                    >
                        <div className="relative overflow-hidden bg-gradient-to-br from-purple-800 to-fuchsia-600 !p-6 text-white">
                            <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border-[22px] border-white/10" />

                            <div className="relative flex items-start justify-between gap-3">
                                <div>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 !px-3 !py-1 text-xs font-medium">
                                        <CalendarCheck2 size={13} />
                                        Interview details
                                    </span>

                                    <h2
                                        id="interview-details-title"
                                        className="mt-4 text-xl font-bold"
                                    >
                                        {selectedInterview.candidateName ||
                                            selectedInterview.studentName ||
                                            "Unknown Candidate"}
                                    </h2>

                                    <p className="mt-1 text-sm text-purple-100">
                                        {selectedInterview.jobTitle || "Job"}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setSelectedInterview(null)}
                                    aria-label="Close interview details"
                                    className="rounded-xl bg-white/10 !p-2 text-white transition hover:bg-white/20"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 !p-6">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Current status
                                </p>
                                <InterviewStatus status={selectedInterview.status} />
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-gray-100 bg-gray-50 !p-4">
                                    <CalendarDays size={17} className="text-purple-600" />
                                    <p className="mt-3 text-xs text-gray-500">Interview date</p>
                                    <p className="mt-1 text-sm font-semibold text-gray-900">
                                        {formatDate(selectedInterview.interviewDate)}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-gray-100 bg-gray-50 !p-4">
                                    <Clock3 size={17} className="text-purple-600" />
                                    <p className="mt-3 text-xs text-gray-500">Interview time</p>
                                    <p className="mt-1 text-sm font-semibold text-gray-900">
                                        {selectedInterview.interviewTime || "Not specified"}
                                    </p>
                                </div>
                            </div>

                            {selectedInterview.meetingLink && (
                                <a
                                    href={selectedInterview.meetingLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 !px-4 !py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                                >
                                    <Video size={16} />
                                    Open meeting link
                                </a>
                            )}

                            {selectedInterview.location && (
                                <div className="flex gap-3 rounded-xl border border-gray-100 !p-4">
                                    <MapPin size={17} className="mt-0.5 shrink-0 text-purple-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">Location</p>
                                        <p className="mt-1 text-sm font-medium text-gray-800">
                                            {selectedInterview.location}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {selectedInterview.notes && (
                                <div className="rounded-xl border border-gray-100 !p-4">
                                    <p className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                                        <FileText size={14} className="text-purple-600" />
                                        Interview notes
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                        {selectedInterview.notes}
                                    </p>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setSelectedInterview(null)}
                                className="w-full rounded-xl border border-gray-200 !px-4 !py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Close details
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default Interviews;

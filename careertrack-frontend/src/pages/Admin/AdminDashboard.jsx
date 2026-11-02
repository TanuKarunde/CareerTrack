
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Users,
    Building2,
    BriefcaseBusiness,
    ClipboardCheck,
    CalendarDays,
    GraduationCap,
    ArrowUpRight,
    RefreshCw,
    ShieldCheck,
    AlertCircle,
    LoaderCircle,
    TrendingUp,
    LayoutDashboard,
    Sparkles,
    Activity,
    CircleCheck,
    Database,
    Menu,
    X,
} from "lucide-react";

import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import { getAdminDashboard } from "../../services/adminService";

const STAT_CARDS = [
    {
        key: "totalStudents",
        title: "Total Students",
        subtitle: "Registered student accounts",
        icon: Users,
        iconStyle: "bg-violet-100 text-violet-700",
        accent: "from-violet-500 to-purple-600",
    },
    {
        key: "totalEmployers",
        title: "Total Employers",
        subtitle: "Recruiter accounts",
        icon: Building2,
        iconStyle: "bg-blue-100 text-blue-700",
        accent: "from-blue-500 to-indigo-600",
    },
    {
        key: "totalJobs",
        title: "Total Jobs",
        subtitle: "Job postings on platform",
        icon: BriefcaseBusiness,
        iconStyle: "bg-amber-100 text-amber-700",
        accent: "from-amber-400 to-orange-500",
    },
    {
        key: "totalApplications",
        title: "Applications",
        subtitle: "Submitted applications",
        icon: ClipboardCheck,
        iconStyle: "bg-pink-100 text-pink-700",
        accent: "from-pink-500 to-rose-600",
    },
    {
        key: "totalInterviews",
        title: "Interviews",
        subtitle: "Interview records",
        icon: CalendarDays,
        iconStyle: "bg-indigo-100 text-indigo-700",
        accent: "from-indigo-500 to-blue-600",
    },
    {
        key: "totalSelected",
        title: "Selected Students",
        subtitle: "Selected application records",
        icon: GraduationCap,
        iconStyle: "bg-emerald-100 text-emerald-700",
        accent: "from-emerald-500 to-teal-600",
    },
];

const QUICK_LINKS = [
    {
        label: "Manage Users",
        description: "Review platform accounts",
        href: "/admin/users",
        icon: Users,
        color: "bg-violet-100 text-violet-700",
    },
    {
        label: "Company Management",
        description: "Review company profiles",
        href: "/admin/companies",
        icon: Building2,
        color: "bg-blue-100 text-blue-700",
    },
    {
        label: "Job Management",
        description: "Monitor job listings",
        href: "/admin/jobs",
        icon: BriefcaseBusiness,
        color: "bg-amber-100 text-amber-700",
    },
];

const formatNumber = (value) =>
    Number(value ?? 0).toLocaleString("en-IN");

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const loadDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminDashboard();

            setStats(data);
            setLastUpdated(new Date());
        } catch (err) {
            setError(
                err?.message || "Unable to load dashboard statistics."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const totalApplications = Number(stats?.totalApplications ?? 0);
    const selected = Number(stats?.totalSelected ?? 0);

    const selectionRate =
        totalApplications > 0
            ? Math.min(
                  100,
                  Math.round((selected / totalApplications) * 100)
              )
            : 0;

    return (
        <div className="min-h-screen bg-[#f8f7fc] text-gray-800">
            <div className="flex min-h-screen">
                {/* Desktop sidebar */}
                <aside className="hidden lg:block">
                    <AdminSidebar />
                </aside>

                {/* Mobile sidebar */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-[100] flex lg:hidden">
                        <button
                            type="button"
                            aria-label="Close navigation"
                            onClick={() => setSidebarOpen(false)}
                            className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
                        />

                        <div className="relative z-10 h-full">
                            <AdminSidebar
                                onClose={() => setSidebarOpen(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Main content */}
                <main className="min-w-0 flex-1">
                    <AdminNavbar
                        onMenuClick={() => setSidebarOpen(true)}
                    />

                    <div className="mx-auto max-w-[1600px] space-y-7 !px-4 !py-5 sm:px-6 md:px-8 md:py-8">

                        {/* Page heading */}
                        <section className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-600">
                                    <LayoutDashboard size={15} />
                                    Admin workspace
                                </div>

                                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                    Dashboard Overview
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                                    Monitor students, employers, recruitment
                                    activity, and hiring progress across
                                    CareerTrack.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={loadDashboard}
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white !px-4 !py-3 text-sm font-bold text-purple-700 shadow-sm transition hover:border-purple-300 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <LoaderCircle
                                        size={17}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <RefreshCw size={17} />
                                )}

                                {loading ? "Refreshing..." : "Refresh data"}
                            </button>
                        </section>

                        {/* Welcome banner */}
                        <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#32106b] via-[#5b21b6] to-[#8b5cf6] !p-6 text-white shadow-xl shadow-purple-200/60 sm:p-8 lg:p-9">
                            {/* Decorative shapes */}
                            <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full border-[42px] border-white/[0.07]" />
                            <div className="pointer-events-none absolute -bottom-28 right-[25%] -z-10 h-64 w-64 rounded-full bg-fuchsia-400/10 blur-2xl" />
                            <div className="pointer-events-none absolute right-[12%] top-10 -z-10 h-24 w-24 rounded-full bg-white/[0.06] blur-xl" />

                            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                                <div>
                                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 !px-3 !py-1.5 text-xs font-bold text-purple-100 backdrop-blur-sm">
                                        <ShieldCheck size={15} />
                                        Platform control center
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                                    </div>

                                    <h2 className="max-w-2xl text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                                        Welcome to{" "}
                                        <span className="text-purple-200">
                                            CareerTrack
                                        </span>
                                        , Admin.
                                    </h2>

                                    <p className="mt-4 max-w-2xl text-sm leading-7 text-purple-100 sm:text-base">
                                        Your central workspace for monitoring
                                        placement activity, understanding
                                        recruitment trends, and keeping your
                                        career ecosystem organized.
                                    </p>

                                    <div className="mt-6 flex flex-wrap items-center gap-3">
                                        <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 !px-3 !py-2 text-xs font-semibold text-white/90">
                                            <Database size={15} />
                                            Live backend statistics
                                        </div>

                                        <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 !px-3 !py-2 text-xs font-semibold text-white/90">
                                            <Activity size={15} />
                                            Admin monitoring
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden h-40 w-40 items-center justify-center rounded-[32px] border border-white/15 bg-white/[0.08] shadow-inner backdrop-blur-sm lg:flex">
                                    <div className="flex h-28 w-28 items-center justify-center rounded-[26px] bg-white text-purple-700 shadow-xl shadow-purple-950/20">
                                        <ShieldCheck size={58} strokeWidth={1.5} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Error state */}
                        {error && (
                            <div
                                role="alert"
                                className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 !p-4 text-sm text-red-700 sm:flex-row sm:items-center"
                            >
                                <AlertCircle
                                    size={21}
                                    className="shrink-0"
                                />

                                <div className="min-w-0 flex-1">
                                    <p className="font-bold">
                                        Dashboard could not load
                                    </p>
                                    <p className="mt-1 break-words">
                                        {error}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={loadDashboard}
                                    disabled={loading}
                                    className="self-start rounded-lg !px-3 !py-2 font-bold underline underline-offset-4 hover:bg-red-100 disabled:opacity-50 sm:self-center"
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        {/* Section title */}
                        <section className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-purple-600">
                                    Platform analytics
                                </p>

                                <h2 className="mt-1 text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                                    Your platform at a glance
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Key totals from your CareerTrack database.
                                </p>
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 !px-3 !py-2 text-xs font-bold text-emerald-700">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                </span>
                                {loading ? "Updating data" : "Dashboard ready"}
                            </div>
                        </section>

                        {/* Statistics cards */}
                        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {STAT_CARDS.map((card) => {
                                const Icon = card.icon;
                                const value = stats?.[card.key];

                                return (
                                    <article
                                        key={card.key}
                                        className="group relative overflow-hidden rounded-2xl border border-purple-100/80 bg-white !p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/70 sm:p-6"
                                    >
                                        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`} />

                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-500">
                                                    {card.title}
                                                </p>

                                                <p className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                                    {loading && !stats ? (
                                                        <span className="inline-block h-9 w-20 animate-pulse rounded-lg bg-purple-50" />
                                                    ) : loading ? (
                                                        <span className="opacity-60">
                                                            {formatNumber(value)}
                                                        </span>
                                                    ) : (
                                                        formatNumber(value)
                                                    )}
                                                </p>
                                            </div>

                                            <div className={`rounded-2xl !p-3.5 transition duration-300 group-hover:rotate-3 group-hover:scale-110 ${card.iconStyle}`}>
                                                <Icon size={23} />
                                            </div>
                                        </div>

                                        <div className="mt-5 flex items-center justify-between gap-2 border-t border-gray-100 !pt-4">
                                            <p className="text-xs leading-5 text-gray-400">
                                                {card.subtitle}
                                            </p>

                                            <ArrowUpRight
                                                size={17}
                                                className="shrink-0 text-purple-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                            />
                                        </div>
                                    </article>
                                );
                            })}
                        </section>

                        {/* Insights and quick links */}
                        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">

                            {/* Recruitment snapshot */}
                            <article className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
                                <div className="flex items-center justify-between gap-3 border-b border-gray-100 !px-5 !py-5 sm:px-6">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-lg bg-purple-100 !p-2 text-purple-700">
                                                <TrendingUp size={19} />
                                            </div>

                                            <h3 className="font-extrabold text-gray-900">
                                                Recruitment snapshot
                                            </h3>
                                        </div>

                                        <p className="mt-2 text-sm text-gray-500">
                                            A quick view of application outcomes.
                                        </p>
                                    </div>

                                    <span className="hidden rounded-full bg-purple-50 !px-3 !py-1.5 text-xs font-bold text-purple-700 sm:inline-flex">
                                        Overview
                                    </span>
                                </div>

                                <div className="!p-5 sm:p-6">
                                    <div className="flex flex-wrap items-end justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-600">
                                                Application selection rate
                                            </p>

                                            <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
                                                {loading && !stats
                                                    ? "—"
                                                    : `${selectionRate}%`}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-emerald-50 !px-3 !py-2 text-xs font-bold text-emerald-700">
                                            <CircleCheck
                                                size={14}
                                                className="mr-1 inline"
                                            />
                                            Selected
                                        </div>
                                    </div>

                                    <div
                                        className="mt-5 h-3 overflow-hidden rounded-full bg-purple-50"
                                        role="progressbar"
                                        aria-label="Application selection rate"
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={selectionRate}
                                    >
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-400 transition-all duration-700"
                                            style={{
                                                width: `${loading && !stats ? 0 : selectionRate}%`,
                                            }}
                                        />
                                    </div>

                                    <p className="mt-3 text-xs leading-5 text-gray-500">
                                        {loading && !stats
                                            ? "Loading application statistics..."
                                            : `${formatNumber(selected)} selected out of ${formatNumber(totalApplications)} total applications.`}
                                    </p>

                                    <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-purple-100 bg-[#faf8ff] !p-4">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs font-semibold text-gray-500">
                                                    Registered companies
                                                </p>

                                                <Building2
                                                    size={17}
                                                    className="text-purple-500"
                                                />
                                            </div>

                                            <p className="mt-3 text-2xl font-extrabold text-gray-900">
                                                {loading && !stats
                                                    ? "—"
                                                    : formatNumber(
                                                          stats?.totalCompanies
                                                      )}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                Company profiles
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 !p-4">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs font-semibold text-gray-500">
                                                    Data connection
                                                </p>

                                                <Database
                                                    size={17}
                                                    className="text-emerald-600"
                                                />
                                            </div>

                                            <p className="mt-3 flex items-center gap-2 text-lg font-extrabold text-gray-900">
                                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                                {error
                                                    ? "Unavailable"
                                                    : loading
                                                      ? "Connecting..."
                                                      : stats
                                                        ? "Connected"
                                                        : "Waiting"}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                CareerTrack backend
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            {/* Quick links */}
                            <article className="rounded-2xl border border-purple-100 bg-white !p-5 shadow-sm sm:p-6">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-xl bg-amber-50 !p-3 text-amber-600">
                                        <Sparkles size={22} />
                                    </div>

                                    <div>
                                        <h3 className="font-extrabold text-gray-900">
                                            Admin quick links
                                        </h3>

                                        <p className="mt-1 text-sm leading-5 text-gray-500">
                                            Jump to your management modules.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    {QUICK_LINKS.map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <Link
                                                key={item.href}
                                                to={item.href}
                                                className="group flex items-center gap-3 rounded-xl border border-gray-100 !p-3.5 transition duration-200 hover:border-purple-200 hover:bg-purple-50/70"
                                            >
                                                <div className={`rounded-xl !p-2.5 transition group-hover:scale-105 ${item.color}`}>
                                                    <Icon size={19} />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-gray-800">
                                                        {item.label}
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                <ArrowUpRight
                                                    size={18}
                                                    className="shrink-0 text-gray-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-purple-600"
                                                />
                                            </Link>
                                        );
                                    })}
                                </div>

                                <div className="mt-5 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 !p-4">
                                    <div className="flex items-start gap-2.5">
                                        <ShieldCheck
                                            size={18}
                                            className="mt-0.5 shrink-0 text-purple-600"
                                        />

                                        <p className="text-xs leading-5 text-purple-800">
                                            Admin access should be protected
                                            by both frontend role checks and
                                            backend authorization.
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </section>

                        {/* Footer */}
                        <footer className="flex flex-col items-center justify-between gap-2 border-t border-purple-100 !py-5 text-center text-xs text-gray-400 sm:flex-row sm:text-left">
                            <p>
                                CareerTrack Admin Console
                                {" "}· Track. Prepare. Get Hired.
                            </p>

                            <p>
                                {lastUpdated
                                    ? `Last refreshed at ${lastUpdated.toLocaleTimeString("en-IN", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      })}`
                                    : "Waiting for dashboard data"}
                            </p>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;

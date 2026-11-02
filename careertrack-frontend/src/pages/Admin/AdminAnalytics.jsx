import { useCallback, useEffect, useState } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";
import {
    Users,
    Building2,
    BriefcaseBusiness,
    ClipboardCheck,
    CalendarDays,
    GraduationCap,
    RefreshCw,
    LoaderCircle,
    AlertCircle,
    TrendingUp,
    ChartNoAxesCombined,
    ShieldCheck,
    Activity,
    CheckCircle2,
    Clock3,
    XCircle,
    Menu,
    Download,
} from "lucide-react";

import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import { getAdminAnalytics } from "../../services/adminService";

const PURPLE = "#7c3aed";

const COLORS = {
    purple: "#8b5cf6",
    blue: "#3b82f6",
    green: "#10b981",
    orange: "#f59e0b",
    red: "#f87171",
    pink: "#ec4899",
    gray: "#94a3b8",
};

const number = (value) => Number(value ?? 0);

const formatNumber = (value) =>
    number(value).toLocaleString("en-IN");

const formatMonth = (value) => {
    if (!value) return "";

    const [year, month] = value.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);

    return date.toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
    });
};

const makeLast12Months = () => {
    const now = new Date();

    return Array.from({ length: 12 }, (_, index) => {
        const date = new Date(
            now.getFullYear(),
            now.getMonth() - 11 + index,
            1
        );

        return {
            month: `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`,
            label: date.toLocaleDateString("en-IN", {
                month: "short",
                year: "2-digit",
            }),
        };
    });
};

const mergeMonthly = (months, rows, keys = ["total"]) => {
    const byMonth = new Map(
        (rows || []).map((row) => [row.month, row])
    );

    return months.map(({ month, label }) => {
        const row = byMonth.get(month) || {};
        const item = { month, label };

        keys.forEach((key) => {
            item[key] = number(row[key]);
        });

        return item;
    });
};

const downloadCSV = (analytics) => {
    if (!analytics) return;

    const rows = [
        ["CareerTrack Admin Analytics Report"],
        ["Generated At", new Date().toLocaleString("en-IN")],
        [],
        ["Metric", "Value"],
        ["Total Students", analytics.totalStudents],
        ["Total Employers", analytics.totalEmployers],
        ["Total Companies", analytics.totalCompanies],
        ["Verified Companies", analytics.verifiedCompanies],
        ["Pending Companies", analytics.pendingCompanies],
        ["Rejected Companies", analytics.rejectedCompanies],
        ["Total Jobs", analytics.totalJobs],
        ["Active Jobs", analytics.activeJobs],
        ["Inactive Jobs", analytics.inactiveJobs],
        ["Total Applications", analytics.totalApplications],
        ["Shortlisted Applications", analytics.shortlistedApplications],
        ["Interview-stage Applications", analytics.interviewStageApplications],
        ["Selected Applications", analytics.selectedApplications],
        ["Rejected Applications", analytics.rejectedApplications],
        ["Total Interviews", analytics.totalInterviews],
        ["Scheduled Interviews", analytics.scheduledInterviews],
    ];

    const csv = rows
        .map((row) =>
            row
                .map((value) => {
                    const text = String(value ?? "");
                    return `"${text.replace(/"/g, '""')}"`;
                })
                .join(",")
        )
        .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "careertrack-admin-analytics.csv";
    anchor.click();

    URL.revokeObjectURL(url);
};

const StatCard = ({ title, value, subtitle, icon: Icon, tone }) => (
    <article className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white !p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100/60">
        <div
            className={`absolute inset-x-0 top-0 h-1 ${tone.bar}`}
        />

        <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-500">
                    {title}
                </p>

                <p className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
                    {formatNumber(value)}
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-400">
                    {subtitle}
                </p>
            </div>

            <div
                className={`rounded-2xl !p-3 transition group-hover:scale-110 ${tone.icon}`}
            >
                <Icon size={22} />
            </div>
        </div>
    </article>
);

const Panel = ({ title, description, icon: Icon, children, action }) => (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 !px-5 !py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-2.5 text-purple-700">
                    <Icon size={20} />
                </div>

                <div className="min-w-0">
                    <h2 className="font-extrabold text-gray-900">
                        {title}
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                        {description}
                    </p>
                </div>
            </div>

            {action}
        </div>

        <div className="p-4 sm:p-6">{children}</div>
    </section>
);

const EmptyChart = ({ message }) => (
    <div className="flex h-full min-h-48 flex-col items-center justify-center gap-2 text-center">
        <ChartNoAxesCombined size={30} className="text-purple-300" />
        <p className="text-sm font-semibold text-gray-600">
            No activity recorded yet
        </p>
        <p className="max-w-xs text-xs leading-5 text-gray-400">
            {message}
        </p>
    </div>
);

const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border border-purple-100 bg-white !p-3 shadow-xl">
            <p className="mb-2 text-xs font-bold text-gray-700">
                {label}
            </p>

            {payload.map((item) => (
                <div
                    key={item.dataKey}
                    className="flex items-center gap-2 !py-1 text-xs"
                >
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-500">
                        {item.name}:
                    </span>
                    <strong className="text-gray-900">
                        {formatNumber(item.value)}
                    </strong>
                </div>
            ))}
        </div>
    );
};

const AdminAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const loadAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminAnalytics();

            setAnalytics(data);
            setLastUpdated(new Date());
        } catch (err) {
            setError(
                err?.message || "Unable to load analytics from the server."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    const months = makeLast12Months();

    const registrations = mergeMonthly(
        months,
        analytics?.monthlyRegistrations,
        ["students", "employers"]
    );

    const jobs = mergeMonthly(
        months,
        analytics?.monthlyJobs
    );

    const applications = mergeMonthly(
        months,
        analytics?.monthlyApplications
    );

    const interviews = mergeMonthly(
        months,
        analytics?.monthlyInterviews
    );

    const companyData = [
        {
            name: "Verified",
            value: number(analytics?.verifiedCompanies),
            color: COLORS.green,
        },
        {
            name: "Pending",
            value: number(analytics?.pendingCompanies),
            color: COLORS.orange,
        },
        {
            name: "Rejected",
            value: number(analytics?.rejectedCompanies),
            color: COLORS.red,
        },
    ].filter((item) => item.value > 0);

    const applicationData = [
        {
            name: "Applied",
            value: Math.max(
                0,
                number(analytics?.totalApplications) -
                    number(analytics?.shortlistedApplications) -
                    number(analytics?.interviewStageApplications) -
                    number(analytics?.selectedApplications) -
                    number(analytics?.rejectedApplications)
            ),
            color: COLORS.blue,
        },
        {
            name: "Shortlisted",
            value: number(analytics?.shortlistedApplications),
            color: COLORS.purple,
        },
        {
            name: "Interview",
            value: number(analytics?.interviewStageApplications),
            color: COLORS.orange,
        },
        {
            name: "Selected",
            value: number(analytics?.selectedApplications),
            color: COLORS.green,
        },
        {
            name: "Rejected",
            value: number(analytics?.rejectedApplications),
            color: COLORS.red,
        },
    ].filter((item) => item.value > 0);

    const activeJobs = number(analytics?.activeJobs);
    const totalJobs = number(analytics?.totalJobs);

    const activeJobRate =
        totalJobs > 0
            ? Math.round((activeJobs / totalJobs) * 100)
            : 0;

    const selected = number(analytics?.selectedApplications);
    const totalApplications = number(analytics?.totalApplications);

    const selectionRate =
        totalApplications > 0
            ? Math.round((selected / totalApplications) * 100)
            : 0;

    const hasRegistrationData = registrations.some(
        (row) => row.students > 0 || row.employers > 0
    );

    const hasJobData = jobs.some((row) => row.total > 0);
    const hasApplicationData = applications.some((row) => row.total > 0);
    const hasInterviewData = interviews.some((row) => row.total > 0);

    return (
        <div className="min-h-screen bg-[#f8f7fc] text-gray-800">
            <div className="flex min-h-screen">
                <aside className="hidden shrink-0 lg:block">
                    <AdminSidebar />
                </aside>

                {sidebarOpen && (
                    <div className="fixed inset-0 z-[100] flex lg:hidden">
                        <button
                            type="button"
                            aria-label="Close navigation"
                            onClick={() => setSidebarOpen(false)}
                            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
                        />

                        <div className="relative z-10 h-full">
                            <AdminSidebar
                                onClose={() => setSidebarOpen(false)}
                            />
                        </div>
                    </div>
                )}

                <main className="min-w-0 flex-1">
                    <AdminNavbar
                        onMenuClick={() => setSidebarOpen(true)}
                    />

                    <div className="mx-auto max-w-[1600px] space-y-7 !px-4 !py-6 sm:px-6 md:px-8 md:!py-8">
                        {/* Heading */}
                        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-purple-600">
                                    <ChartNoAxesCombined size={16} />
                                    Insights & reports
                                </div>

                                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                    Analytics & Reports
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                                    Understand registrations, recruitment
                                    activity, company verification, and
                                    placement outcomes across CareerTrack.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => downloadCSV(analytics)}
                                    disabled={!analytics}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white !px-4 !py-3 text-sm font-bold text-purple-700 shadow-sm transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Download size={17} />
                                    Export CSV
                                </button>

                                <button
                                    type="button"
                                    onClick={loadAnalytics}
                                    disabled={loading}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-700 !px-4 !py-3 text-sm font-bold text-white shadow-md shadow-purple-200 transition hover:bg-purple-800 disabled:opacity-60"
                                >
                                    {loading ? (
                                        <LoaderCircle
                                            size={17}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <RefreshCw size={17} />
                                    )}
                                    {loading ? "Refreshing..." : "Refresh"}
                                </button>
                            </div>
                        </section>

                        {/* Hero */}
                        <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#32106b] via-[#5b21b6] to-[#8b5cf6] !p-6 text-white shadow-xl shadow-purple-200/60 sm:p-8">
                            <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-64 w-64 rounded-full border-[40px] border-white/[0.07]" />
                            <div className="pointer-events-none absolute -bottom-24 right-[25%] -z-10 h-52 w-52 rounded-full bg-fuchsia-300/10 blur-2xl" />

                            <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
                                <div className="max-w-3xl">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-1.5 text-xs font-bold text-purple-100">
                                        <Activity size={14} />
                                        Live platform insights
                                    </span>

                                    <h2 className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">
                                        Every number tells a story.
                                    </h2>

                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-purple-100 sm:text-base">
                                        Track platform growth, discover
                                        hiring patterns, and monitor
                                        placement progress with real
                                        database analytics.
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 !p-4 backdrop-blur-sm">
                                    <div className="rounded-xl bg-white p-3 text-purple-700">
                                        <ShieldCheck size={28} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-purple-100">
                                            Backend connection
                                        </p>
                                        <p className="mt-1 font-extrabold">
                                            {error
                                                ? "Unavailable"
                                                : loading
                                                  ? "Connecting..."
                                                  : analytics
                                                    ? "Connected"
                                                    : "Waiting"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Error */}
                        {error && (
                            <div
                                role="alert"
                                className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 !p-4 text-sm text-red-700 sm:flex-row sm:items-center"
                            >
                                <AlertCircle size={21} className="shrink-0" />

                                <div className="min-w-0 flex-1">
                                    <p className="font-bold">
                                        Analytics could not be loaded
                                    </p>
                                    <p className="mt-1 break-words">{error}</p>
                                </div>

                                <button
                                    type="button"
                                    onClick={loadAnalytics}
                                    className="self-start rounded-lg !px-3 !py-2 font-bold underline underline-offset-4 hover:bg-red-100"
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        {/* Summary cards */}
                        <section>
                            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                                <div>
                                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-purple-600">
                                        Platform overview
                                    </p>
                                    <h2 className="mt-1 text-xl font-extrabold text-gray-900">
                                        Key performance indicators
                                    </h2>
                                </div>

                                <span className="text-xs text-gray-400">
                                    {lastUpdated
                                        ? `Updated ${lastUpdated.toLocaleTimeString("en-IN", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })}`
                                        : "Waiting for data"}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                <StatCard
                                    title="Total Students"
                                    value={analytics?.totalStudents}
                                    subtitle="Registered student accounts"
                                    icon={Users}
                                    tone={{
                                        bar: "bg-gradient-to-r from-violet-500 to-purple-600",
                                        icon: "bg-violet-100 text-violet-700",
                                    }}
                                />

                                <StatCard
                                    title="Total Employers"
                                    value={analytics?.totalEmployers}
                                    subtitle="Recruiter accounts"
                                    icon={Building2}
                                    tone={{
                                        bar: "bg-gradient-to-r from-blue-500 to-indigo-600",
                                        icon: "bg-blue-100 text-blue-700",
                                    }}
                                />

                                <StatCard
                                    title="Total Jobs"
                                    value={analytics?.totalJobs}
                                    subtitle={`${formatNumber(analytics?.activeJobs)} active job postings`}
                                    icon={BriefcaseBusiness}
                                    tone={{
                                        bar: "bg-gradient-to-r from-amber-400 to-orange-500",
                                        icon: "bg-amber-100 text-amber-700",
                                    }}
                                />

                                <StatCard
                                    title="Applications"
                                    value={analytics?.totalApplications}
                                    subtitle="Unique submitted application records"
                                    icon={ClipboardCheck}
                                    tone={{
                                        bar: "bg-gradient-to-r from-pink-500 to-rose-600",
                                        icon: "bg-pink-100 text-pink-700",
                                    }}
                                />

                                <StatCard
                                    title="Interviews"
                                    value={analytics?.totalInterviews}
                                    subtitle={`${formatNumber(analytics?.scheduledInterviews)} currently scheduled`}
                                    icon={CalendarDays}
                                    tone={{
                                        bar: "bg-gradient-to-r from-indigo-500 to-blue-600",
                                        icon: "bg-indigo-100 text-indigo-700",
                                    }}
                                />

                                <StatCard
                                    title="Selected Applications"
                                    value={analytics?.selectedApplications}
                                    subtitle="Applications currently marked selected"
                                    icon={GraduationCap}
                                    tone={{
                                        bar: "bg-gradient-to-r from-emerald-500 to-teal-600",
                                        icon: "bg-emerald-100 text-emerald-700",
                                    }}
                                />
                            </div>
                        </section>

                        {/* Registration and application trends */}
                        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                            <Panel
                                title="Registration growth"
                                description="Student and employer registrations by month"
                                icon={Users}
                            >
                                <div className="h-[300px] w-full">
                                    {hasRegistrationData ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={registrations} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="studentFill" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor={COLORS.purple} stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0.02} />
                                                    </linearGradient>
                                                    <linearGradient id="employerFill" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.25} />
                                                        <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0.02} />
                                                    </linearGradient>
                                                </defs>

                                                <CartesianGrid stroke="#f0eafa" strokeDasharray="4 4" vertical={false} />
                                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                                <Tooltip content={<ChartTooltip />} />
                                                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />

                                                <Area type="monotone" dataKey="students" name="Students" stroke={COLORS.purple} fill="url(#studentFill)" strokeWidth={3} activeDot={{ r: 5 }} />
                                                <Area type="monotone" dataKey="employers" name="Employers" stroke={COLORS.blue} fill="url(#employerFill)" strokeWidth={3} activeDot={{ r: 5 }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <EmptyChart message="Registration trends will appear after accounts are registered." />
                                    )}
                                </div>
                            </Panel>

                            <Panel
                                title="Application activity"
                                description="Monthly application submissions"
                                icon={ClipboardCheck}
                            >
                                <div className="h-[300px] w-full">
                                    {hasApplicationData ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={applications} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="applicationFill" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor={COLORS.pink} stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor={COLORS.pink} stopOpacity={0.02} />
                                                    </linearGradient>
                                                </defs>

                                                <CartesianGrid stroke="#f0eafa" strokeDasharray="4 4" vertical={false} />
                                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                                <Tooltip content={<ChartTooltip />} />

                                                <Area type="monotone" dataKey="total" name="Applications" stroke={COLORS.pink} fill="url(#applicationFill)" strokeWidth={3} activeDot={{ r: 5 }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <EmptyChart message="Applications will appear here when students apply for jobs." />
                                    )}
                                </div>
                            </Panel>
                        </section>

                        {/* Jobs and interviews */}
                        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                            <Panel
                                title="Job creation trend"
                                description="New job postings grouped by month"
                                icon={BriefcaseBusiness}
                            >
                                <div className="h-[290px] w-full">
                                    {hasJobData ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={jobs} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                                                <CartesianGrid stroke="#f0eafa" strokeDasharray="4 4" vertical={false} />
                                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                                <Tooltip content={<ChartTooltip />} />

                                                <Bar dataKey="total" name="Jobs created" fill={COLORS.purple} radius={[7, 7, 0, 0]} maxBarSize={42} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <EmptyChart message="New job postings will appear here." />
                                    )}
                                </div>

                                <div className="mt-4 rounded-xl bg-purple-50 !p-4">
                                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                        <span className="font-semibold text-gray-600">
                                            Active job ratio
                                        </span>
                                        <strong className="text-purple-700">
                                            {activeJobRate}%
                                        </strong>
                                    </div>

                                    <div className="h-2.5 overflow-hidden rounded-full bg-purple-100">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all"
                                            style={{ width: `${activeJobRate}%` }}
                                        />
                                    </div>

                                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                                        <span>{formatNumber(analytics?.activeJobs)} active</span>
                                        <span>{formatNumber(analytics?.inactiveJobs)} inactive</span>
                                    </div>
                                </div>
                            </Panel>

                            <Panel
                                title="Interview activity"
                                description="Interviews grouped by scheduled date"
                                icon={CalendarDays}
                            >
                                <div className="h-[290px] w-full">
                                    {hasInterviewData ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={interviews} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                                                <CartesianGrid stroke="#f0eafa" strokeDasharray="4 4" vertical={false} />
                                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                                <Tooltip content={<ChartTooltip />} />

                                                <Bar dataKey="total" name="Interviews" fill={COLORS.blue} radius={[7, 7, 0, 0]} maxBarSize={42} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <EmptyChart message="Interviews will appear after they are scheduled." />
                                    )}
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-blue-100 bg-blue-50/70 !p-4">
                                        <p className="text-xs font-semibold text-gray-500">
                                            All interview records
                                        </p>
                                        <p className="mt-2 text-2xl font-extrabold text-gray-900">
                                            {formatNumber(analytics?.totalInterviews)}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 !p-4">
                                        <p className="text-xs font-semibold text-gray-500">
                                            Scheduled
                                        </p>
                                        <p className="mt-2 text-2xl font-extrabold text-gray-900">
                                            {formatNumber(analytics?.scheduledInterviews)}
                                        </p>
                                    </div>
                                </div>
                            </Panel>
                        </section>

                        {/* Company and placement breakdown */}
                        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                            <Panel
                                title="Company verification"
                                description="Current verification status of company profiles"
                                icon={Building2}
                            >
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr] sm:items-center">
                                    <div className="h-[240px] min-w-0">
                                        {companyData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={companyData}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={55}
                                                        outerRadius={88}
                                                        paddingAngle={4}
                                                        stroke="white"
                                                        strokeWidth={3}
                                                    >
                                                        {companyData.map((item) => (
                                                            <Cell key={item.name} fill={item.color} />
                                                        ))}
                                                    </Pie>

                                                    <Tooltip content={<ChartTooltip />} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <EmptyChart message="Company verification data will appear here." />
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {[
                                            {
                                                label: "Verified",
                                                value: analytics?.verifiedCompanies,
                                                icon: CheckCircle2,
                                                color: "text-emerald-600",
                                                bg: "bg-emerald-50",
                                            },
                                            {
                                                label: "Pending",
                                                value: analytics?.pendingCompanies,
                                                icon: Clock3,
                                                color: "text-amber-600",
                                                bg: "bg-amber-50",
                                            },
                                            {
                                                label: "Rejected",
                                                value: analytics?.rejectedCompanies,
                                                icon: XCircle,
                                                color: "text-rose-600",
                                                bg: "bg-rose-50",
                                            },
                                        ].map((item) => {
                                            const Icon = item.icon;

                                            return (
                                                <div
                                                    key={item.label}
                                                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 !p-3"
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`rounded-lg p-2 ${item.bg} ${item.color}`}>
                                                            <Icon size={17} />
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-600">
                                                            {item.label}
                                                        </span>
                                                    </div>

                                                    <strong className="text-lg text-gray-900">
                                                        {formatNumber(item.value)}
                                                    </strong>
                                                </div>
                                            );
                                        })}

                                        <p className="!pt-1 text-xs text-gray-400">
                                            {formatNumber(analytics?.totalCompanies)} total company profiles
                                        </p>
                                    </div>
                                </div>
                            </Panel>

                            <Panel
                                title="Placement outcomes"
                                description="Current application status distribution"
                                icon={GraduationCap}
                            >
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr] sm:items-center">
                                    <div className="h-[240px] min-w-0">
                                        {applicationData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={applicationData}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={55}
                                                        outerRadius={88}
                                                        paddingAngle={3}
                                                        stroke="white"
                                                        strokeWidth={3}
                                                    >
                                                        {applicationData.map((item) => (
                                                            <Cell key={item.name} fill={item.color} />
                                                        ))}
                                                    </Pie>

                                                    <Tooltip content={<ChartTooltip />} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <EmptyChart message="Placement outcomes will appear when students apply." />
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {applicationData.map((item) => (
                                            <div
                                                key={item.name}
                                                className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 !p-3"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <span
                                                        className="h-3 w-3 rounded-full"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                    <span className="text-sm font-semibold text-gray-600">
                                                        {item.name}
                                                    </span>
                                                </div>

                                                <strong className="text-lg text-gray-900">
                                                    {formatNumber(item.value)}
                                                </strong>
                                            </div>
                                        ))}

                                        <div className="rounded-xl bg-purple-50 !p-3">
                                            <p className="text-xs font-semibold text-purple-700">
                                                Selection rate
                                            </p>
                                            <p className="mt-1 text-2xl font-extrabold text-purple-900">
                                                {selectionRate}%
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-purple-600">
                                                Selected applications divided by all applications.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </section>

                        {/* Footer */}
                        <footer className="flex flex-col items-center justify-between gap-2 border-t border-purple-100 !py-5 text-center text-xs text-gray-400 sm:flex-row sm:text-left">
                            <p>
                                CareerTrack Admin Console · Analytics & Reports
                            </p>
                            <p>
                                {lastUpdated
                                    ? `Last refreshed ${lastUpdated.toLocaleString("en-IN")}`
                                    : "Waiting for analytics data"}
                            </p>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminAnalytics;

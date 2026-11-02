
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    BriefcaseBusiness,
    Building2,
    MapPin,
    Search,
    RefreshCw,
    Eye,
    ShieldCheck,
    ShieldAlert,
    Clock3,
    IndianRupee,
    Users,
    X,
    CheckCircle2,
    AlertCircle,
    Code2,
    CalendarDays,
    ChevronDown,
} from "lucide-react";



import {
    getAdminJobs,
    updateAdminJobStatus,
} from "../../services/adminService";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminNavbar from "../../components/Admin/AdminNavbar";

const JOB_TYPES = [
    "ALL",
    "FULL_TIME",
    "INTERNSHIP",
    "PART_TIME",
    "CONTRACT",
    "REMOTE",
];

const STATUS_OPTIONS = [
    { label: "All jobs", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
];

const formatLabel = (value) => {
    if (!value) return "Not specified";

    return String(value)
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatSalary = (min, max) => {
    if (min == null && max == null) return "Not disclosed";

    const formatAmount = (amount) =>
        new Intl.NumberFormat("en-IN", {
            maximumFractionDigits: 0,
        }).format(amount);

    if (min != null && max != null) {
        return `₹${formatAmount(min)} – ₹${formatAmount(max)}`;
    }

    if (min != null) return `From ₹${formatAmount(min)}`;

    return `Up to ₹${formatAmount(max)}`;
};

const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Date unavailable";

    return parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const getSkills = (skills) => {
    if (!skills) return [];

    if (Array.isArray(skills)) return skills;

    return String(skills)
        .split(/[,;|]/)
        .map((skill) => skill.trim())
        .filter(Boolean);
};

const JobModeration = () => {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [jobType, setJobType] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [selectedJob, setSelectedJob] = useState(null);
    const [pendingJob, setPendingJob] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [actionError, setActionError] = useState("");

    const loadJobs = useCallback(async (isRefresh = false) => {
        setError("");

        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const response = await getAdminJobs({
                search,
                status,
                jobType,
            });

            const data = Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                    ? response.data
                    : [];

            setJobs(data);
        } catch (err) {
            setError(
                err?.message ||
                "Unable to load jobs. Please check your connection and try again."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [search, status, jobType]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadJobs();
        }, 300);

        return () => clearTimeout(timer);
    }, [loadJobs]);

    const stats = useMemo(() => {
        const active = jobs.filter((job) => job.active).length;
        const inactive = jobs.filter((job) => !job.active).length;

        return {
            total: jobs.length,
            active,
            inactive,
        };
    }, [jobs]);

    const handleStatusChange = async () => {
        if (!pendingJob) return;

        const job = pendingJob;
        const nextActive = !job.active;

        setUpdatingId(job.id);
        setActionError("");

        try {
            const updated = await updateAdminJobStatus(job.id, nextActive);

            const updatedJob =
                updated?.data && !Array.isArray(updated.data)
                    ? updated.data
                    : updated;

            setJobs((previous) =>
                previous.map((item) =>
                    item.id === job.id
                        ? {
                            ...item,
                            ...(updatedJob && typeof updatedJob === "object"
                                ? updatedJob
                                : {}),
                            active: nextActive,
                        }
                        : item
                )
            );

            setSelectedJob((previous) =>
                previous?.id === job.id
                    ? { ...previous, active: nextActive }
                    : previous
            );

            setPendingJob(null);

            // Refresh the list so the current filters remain accurate.
            await loadJobs(true);
        } catch (err) {
            setActionError(
                err?.message ||
                "Could not update this job. Please try again."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#f7f6fc] text-slate-800">
            {/* Fixed sidebar */}
            <aside className="z-30 hidden h-screen shrink-0 lg:block">
                <AdminSidebar />
            </aside>

            {/* Right-side workspace */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <header className="sticky top-0 z-40 shrink-0 border-b border-violet-100 bg-white/95 backdrop-blur-xl">
                    <AdminNavbar />
                </header>

                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-[1600px] space-y-7 !p-4 sm:p-6 xl:p-8">

                        {/* Page heading */}
                        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-950 via-violet-800 to-fuchsia-700 !p-6 text-white shadow-xl shadow-violet-200/60 sm:p-8">
                            <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
                            <div className="pointer-events-none absolute -bottom-24 right-1/4 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-3xl" />

                            <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                                <div>
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-1.5 text-xs font-semibold tracking-wide text-violet-100">
                                        <ShieldCheck size={15} />
                                        ADMIN CONTROL CENTER
                                    </div>

                                    <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                                        Job Moderation
                                    </h1>

                                    <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100 sm:text-base">
                                        Review job listings, monitor employer activity,
                                        and keep the CareerTrack marketplace trustworthy.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => loadJobs(true)}
                                    disabled={refreshing || loading}
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 !px-4 !py-3 text-sm font-bold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <RefreshCw
                                        size={17}
                                        className={refreshing ? "animate-spin" : ""}
                                    />
                                    Refresh jobs
                                </button>
                            </div>
                        </section>

                        {/* Statistics */}
                        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <StatCard
                                title="Matching listings"
                                value={loading ? "—" : stats.total}
                                detail="Based on current filters"
                                icon={BriefcaseBusiness}
                                iconStyle="bg-violet-100 text-violet-700"
                            />

                            <StatCard
                                title="Active listings"
                                value={loading ? "—" : stats.active}
                                detail="Visible to students"
                                icon={CheckCircle2}
                                iconStyle="bg-emerald-100 text-emerald-700"
                            />

                            <StatCard
                                title="Inactive listings"
                                value={loading ? "—" : stats.inactive}
                                detail="Hidden from student listings"
                                icon={ShieldAlert}
                                iconStyle="bg-amber-100 text-amber-700"
                            />
                        </section>

                        {/* Search and filters */}
                        <section className="rounded-2xl border border-violet-100 bg-white !p-4 shadow-sm sm:p-5">
                            <div className="mb-4 flex flex-col gap-1">
                                <h2 className="text-base font-extrabold text-slate-900">
                                    Listing directory
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Search and filter all active and inactive jobs.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_190px_190px]">
                                <div className="relative">
                                    <Search
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
                                    />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search title, company, employer, skills..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 !py-3 !pl-11 !pr-4 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                                    />
                                </div>

                                <FilterSelect
                                    value={status}
                                    onChange={setStatus}
                                    options={STATUS_OPTIONS}
                                    label="Status"
                                />

                                <FilterSelect
                                    value={jobType}
                                    onChange={setJobType}
                                    options={JOB_TYPES.map((type) => ({
                                        value: type,
                                        label: type === "ALL" ? "All job types" : formatLabel(type),
                                    }))}
                                    label="Job type"
                                />
                            </div>
                        </section>

                        {/* Results */}
                        <section>
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-900">
                                        Job listings
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {loading
                                            ? "Loading listings..."
                                            : `${jobs.length} listing${jobs.length === 1 ? "" : "s"} found`}
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 !p-4 text-sm text-red-700">
                                    <AlertCircle size={19} className="mt-0.5 shrink-0" />
                                    <div className="flex-1">
                                        <p className="font-bold">Could not load job listings</p>
                                        <p className="mt-1">{error}</p>
                                        <button
                                            type="button"
                                            onClick={() => loadJobs(true)}
                                            className="mt-2 font-bold underline"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                </div>
                            )}

                            {loading ? (
                                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div
                                            key={item}
                                            className="h-64 animate-pulse rounded-2xl border border-violet-100 bg-white"
                                        />
                                    ))}
                                </div>
                            ) : !error && jobs.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-violet-200 bg-white !px-6 !py-16 text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                                        <BriefcaseBusiness size={28} />
                                    </div>
                                    <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                                        No matching jobs
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                        Try another keyword or change your filters to see more listings.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setStatus("ALL");
                                            setJobType("ALL");
                                        }}
                                        className="mt-5 rounded-xl bg-violet-600 !px-4 !py-2.5 text-sm font-bold text-white transition hover:bg-violet-700"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                                    {jobs.map((job) => (
                                        <JobCard
                                            key={job.id}
                                            job={job}
                                            onView={() => {
                                                setActionError("");
                                                setSelectedJob(job);
                                            }}
                                            onToggle={() => {
                                                setActionError("");
                                                setPendingJob(job);
                                            }}
                                            updating={updatingId === job.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>

            {/* Job details modal */}
            {selectedJob && (
                <JobDetailsModal
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                    onToggle={() => {
                        setActionError("");
                        setPendingJob(selectedJob);
                    }}
                    updating={updatingId === selectedJob.id}
                />
            )}

            {/* Confirm status change */}
            {pendingJob && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/50 !p-4 backdrop-blur-sm">
                    <div className="my-auto w-full max-w-md rounded-3xl bg-white !p-6 shadow-2xl">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                            pendingJob.active
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                        }`}>
                            {pendingJob.active
                                ? <ShieldAlert size={27} />
                                : <ShieldCheck size={27} />}
                        </div>

                        <h3 className="mt-5 text-xl font-black text-slate-900">
                            {pendingJob.active ? "Deactivate this listing?" : "Reactivate this listing?"}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            <span className="font-bold">{pendingJob.title}</span>
                            {pendingJob.active
                                ? " will no longer appear in the active student job listings. The job and its applications will not be deleted."
                                : " will become visible in the active student job listings again."}
                        </p>

                        {actionError && (
                            <p className="mt-3 rounded-xl bg-red-50 !p-3 text-sm text-red-700">
                                {actionError}
                            </p>
                        )}

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setPendingJob(null);
                                    setActionError("");
                                }}
                                disabled={updatingId === pendingJob.id}
                                className="rounded-xl border border-slate-200 !px-4 !py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleStatusChange}
                                disabled={updatingId === pendingJob.id}
                                className={`rounded-xl !px-4 !py-3 text-sm font-bold text-white disabled:opacity-60 ${
                                    pendingJob.active
                                        ? "bg-amber-600 hover:bg-amber-700"
                                        : "bg-emerald-600 hover:bg-emerald-700"
                                }`}
                            >
                                {updatingId === pendingJob.id
                                    ? "Updating..."
                                    : pendingJob.active
                                        ? "Deactivate job"
                                        : "Reactivate job"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ title, value, detail, icon: Icon, iconStyle }) => (
    <div className="group rounded-2xl border border-violet-100 bg-white !p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100/70">
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-sm font-semibold text-slate-500">{title}</p>
                <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                    {value}
                </p>
                <p className="mt-2 text-xs text-slate-500">{detail}</p>
            </div>

            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:scale-110 ${iconStyle}`}>
                <Icon size={23} />
            </div>
        </div>
    </div>
);

const FilterSelect = ({ value, onChange, options, label }) => (
    <div className="relative">
        <label className="sr-only">{label}</label>
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 !px-4 !py-3 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
    </div>
);

const JobCard = ({ job, onView, onToggle, updating }) => {
    const skills = getSkills(job.skills);
    const active = Boolean(job.active);

    return (
        <article className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-white !p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/60 sm:p-6">
            <div className={`absolute inset-x-0 top-0 h-1 ${
                active
                    ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                    : "bg-gradient-to-r from-amber-400 to-orange-500"
            }`} />

            <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700">
                    <Building2 size={23} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full !px-2.5 !py-1 text-[11px] font-extrabold ${
                            active
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                        }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                                active ? "bg-emerald-500" : "bg-amber-500"
                            }`} />
                            {active ? "ACTIVE" : "INACTIVE"}
                        </span>

                        <span className="rounded-full bg-violet-50 !px-2.5 !py-1 text-[11px] font-bold text-violet-700">
                            {formatLabel(job.jobType)}
                        </span>
                    </div>

                    <h3 className="mt-3 break-words text-lg font-black leading-snug text-slate-900">
                        {job.title || "Untitled position"}
                    </h3>

                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                        <Building2 size={14} />
                        {job.company || "Company not specified"}
                    </p>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 !p-3 sm:grid-cols-2">
                <InfoItem icon={MapPin} label="Location" value={job.location || "Not specified"} />
                <InfoItem icon={Users} label="Experience" value={formatLabel(job.experienceLevel)} />
                <InfoItem icon={IndianRupee} label="Salary range" value={formatSalary(job.salaryMin, job.salaryMax)} />
                <InfoItem icon={CalendarDays} label="Posted on" value={formatDate(job.createAt)} />
            </div>

            {skills.length > 0 && (
                <div className="mt-4">
                    <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                        <Code2 size={14} />
                        Required skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {skills.slice(0, 4).map((skill, index) => (
                            <span
                                key={`${skill}-${index}`}
                                className="rounded-lg border border-violet-100 bg-white !px-2.5 !py-1.5 text-xs font-semibold text-violet-700"
                            >
                                {skill}
                            </span>
                        ))}

                        {skills.length > 4 && (
                            <span className="rounded-lg bg-slate-100 !px-2.5 !py-1.5 text-xs font-bold text-slate-500">
                                +{skills.length - 4} more
                            </span>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-5 border-t border-slate-100 !pt-4">
                <p className="truncate text-xs text-slate-500">
                    Posted by{" "}
                    <span className="font-bold text-slate-700">
                        {job.employerName || job.employerEmail || "Employer unavailable"}
                    </span>
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={onView}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-200 !px-3 !py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-50"
                    >
                        <Eye size={16} />
                        View details
                    </button>

                    <button
                        type="button"
                        onClick={onToggle}
                        disabled={updating}
                        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl !px-3 !py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            active
                                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                    >
                        {active ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                        {updating ? "Updating..." : active ? "Deactivate" : "Reactivate"}
                    </button>
                </div>
            </div>
        </article>
    );
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex min-w-0 items-start gap-2">
        <Icon size={16} className="mt-0.5 shrink-0 text-violet-500" />
        <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>
            <p className="mt-0.5 break-words text-xs font-bold text-slate-700">
                {value}
            </p>
        </div>
    </div>
);

const JobDetailsModal = ({ job, onClose, onToggle, updating }) => {
    const skills = getSkills(job.skills);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 !p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
                <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-violet-100 bg-white/95 !p-5 backdrop-blur sm:p-6">
                    <div className="min-w-0">
                        <span className="text-xs font-extrabold uppercase tracking-[0.15em] text-violet-600">
                            Job listing #{job.id}
                        </span>
                        <h2 className="mt-2 break-words text-xl font-black text-slate-900 sm:text-2xl">
                            {job.title || "Untitled position"}
                        </h2>
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                            {job.company || "Company not specified"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close job details"
                        className="rounded-xl !p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X size={21} />
                    </button>
                </div>

                <div className="space-y-6 !p-5 sm:p-6">
                    <div className="flex flex-wrap gap-2">
                        <span className={`rounded-full !px-3 !py-1.5 text-xs font-extrabold ${
                            job.active
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                        }`}>
                            {job.active ? "Active listing" : "Inactive listing"}
                        </span>
                        <span className="rounded-full bg-violet-50 !px-3 !py-1.5 text-xs font-bold text-violet-700">
                            {formatLabel(job.jobType)}
                        </span>
                        <span className="rounded-full bg-slate-100 !px-3 !py-1.5 text-xs font-bold text-slate-600">
                            {formatLabel(job.experienceLevel)}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InfoItem icon={MapPin} label="Location" value={job.location || "Not specified"} />
                        <InfoItem icon={IndianRupee} label="Salary" value={formatSalary(job.salaryMin, job.salaryMax)} />
                        <InfoItem icon={CalendarDays} label="Created" value={formatDate(job.createAt)} />
                        <InfoItem icon={Clock3} label="Last updated" value={formatDate(job.updateAt)} />
                    </div>

                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900">
                            Job description
                        </h3>
                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                            {job.description || "No description provided."}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900">
                            Required skills
                        </h3>
                        {skills.length ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span
                                        key={`${skill}-${index}`}
                                        className="rounded-lg border border-violet-100 bg-violet-50 !px-3 !py-2 text-xs font-bold text-violet-700"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-slate-500">
                                No skills specified.
                            </p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50 !p-4">
                        <h3 className="text-sm font-extrabold text-slate-900">
                            Employer information
                        </h3>
                        <p className="mt-3 text-sm text-slate-600">
                            Employer:{" "}
                            <span className="font-bold text-slate-800">
                                {job.employerName || "Not available"}
                            </span>
                        </p>
                        <p className="mt-2 break-all text-sm text-slate-600">
                            Email:{" "}
                            <span className="font-semibold text-slate-800">
                                {job.employerEmail || "Not available"}
                            </span>
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                            Employer ID:{" "}
                            <span className="font-semibold text-slate-800">
                                {job.employerId ?? "Not available"}
                            </span>
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onToggle}
                        disabled={updating}
                        className={`w-full rounded-xl !px-4 !py-3 text-sm font-extrabold text-white transition disabled:opacity-60 ${
                            job.active
                                ? "bg-amber-600 hover:bg-amber-700"
                                : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                    >
                        {job.active ? "Deactivate this listing" : "Reactivate this listing"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobModeration;

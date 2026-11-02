
import { useCallback, useEffect, useState } from "react";
import {
    Building2,
    Search,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Clock3,
    Globe,
    MapPin,
    CalendarDays,
    ShieldCheck,
    ExternalLink,
    X,
    LoaderCircle,
    Factory,
    ArrowUpRight,
    Sparkles,
    FileCheck2,
    ShieldAlert,
} from "lucide-react";


import {
    getAdminCompanies,
    updateCompanyVerification,
} from "../../services/adminService";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminNavbar from "../../components/Admin/AdminNavbar";

const STATUS_OPTIONS = [
    { label: "All companies", value: "ALL" },
    { label: "Pending review", value: "PENDING" },
    { label: "Verified", value: "VERIFIED" },
    { label: "Rejected", value: "REJECTED" },
];

const STATUS_STYLES = {
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    VERIFIED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
};

const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
        ? "Date unavailable"
        : parsedDate.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          });
};

const CompanyVerification = () => {
    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionId, setActionId] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [rejectionNote, setRejectionNote] = useState("");

    const loadCompanies = useCallback(async (showLoader = true) => {
        if (showLoader) setLoading(true);
        setError("");

        try {
            const data = await getAdminCompanies({ search, status });
            setCompanies(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Unable to load companies.");
        } finally {
            setLoading(false);
        }
    }, [search, status]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadCompanies();
        }, 300);

        return () => clearTimeout(timer);
    }, [loadCompanies]);

    const updateStatus = async (company, nextStatus, note = null) => {
        setActionId(company.id);
        setError("");

        try {
            await updateCompanyVerification(company.id, nextStatus, note);

            setSelectedCompany(null);
            setRejectionNote("");
            await loadCompanies(false);
        } catch (err) {
            setError(err.message || "Unable to update verification.");
        } finally {
            setActionId(null);
        }
    };

    const counts = {
        total: companies.length,
        pending: companies.filter(
            (company) => (company.verificationStatus || "PENDING") === "PENDING"
        ).length,
        verified: companies.filter(
            (company) => company.verificationStatus === "VERIFIED"
        ).length,
        rejected: companies.filter(
            (company) => company.verificationStatus === "REJECTED"
        ).length,
    };

    const summaryCards = [
        {
            label: "Total results",
            value: counts.total,
            icon: Building2,
            iconStyle: "bg-violet-100 text-violet-700",
            accent: "from-violet-500 to-purple-500",
        },
        {
            label: "Awaiting review",
            value: counts.pending,
            icon: Clock3,
            iconStyle: "bg-amber-100 text-amber-700",
            accent: "from-amber-400 to-orange-400",
        },
        {
            label: "Verified",
            value: counts.verified,
            icon: CheckCircle2,
            iconStyle: "bg-emerald-100 text-emerald-700",
            accent: "from-emerald-400 to-teal-500",
        },
        {
            label: "Rejected",
            value: counts.rejected,
            icon: ShieldAlert,
            iconStyle: "bg-rose-100 text-rose-700",
            accent: "from-rose-400 to-pink-500",
        },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#f7f6fc] text-slate-800">
            {/* Fixed admin sidebar */}
            <aside className="z-30 hidden h-screen shrink-0 lg:block">
                <AdminSidebar />
            </aside>

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

            {/* Sticky navbar — does not overlap the sidebar */}
            <header className="sticky top-0 z-40 shrink-0 border-b border-violet-100 bg-white/95 backdrop-blur-xl">
                <AdminNavbar />
            </header>

            {/* Main content scrolls independently of the sidebar */}
            <main className="min-w-0 flex-1 overflow-y-auto">
                <div className="mx-auto max-w-[1600px] space-y-6 !p-4 sm:p-6 xl:p-8">

                    {/* Top breadcrumb / page identity */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-slate-400">Admin Console</span>
                            <span className="text-slate-300">/</span>
                            <span className="font-semibold text-violet-700">
                                Companies
                            </span>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white !px-3 !py-2 text-xs font-semibold text-slate-600 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                            Verification workspace
                        </div>
                    </div>

                    {/* Hero */}
                    <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#4338ca] !p-6 text-white shadow-xl shadow-violet-200/60 sm:p-8 xl:p-9">
                        <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-72 w-72 rounded-full border-[42px] border-white/[0.07]" />
                        <div className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl" />
                        <div className="pointer-events-none absolute right-16 top-12 -z-10 h-20 w-20 rounded-full bg-indigo-300/20 blur-xl" />

                        <div className="relative flex flex-col justify-between gap-7 xl:flex-row xl:items-end">
                            <div className="max-w-2xl">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-1.5 text-[11px] font-bold tracking-[0.16em] text-violet-100">
                                    <Sparkles size={14} />
                                    CAREERTRACK · ADMIN
                                </div>

                                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                    Company Verification
                                </h1>

                                <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100 sm:text-base">
                                    Make trusted hiring possible. Review company
                                    profiles, verify employer information, and
                                    manage approval decisions from one workspace.
                                </p>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 !px-3.5 !py-2.5 text-sm">
                                        <ShieldCheck size={17} />
                                        <span>Trust & safety</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 !px-3.5 !py-2.5 text-sm">
                                        <FileCheck2 size={17} />
                                        <span>Employer review</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => loadCompanies()}
                                disabled={loading}
                                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/25 bg-white !px-5 !py-3 text-sm font-bold text-violet-800 shadow-lg shadow-violet-950/10 transition hover:-translate-y-0.5 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-70 xl:self-auto"
                            >
                                <RefreshCw
                                    size={16}
                                    className={loading ? "animate-spin" : ""}
                                />
                                Refresh submissions
                            </button>
                        </div>
                    </section>

                    {/* Summary cards */}
                    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
                        {summaryCards.map((item) => {
                            const Icon = item.icon;

                            return (
                                <article
                                    key={item.label}
                                    className="group relative overflow-hidden rounded-2xl border border-violet-100/80 bg-white !p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100/70 sm:p-5"
                                >
                                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent}`} />

                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs font-medium text-slate-500 sm:text-sm">
                                            {item.label}
                                        </p>
                                        <span className={`rounded-xl !p-2.5 ${item.iconStyle}`}>
                                            <Icon size={19} />
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-end justify-between">
                                        <p className="text-3xl font-extrabold tracking-tight text-slate-900">
                                            {item.value}
                                        </p>
                                        <ArrowUpRight
                                            size={18}
                                            className="mb-1 text-slate-300 transition group-hover:text-violet-500"
                                        />
                                    </div>
                                </article>
                            );
                        })}
                    </section>

                    {/* Search and filters */}
                    <section className="rounded-2xl border border-violet-100 bg-white !p-4 shadow-sm sm:p-5">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                                <Search size={19} />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Find a company
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Search submissions or narrow results by status.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 lg:flex-row">
                            <div className="relative flex-1">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Company, website, industry or employer..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 !py-3 !pl-11 !pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        aria-label="Clear search"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg !p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                                    >
                                        <X size={15} />
                                    </button>
                                )}
                            </div>

                            <select
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="min-w-44 rounded-xl border border-slate-200 bg-white !px-4 !py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </section>

                    {/* Errors */}
                    {error && (
                        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 !p-4 text-sm text-rose-700">
                            <XCircle size={19} className="mt-0.5 shrink-0" />
                            <p className="flex-1">{error}</p>
                            <button
                                type="button"
                                onClick={() => setError("")}
                                aria-label="Dismiss error"
                                className="rounded-lg !p-1 hover:bg-rose-100"
                            >
                                <X size={17} />
                            </button>
                        </div>
                    )}

                    {/* Company submissions */}
                    <section className="!pb-6">
                        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                                        Company submissions
                                    </h2>
                                    <span className="rounded-lg bg-violet-100 !px-2 !py-1 text-s font-bold text-violet-700">
                                        {companies.length}
                                    </span>
                                </div>
                                <p className="mt-1.5 text-sm text-slate-500">
                                    Inspect employer details before making a decision.
                                </p>
                            </div>

                            <div className="text-xs font-medium text-slate-400">
                                Sorted by latest submission
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-violet-100 bg-white">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
                                    <LoaderCircle
                                        size={29}
                                        className="animate-spin text-violet-600"
                                    />
                                </div>
                                <p className="mt-4 font-semibold text-slate-700">
                                    Loading company submissions
                                </p>
                                <p className="mt-1 text-sm text-slate-400">
                                    Please wait a moment...
                                </p>
                            </div>
                        ) : companies.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-violet-200 bg-white !px-5 !py-16 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
                                    <Building2 size={30} className="text-violet-400" />
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    No companies found
                                </h3>
                                <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
                                    No submissions match your current search and
                                    verification filter. Try changing your filters.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setStatus("ALL");
                                    }}
                                    className="mt-5 rounded-xl bg-violet-600 !px-4 !py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4 xl:grid-cols-2 2xl:gap-5">
                                {companies.map((company) => {
                                    const companyStatus =
                                        company.verificationStatus || "PENDING";
                                    const isBusy = actionId === company.id;

                                    return (
                                        <article
                                            key={company.id}
                                            className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/60"
                                        >
                                            <div className="h-1 bg-gradient-to-r from-violet-500 via-fuchsia-400 to-indigo-500" />

                                            <div className="!p-5 sm:p-6">
                                                {/* Company identity */}
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-100 text-violet-700 transition group-hover:from-violet-100 group-hover:to-fuchsia-100">
                                                        <Building2 size={27} />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="break-words text-lg font-extrabold text-slate-900">
                                                                {company.name || "Unnamed company"}
                                                            </h3>
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 rounded-full border !px-2.5 !py-1 text-[10px] font-bold uppercase tracking-wide ${
                                                                    STATUS_STYLES[companyStatus] ||
                                                                    STATUS_STYLES.PENDING
                                                                }`}
                                                            >
                                                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                                {companyStatus}
                                                            </span>
                                                        </div>

                                                        <p className="mt-1 break-words text-sm text-slate-500">
                                                            {company.tagline ||
                                                                company.industry ||
                                                                "Company profile"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Company information */}
                                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                                    <div className="flex min-w-0 items-start gap-2.5 rounded-xl bg-slate-50 !p-3">
                                                        <Globe size={16} className="mt-0.5 shrink-0 text-violet-600" />
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                                Website
                                                            </p>
                                                            {company.website ? (
                                                                <a
                                                                    href={
                                                                        /^https?:\/\//i.test(company.website)
                                                                            ? company.website
                                                                            : `https://${company.website}`
                                                                    }
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="mt-1 inline-flex max-w-full items-center gap-1 break-all text-sm font-medium text-slate-700 hover:text-violet-700 hover:underline"
                                                                >
                                                                    {company.website}
                                                                    <ExternalLink size={12} className="shrink-0" />
                                                                </a>
                                                            ) : (
                                                                <p className="mt-1 text-sm text-slate-500">
                                                                    Not provided
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex min-w-0 items-start gap-2.5 rounded-xl bg-slate-50 !p-3">
                                                        <Factory size={16} className="mt-0.5 shrink-0 text-violet-600" />
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                                Industry
                                                            </p>
                                                            <p className="mt-1 break-words text-sm font-medium text-slate-700">
                                                                {company.industry || "Not specified"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex min-w-0 items-start gap-2.5 rounded-xl bg-slate-50 !p-3">
                                                        <MapPin size={16} className="mt-0.5 shrink-0 text-violet-600" />
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                                Headquarters
                                                            </p>
                                                            <p className="mt-1 break-words text-sm font-medium text-slate-700">
                                                                {company.headquarters || "Not specified"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex min-w-0 items-start gap-2.5 rounded-xl bg-slate-50 !p-3">
                                                        <CalendarDays size={16} className="mt-0.5 shrink-0 text-violet-600" />
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                                Submitted
                                                            </p>
                                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                                {formatDate(company.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Employer details */}
                                                <div className="mt-4 flex items-start gap-3 rounded-xl border border-violet-100 bg-gradient-to-r from-violet-50/80 to-white !p-4">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
                                                        <ShieldCheck size={19} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-violet-600">
                                                            Submitted by
                                                        </p>
                                                        <p className="mt-1 break-words text-sm font-bold text-slate-800">
                                                            {company.createdByName || "Unknown employer"}
                                                        </p>
                                                        <p className="mt-0.5 break-all text-sm text-slate-500">
                                                            {company.createdByEmail || "Email unavailable"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {company.about && (
                                                    <div className="mt-4">
                                                        <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                            About company
                                                        </p>
                                                        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                                                            {company.about}
                                                        </p>
                                                    </div>
                                                )}

                                                {company.verificationNote && (
                                                    <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 !p-3.5">
                                                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700">
                                                            <ShieldAlert size={15} />
                                                            Rejection reason
                                                        </p>
                                                        <p className="mt-1.5 text-sm leading-5 text-rose-700">
                                                            {company.verificationNote}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                {companyStatus !== "VERIFIED" ? (
                                                    <div className="mt-5 flex flex-col gap-2 border-t border-slate-100!pt-4 sm:flex-row">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateStatus(company, "VERIFIED")
                                                            }
                                                            disabled={isBusy || actionId !== null}
                                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 !px-4 !py-3 text-sm font-bold text-white shadow-sm shadow-emerald-100 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {isBusy ? (
                                                                <LoaderCircle size={16} className="animate-spin" />
                                                            ) : (
                                                                <CheckCircle2 size={16} />
                                                            )}
                                                            Approve company
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedCompany(company);
                                                                setRejectionNote(
                                                                    company.verificationNote || ""
                                                                );
                                                            }}
                                                            disabled={isBusy || actionId !== null}
                                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white !px-4 !py-3 text-sm font-bold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            <XCircle size={16} />
                                                            Reject submission
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/80 !p-3.5">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600">
                                                            <CheckCircle2 size={19} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-emerald-800">
                                                                Company verified
                                                            </p>
                                                            <p className="mt-0.5 text-xs text-emerald-700">
                                                                This company has passed admin verification.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Rejection dialog */}
            {selectedCompany && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 !p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && actionId === null) {
                            setSelectedCompany(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reject-dialog-title"
                        className="w-full max-w-md overflow-hidden rounded-3xl border border-white/50 bg-white shadow-2xl shadow-slate-950/20"
                    >
                        <div className="bg-gradient-to-br from-rose-50 via-white to-violet-50 !p-6">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                                        <ShieldAlert size={22} />
                                    </div>
                                    <div>
                                        <h2
                                            id="reject-dialog-title"
                                            className="text-lg font-extrabold text-slate-900"
                                        >
                                            Reject company
                                        </h2>
                                        <p className="mt-1 break-words text-sm text-slate-500">
                                            {selectedCompany.name}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (actionId === null) setSelectedCompany(null);
                                    }}
                                    disabled={actionId !== null}
                                    aria-label="Close dialog"
                                    className="rounded-xl !p-2 text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-50"
                                >
                                    <X size={19} />
                                </button>
                            </div>
                        </div>

                        <div className="!p-6 pt-2">
                            <label
                                htmlFor="rejection-note"
                                className="block text-sm font-bold text-slate-700"
                            >
                                Reason for rejection
                                <span className="ml-1 text-rose-500">*</span>
                            </label>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Give the employer a clear explanation of what
                                needs to be corrected.
                            </p>

                            <textarea
                                id="rejection-note"
                                value={rejectionNote}
                                onChange={(event) =>
                                    setRejectionNote(event.target.value)
                                }
                                rows={4}
                                maxLength={2000}
                                placeholder="For example: Company website or business details could not be verified..."
                                className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 !p-3.5 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                            />

                            <p className="mt-1 text-right text-xs text-slate-400">
                                {rejectionNote.length}/2000
                            </p>

                            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCompany(null);
                                        setRejectionNote("");
                                    }}
                                    disabled={actionId !== null}
                                    className="rounded-xl border border-slate-200 !px-4 !py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        !rejectionNote.trim() ||
                                        actionId === selectedCompany.id
                                    }
                                    onClick={() =>
                                        updateStatus(
                                            selectedCompany,
                                            "REJECTED",
                                            rejectionNote.trim()
                                        )
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 !px-4 !py-3 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {actionId === selectedCompany.id && (
                                        <LoaderCircle size={16} className="animate-spin" />
                                    )}
                                    Confirm rejection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default CompanyVerification;

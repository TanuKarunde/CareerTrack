import { useEffect, useMemo, useState } from "react";
import {
    Users,
    UserCheck,
    CalendarClock,
    UserRoundCheck,
    FileText,
    Search,
    Sparkles,
    TrendingUp,
    RefreshCw,
    BriefcaseBusiness,
    ArrowUpRight,
    CircleCheck,
    XCircle,
} from "lucide-react";

import ApplicantList from "./ApplicantList";
import ApplicantFilter from "./ApplicantFilters";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { getEmployerApplicants } from "../../../services/employerService";
import EmployerNavbar from "../ENavbar/EmployerNavbar";

const Applicants = () => {
    const [applicants, setApplicants] = useState([]);
    const [search, setSearch] = useState("");
    const [jobFilter, setJobFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadApplicants = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getEmployerApplicants();

                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.applicants)
                      ? data.applicants
                      : Array.isArray(data?.data)
                        ? data.data
                        : [];

                if (!cancelled) setApplicants(list);
            } catch (err) {
                console.error("Unable to load applicants:", err);

                if (!cancelled) {
                    setError(err.message || "Unable to load applicants.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadApplicants();

        return () => {
            cancelled = true;
        };
    }, []);

    const jobs = useMemo(
        () => [
            ...new Set(
                applicants
                    .map((applicant) => applicant.jobTitle)
                    .filter(Boolean)
            ),
        ],
        [applicants]
    );

    const counts = useMemo(() => {
        const count = (status) =>
            applicants.filter(
                (applicant) =>
                    (applicant.status || "APPLIED").toUpperCase() === status
            ).length;

        return {
            all: applicants.length,
            applied: count("APPLIED"),
            shortlisted: count("SHORTLISTED"),
            interview: count("INTERVIEW"),
            selected: count("SELECTED"),
            rejected: count("REJECTED"),
        };
    }, [applicants]);

    const filteredApplicants = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        return applicants.filter((applicant) => {
            const name = (
                applicant.studentName ||
                applicant.name ||
                ""
            ).toLowerCase();

            const email = (applicant.email || "").toLowerCase();
            const title = (applicant.jobTitle || "").toLowerCase();

            const skills = Array.isArray(applicant.skills)
                ? applicant.skills.join(" ").toLowerCase()
                : String(applicant.skills || "").toLowerCase();

            const currentStatus = (
                applicant.status || "APPLIED"
            ).toUpperCase();

            return (
                (!searchText ||
                    name.includes(searchText) ||
                    email.includes(searchText) ||
                    title.includes(searchText) ||
                    skills.includes(searchText)) &&
                (jobFilter === "ALL" || applicant.jobTitle === jobFilter) &&
                (statusFilter === "ALL" || currentStatus === statusFilter)
            );
        });
    }, [applicants, search, jobFilter, statusFilter]);

    const statCards = [
        {
            id: "ALL",
            label: "Total Applicants",
            value: counts.all,
            caption: "Across your job listings",
            icon: Users,
            iconStyle: "bg-violet-100 text-violet-700",
            accent: "from-violet-500 to-purple-600",
        },
        {
            id: "APPLIED",
            label: "New Applications",
            value: counts.applied,
            caption: "Waiting for review",
            icon: FileText,
            iconStyle: "bg-sky-100 text-sky-700",
            accent: "from-sky-400 to-blue-600",
        },
        {
            id: "SHORTLISTED",
            label: "Shortlisted",
            value: counts.shortlisted,
            caption: "Promising candidates",
            icon: UserCheck,
            iconStyle: "bg-emerald-100 text-emerald-700",
            accent: "from-emerald-400 to-teal-600",
        },
        {
            id: "INTERVIEW",
            label: "Interview Stage",
            value: counts.interview,
            caption: "Candidates in progress",
            icon: CalendarClock,
            iconStyle: "bg-amber-100 text-amber-700",
            accent: "from-amber-400 to-orange-500",
        },
        {
            id: "SELECTED",
            label: "Selected",
            value: counts.selected,
            caption: "Successful candidates",
            icon: UserRoundCheck,
            iconStyle: "bg-fuchsia-100 text-fuchsia-700",
            accent: "from-fuchsia-500 to-purple-600",
        },
    ];

    const clearFilters = () => {
        setSearch("");
        setJobFilter("ALL");
        setStatusFilter("ALL");
    };

    return (
        <div className="min-h-screen bg-[#f8f7ff] lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
            {/* Sidebar stays separate from the navbar */}
            <aside className="sticky top-0 z-30 h-screen self-start">
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            </aside>

            {/* Main workspace */}
            <main className="min-w-0">
                {/* Keep navbar inside the main column */}
                <div className="sticky top-0 z-20">
                    <EmployerNavbar />
                </div>

                <div className="mx-auto w-full max-w-[1600px] !px-4 sm:!px-6 lg:!px-8 !py-6 lg:!py-8">
                    {/* Hero */}
                    <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#30205f] via-[#5635a1] to-[#8153dc] !p-6 sm:!p-8 shadow-xl shadow-purple-200/50">
                        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-28 right-1/4 h-60 w-60 rounded-full bg-fuchsia-300/15 blur-3xl" />
                        <div className="pointer-events-none absolute right-8 top-8 hidden opacity-[0.09] sm:block">
                            <Users size={150} />
                        </div>

                        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                            <div className="min-w-0">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 !px-3 !py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-purple-100">
                                    <Sparkles size={14} />
                                    Talent workspace
                                </div>

                                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                                    Applicants
                                    <span className="text-purple-200">.</span>
                                </h1>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-purple-100/90 sm:text-base">
                                    Discover talent, review applications, and
                                    move the right candidates forward.
                                </p>

                                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-purple-100">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 !px-3 !py-2">
                                        <CircleCheck size={14} />
                                        {counts.all} total applications
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 !px-3 !py-2">
                                        <BriefcaseBusiness size={14} />
                                        {jobs.length} job positions
                                    </span>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 !p-4 backdrop-blur-md">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-purple-700">
                                    <TrendingUp size={22} />
                                </div>
                                <div>
                                    <p className="text-xs text-purple-100">
                                        Hiring pipeline
                                    </p>
                                    <p className="mt-1 text-lg font-bold text-white">
                                        {counts.shortlisted +
                                            counts.interview +
                                            counts.selected}{" "}
                                        progressing
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Statistics */}
                    <section className="mt-6">
                        <div className="mb-4 flex items-end justify-between gap-3">
                            <div>
                                <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                                    Hiring at a glance
                                </h2>
                                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                    Select a card to filter applicants by stage.
                                </p>
                            </div>

                            {statusFilter !== "ALL" && (
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter("ALL")}
                                    className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900"
                                >
                                    Reset stage
                                    <ArrowUpRight size={14} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                            {statCards.map((stat) => {
                                const Icon = stat.icon;
                                const active = statusFilter === stat.id;

                                return (
                                    <button
                                        type="button"
                                        key={stat.id}
                                        onClick={() => setStatusFilter(stat.id)}
                                        aria-pressed={active}
                                        className={`group relative min-w-0 overflow-hidden rounded-2xl border !p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                                            active
                                                ? "border-purple-300 bg-purple-50 shadow-md shadow-purple-100"
                                                : "border-purple-100 bg-white shadow-sm hover:border-purple-200"
                                        }`}
                                    >
                                        <span
                                            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.accent}`}
                                        />

                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-gray-500">
                                                    {stat.label}
                                                </p>
                                                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900 tabular-nums">
                                                    {stat.value}
                                                </p>
                                            </div>

                                            <span
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110 ${stat.iconStyle}`}
                                            >
                                                <Icon size={21} />
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between gap-2">
                                            <p className="text-[11px] text-gray-500">
                                                {stat.caption}
                                            </p>
                                            <ArrowUpRight
                                                size={15}
                                                className={`shrink-0 ${
                                                    active
                                                        ? "text-purple-700"
                                                        : "text-gray-300 group-hover:text-purple-600"
                                                }`}
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Search and list */}
                    <section className="mt-7">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                                    Candidate directory
                                </h2>
                                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                    Search, filter, and open individual
                                    applications.
                                </p>
                            </div>

                            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-purple-100 bg-white !px-3 !py-2 text-xs font-semibold text-purple-700">
                                <Users size={14} />
                                {filteredApplicants.length} results
                            </div>
                        </div>

                        <ApplicantFilter
                            search={search}
                            setSearch={setSearch}
                            jobFilter={jobFilter}
                            setJobFilter={setJobFilter}
                            jobs={jobs}
                        />

                        <div className="mt-4">
                            {loading ? (
                                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-purple-100 bg-white">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                                        <RefreshCw
                                            size={24}
                                            className="animate-spin"
                                        />
                                    </div>
                                    <p className="mt-4 text-sm font-semibold text-gray-800">
                                        Gathering your candidates
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Loading application records...
                                    </p>
                                </div>
                            ) : error ? (
                                <div className="rounded-2xl border border-rose-100 bg-white !p-8 text-center shadow-sm">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                                        <XCircle size={25} />
                                    </div>
                                    <h3 className="mt-4 text-base font-bold text-gray-900">
                                        We couldn't load applicants
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-lg text-sm text-rose-600">
                                        {error}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.location.reload()
                                        }
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 !px-4 !py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                                    >
                                        <RefreshCw size={15} />
                                        Try again
                                    </button>
                                </div>
                            ) : (
                                <ApplicantList
                                    applicants={filteredApplicants}
                                    onClearFilters={clearFilters}
                                    hasFilters={
                                        Boolean(search) ||
                                        jobFilter !== "ALL" ||
                                        statusFilter !== "ALL"
                                    }
                                />
                            )}
                        </div>

                        {!loading && !error && (
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-purple-100/80 bg-white/70 !px-4 !py-3">
                                <p className="text-[11px] text-gray-500">
                                    Showing{" "}
                                    <span className="font-bold text-gray-800">
                                        {filteredApplicants.length}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-bold text-gray-800">
                                        {applicants.length}
                                    </span>{" "}
                                    applications
                                </p>
                                <p className="inline-flex items-center gap-1.5 text-[11px] text-gray-400">
                                    <Sparkles
                                        size={12}
                                        className="text-purple-500"
                                    />
                                    Your next great hire starts here
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Applicants;
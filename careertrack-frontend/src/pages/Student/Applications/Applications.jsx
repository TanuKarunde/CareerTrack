
import { useEffect, useMemo, useState } from "react";
import {
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    FileText,
    Sparkles,
    TrendingUp,
    ArrowUpRight,
} from "lucide-react";

import ApplicationFilters from "./ApplicationFilters";
import ApplicationList from "./ApplicationList";
import NoApplications from "./NoApplications";

import { getMyApplications } from "../../../services/applicationService";
import Sidebar from "../../../components/Sidebar/Sidebar";
import UserNavbar from "../Navbar/UserNavbar";

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getMyApplications();
                setApplications(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load applications:", err);
                setError(err?.message || "Failed to load applications");
                setApplications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const filteredApplications =
        filter === "ALL"
            ? applications
            : applications.filter(
                  (application) =>
                      application.status?.toUpperCase() ===
                      filter.toUpperCase()
              );

    const stats = useMemo(() => {
        const countStatus = (status) =>
            applications.filter(
                (application) =>
                    application.status?.toUpperCase() === status
            ).length;

        return [
            {
                label: "Total Applications",
                value: applications.length,
                icon: BriefcaseBusiness,
                iconStyle: "bg-violet-100 text-violet-700",
                accent: "from-violet-500 to-purple-600",
                description: "Your applications so far",
            },
            {
                label: "In Review",
                value:
                    countStatus("APPLIED") +
                    countStatus("SHORTLISTED") +
                    countStatus("INTERVIEW"),
                icon: Clock3,
                iconStyle: "bg-amber-100 text-amber-700",
                accent: "from-amber-400 to-orange-500",
                description: "Moving through the process",
            },
            {
                label: "Shortlisted",
                value: countStatus("SHORTLISTED"),
                icon: TrendingUp,
                iconStyle: "bg-blue-100 text-blue-700",
                accent: "from-blue-500 to-indigo-500",
                description: "Applications getting noticed",
            },
            {
                label: "Selected",
                value: countStatus("SELECTED"),
                icon: CheckCircle2,
                iconStyle: "bg-emerald-100 text-emerald-700",
                accent: "from-emerald-400 to-teal-500",
                description: "Successful applications",
            },
        ];
    }, [applications]);

    return (
        <div className="min-h-screen bg-[#f8f7ff]">
            <div className="grid min-h-screen grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)]">

                {/* LEFT SIDEBAR */}
                <aside
                    className={`${
                        isOpen ? "block" : "hidden"
                    } relative z-40 min-w-0 md:block`}
                >
                    <div className="sticky top-0 h-screen overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
    />
</div>
                </aside>

                {/* RIGHT CONTENT COLUMN */}
                <div className="flex min-h-screen min-w-0 flex-col">

                    {/* STICKY NAVBAR */}
                    <div className="sticky top-0 z-30 w-full border-b border-violet-100/80 bg-white/95 backdrop-blur-xl">
                        <UserNavbar />
                    </div>

                    {/* SCROLLABLE PAGE CONTENT */}
                    <main className="relative z-0 min-h-0 min-w-0 flex-1 !px-4 !py-6 sm:!px-6 lg:!px-8 lg:!py-8">
                        <div className="mx-auto w-full max-w-[1600px] min-w-0">

                            {/* PAGE HEADER */}
                            <header className="relative mb-7 overflow-hidden rounded-3xl border border-violet-100 bg-white !p-5 shadow-[0_5px_30px_rgba(109,40,217,0.06)] sm:!p-7 lg:!p-8">
                                <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-violet-100/70 blur-3xl" />
                                <div className="pointer-events-none absolute bottom-0 right-1/4 h-24 w-24 rounded-full bg-fuchsia-100/50 blur-2xl" />

                                <div className="relative flex flex-wrap items-center justify-between gap-5">
                                    <div className="max-w-2xl">
                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 !px-3 !py-1.5 text-xs font-semibold text-violet-700">
                                            <Sparkles size={14} />
                                            YOUR CAREER JOURNEY
                                        </div>

                                        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                                            My Applications
                                            <span className="text-violet-600">.</span>
                                        </h1>

                                        <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                                            Every application is a step forward.
                                            Keep track of your progress and see
                                            where your next opportunity leads.
                                        </p>
                                    </div>

                                    <div className="relative flex items-center gap-3 rounded-2xl border border-violet-100 bg-white/90 !px-4 !py-3 shadow-sm">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-md shadow-violet-200">
                                            <FileText size={23} />
                                        </div>

                                        <div>
                                            <p className="text-2xl font-extrabold leading-7 text-gray-900">
                                                {loading ? "—" : applications.length}
                                            </p>
                                            <p className="text-xs font-medium text-gray-500">
                                                Applications tracked
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative mt-6 flex items-center gap-2 border-t border-violet-100 !pt-4 text-xs text-gray-500">
                                    <span className="h-2 w-2 rounded-full bg-violet-500" />
                                    <span>
                                        Stay prepared. Your next opportunity could be closer than you think.
                                    </span>
                                </div>
                            </header>

                            {/* APPLICATION STATISTICS */}
                            <section className="mb-8">
                                <div className="mb-4">
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Application overview
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        A quick look at your progress.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    {stats.map((stat) => {
                                        const Icon = stat.icon;

                                        return (
                                            <div
                                                key={stat.label}
                                                className="group relative overflow-hidden rounded-2xl border border-violet-100/80 bg-white !p-5 shadow-[0_3px_16px_rgba(30,20,70,0.035)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(109,40,217,0.09)]"
                                            >
                                                <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${stat.accent}`} />

                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">
                                                            {stat.label}
                                                        </p>
                                                        <p className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
                                                            {loading ? "—" : stat.value}
                                                        </p>
                                                    </div>

                                                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconStyle} transition duration-300 group-hover:scale-110`}>
                                                        <Icon size={21} />
                                                    </div>
                                                </div>

                                                <p className="mt-4 border-t border-gray-100 !pt-3 text-xs leading-5 text-gray-500">
                                                    {stat.description}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* APPLICATION ACTIVITY */}
                            <section className="min-w-0 overflow-hidden rounded-3xl border border-violet-100/80 bg-white shadow-[0_5px_25px_rgba(30,20,70,0.04)]">
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-violet-100 !px-5 !py-5 sm:!px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                                            <BriefcaseBusiness size={20} />
                                        </div>

                                        <div>
                                            <h2 className="font-bold text-gray-900">
                                                Application activity
                                            </h2>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Review and manage your job applications.
                                            </p>
                                        </div>
                                    </div>

                                    {!loading && !error && (
                                        <span className="rounded-full bg-violet-50 !px-3 !py-1.5 text-xs font-semibold text-violet-700">
                                            {filteredApplications.length}{" "}
                                            {filteredApplications.length === 1
                                                ? "result"
                                                : "results"}
                                        </span>
                                    )}
                                </div>

                                <div className="min-w-0 !p-4 sm:!p-6">
                                    <div className="mb-6 rounded-2xl border border-gray-100 bg-[#fcfbff] !p-3 sm:!p-4">
                                        <ApplicationFilters
                                            filter={filter}
                                            setFilter={setFilter}
                                            applications={applications}
                                        />
                                    </div>

                                    {loading && (
                                        <div className="rounded-2xl border border-violet-100 bg-violet-50/30 !px-5 !py-14 text-center">
                                            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-[3px] border-violet-100 border-t-violet-600" />
                                            <p className="mt-4 text-sm font-semibold text-gray-700">
                                                Loading your applications...
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                Getting your latest application updates.
                                            </p>
                                        </div>
                                    )}

                                    {!loading && error && (
                                        <div className="rounded-2xl border border-red-100 bg-red-50 !p-5 text-red-600">
                                            <p className="font-semibold">
                                                Unable to load applications
                                            </p>
                                            <p className="mt-1 text-sm">
                                                {error}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => window.location.reload()}
                                                className="mt-4 rounded-xl bg-red-600 !px-4 !py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                                            >
                                                Try again
                                            </button>
                                        </div>
                                    )}

                                    {!loading &&
                                        !error &&
                                        filteredApplications.length === 0 && (
                                            <NoApplications />
                                        )}

                                    {!loading &&
                                        !error &&
                                        filteredApplications.length > 0 && (
                                            <ApplicationList
                                                applications={filteredApplications}
                                            />
                                        )}
                                </div>
                            </section>

                            {/* CAREER TIP */}
                            {!loading && !error && applications.length > 0 && (
                                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-white !p-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                                        <ArrowUpRight size={19} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Keep your momentum going
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-gray-500">
                                            Check your application status regularly
                                            and prepare for interviews when you get shortlisted.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Applications;

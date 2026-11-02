
import { useEffect, useState } from "react";
import {
    Sparkles,
    BriefcaseBusiness,
    RotateCcw,
    Search,
} from "lucide-react";

import JobFilters from "./JobFilters";
import JobList from "./JobList";
import JobSearchBar from "./JobSearchBar";
import JobSort from "./JobSort";

import { getJobs } from "../../../services/jobService";
import Sidebar from "../../../components/Sidebar/Sidebar";
import UserNavbar from "../Navbar/UserNavbar";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [jobType, setJobType] = useState("");
    const [experience, setExperience] = useState("");
    const [location, setLocation] = useState("");
    const [sort, setSort] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getJobs();
            setJobs(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            setError(err?.message || "Failed to load jobs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter((job) => {
        const searchText = search.trim().toLowerCase();

        const title = (job?.title || "").toLowerCase();
        const company = (job?.company || job?.compony || "").toLowerCase();

        const skills = Array.isArray(job?.skills)
            ? job.skills.join(" ").toLowerCase()
            : (job?.skills || "").toLowerCase();

        const matchesSearch =
            !searchText ||
            title.includes(searchText) ||
            company.includes(searchText) ||
            skills.includes(searchText);

        const typeValue = (job?.jobType || job?.jobtype || "").toUpperCase();
        const selectedType = jobType.toUpperCase();

        const matchesJobType = (() => {
            if (!jobType) return true;

            if (selectedType === "REMOTE") {
                return (
                    typeValue.includes("REMOTE") ||
                    (job?.location || "").toLowerCase().includes("remote")
                );
            }

            return typeValue === selectedType;
        })();

        const expValue = (job?.experienceLevel || "").toUpperCase();

        const matchesExperience = (() => {
            if (!experience) return true;

            if (experience === "FRESHER") {
                return (
                    expValue.includes("FRESHER") ||
                    expValue.includes("ENTRY LEVEL")
                );
            }

            if (experience === "ENTRY") {
                return (
                    expValue.includes("ENTRY") ||
                    expValue.includes("1 - 2") ||
                    expValue.includes("1-2") ||
                    expValue.includes("1 TO 2")
                );
            }

            if (experience === "MID") {
                return (
                    expValue.includes("MID") ||
                    expValue.includes("2 - 5") ||
                    expValue.includes("2-5") ||
                    expValue.includes("2 TO 5")
                );
            }

            if (experience === "5+") {
                return (
                    expValue.includes("5+") ||
                    expValue.includes("5 +") ||
                    expValue.includes("5 YEARS")
                );
            }

            return expValue.includes(experience.toUpperCase());
        })();

        const matchesLocation =
            !location ||
            (job?.location || "").toLowerCase().includes(location.toLowerCase());

        return (
            matchesSearch &&
            matchesJobType &&
            matchesExperience &&
            matchesLocation
        );
    });

    const sortedJobs = [...filteredJobs].sort((a, b) => {
        if (sort === "latest") {
            return (
                new Date(b?.createdAt || 0).getTime() -
                new Date(a?.createdAt || 0).getTime()
            );
        }

        if (sort === "salary-high") {
            return Number(b?.salaryMax || 0) - Number(a?.salaryMax || 0);
        }

        if (sort === "salary-low") {
            return Number(a?.salaryMin || 0) - Number(b?.salaryMin || 0);
        }

        return 0;
    });

    const clearFilters = () => {
        setSearch("");
        setJobType("");
        setExperience("");
        setLocation("");
        setSort("");
    };

    return (
        <div className="min-h-screen bg-[#f7f8fc]">
            <div className="grid min-h-screen grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)]">
                {/* Sidebar */}
                <aside
                    className={`${
                        isOpen ? "block" : "hidden"
                    } relative z-40 min-w-0 md:block`}
                >
                    <div className="sticky top-0 h-screen">
                        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                    </div>
                </aside>

                {/* Main column */}
                <div className="flex min-h-screen min-w-0 flex-col">
                    {/* Sticky navbar — right column only */}
                    <div className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/95 shadow-[0_2px_12px_rgba(35,45,75,0.025)] backdrop-blur-xl">
                        <UserNavbar />
                    </div>

                    <main className="relative z-0 min-w-0 flex-1 !px-4 !py-6 sm:!px-6 lg:!px-8 lg:!py-8">
                        <div className="mx-auto w-full max-w-[1600px] min-w-0">
                            {/* Heading */}
                            <header className="relative mb-6 overflow-hidden rounded-[26px] border border-[#e8e7f3] bg-white !p-5 shadow-[0_5px_22px_rgba(35,45,75,0.035)] sm:!p-7 lg:!p-8">
                                <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-[#eee9ff] opacity-70 blur-3xl" />
                                <div className="pointer-events-none absolute right-36 top-16 h-32 w-32 rounded-full bg-[#e5edf9] opacity-80 blur-3xl" />

                                <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                                    <div className="min-w-0">
                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e9e5f8] bg-[#f8f6ff] !px-3 !py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6252ae]">
                                            <Sparkles size={13} />
                                            Your next chapter starts here
                                        </div>

                                        <h1 className="text-2xl font-extrabold tracking-tight text-[#27344a] sm:text-3xl lg:text-[34px]">
                                            Find your next opportunity
                                        </h1>

                                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                            Explore roles that fit your skills, discover new possibilities,
                                            and take your next career step with confidence.
                                        </p>
                                    </div>

                                    {!loading && !error && (
                                        <div className="flex shrink-0 items-center gap-3 self-start rounded-2xl border border-slate-200/80 bg-white !px-4 !py-3 shadow-sm sm:self-center">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#344563] text-white shadow-md shadow-slate-200">
                                                <BriefcaseBusiness size={20} />
                                            </div>

                                            <div>
                                                <p className="text-2xl font-extrabold leading-7 text-[#27344a]">
                                                    {sortedJobs.length}
                                                </p>
                                                <p className="text-[11px] font-semibold text-slate-400">
                                                    Matching jobs
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </header>

                            {/* Search */}
                            <section className="rounded-2xl border border-slate-200/80 bg-white !p-3 shadow-sm sm:!p-4">
                                <JobSearchBar
                                    search={search}
                                    setSearch={setSearch}
                                />
                            </section>

                            {/* Filters + results */}
                            <div className="mt-6 grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[245px_minmax(0,1fr)] xl:grid-cols-[265px_minmax(0,1fr)] xl:gap-6">
                                <aside className="min-w-0 lg:sticky lg:top-24">
                                    <JobFilters
                                        jobs={jobs}
                                        jobType={jobType}
                                        setJobType={setJobType}
                                        experience={experience}
                                        setExperience={setExperience}
                                        location={location}
                                        setLocation={setLocation}
                                    />
                                </aside>

                                <section className="min-w-0">
                                    {/* Results header */}
                                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <h2 className="text-lg font-extrabold tracking-tight text-[#27344a]">
                                                Explore opportunities
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {loading
                                                    ? "Finding opportunities..."
                                                    : `${sortedJobs.length} ${sortedJobs.length === 1 ? "position" : "positions"} available`}
                                            </p>
                                        </div>

                                        <JobSort sort={sort} setSort={setSort} />
                                    </div>

                                    <div className="mb-5 h-px bg-gradient-to-r from-[#c9c1ed] via-slate-200 to-transparent" />

                                    {/* Loading */}
                                    {loading && (
                                        <div className="rounded-2xl border border-slate-200 bg-white !p-10 text-center shadow-sm sm:!p-14">
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2efff]">
                                                <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#ddd6fa] border-t-[#6252ae]" />
                                            </div>

                                            <p className="mt-4 text-sm font-bold text-[#27344a]">
                                                Finding opportunities for you
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Loading the latest available jobs...
                                            </p>
                                        </div>
                                    )}

                                    {/* Error */}
                                    {!loading && error && (
                                        <div className="rounded-2xl border border-rose-100 bg-white !p-6 shadow-sm sm:!p-8">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                                                <RotateCcw size={21} />
                                            </div>

                                            <h3 className="mt-4 text-base font-extrabold text-slate-800">
                                                We couldn't load the jobs
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                                {error}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={fetchJobs}
                                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#344563] !px-4 !py-2.5 text-sm font-bold text-white transition hover:bg-[#6252ae] focus:outline-none focus:ring-2 focus:ring-[#8c7bd8] focus:ring-offset-2"
                                            >
                                                <RotateCcw size={15} />
                                                Try again
                                            </button>
                                        </div>
                                    )}

                                    {/* Results */}
                                    {!loading && !error && sortedJobs.length > 0 && (
                                        <JobList jobs={sortedJobs} />
                                    )}

                                    {/* Empty state */}
                                    {!loading && !error && sortedJobs.length === 0 && (
                                        <div className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-white !px-5 !py-12 text-center shadow-sm sm:!py-16">
                                            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#eee9ff] blur-3xl" />
                                            <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[#eaf0fa] blur-3xl" />

                                            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f2efff] text-[#6252ae]">
                                                <Search size={27} />
                                            </div>

                                            <h3 className="relative mt-5 text-lg font-extrabold text-[#27344a]">
                                                No matching opportunities
                                            </h3>

                                            <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                                We couldn't find any jobs for your current search.
                                                Try different keywords or clear some filters.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={clearFilters}
                                                className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-[#344563] !px-5 !py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#6252ae] hover:shadow-md"
                                            >
                                                <RotateCcw size={15} />
                                                Reset search and filters
                                            </button>
                                        </div>
                                    )}
                                </section>
                            </div>

                            <footer className="!pt-8 text-center text-[11px] text-slate-400">
                                CareerTrack · Discover work that moves you forward.
                            </footer>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Jobs;

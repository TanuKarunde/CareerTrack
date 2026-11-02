
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BriefcaseBusiness,
    Plus,
    Sparkles,
    CheckCircle2,
    PauseCircle,
    ArrowUpRight
} from "lucide-react";

import { getEmployerApplicants, getEmployerJobs } from "../../../services/employerService";
import EJobCard from "./EJobCard";
import EJobFilter from "./EJobFilters";
import Sidebar from "../../../components/Sidebar/Sidebar";
import EmployerNavbar from "../ENavbar/EmployerNavbar";

const EJobs = () => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [experience, setExperience] = useState("ALL");
    const [isOpen, setIsOpen] = useState(false);

    const storedUser = JSON.parse(
        localStorage.getItem("careertrack_user") || "{}"
    );

    const currentUserId = storedUser?.id;

    useEffect(() => {
    const loadJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const [jobsData, applicantsData] = await Promise.all([
                getEmployerJobs(),
                getEmployerApplicants()
            ]);

            console.log("EMPLOYER JOBS:", jobsData);
            console.log("EMPLOYER APPLICANTS:", applicantsData);

            const jobsList = Array.isArray(jobsData)
                ? jobsData
                : [];

            const applicantsList = Array.isArray(applicantsData)
                ? applicantsData
                : [];

            const jobsWithApplicantCounts = jobsList.map((job) => {
                const applicantCount = applicantsList.filter((applicant) => {
                    const applicantJobId =
                        applicant.jobId ??
                        applicant.application?.jobId ??
                        applicant.job?.id ??
                        applicant.application?.job?.id;

                    return (
                        applicantJobId != null &&
                        Number(applicantJobId) === Number(job.id)
                    );
                }).length;

                return {
                    ...job,
                    applicationsCount: applicantCount
                };
            });

            setJobs(jobsWithApplicantCounts);
        } catch (err) {
            console.error("Failed to load employer jobs:", err);
            setError(err?.message || "Unable to load jobs.");
        } finally {
            setLoading(false);
        }
    };

    loadJobs();
}, []);

    const handleStatusChange = (updatedJob) => {
        if (!updatedJob?.id) return;

        setJobs((previousJobs) =>
            previousJobs.map((job) =>
                job.id === updatedJob.id
                    ? { ...job, ...updatedJob }
                    : job
            )
        );
    };

    const filteredJobs = jobs.filter((job) => {
        const searchText = search.toLowerCase().trim();

        const title = String(job?.title || job?.jobTitle || "").toLowerCase();
        const company = String(job?.company || job?.compony || "").toLowerCase();
        const location = String(job?.location || "").toLowerCase();
        const skills = Array.isArray(job?.skills)
            ? job.skills.join(" ").toLowerCase()
            : String(job?.skills || "").toLowerCase();

        const matchesSearch =
            title.includes(searchText) ||
            company.includes(searchText) ||
            location.includes(searchText) ||
            skills.includes(searchText);

        const isActive =
            job?.active === true ||
            job?.active === "true";

        const matchesStatus =
            status === "ALL" ||
            (status === "ACTIVE" && isActive) ||
            (status === "PAUSED" && !isActive);

        const jobExperience = String(
            job?.experienceLevel ||
            job?.experiencelevel ||
            job?.experience ||
            ""
        ).toLowerCase().trim();

        const normalizedFilter = experience.toLowerCase().trim();

        const matchesExperience =
            experience === "ALL" ||
            jobExperience === normalizedFilter ||
            (normalizedFilter === "0-1" && /0\s*[-–]\s*1|fresher|entry/.test(jobExperience)) ||
            (normalizedFilter === "1-2" && /1\s*[-–]\s*2/.test(jobExperience)) ||
            (normalizedFilter === "2-5" && /2\s*[-–]\s*5/.test(jobExperience)) ||
            (normalizedFilter === "5+" && /5\+|5\s*\+|5\s*(?:years|year)|senior/.test(jobExperience));

        return matchesSearch && matchesStatus && matchesExperience;
    });

    const activeCount = jobs.filter(
        (job) => job?.active === true || job?.active === "true"
    ).length;

    const pausedCount = jobs.length - activeCount;

    const stats = [
        {
            label: "Total Jobs",
            value: jobs.length,
            icon: BriefcaseBusiness,
            style: "from-violet-500 to-purple-600",
            surface: "border-violet-100 bg-violet-50/80",
            iconColor: "text-violet-600"
        },
        {
            label: "Active Jobs",
            value: activeCount,
            icon: CheckCircle2,
            style: "from-emerald-400 to-teal-500",
            surface: "border-emerald-100 bg-emerald-50/80",
            iconColor: "text-emerald-600"
        },
        {
            label: "Paused Jobs",
            value: pausedCount,
            icon: PauseCircle,
            style: "from-orange-400 to-amber-500",
            surface: "border-orange-100 bg-orange-50/80",
            iconColor: "text-orange-600"
        }
    ];

    const pageShell = (content) => (
        <div className="min-h-screen w-full bg-[#faf8ff] text-slate-800">
            <div className="grid min-h-screen grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)]">
                <aside className="sticky top-0 z-40 hidden h-screen self-start md:block">
                    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                </aside>

                <div className="flex min-h-screen min-w-0 flex-col">
                    <EmployerNavbar />

                    <main className="min-w-0 w-full flex-1 !px-4 !py-6 sm:!px-6 lg:!px-8 lg:!py-8">
                        {content}
                    </main>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return pageShell(
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
                <p className="text-sm font-medium text-slate-500">
                    Preparing your job workspace...
                </p>
            </div>
        );
    }

    if (error) {
        return pageShell(
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="w-full max-w-md rounded-[28px] border border-red-100 bg-white !p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <BriefcaseBusiness size={25} />
                    </div>

                    <h2 className="mt-4 text-xl font-extrabold text-slate-800">
                        Unable to load jobs
                    </h2>

                    <p className="mt-2 text-sm text-red-500">{error}</p>

                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-5 rounded-xl bg-violet-600 !px-5 !py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return pageShell(
        <div className="mx-auto w-full max-w-[1600px]">
            {/* HERO */}
            <section className="
                relative mb-6 overflow-hidden
                rounded-[30px] border border-violet-100
                bg-gradient-to-r from-violet-100 via-white to-pink-100
                !px-5 !py-6 sm:!px-7 sm:!py-7
                shadow-[0_12px_36px_rgba(139,92,246,0.08)]
            ">
                <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-pink-300/30 blur-3xl" />
                <div className="pointer-events-none absolute right-40 bottom-[-70px] h-44 w-44 rounded-full bg-cyan-200/40 blur-3xl" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
                            <BriefcaseBusiness size={27} />
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                                    My Jobs
                                </h1>
                                <span className="rounded-full border border-violet-200 bg-white/80 !px-3 !py-1 text-[11px] font-bold text-violet-700">
                                    Employer Workspace
                                </span>
                            </div>

                            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
                                Manage your job postings, track applicants, and discover your next great hire.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/employer/jobs/create")}
                        className="
                            inline-flex items-center justify-center gap-2
                            rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600
                            !px-5 !py-3 text-sm font-bold text-white
                            shadow-lg shadow-violet-200 transition
                            hover:-translate-y-0.5 hover:from-violet-700 hover:to-fuchsia-700
                            active:scale-[0.98]
                        "
                    >
                        <Plus size={18} />
                        Post New Job
                        <ArrowUpRight size={16} />
                    </button>
                </div>

                <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {stats.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.label}
                                className={`flex items-center gap-3 rounded-2xl border !px-4 !py-3 ${item.surface}`}
                            >
                                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ${item.iconColor}`}>
                                    <Icon size={21} />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        {item.label}
                                    </p>
                                    <p className="text-2xl font-black leading-tight text-slate-900">
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* FILTERS */}
            <EJobFilter
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
                experience={experience}
                setExperience={setExperience}
            />

            {/* JOB LIST HEADING */}
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-lg font-extrabold text-slate-800">
                        Your job postings
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                        Showing {filteredJobs.length} of {jobs.length} jobs
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white !px-3 !py-2 text-xs font-semibold text-violet-600 shadow-sm">
                    <Sparkles size={14} />
                    Talent at a glance
                </div>
            </div>

            {/* JOBS */}
            {filteredJobs.length === 0 ? (
                <div className="
                    rounded-[28px] border border-dashed border-violet-200
                    bg-gradient-to-br from-white via-violet-50/50 to-pink-50/50
                    !px-6 !py-14 text-center
                ">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 text-violet-600">
                        <BriefcaseBusiness size={29} />
                    </div>

                    <h2 className="mt-4 text-lg font-extrabold text-slate-800">
                        {jobs.length === 0
                            ? "Your next great hire starts here"
                            : "No matching jobs found"}
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        {jobs.length === 0
                            ? "Create your first job posting and start connecting with talented candidates."
                            : "Try another keyword or reset your filters to see more job postings."}
                    </p>

                    {jobs.length === 0 ? (
                        <button
                            type="button"
                            onClick={() => navigate("/employer/jobs/create")}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 !px-5 !py-3 text-sm font-bold text-white transition hover:bg-violet-700"
                        >
                            <Plus size={17} />
                            Create Your First Job
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setStatus("ALL");
                                setExperience("ALL");
                            }}
                            className="mt-5 rounded-xl border border-violet-200 bg-white !px-5 !py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-50"
                        >
                            Reset all filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredJobs.map((job) => (
                        <EJobCard
                            key={job.id}
                            job={job}
                            currentUserId={currentUserId}
                            onEdit={(id) => navigate(`/employer/jobs/edit/${id}`)}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EJobs;

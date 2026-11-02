
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowRight,
    ArrowUpRight,
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    CircleAlert,
    Plus,
    Sparkles,
    UserPlus,
    Users,
    Zap,
    CalendarDays,
    Target,
    Rocket,
    ChevronRight,
    Layers3,
} from "lucide-react";

import { getEmployerDashboard } from "../../../services/employerService";
import Sidebar from "../../../components/Sidebar/Sidebar";
import EmployerNavbar from "../ENavbar/EmployerNavbar";

import WelcomeBanner from "./WelcomeBanner";
import EmployerStats from "./EmployerStats";
import ActiveJobs from "./ActiveJobs";
import QuickAction from "./QuickAction";
import RecentApplications from "./RecentApplication";
import AnnouncementBanner from "../../../components/Announcement/AnnouncementBanner";

const EDashboard = () => {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [employerName, setEmployerName] = useState("Employer");

    useEffect(() => {
        try {
            const storedUser =
                localStorage.getItem("careertrack_user") ||
                localStorage.getItem("user");

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);

                setEmployerName(
                    parsedUser?.fullName ||
                    parsedUser?.name ||
                    parsedUser?.username ||
                    "Employer"
                );
            }
        } catch (err) {
            console.error("Unable to load employer details:", err);
        }
    }, []);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await getEmployerDashboard();
                setDashboard(result || {});
            } catch (err) {
                console.error("Dashboard Error:", err);
                setError(
                    err?.message || "Unable to load employer dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const data = dashboard || {};

    const activeJobs =
        data?.activejobsList ||
        data?.activeJobsList ||
        [];

    const recentApplications =
        data?.recentApplications ||
        data?.recentApplicants ||
        [];

    const hasCompany = data.hasCompany !== false;

    // Shared layout: sticky sidebar, separate sticky navbar, spacious content.
    const pageShell = (content) => (
        <div className="relative min-h-screen w-full overflow-x-clip bg-[#F7F6FC] text-slate-800">
            {/* Ambient background decoration */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-violet-200/25 blur-[100px]" />
                <div className="absolute -left-40 top-[45%] h-80 w-80 rounded-full bg-fuchsia-200/20 blur-[100px]" />
            </div>

            <div className="relative grid min-h-screen grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)]">
                {/* Keep sidebar separate from navbar */}
                <div className="sticky top-0 z-40 hidden h-screen self-start md:block">
                    <Sidebar
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                </div>

                <div className="flex min-h-screen min-w-0 flex-col">
                    <EmployerNavbar />

                    <main className="min-w-0 w-full flex-1 !px-4 !py-6 sm:!px-6 lg:!px-9 lg:!py-8">
                        {content}
                    </main>
                </div>
            </div>
        </div>
    );

    // LOADING
    if (loading) {
        return pageShell(
            <div className="flex min-h-[70vh] flex-col items-center justify-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-[30px] bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 text-white shadow-2xl shadow-violet-300/50">
                    <BriefcaseBusiness size={38} />
                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#F7F6FC] bg-cyan-400">
                        <Sparkles size={12} className="text-white" />
                    </span>
                </div>

                <h2 className="mt-7 text-xl font-extrabold tracking-tight text-slate-800">
                    Preparing your workspace
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    Gathering your recruitment insights...
                </p>

                <div className="mt-6 h-2 w-52 overflow-hidden rounded-full bg-violet-100">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                </div>
            </div>
        );
    }

    // ERROR
    if (error) {
        return pageShell(
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="w-full max-w-lg rounded-[30px] border border-rose-100 bg-white !p-8 text-center shadow-xl shadow-rose-100/40 sm:!p-10">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-gradient-to-br from-rose-100 to-orange-100">
                        <CircleAlert size={34} className="text-rose-600" />
                    </div>

                    <h2 className="mt-6 text-2xl font-extrabold text-slate-900">
                        We couldn't load your dashboard
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 !px-6 !py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                        Try Again <ArrowRight size={17} />
                    </button>
                </div>
            </div>
        );
    }

    // NEW EMPLOYER: COMPANY SETUP
    if (!hasCompany) {
        return pageShell(
            <div className="mx-auto w-full max-w-6xl space-y-8">
                <section className="relative isolate overflow-hidden rounded-[32px] bg-gradient-to-br from-[#251047] via-[#5428A0] to-[#8B5CF6] !p-7 text-white shadow-2xl shadow-violet-200/60 sm:!p-10 lg:!p-12">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border-[48px] border-white/[0.08]" />
                    <div className="pointer-events-none absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />

                    <div className="pointer-events-none absolute right-8 top-28 hidden rotate-12 text-white/[0.09] lg:block">
                        <Layers3 size={160} strokeWidth={1} />
                    </div>

                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-4 !py-2 text-xs font-bold tracking-wide text-violet-100">
                            <Sparkles size={15} />
                            YOUR NEXT CHAPTER STARTS HERE
                        </span>

                        <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Great teams
                            <span className="block bg-gradient-to-r from-fuchsia-200 via-violet-100 to-cyan-200 bg-clip-text text-transparent">
                                start with you.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl text-sm leading-7 text-violet-100 sm:text-base">
                            Welcome, {employerName}. Set up your company
                            workspace to publish opportunities, discover
                            talented candidates, and build your dream team.
                        </p>
                    </div>

                    <div className="relative z-10 mt-9 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/90">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 !px-4 !py-2.5">
                            <BriefcaseBusiness size={15} />
                            Publish jobs
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 !px-4 !py-2.5">
                            <Users size={15} />
                            Find talent
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 !px-4 !py-2.5">
                            <Target size={15} />
                            Hire smarter
                        </span>
                    </div>
                </section>

                <section>
                    <div className="mb-6">
                        <p className="text-xs font-extrabold uppercase tracking-[2px] text-violet-600">
                            Let's get started
                        </p>

                        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                            Set up your company
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Choose how you want to connect with your organization.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => navigate("/employer/company/create")}
                            className="group relative overflow-hidden rounded-[28px] border border-violet-100 bg-white !p-7 text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-200/50 sm:!p-9"
                        >
                            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-100/70 transition duration-300 group-hover:scale-125" />

                            <div className="relative flex items-start justify-between">
                                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-xl shadow-violet-200 transition group-hover:rotate-3">
                                    <Building2 size={29} />
                                </div>

                                <ArrowUpRight
                                    size={24}
                                    className="text-violet-500 transition group-hover:translate-x-1 group-hover:-translate-y-1"
                                />
                            </div>

                            <h3 className="relative mt-7 text-xl font-extrabold text-slate-900 sm:text-2xl">
                                Create a company
                            </h3>

                            <p className="relative mt-3 max-w-md text-sm leading-7 text-slate-500">
                                Build your company profile and create a dedicated
                                workspace for managing your recruitment activities.
                            </p>

                            <div className="relative mt-7 flex items-center gap-2 border-t border-slate-100 !pt-5 text-sm font-extrabold text-violet-700">
                                Create company profile
                                <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/employer/company/join")}
                            className="group relative overflow-hidden rounded-[28px] border border-cyan-100 bg-white !p-7 text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-100/70 sm:!p-9"
                        >
                            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-50 transition duration-300 group-hover:scale-125" />

                            <div className="relative flex items-start justify-between">
                                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-100 transition group-hover:-rotate-3">
                                    <UserPlus size={29} />
                                </div>

                                <ArrowUpRight
                                    size={24}
                                    className="text-cyan-600 transition group-hover:translate-x-1 group-hover:-translate-y-1"
                                />
                            </div>

                            <h3 className="relative mt-7 text-xl font-extrabold text-slate-900 sm:text-2xl">
                                Join an existing company
                            </h3>

                            <p className="relative mt-3 max-w-md text-sm leading-7 text-slate-500">
                                Connect with your organization and request access
                                to collaborate with its existing employer team.
                            </p>

                            <div className="relative mt-7 flex items-center gap-2 border-t border-slate-100 !pt-5 text-sm font-extrabold text-cyan-700">
                                Find your company
                                <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                            </div>
                        </button>
                    </div>
                </section>

                <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 !p-5">
                    <CircleAlert size={21} className="mt-0.5 shrink-0 text-amber-600" />

                    <div>
                        <p className="text-sm font-extrabold text-amber-950">
                            One quick step before you begin
                        </p>
                        <p className="mt-1 text-sm leading-6 text-amber-800">
                            Company access is needed to use employer features
                            such as jobs, applicants, and interviews.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // MAIN EMPLOYER DASHBOARD
    return pageShell(
        <div className="mx-auto w-full max-w-[1600px] space-y-8">

            {/* Header */}
            <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white !px-3 !py-1.5 text-xs font-extrabold uppercase tracking-wider text-violet-700 shadow-sm">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        </span>
                        Employer workspace
                    </div>

                    <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl xl:text-[42px]">
                        Let's build something
                        <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                            {" "}great.
                        </span>
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                        Your recruitment overview, job listings, and candidate
                        activity — all in one place.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/employer/jobs/create")}
                    className="group inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 !px-6 !py-4 text-sm font-extrabold text-white shadow-xl shadow-violet-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-300/60 xl:self-auto"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
                        <Plus size={19} strokeWidth={2.5} />
                    </span>
                    Create New Job
                    <ArrowRight size={17} className="transition group-hover:translate-x-1" />
                </button>
            </section>

            {/* Creative welcome hero */}
            <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#241044] via-[#51269A] to-[#7651DF] text-white shadow-2xl shadow-violet-200/60">
                <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border-[45px] border-white/[0.07]" />
                <div className="pointer-events-none absolute -bottom-32 right-[30%] h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
                <div className="pointer-events-none absolute right-12 top-12 hidden rotate-12 text-white/[0.10] lg:block">
                    <Rocket size={170} strokeWidth={1} />
                </div>

                <div className="relative z-10 flex flex-col gap-7 !p-6 sm:!p-8 lg:flex-row lg:items-center lg:justify-between lg:!p-10">
                    <div className="min-w-0 flex-1">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-2 text-xs font-bold text-violet-100 backdrop-blur-sm">
                            <Sparkles size={15} />
                            YOUR NEXT GREAT HIRE STARTS HERE
                        </div>

                        <div className="mt-5">
                            <WelcomeBanner employerName={employerName} />
                        </div>

                        <p className="mt-3 max-w-xl text-sm leading-7 text-violet-100">
                            Every great team begins with the right opportunity.
                            Manage your openings and discover candidates who
                            can make a difference.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => navigate("/employer/jobs")}
                                className="inline-flex items-center gap-2 rounded-xl bg-white !px-4 !py-3 text-sm font-extrabold text-violet-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-50"
                            >
                                <BriefcaseBusiness size={17} />
                                Explore Jobs
                                <ChevronRight size={16} />
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/employer/applicants")}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 !px-4 !py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                            >
                                <Users size={17} />
                                View Applicants
                            </button>
                        </div>
                    </div>

                    {/* Decorative side card */}
                    <div className="relative w-full shrink-0 rounded-[24px] border border-white/20 bg-white/10 !p-5 backdrop-blur-xl sm:!p-6 lg:max-w-[290px]">
                        <div className="flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-cyan-200">
                                <Target size={25} />
                            </div>

                            <span className="rounded-full border border-emerald-300/30 bg-emerald-300/15 !px-3 !py-1.5 text-xs font-bold text-emerald-200">
                                Let's go!
                            </span>
                        </div>

                        <p className="mt-5 text-sm font-medium text-violet-100">
                            Your recruitment workspace
                        </p>

                        <h3 className="mt-1 text-2xl font-black tracking-tight">
                            Ready to grow?
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-violet-100">
                            Keep your jobs organized and move promising
                            candidates forward.
                        </p>

                        <div className="mt-5 flex items-center gap-2 border-t border-white/15 !pt-4 text-xs font-semibold text-white/80">
                            <CheckCircle2 size={15} className="text-emerald-300" />
                            Your hiring journey starts here
                        </div>
                    </div>
                </div>
            </section>

            {/* CareerTrack Announcements */}
<div className="mb-6">
    <AnnouncementBanner role="EMPLOYER" />
</div>

            {/* Stats */}
            <section>
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-[2px] text-violet-600">
                            The big picture
                        </p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                            Hiring at a glance
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Your recruitment activity, summarized.
                        </p>
                    </div>

                    <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-violet-100 bg-white !px-4 !py-2.5 text-xs font-bold text-violet-700 shadow-sm">
                        <Zap size={15} />
                        Workspace insights
                    </span>
                </div>

                <div className="rounded-[26px] border border-white bg-white/90 !p-4 shadow-lg shadow-slate-200/40 sm:!p-6">
                    <EmployerStats dashboard={data} />
                </div>
            </section>

            {/* Jobs and applicants */}
            <section>
                <div className="mb-5">
                    <p className="text-xs font-extrabold uppercase tracking-[2px] text-fuchsia-600">
                        Your hiring activity
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                        Keep things moving
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Stay on top of your opportunities and candidate applications.
                    </p>
                </div>

                <div className="grid min-w-0 grid-cols-1 items-stretch gap-6 xl:grid-cols-2">

                    {/* Active jobs panel */}
                    <div className="group flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-violet-100/80 bg-white shadow-sm transition duration-300 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50">
                        <div className="relative overflow-hidden bg-gradient-to-r from-violet-50 via-purple-50 to-white !px-5 !py-5 sm:!px-6">
                            <div className="pointer-events-none absolute -right-6 -top-12 h-28 w-28 rounded-full bg-violet-100/70 blur-2xl" />

                            <div className="relative flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-lg shadow-violet-200 transition group-hover:scale-105">
                                        <BriefcaseBusiness size={22} />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="text-base font-extrabold text-slate-900">
                                            Active job listings
                                        </h3>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Your open opportunities
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate("/employer/jobs")}
                                    className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-white !px-3 !py-2.5 text-xs font-extrabold text-violet-700 shadow-sm transition hover:bg-violet-600 hover:text-white"
                                >
                                    View all <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="min-w-0 flex-1 !p-5 sm:!p-6">
                            <ActiveJobs jobs={activeJobs} />
                        </div>

                        <div className="!px-5 !pb-5 sm:!px-6 sm:!pb-6">
                            <button
                                type="button"
                                onClick={() => navigate("/employer/jobs/create")}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-violet-200 bg-violet-50/70 !px-4 !py-3 text-sm font-bold text-violet-700 transition hover:border-violet-400 hover:bg-violet-100"
                            >
                                <Plus size={17} />
                                Create another job
                            </button>
                        </div>
                    </div>

                    {/* Recent applicants panel */}
                    <div className="group flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-fuchsia-100/80 bg-white shadow-sm transition duration-300 hover:border-fuchsia-200 hover:shadow-xl hover:shadow-fuchsia-100/40">
                        <div className="relative overflow-hidden bg-gradient-to-r from-fuchsia-50 via-pink-50/70 to-white !px-5 !py-5 sm:!px-6">
                            <div className="pointer-events-none absolute -right-6 -top-12 h-28 w-28 rounded-full bg-fuchsia-100/70 blur-2xl" />

                            <div className="relative flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white shadow-lg shadow-fuchsia-200 transition group-hover:scale-105">
                                        <Users size={22} />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="text-base font-extrabold text-slate-900">
                                            Recent applicants
                                        </h3>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Latest candidate activity
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate("/employer/applicants")}
                                    className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-white !px-3 !py-2.5 text-xs font-extrabold text-fuchsia-700 shadow-sm transition hover:bg-fuchsia-600 hover:text-white"
                                >
                                    View all <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="min-w-0 flex-1 !p-5 sm:!p-6">
                            <RecentApplications
                                applications={recentApplications}
                            />
                        </div>

                        <div className="!px-5 !pb-5 sm:!px-6 sm:!pb-6">
                            <button
                                type="button"
                                onClick={() => navigate("/employer/applicants")}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-fuchsia-200 bg-fuchsia-50/70 !px-4 !py-3 text-sm font-bold text-fuchsia-700 transition hover:border-fuchsia-400 hover:bg-fuchsia-100"
                            >
                                Explore applicants
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick actions */}
            <section className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-gradient-to-br from-white via-violet-50/70 to-indigo-50/80 shadow-sm shadow-indigo-100/50">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl" />

                <div className="relative flex flex-col gap-4 border-b border-violet-100/80 !px-5 !py-5 sm:flex-row sm:items-center sm:!px-7">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-fuchsia-500 text-white shadow-xl shadow-violet-200/70">
                        <Zap size={25} />
                    </div>

                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-[1.5px] text-violet-600">
                            Your shortcuts
                        </p>
                        <h2 className="mt-1 text-xl font-black text-slate-900">
                            Make your next move
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Get to the tools you need without the extra clicks.
                        </p>
                    </div>
                </div>

                <div className="relative !p-5 sm:!p-7">
                    <QuickAction />
                </div>
            </section>

            {/* Final CTA */}
            <section className="group relative isolate overflow-hidden rounded-[30px] bg-gradient-to-r from-[#241044] via-[#51279B] to-[#7650DC] !p-6 text-white shadow-xl shadow-violet-200/50 sm:!p-8 lg:!p-9">
                <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[38px] border-white/[0.07]" />
                <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-fuchsia-400/20 blur-3xl" />

                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-1.5 text-xs font-bold text-violet-100">
                            <Sparkles size={14} />
                            YOUR NEXT GREAT HIRE
                        </div>

                        <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                            The right talent changes everything.
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-7 text-violet-100">
                            Publish your next opportunity and bring new talent
                            into your recruitment pipeline.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/employer/jobs/create")}
                        className="group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white !px-6 !py-4 text-sm font-extrabold text-violet-800 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-violet-50"
                    >
                        <Plus size={19} />
                        Post a new job
                        <ArrowUpRight
                            size={17}
                            className="transition group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
                        />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-200/80 !pt-6 text-xs text-slate-400 sm:flex-row">
                <p className="font-semibold">
                    CareerTrack <span className="mx-1 text-violet-400">✦</span>
                    Track. Prepare. Get Hired.
                </p>

                <p className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Your recruitment workspace
                </p>
            </footer>
        </div>
    );
};

export default EDashboard;

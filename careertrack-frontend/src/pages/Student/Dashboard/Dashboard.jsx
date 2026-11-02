
import { useEffect, useState } from "react";
import {
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

import WelcomeBanner from "./WelcomeBanner";
import StatsGrid from "./StatsGrid";
import ApplicationOverview from "./ApplicationOverview";
import RecentApplications from "./RecentApplications";
import RecommendedJobs from "./RecommendedJobs";
import QuickActions from "./QuickActions";

import { getStudentdashboard } from "../../../services/dashboardService";
import { getStudentApplications } from "../../../services/applicationService";

import Sidebar from "../../../components/Sidebar/Sidebar";
import UpcomingInterviews from "../Interviews/Upcominginterviews";
import UserNavbar from "../Navbar/UserNavbar";
import AnnouncementBanner from "../../../components/Announcement/AnnouncementBanner";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const dashboardData = await getStudentdashboard();
        if (!active) return;
        setDashboard(dashboardData);

        const applicationsData = await getStudentApplications();
        if (!active) return;

        if (Array.isArray(applicationsData)) {
          setApplications(applicationsData);
        } else if (Array.isArray(applicationsData?.data)) {
          setApplications(applicationsData.data);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        if (active) {
          setError(err.message || "Unable to load dashboard");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  let storedUser = {};

  try {
    storedUser = JSON.parse(localStorage.getItem("careertrack_user") || "{}");
  } catch {
    storedUser = {};
  }

  const studentname =
    storedUser?.name || storedUser?.fullName || "Student";

  return (
    <div className="min-h-screen bg-[#f8f7fc] text-slate-800">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)]">
        {/* SIDEBAR */}
        <aside className="sticky top-0 z-40 hidden h-screen md:block">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </aside>

        {/* MAIN COLUMN */}
        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 w-full border-b border-violet-100/80 bg-white/90 shadow-[0_4px_20px_-18px_rgba(76,29,149,0.6)] backdrop-blur-xl">
            <UserNavbar />
          </header>

          <main className="min-w-0 flex-1 !p-4 sm:!p-6 xl:!p-8">
            <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-7">
              {loading ? (
                <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-[28px] border border-violet-100 bg-white !p-8 shadow-sm">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
                    <div className="absolute inset-0 animate-ping rounded-2xl bg-violet-200/50" />
                    <RefreshCw size={26} className="relative animate-spin text-violet-600" />
                  </div>
                  <h2 className="mt-5 text-lg font-extrabold text-slate-900">
                    Getting your career space ready
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Gathering your applications and opportunities…
                  </p>
                </div>
              ) : error ? (
                <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-[28px] border border-red-100 bg-white !p-8 text-center shadow-sm">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <RefreshCw size={24} />
                  </div>
                  <h2 className="mt-4 text-xl font-extrabold text-slate-900">
                    Unable to load dashboard
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 !px-5 !py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
                  >
                    <RefreshCw size={16} />
                    Try again
                  </button>
                </div>
              ) : (
                <>
                  {/* 1. WELCOME */}
                  <section className="min-w-0">
                    <WelcomeBanner studentname={studentname} />
                  </section>

                  <div className="mb-6">
                    <AnnouncementBanner role="STUDENT" />
                  </div>

                  {/* 2. STATS */}
                  <section className="min-w-0">
                    <StatsGrid dashboard={dashboard} />
                  </section>

                  {/* 3. APPLICATIONS */}
                  <section className="min-w-0">
                    <div className="grid min-w-0 grid-cols-1 items-stretch gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)]">
                      <div className="min-w-0">
                        <ApplicationOverview applications={applications} />
                      </div>
                      <div className="min-w-0">
                        <RecentApplications
                          applications={dashboard?.recentApplications || []}
                        />
                      </div>
                    </div>
                  </section>

                  {/* 4. RECOMMENDED JOBS */}
                  <section className="min-w-0">
                    <RecommendedJobs jobs={dashboard?.recommendedJobs || []} />
                  </section>

                  {/* 5. QUICK ACTIONS + INTERVIEWS */}
                  <section className="min-w-0">
                    <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-2">
                      <div className="min-w-0">
                        <QuickActions />
                      </div>
                      <div className="min-w-0">
                        <UpcomingInterviews dashboard={dashboard} />
                      </div>
                    </div>
                  </section>

                  {/* 6. CAREER TIP */}
                  <section className="group relative overflow-hidden rounded-[28px] border border-violet-100/80 bg-gradient-to-br from-violet-100 via-white to-fuchsia-50 !p-5 shadow-sm transition duration-300 hover:shadow-lg hover:shadow-violet-100/70 sm:!p-7">
                    <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-fuchsia-200/40 blur-3xl transition group-hover:bg-violet-200/60" />
                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200 transition duration-300 group-hover:rotate-3 group-hover:scale-105">
                        <TrendingUp size={26} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
                          <Sparkles size={14} />
                          A little career reminder
                        </div>
                        <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                          Small steps. Big dreams.
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                          Keep your profile updated, practice consistently,
                          and take the next step in your career journey. Every
                          improvement brings you closer to your dream job.
                        </p>
                      </div>

                      <a
                        href="/student/profile"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white !px-4 !py-3 text-sm font-bold text-violet-700 shadow-sm ring-1 ring-violet-100 transition hover:-translate-y-0.5 hover:bg-violet-600 hover:text-white"
                      >
                        Improve profile
                        <ArrowUpRight size={16} />
                      </a>
                    </div>
                  </section>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

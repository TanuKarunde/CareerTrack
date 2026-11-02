
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  FileText,
  Users,
  UserRound,
  BriefcaseBusiness,
  Briefcase,
  Target,
  CalendarDays,
  BrainCircuit,
  FileSearch,
  Building2,
  MessageCircle,
  ChevronRight,
  Trophy,
  ClipboardCheck,
  Bell,
  PlusCircle,
  Crown,
  LockKeyhole,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/authContext";
import { apiRequest } from "../../services/api";
import Logout from "../../pages/Auth/Logout/Logout";

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  const [usage, setUsage] = useState(null);
  const [usageChecked, setUsageChecked] = useState(false);

  const isPremium = usage?.isPremium === true;

  useEffect(() => {
    let cancelled = false;

    const fetchFeatureUsage = async () => {
      if (role !== "STUDENT") {
        setUsage(null);
        setUsageChecked(true);
        return;
      }

      setUsageChecked(false);

      try {
        const data = await apiRequest("/feature-usage/status");

        if (!cancelled) {
          setUsage(data);
        }
      } catch (error) {
        console.error("Unable to fetch feature usage:", error);

        if (!cancelled) {
          setUsage(null);
        }
      } finally {
        if (!cancelled) {
          setUsageChecked(true);
        }
      }
    };

    fetchFeatureUsage();

    return () => {
      cancelled = true;
    };
  }, [role]);

  const studentMenu = [
    {
      section: "OVERVIEW",
      items: [
        {
          label: "Dashboard",
          path: "/student/dashboard",
          icon: LayoutDashboard,
          end: true,
        },
        {
          label: "My Profile",
          path: "/student/profile",
          icon: UserRound,
        },
      ],
    },
    {
      section: "CAREER OPPORTUNITIES",
      items: [
        {
          label: "Browse Jobs",
          path: "/student/jobs",
          icon: Briefcase,
          end: true,
        },
        {
          label: "My Applications",
          path: "/student/applications",
          icon: FileText,
          end: true,
        },
      ],
    },
    {
      section: "PREPARATION & GROWTH",
      items: [
        {
          label: "Job Readiness",
          path: "/student/jobs/1/readiness",
          icon: ClipboardCheck,
        },
        {
          label: "Mission Control",
          path: "/student/mission-control",
          icon: Target,
        },
        {
          label: "Interview Preparation",
          path: "/student/interview-prep",
          icon: BrainCircuit,
          end: true,
          premium: true,
          usageKey: "interview",
        },
        {
          label: "My Interviews",
          path: "/student/interviews",
          icon: CalendarDays,
        },
        {
          label: "Resume Analyzer",
          path: "/student/resume-analyzer",
          icon: FileSearch,
          premium: true,
          usageKey: "resume",
        },
        {
          label: "Practice Scoreboard",
          path: "/student/interview-prep/scoreboard",
          icon: Trophy,
        },
      ],
    },
    {
      section: "COMMUNICATION",
      items: [
        {
          label: "Chat",
          path: "/student/chat",
          icon: MessageCircle,
        },
        {
          label: "Notifications",
          path: "/notifications",
          icon: Bell,
        },
      ],
    },
  ];

  const employerMenu = [
    {
      section: "OVERVIEW",
      items: [
        {
          label: "Dashboard",
          path: "/employer/dashboard",
          icon: LayoutDashboard,
          end: true,
        },
      ],
    },
    {
      section: "TALENT MANAGEMENT",
      items: [
        {
          label: "My Jobs",
          path: "/employer/jobs",
          icon: Briefcase,
          end: true,
        },
        {
          label: "Create Job",
          path: "/employer/jobs/create",
          icon: PlusCircle,
        },
        {
          label: "Applicants",
          path: "/employer/applicants",
          icon: Users,
          end: true,
        },
        {
          label: "Interviews",
          path: "/employer/interviews",
          icon: CalendarDays,
        },
        {
          label: "Smart Candidate Match",
          path: "/employer/jobs",
          icon: Target,
          end: true,
        },
      ],
    },
    {
      section: "COMPANY & ACCOUNT",
      items: [
        {
          label: "Company Profile",
          path: "/employer/companyprofile",
          icon: Building2,
        },
        {
          label: "My Profile",
          path: "/employer/profile",
          icon: UserRound,
        },
      ],
    },
    {
      section: "COMMUNICATION",
      items: [
        {
          label: "Notifications",
          path: "/notifications",
          icon: Bell,
        },
      ],
    },
  ];

  const isStudent = role === "STUDENT";

  const getRemainingUses = (item) => {
    if (!usage || !item.usageKey) return null;

    if (item.usageKey === "interview") {
      return usage.interviewRemaining;
    }

    if (item.usageKey === "resume") {
      return usage.resumeRemaining;
    }

    return null;
  };

  const getLinkClass = (isActive, extra = "") =>
    `group relative flex items-center gap-3 !pl-7 !pr-3 !py-3 font-medium transition-all duration-200 ${
      isActive
        ? "bg-white !text-[#0A1931] font-semibold rounded-l-none"
        : "mx-3 rounded-xl text-slate-300 hover:bg-white/20 hover:text-white"
    } ${extra}`;

  const renderMenuItems = (items) =>
    items.map((item) => {
      const Icon = item.icon;

      const isPremiumFeature =
        isStudent && item.premium === true;

      const remaining = getRemainingUses(item);

      // -1 means unlimited access for an active Premium subscription.
      const hasUnlimitedAccess =
        isPremiumFeature && isPremium;

      const hasFreeUses =
        isPremiumFeature &&
        typeof remaining === "number" &&
        remaining > 0;

      // Keep feature links unavailable while the usage API is loading
      // or if it fails; retry by refreshing the page.
      const isLocked =
        isPremiumFeature &&
        (
          !usageChecked ||
          !usage ||
          (!hasUnlimitedAccess && !hasFreeUses)
        );

      const destination = isLocked
        ? "/student/premium"
        : item.path;

      const showRemaining =
        isPremiumFeature &&
        usageChecked &&
        usage &&
        !isPremium &&
        typeof remaining === "number" &&
        remaining > 0;

      return (
        <NavLink
          key={item.path + item.label}
          to={destination}
          end={isLocked ? true : item.end}
          className={({ isActive }) =>
            getLinkClass(isActive, "text-[13px]")
          }
          title={
            isLocked
              ? "View Premium plans"
              : item.label
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                size={18}
                strokeWidth={isActive ? 2.3 : 1.8}
                className={
                  isActive
                    ? "!text-[#0A1931]"
                    : "text-slate-400 transition-colors group-hover:text-white"
                }
              />

              <span className="flex-1">
                {item.label}
              </span>

              {showRemaining && (
                <span
                  className={`shrink-0 rounded-md !px-1.5 !py-0.5 text-[10px] font-bold ${
                    isActive
                      ? "bg-violet-100 text-violet-700"
                      : "bg-white/10 text-slate-200"
                  }`}
                  title="Free attempts remaining"
                >
                  {remaining} left
                </span>
              )}

              {isPremiumFeature &&
                (isLocked ? (
                  <LockKeyhole
                    size={14}
                    className="shrink-0 text-amber-300"
                    aria-label="Premium required or usage status unavailable"
                  />
                ) : isPremium ? (
                  <Crown
                    size={15}
                    className="shrink-0 text-amber-300"
                    aria-label="Unlimited Premium access"
                  />
                ) : null)}

              {isActive && (
                <ChevronRight
                  size={15}
                  className="!text-[#0A1931]"
                />
              )}
            </>
          )}
        </NavLink>
      );
    });

  return (
    <aside className="sticky top-0 h-screen w-63 shrink-0 bg-[#0A1931]">
      <nav className="scrollbar-hide flex h-screen flex-col overflow-y-auto border-r border-white/10 bg-[#0A1931] !p-0 !py-5 text-white">

        {/* Brand */}
        <NavLink
          to={
            isStudent
              ? "/student/dashboard"
              : "/employer/dashboard"
          }
          className="mb-8 flex shrink-0 items-center gap-3 !px-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 shadow-lg shadow-violet-500/20">
            <BriefcaseBusiness size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-wide">
              CareerTrack
            </h1>

            <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-slate-400">
              Track. Prepare. Get Hired.
            </p>
          </div>
        </NavLink>

        {/* Student Navigation */}
        {isStudent ? (
          <div className="flex-1 space-y-6">
            {studentMenu.map((group) => (
              <div key={group.section}>
                <p className="mb-2 !px-3 text-[10px] font-bold tracking-[1.8px] text-slate-500">
                  {group.section}
                </p>

                <div className="space-y-1">
                  {renderMenuItems(group.items)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Employer Navigation */
          <div className="flex-1 space-y-6">
            {employerMenu.map((group) => (
              <div key={group.section}>
                <p className="mb-2 !px-3 text-[10px] font-bold tracking-[1.8px] text-slate-500">
                  {group.section}
                </p>

                <div className="space-y-1">
                  {renderMenuItems(group.items)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Premium plan shortcut */}
        {isStudent && (
          <div className="mt-8 mb-3 rounded-xl border border-violet-300/20 bg-violet-500/10 !p-3">
            <div className="flex items-center gap-2">
              <Crown size={17} className="text-amber-300" />

              <span className="text-xs font-semibold text-white">
                {isPremium ? "Premium Active" : "CareerTrack Premium"}
              </span>
            </div>

            <p className="mt-1 text-[11px] leading-5 text-slate-300">
              {isPremium
                ? "Enjoy unlimited interview and resume analysis."
                : "Unlock unlimited interview practice and resume analysis."}
            </p>

            {!isPremium && (
              <NavLink
                to="/student/premium"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-violet-300 hover:text-white"
              >
                Explore plans
                <ChevronRight size={13} />
              </NavLink>
            )}
          </div>
        )}

        {/* Logout */}
        <div className="mt-2 shrink-0 border-t border-white/10 !pt-4">
          <Logout />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

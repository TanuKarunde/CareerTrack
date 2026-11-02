
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FileText,
  UserRound,
  GraduationCap,
  Zap,
  Sparkles,
} from "lucide-react";

const actions = [
  {
    title: "Find Jobs",
    description: "Explore new opportunities",
    link: "/student/jobs",
    Icon: BriefcaseBusiness,
    iconStyle: "bg-violet-100 text-violet-700",
    hoverStyle: "hover:border-violet-200 hover:bg-violet-50/70",
    accent: "bg-violet-500",
  },
  {
    title: "My Applications",
    description: "Track your applications",
    link: "/student/applications",
    Icon: FileText,
    iconStyle: "bg-blue-100 text-blue-700",
    hoverStyle: "hover:border-blue-200 hover:bg-blue-50/70",
    accent: "bg-blue-500",
  },
  {
    title: "My Profile",
    description: "Update your career profile",
    link: "/student/profile",
    Icon: UserRound,
    iconStyle: "bg-emerald-100 text-emerald-700",
    hoverStyle: "hover:border-emerald-200 hover:bg-emerald-50/70",
    accent: "bg-emerald-500",
  },
  {
    title: "Interview Preparation",
    description: "Prepare for your next interview",
    link: "/student/interview-prep",
    Icon: GraduationCap,
    iconStyle: "bg-amber-100 text-amber-700",
    hoverStyle: "hover:border-amber-200 hover:bg-amber-50/70",
    accent: "bg-amber-500",
  },
];

const QuickActions = () => {
  return (
    <section className="group relative min-w-0 overflow-hidden rounded-[28px] border border-violet-100/80 bg-white !p-5 shadow-[0_8px_35px_-22px_rgba(109,40,217,0.35)] transition duration-300 hover:shadow-[0_18px_45px_-25px_rgba(109,40,217,0.4)] sm:!p-6">
      <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-violet-100/70 blur-3xl transition duration-500 group-hover:bg-fuchsia-100/80" />

      {/* HEADER */}
      <div className="relative mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
            <Zap size={21} />
          </div>

          <div className="min-w-0">
            <h2 className="font-extrabold tracking-tight text-slate-900">
              Quick Actions
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Your next step starts here
            </p>
          </div>
        </div>

        <span className="hidden items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 !px-2.5 !py-1.5 text-[10px] font-bold uppercase tracking-wide text-violet-700 sm:inline-flex">
          <Sparkles size={12} />
          Get moving
        </span>
      </div>

      {/* ACTION CARDS */}
      <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.Icon;

          return (
            <a
              key={action.title}
              href={action.link}
              className={`group/action relative flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/60 !p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${action.hoverStyle}`}
            >
              {/* Accent bar */}
              <span
                className={`absolute bottom-3 left-0 top-3 w-[3px] origin-center scale-y-0 rounded-r-full ${action.accent} transition-transform duration-300 group-hover/action:scale-y-100`}
              />

              {/* ICON */}
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${action.iconStyle} shadow-sm ring-1 ring-white transition duration-300 group-hover/action:rotate-3 group-hover/action:scale-110`}
              >
                <Icon size={20} strokeWidth={2.1} />
              </div>

              {/* TEXT */}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-extrabold leading-5 text-slate-800 transition group-hover/action:text-violet-800">
                  {action.title}
                </h3>
                <p className="mt-1 text-xs leading-4 text-slate-500">
                  {action.description}
                </p>
              </div>

              {/* ARROW */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-100 transition duration-300 group-hover/action:bg-violet-600 group-hover/action:text-white group-hover/action:ring-violet-600">
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover/action:-translate-y-0.5 group-hover/action:translate-x-0.5"
                />
              </div>
            </a>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="relative mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-50 to-fuchsia-50 !px-3 !py-3">
        <Sparkles size={16} className="shrink-0 text-violet-600" />
        <p className="text-xs leading-5 text-slate-600">
          Small actions today can create big opportunities tomorrow.
        </p>
      </div>
    </section>
  );
};

export default QuickActions;

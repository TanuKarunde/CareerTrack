
import { useMemo } from "react";
import {
  ChartNoAxesCombined,
  Sparkles,
  ArrowUpRight,
  Target,
} from "lucide-react";

const COLORS = ["#7c3aed", "#10b981", "#a855f7", "#f59e0b", "#f43f5e"];

const ApplicationOverview = ({ applications = [] }) => {
  const applicationData = useMemo(() => {
    const statuses = [
      { name: "Applied", status: "APPLIED" },
      { name: "Shortlisted", status: "SHORTLISTED" },
      { name: "Interview", status: "INTERVIEW" },
      { name: "Selected", status: "SELECTED" },
      { name: "Rejected", status: "REJECTED" },
    ];

    return statuses.map((item) => ({
      ...item,
      value: applications.filter(
        (app) => String(app?.status || "").toUpperCase() === item.status
      ).length,
    }));
  }, [applications]);

  const total = applications.length;
  const radius = 67;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  const successCount =
    applicationData.find((item) => item.status === "SELECTED")?.value || 0;

  return (
    <section className="group relative h-full min-w-0 overflow-hidden rounded-[28px] border border-violet-100/80 bg-white !p-5 shadow-[0_8px_35px_-22px_rgba(109,40,217,0.35)] transition duration-300 hover:shadow-[0_18px_45px_-25px_rgba(109,40,217,0.45)] sm:!p-6">
      <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-fuchsia-100/60 blur-3xl transition duration-500 group-hover:bg-violet-200/70" />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
            <ChartNoAxesCombined size={21} />
          </div>
          <div className="min-w-0">
            <h2 className="font-extrabold tracking-tight text-slate-900">
              Application Progress
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Your career journey at a glance
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-violet-100 bg-violet-50 !px-2.5 !py-1 text-[10px] font-bold uppercase tracking-wide text-violet-700">
          <Target size={12} /> Overview
        </span>
      </div>

      <div className="relative mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-around xl:flex-col 2xl:flex-row">
        <div className="relative h-[190px] w-[190px] shrink-0 transition-transform duration-500 group-hover:scale-[1.03]">
          <svg
            viewBox="0 0 180 180"
            className="h-full w-full -rotate-90"
            role="img"
            aria-label={`${total} total applications`}
          >
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#f3efff"
              strokeWidth="13"
            />

            {total > 0 &&
              applicationData.map((item, index) => {
                if (!item.value) return null;

                const segmentLength = (item.value / total) * circumference;
                const dashOffset = -currentOffset;
                currentOffset += segmentLength;

                return (
                  <circle
                    key={item.name}
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke={COLORS[index]}
                    strokeWidth="11"
                    strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                );
              })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black tracking-tight text-slate-900">
              {total}
            </span>
            <span className="mt-1 text-xs font-medium text-slate-500">
              Total applications
            </span>
            <span className="mt-2 rounded-full bg-violet-50 !px-2.5 !py-1 text-[10px] font-bold text-violet-700">
              Keep going!
            </span>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-2.5">
          {applicationData.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-3 rounded-xl !px-3 !py-2.5 transition hover:bg-violet-50/80"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="h-3 w-3 shrink-0 rounded-full ring-4 ring-slate-50"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="truncate text-sm font-medium text-slate-600">
                  {item.name}
                </span>
              </div>
              <span className="min-w-8 rounded-lg bg-slate-50 !px-2 !py-1 text-center text-sm font-extrabold tabular-nums text-slate-900">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-5 flex items-start gap-3 rounded-2xl border border-violet-100/80 bg-gradient-to-r from-violet-50 via-white to-fuchsia-50 !p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
          <Sparkles size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-800">
            {total === 0
              ? "Your story starts with one application"
              : successCount > 0
                ? "You're making progress!"
                : "Your next opportunity is out there"}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {total === 0
              ? "Explore roles that match your goals and take your first step."
              : "Keep applying to relevant roles and check your application status regularly."}
          </p>
        </div>
        <ArrowUpRight size={16} className="mt-1 shrink-0 text-violet-500" />
      </div>
    </section>
  );
};

export default ApplicationOverview;

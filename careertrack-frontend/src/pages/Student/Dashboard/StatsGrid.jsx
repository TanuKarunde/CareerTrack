
import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Star,
  Sparkles,
} from "lucide-react";

import StatsCard from "./StatsCard";
import { getUpcomingInterviews } from "../../../services/dashboardService";

const StatsGrid = ({ dashboard }) => {
  const [interviewCount, setInterviewCount] = useState(0);

  useEffect(() => {
    let active = true;

    getUpcomingInterviews()
      .then((data) => {
        if (active) {
          setInterviewCount(Array.isArray(data) ? data.length : 0);
        }
      })
      .catch((error) => {
        console.error("Failed to load interview count:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = [
    {
      title: "Applications",
      value: dashboard?.totalApplications ?? 0,
      description: "Jobs you've applied to",
      icon: FileText,
      theme: "violet",
    },
    {
      title: "Shortlisted",
      value: dashboard?.shortlisted ?? 0,
      description: "You're on their radar",
      icon: Star,
      theme: "emerald",
    },
    {
      title: "Interviews",
      value: interviewCount,
      description: "Upcoming interviews",
      icon: CalendarDays,
      theme: "blue",
    },
    {
      title: "Selected",
      value: dashboard?.selected ?? 0,
      description: "Celebrate your progress",
      icon: CheckCircle2,
      theme: "amber",
    },
  ];

  return (
    <section className="min-w-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-slate-900">
            Your career snapshot
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            A quick look at how things are moving
          </p>
        </div>

        <div className="hidden items-center gap-1.5 rounded-full border border-violet-100 bg-white !px-3 !py-2 text-xs font-semibold text-violet-700 sm:inline-flex">
          <Sparkles size={14} />
          Your progress
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  );
};

export default StatsGrid;

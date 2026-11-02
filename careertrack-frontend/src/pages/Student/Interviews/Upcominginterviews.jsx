
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Video,
  CalendarCheck,
  Sparkles,
  BriefcaseBusiness,
} from "lucide-react";

import { getUpcomingInterviews } from "../../../services/dashboardService";

const UpcomingInterviews = ({ dashboard }) => {
  const [interviews, setInterviews] = useState(
    dashboard?.upcomingInterviews || []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadInterviews = async () => {
      try {
        const data = await getUpcomingInterviews();

        if (active) {
          setInterviews(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to load upcoming interviews:", error);
        if (active) setInterviews([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInterviews();

    return () => {
      active = false;
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "Date to be confirmed";

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "Date to be confirmed";

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return null;
    return String(time).slice(0, 5);
  };

  return (
    <section className="group flex h-[380px] min-w-0 flex-col overflow-hidden rounded-[28px] border border-violet-100/80 bg-white !p-5 shadow-[0_8px_35px_-22px_rgba(109,40,217,0.35)] transition duration-300 hover:shadow-[0_18px_45px_-25px_rgba(109,40,217,0.4)]">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
            <CalendarDays size={21} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate font-extrabold tracking-tight text-slate-900">
              Upcoming Interviews
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Be ready for your big moment
            </p>
          </div>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition duration-300 group-hover:rotate-6 group-hover:bg-fuchsia-50 group-hover:text-fuchsia-600">
          <Sparkles size={17} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:#ddd6fe_transparent]">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-violet-100/70 !p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-violet-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 rounded-full bg-violet-100" />
                    <div className="h-2.5 w-1/2 rounded-full bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : interviews.length === 0 ? (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 !px-4 !py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
              <CalendarCheck size={26} />
            </div>

            <p className="mt-4 text-sm font-extrabold text-slate-800">
              No upcoming interviews
            </p>

            <p className="mt-2 max-w-[230px] text-xs leading-5 text-slate-500">
              Your next opportunity could be just around the corner. Keep an
              eye on your applications.
            </p>

            <a
              href="/student/applications"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white !px-3 !py-2 text-xs font-bold text-violet-700 shadow-sm ring-1 ring-violet-100 transition hover:bg-violet-600 hover:text-white hover:ring-violet-600"
            >
              Track applications <ArrowUpRight size={14} />
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {interviews.slice(0, 3).map((interview) => (
              <div
                key={interview.id}
                className="group/card rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-violet-50/40 !p-3 transition duration-300 hover:border-violet-200 hover:shadow-md hover:shadow-violet-100/60"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700 ring-1 ring-violet-100 transition group-hover/card:scale-105">
                    <BriefcaseBusiness size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="min-w-0 flex-1 break-words text-sm font-extrabold leading-5 text-slate-800">
                        {interview.jobTitle || "Interview"}
                      </h3>

                      <span className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 !px-2 !py-1 text-[10px] font-bold text-emerald-700">
                        {interview.status || "Scheduled"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays
                          size={13}
                          className="shrink-0 text-violet-600"
                        />
                        {formatDate(interview.interviewDate)}
                      </span>

                      {interview.interviewTime && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3
                            size={13}
                            className="shrink-0 text-violet-600"
                          />
                          {formatTime(interview.interviewTime)}
                        </span>
                      )}
                    </div>

                    {interview.meetingLink && (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 !px-3 !py-2.5 text-xs font-bold text-white shadow-sm shadow-violet-200 transition duration-200 hover:from-violet-700 hover:to-fuchsia-600"
                      >
                        <Video size={14} />
                        Join interview
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <a
              href="/student/interviews"
              className="flex items-center justify-center gap-1.5 rounded-xl !py-2 text-xs font-bold text-violet-600 transition hover:bg-violet-50 hover:text-violet-800"
            >
              View all interviews <ArrowUpRight size={14} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingInterviews;

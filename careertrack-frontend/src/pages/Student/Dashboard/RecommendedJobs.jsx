
import {
  ArrowUpRight,
  BriefcaseBusiness,
  MapPin,
  Sparkles,
  Building2,
} from "lucide-react";

const RecommendedJobs = ({ jobs = [] }) => {
  const list = Array.isArray(jobs) ? jobs : [];

  return (
    <section className="group relative overflow-hidden rounded-[28px] border border-violet-100/80 bg-white !p-5 shadow-[0_8px_35px_-22px_rgba(109,40,217,0.35)] transition duration-300 hover:shadow-[0_18px_45px_-25px_rgba(109,40,217,0.4)] sm:!p-6">
      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-fuchsia-100/60 blur-3xl" />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
            <Sparkles size={21} />
          </div>
          <div className="min-w-0">
            <h2 className="font-extrabold tracking-tight text-slate-900">
              Recommended Jobs
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Opportunities to explore next
            </p>
          </div>
        </div>

        <a
          href="/student/jobs"
          className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-violet-50 !px-3 !py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-600 hover:text-white"
        >
          View all <ArrowUpRight size={14} />
        </a>
      </div>

      {list.length === 0 ? (
        <div className="relative my-6 rounded-2xl border border-dashed border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 !px-4 !py-9 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
            <BriefcaseBusiness size={25} />
          </div>
          <p className="mt-4 text-sm font-extrabold text-slate-800">
            Your next opportunity awaits
          </p>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
            Complete your profile and explore available roles to find a suitable match.
          </p>
          <a
            href="/student/jobs"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 !px-4 !py-2.5 text-xs font-bold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5"
          >
            Explore jobs <ArrowUpRight size={15} />
          </a>
        </div>
      ) : (
        <div className="relative mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {list.slice(0, 4).map((job, index) => {
            const id = job?.id ?? job?.jobId;
            const title = job?.title ?? job?.jobTitle ?? "Job opportunity";
            const company = job?.company ?? job?.companyName ?? "Company";
            const location = job?.location ?? "Location not specified";
            const type = job?.jobType ?? job?.employmentType;

            return (
              <a
                key={id ?? `${title}-${index}`}
                href={id != null ? `/student/jobs/${id}` : "/student/jobs"}
                className="group/card relative flex min-w-0 items-start gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-violet-50/40 !p-4 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/70"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700 ring-1 ring-violet-100 transition duration-300 group-hover/card:scale-105 group-hover/card:rotate-3">
                  <BriefcaseBusiness size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-extrabold text-slate-800 transition group-hover/card:text-violet-700">
                    {title}
                  </h3>
                  <p className="mt-1 flex min-w-0 items-center gap-1.5 truncate text-xs font-medium text-slate-500">
                    <Building2 size={12} className="shrink-0" />
                    <span className="truncate">{company}</span>
                  </p>
                  <p className="mt-2 flex min-w-0 items-center gap-1.5 text-xs text-slate-400">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{location}</span>
                  </p>
                  {type && (
                    <span className="mt-3 inline-flex rounded-full border border-violet-100 bg-violet-50 !px-2.5 !py-1 text-[10px] font-bold uppercase tracking-wide text-violet-700">
                      {String(type).replaceAll("_", " ")}
                    </span>
                  )}
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-100 transition group-hover/card:bg-violet-600 group-hover/card:text-white group-hover/card:ring-violet-600">
                  <ArrowUpRight size={16} />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecommendedJobs;

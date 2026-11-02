
import { useState } from "react";
import {
  ArrowUpRight,
  FileText,
  MapPin,
  BriefcaseBusiness,
  Clock3,
} from "lucide-react";
import ApplicationStatus from "../Applications/ApplicationStatus";

const RecentApplications = ({ applications = [] }) => {
  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="group h-full min-w-0 overflow-hidden rounded-[28px] border border-violet-100/80 bg-white !p-5 shadow-[0_8px_35px_-22px_rgba(109,40,217,0.35)] transition duration-300 hover:shadow-[0_18px_45px_-25px_rgba(109,40,217,0.4)] sm:!p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-violet-200">
            <FileText size={21} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate font-extrabold tracking-tight text-slate-900">
              Recent Applications
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Your latest career moves
            </p>
          </div>
        </div>

        <a
          href="/student/applications"
          className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-violet-50 !px-3 !py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-600 hover:text-white"
        >
          View all <ArrowUpRight size={14} />
        </a>
      </div>

      {applications.length === 0 ? (
        <div className="my-6 rounded-2xl border border-dashed border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 !px-4 !py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
            <BriefcaseBusiness size={25} />
          </div>
          <h3 className="mt-4 text-sm font-extrabold text-slate-800">
            Your next chapter starts here
          </h3>
          <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">
            Once you apply for a role, you can track its progress right here.
          </p>
          <a
            href="/student/jobs"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 !px-4 !py-2.5 text-xs font-bold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Explore opportunities <ArrowUpRight size={15} />
          </a>
        </div>
      ) : (
        <div className="mt-5">
          {applications.slice(0, 4).map((application) => {
            const job = application?.job || {};
            const company = job?.company || "Company";

            return (
              <div
                key={application.id}
                className="group/row flex flex-col gap-3 border-t border-slate-100 !py-4 transition first:border-t-0 hover:rounded-2xl hover:bg-violet-50/60 sm:flex-row sm:items-center sm:gap-4 sm:!px-2"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <CompanyLogo logo={job?.logo} company={company} />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-extrabold text-slate-800 transition group-hover/row:text-violet-700">
                      {job?.title || "Job"}
                    </h3>
                    <p className="mt-1 truncate text-xs font-medium text-slate-500">
                      {company}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate">
                        {job?.location || "Location not specified"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                    <Clock3 size={12} />
                    {formatDate(application?.appliedAt)}
                  </span>
                  <ApplicationStatus status={application?.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

const CompanyLogo = ({ logo, company }) => {
  const [imageError, setImageError] = useState(false);

  if (!logo || imageError) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 via-indigo-50 to-fuchsia-100 text-base font-black text-violet-700 ring-1 ring-violet-100 transition duration-300 group-hover/row:scale-105">
        {company?.charAt(0)?.toUpperCase() || "C"}
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-violet-100 bg-white !p-1.5">
      <img
        src={`http://localhost:8080${logo}`}
        alt={`${company} logo`}
        className="h-full w-full object-contain"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default RecentApplications;

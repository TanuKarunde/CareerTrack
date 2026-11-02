
import {
  BriefcaseBusiness,
  Target,
  CheckCircle2,
  XCircle,
  MapPin,
  Building2,
  TrendingUp,
  Sparkles,
  GraduationCap,
  FolderKanban,
  Award,
  Code2,
  ArrowUpRight,
} from "lucide-react";

const clampScore = (value) => {
  const score = Number(value);
  return Number.isFinite(score)
    ? Math.max(0, Math.min(100, score))
    : 0;
};

const getScoreStyle = (score) => {
  if (score > 75) {
    return {
      text: "text-emerald-700",
      badge: "bg-emerald-50",
      bar: "from-emerald-400 to-teal-500",
      label: "Strong match",
    };
  }

  if (score >= 60) {
    return {
      text: "text-blue-700",
      badge: "bg-blue-50",
      bar: "from-blue-400 to-indigo-500",
      label: "Moderate match",
    };
  }

  return {
    text: "text-slate-600",
    badge: "bg-slate-100",
    bar: "from-slate-400 to-slate-500",
    label: "Lower match",
  };
};

const breakdownItems = [
  { key: "roleScore", label: "Role relevance", icon: Target },
  { key: "skillsScore", label: "Skills", icon: Code2 },
  { key: "experienceScore", label: "Experience", icon: BriefcaseBusiness },
  { key: "educationScore", label: "Education", icon: GraduationCap },
  { key: "projectsScore", label: "Projects", icon: FolderKanban },
  { key: "descriptionScore", label: "Job description", icon: Sparkles },
  { key: "certificationsScore", label: "Certifications", icon: Award },
  { key: "locationScore", label: "Location", icon: MapPin },
];

const SkillChips = ({ skills, tone = "green" }) => {
  const styles =
    tone === "amber"
      ? "border-amber-100 bg-amber-50 text-amber-800"
      : "border-emerald-100 bg-emerald-50 text-emerald-700";

  if (!skills.length) {
    return (
      <p className="mt-2 text-xs leading-5 text-slate-500">
        No {tone === "amber" ? "missing" : "matching"} skills were identified.
      </p>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span
          key={`${skill}-${index}`}
          className={`rounded-lg border !px-2.5 !py-1.5 text-xs font-semibold ${styles}`}
        >
          {skill}
        </span>
      ))}
    </div>
  );
};

const RecommendedJobCard = ({ job, index }) => {
  const score = clampScore(job.jobMatchScore);
  const style = getScoreStyle(score);
  const matchedSkills = Array.isArray(job.matchedSkills) ? job.matchedSkills : [];
  const missingSkills = Array.isArray(job.missingSkills) ? job.missingSkills : [];
  const reasons = Array.isArray(job.matchReasons)
    ? job.matchReasons.filter((reason) => typeof reason === "string")
    : [];
  const breakdown = job.matchBreakdown ?? {};

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-950/[0.06]">
      <div className="border-b border-slate-100 bg-gradient-to-r from-white to-violet-50/60 !p-5 sm:!p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/15">
            <BriefcaseBusiness size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words text-base font-extrabold text-slate-900">
                {job.jobTitle || "Job opportunity"}
              </h3>

              {index === 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 !px-2.5 !py-1 text-[10px] font-extrabold text-violet-700">
                  <Sparkles size={11} />
                  TOP MATCH
                </span>
              )}
            </div>

            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-600">
              <Building2 size={15} className="shrink-0 text-slate-400" />
              {job.company || "Company not specified"}
            </p>

            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <MapPin size={14} className="shrink-0" />
              {job.jobLocation || "Location not specified"}
              {job.jobType && (
                <>
                  <span>·</span>
                  <span>{job.jobType.replaceAll("_", " ")}</span>
                </>
              )}
            </p>

            {job.experienceLevel && (
              <p className="mt-1 text-xs text-slate-500">
                Experience: {job.experienceLevel}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-100 bg-white !p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Resume compatibility
              </p>
              <p className={`mt-2 inline-flex rounded-full !px-2.5 !py-1 text-xs font-bold ${style.text} ${style.badge}`}>
                {style.label}
              </p>
            </div>

            <p className={`text-3xl font-extrabold tracking-tight ${style.text}`}>
              {score}<span className="text-base font-semibold">%</span>
            </p>
          </div>

          <div
            className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label={`${job.jobTitle || "Job"} match score`}
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-700`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-5 !p-5 sm:!p-6">
        {Object.keys(breakdown).length > 0 && (
          <details className="group/details">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl border border-violet-100 bg-violet-50/60 !p-3.5 text-sm font-bold text-violet-800 transition hover:bg-violet-50">
              <span className="inline-flex items-center gap-2">
                <TrendingUp size={17} />
                View match breakdown
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-violet-600">
                <span className="group-open/details:hidden">+</span>
                <span className="hidden group-open/details:inline">−</span>
              </span>
            </summary>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {breakdownItems
                .filter(({ key }) => breakdown[key] != null)
                .map(({ key, label, icon: Icon }) => {
                  const value = clampScore(breakdown[key]);

                  return (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 !p-3"
                    >
                      <div className="flex items-center gap-2 text-slate-500">
                        <Icon size={15} className="shrink-0 text-violet-600" />
                        <span className="text-xs">{label}</span>
                      </div>
                      <p className="mt-2 text-lg font-extrabold text-slate-800">
                        {value}<span className="text-xs font-medium text-slate-400">/100</span>
                      </p>
                    </div>
                  );
                })}
            </div>
          </details>
        )}

        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <CheckCircle2 size={17} className="text-emerald-600" />
            Matching skills
            <span className="rounded-full bg-emerald-50 !px-2 !py-0.5 text-[10px] font-bold text-emerald-700">
              {matchedSkills.length}
            </span>
          </h4>
          <SkillChips skills={matchedSkills} tone="green" />
        </div>

        {missingSkills.length > 0 && (
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <XCircle size={17} className="text-amber-600" />
              Skills to develop
            </h4>
            <SkillChips skills={missingSkills} tone="amber" />
          </div>
        )}

        {reasons.length > 0 && (
          <div className="border-t border-slate-100 !pt-4">
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Sparkles size={16} className="text-violet-600" />
              Why this job fits
            </h4>
            <ul className="mt-3 space-y-3">
              {reasons.map((reason, reasonIndex) => (
                <li
                  key={`${job.jobId}-${reasonIndex}`}
                  className="flex items-start gap-2.5 text-sm leading-5 text-slate-600"
                >
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-violet-500" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-slate-100 !pt-4 text-xs leading-5 text-slate-400">
          <ArrowUpRight size={15} className="shrink-0" />
          Match scores are estimates, not guarantees of selection.
        </div>
      </div>
    </article>
  );
};

const JobMatchSection = ({ report }) => {
  if (!report) return null;

  const recommendedJobs = Array.isArray(report.recommendedJobs)
    ? [...report.recommendedJobs]
        .filter(
          (job) =>
            job &&
            job.jobId != null &&
            clampScore(job.jobMatchScore) >= 20
        )
        .sort(
          (a, b) =>
            clampScore(b.jobMatchScore) - clampScore(a.jobMatchScore)
        )
    : [];

  const hasSelectedJobMatch = report.jobMatchScore != null;
  if (!hasSelectedJobMatch && recommendedJobs.length === 0) return null;

  const selectedScore = clampScore(report.jobMatchScore);

  return (
    <section className="space-y-6">
      {hasSelectedJobMatch && (
        <div className="overflow-hidden rounded-[26px] border border-blue-200/80 bg-white shadow-sm">
          <div className="flex items-center gap-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 !px-5 !py-5 sm:!px-7">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20">
              <Target size={23} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold text-slate-900">Selected job match</h2>
              <p className="mt-1 truncate text-sm text-slate-600">
                {report.jobTitle || "Your selected job"}
              </p>
            </div>
          </div>

          <div className="grid gap-6 !p-5 sm:grid-cols-[180px_1fr] sm:items-center sm:!p-7">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-blue-50 to-indigo-50 !p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Match score
              </p>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-blue-700">
                {selectedScore}<span className="text-xl">%</span>
              </p>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-blue-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                  style={{ width: `${selectedScore}%` }}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <CheckCircle2 size={17} className="text-emerald-600" />
                  Matching skills
                </h3>
                <SkillChips
                  skills={Array.isArray(report.matchedSkills) ? report.matchedSkills : []}
                  tone="green"
                />
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <XCircle size={17} className="text-amber-600" />
                  Skills to develop
                </h3>
                <SkillChips
                  skills={Array.isArray(report.missingSkills) ? report.missingSkills : []}
                  tone="amber"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm">
        <div className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-r from-violet-50 via-white to-indigo-50 !px-5 !py-6 sm:!px-7">
          <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-violet-200/30 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/20">
              <Sparkles size={23} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                Recommended jobs
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Opportunities ranked by how closely they align with your resume.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-white !px-3 !py-1.5 text-xs font-extrabold text-violet-700 shadow-sm">
              {recommendedJobs.length} {recommendedJobs.length === 1 ? "JOB" : "JOBS"}
            </span>
          </div>
        </div>

        <div className="!p-5 sm:!p-7">
          {recommendedJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {recommendedJobs.map((job, index) => (
                <RecommendedJobCard key={job.jobId} job={job} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 !py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                <BriefcaseBusiness size={29} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-800">
                No job recommendations available
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                There are no active jobs with a match score of at least 20%
                available to display right now. Check again when employers
                publish new jobs.
              </p>
            </div>
          )}

          {recommendedJobs.length > 0 && (
            <p className="mt-5 text-xs leading-5 text-slate-500">
              Recommendations are based on active jobs returned by CareerTrack.
              Match scores are estimates, not guarantees of selection. Review
              each job's actual requirements before applying.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobMatchSection;

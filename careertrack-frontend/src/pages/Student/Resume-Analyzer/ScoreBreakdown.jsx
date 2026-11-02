
import {
  Code2,
  FolderKanban,
  GraduationCap,
  BriefcaseBusiness,
  ChartNoAxesColumnIncreasing,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const scoreCategories = [
  {
    key: "skillsScore",
    label: "Skills",
    description: "Technical and professional skills",
    icon: Code2,
    gradient: "from-violet-500 to-indigo-500",
    iconStyle: "bg-violet-50 text-violet-700",
  },
  {
    key: "projectsScore",
    label: "Projects",
    description: "Practical work and project outcomes",
    icon: FolderKanban,
    gradient: "from-blue-500 to-cyan-500",
    iconStyle: "bg-blue-50 text-blue-700",
  },
  {
    key: "educationScore",
    label: "Education",
    description: "Qualifications and education details",
    icon: GraduationCap,
    gradient: "from-fuchsia-500 to-violet-500",
    iconStyle: "bg-fuchsia-50 text-fuchsia-700",
  },
  {
    key: "experienceScore",
    label: "Experience",
    description: "Internships and professional experience",
    icon: BriefcaseBusiness,
    gradient: "from-emerald-500 to-teal-500",
    iconStyle: "bg-emerald-50 text-emerald-700",
  },
];

const getScoreLabel = (score) => {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs work";
};

const getScoreText = (score) => {
  if (score >= 80) return "text-emerald-700";
  if (score >= 60) return "text-blue-700";
  if (score >= 40) return "text-amber-700";
  return "text-red-700";
};

const ScoreBreakdown = ({ report }) => {
  if (!report) return null;

  const scores = scoreCategories.map((category) => {
    const rawScore = Number(report[category.key]);
    const score = Number.isFinite(rawScore)
      ? Math.max(0, Math.min(100, rawScore))
      : 0;
    return { ...category, score };
  });

  const lowest = [...scores].sort((a, b) => a.score - b.score)[0];

  return (
    <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 !px-5 !py-6 sm:flex-row sm:items-center sm:justify-between sm:!px-7">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/20">
            <ChartNoAxesColumnIncreasing size={23} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
              Score breakdown
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Explore the building blocks of your resume.
            </p>
          </div>
        </div>

        <span className="w-fit rounded-full bg-violet-50 !px-3 !py-1.5 text-xs font-bold text-violet-700">
          {scores.length} evaluation areas
        </span>
      </div>

      <div className="grid gap-4 !p-5 sm:grid-cols-2 sm:!p-7">
        {scores.map((category) => {
          const Icon = category.icon;

          return (
            <article
              key={category.key}
              className="group rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/70 !p-5 transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-950/[0.04]"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${category.iconStyle}`}
                >
                  <Icon size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    {category.label}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {category.description}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`text-2xl font-extrabold tracking-tight ${getScoreText(category.score)}`}>
                    {category.score}
                    <span className="text-xs font-semibold text-slate-400">/100</span>
                  </p>
                  <p className={`mt-1 text-[10px] font-bold uppercase tracking-wider ${getScoreText(category.score)}`}>
                    {getScoreLabel(category.score)}
                  </p>
                </div>
              </div>

              <div
                className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label={`${category.label} score`}
                aria-valuenow={category.score}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${category.gradient} transition-all duration-700`}
                  style={{ width: `${category.score}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>Performance indicator</span>
                <span>{category.score}% complete</span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="!px-5 !pb-5 sm:!px-7 sm:!pb-7">
        <div className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50 !p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
            <Sparkles size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-violet-950">
                Your next improvement opportunity
              </h3>
              <ArrowUpRight size={15} className="text-violet-600" />
            </div>
            <p className="mt-1 text-sm leading-6 text-violet-900/80">
              Start with <strong>{lowest.label.toLowerCase()}</strong>, currently
              at {lowest.score}/100. Add relevant detail and concrete examples
              where they accurately reflect your experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScoreBreakdown;


import { CheckCircle2, Target, Sparkles, TrendingUp, Award } from "lucide-react";

const getScoreStatus = (score) => {
  if (score >= 80) return { label: "Excellent", color: "text-emerald-700", background: "bg-emerald-50" };
  if (score >= 60) return { label: "Good foundation", color: "text-blue-700", background: "bg-blue-50" };
  if (score >= 40) return { label: "Room to grow", color: "text-amber-700", background: "bg-amber-50" };
  return { label: "Needs attention", color: "text-red-700", background: "bg-red-50" };
};

const ScoreRing = ({ score, label, icon: Icon }) => {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  const status = getScoreStatus(safeScore);

  return (
    <article className="group rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/70 !p-5 transition hover:border-violet-200 hover:shadow-lg hover:shadow-violet-950/[0.04] sm:!p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">{label}</h3>
          <p className="mt-0.5 text-xs text-slate-500">Out of 100 points</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <div
          className="relative flex h-40 w-40 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-[1.03]"
          style={{
            background: `conic-gradient(#7c3aed ${safeScore * 3.6}deg, #ede9fe 0deg)`,
          }}
          role="img"
          aria-label={`${label}: ${safeScore} out of 100`}
        >
          <div className="absolute inset-[9px] flex flex-col items-center justify-center rounded-full border border-white bg-white shadow-inner">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">
              {safeScore}
              <span className="text-lg font-semibold text-slate-400">%</span>
            </span>
            <span className="mt-1 text-xs text-slate-400">Your score</span>
          </div>
        </div>
      </div>

      <div className="mt-5 text-center">
        <span className={`inline-flex items-center gap-1.5 rounded-full !px-3 !py-1.5 text-xs font-bold ${status.color} ${status.background}`}>
          <CheckCircle2 size={14} />
          {status.label}
        </span>
      </div>
    </article>
  );
};

const OverallScoreCard = ({ report }) => {
  if (!report) return null;

  const overallScore = Math.max(0, Math.min(100, Number(report.overallScore) || 0));
  const atsScore = Math.max(0, Math.min(100, Number(report.atsScore) || 0));
  const status = getScoreStatus(overallScore);

  return (
    <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#211044] via-violet-800 to-indigo-700 !px-5 !py-6 text-white sm:!px-7">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-violet-200">YOUR PERFORMANCE</p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight">Resume scorecard</h2>
              <p className="mt-1 text-sm text-violet-100/75">
                A snapshot of your resume's current strengths.
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full border border-white/15 bg-white/10 !px-3 !py-1.5 text-xs font-bold text-white">
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid gap-5 !p-5 sm:grid-cols-2 sm:!p-7">
        <ScoreRing score={overallScore} label="Overall resume score" icon={Award} />
        <ScoreRing score={atsScore} label="ATS compatibility" icon={Target} />
      </div>

      <div className="!px-5 !pb-5 sm:!px-7 sm:!pb-7">
        <div className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50 !p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-violet-950">Your evaluation at a glance</h3>
            <p className="mt-1 text-sm leading-6 text-violet-900/80">
              {overallScore >= 80
                ? "Your resume has a strong score. Review the suggestions below to identify further improvements."
                : overallScore >= 60
                  ? "Your resume has a good foundation. Focus on the improvement suggestions to strengthen it further."
                  : "Review the skill gaps, formatting recommendations, and feedback below to improve your resume."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 border-t border-slate-100 !px-5 !py-5 sm:grid-cols-2 sm:!px-7">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Resume analyzed</p>
          <p className="mt-1 break-words text-sm font-semibold text-slate-800">
            {report.resumeName || "Profile resume"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Analysis date</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {report.analyzedAt ? new Date(report.analyzedAt).toLocaleString() : "Not available"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default OverallScoreCard;

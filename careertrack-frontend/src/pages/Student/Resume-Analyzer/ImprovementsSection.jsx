
import { AlertTriangle, Lightbulb, ArrowRight, Target, CheckCircle2 } from "lucide-react";

const ImprovementsSection = ({ report }) => {
  if (!report) return null;

  const rawImprovements =
    report.improvements ?? report.suggestions ?? report.recommendations ?? [];

  const improvements = Array.isArray(rawImprovements)
    ? rawImprovements
        .map((item) =>
          typeof item === "string"
            ? item
            : item?.description || item?.message || item?.suggestion || item?.title || ""
        )
        .filter(Boolean)
    : typeof rawImprovements === "string"
      ? rawImprovements.split(/\n/).map((item) => item.replace(/^[-*•\d.)\s]+/, "").trim()).filter(Boolean)
      : [];

  if (improvements.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-[26px] border border-amber-200/80 bg-white shadow-sm">
      <div className="relative overflow-hidden border-b border-amber-100 bg-gradient-to-r from-amber-50 via-white to-orange-50 !px-5 !py-6 sm:!px-7">
        <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-amber-200/30 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20">
            <Target size={23} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Areas to improve</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Practical next steps to make your resume stronger.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white !px-3 !py-1.5 text-xs font-bold text-amber-800 shadow-sm">
            {improvements.length} {improvements.length === 1 ? "suggestion" : "suggestions"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 !p-5 sm:grid-cols-2 sm:!p-7 xl:grid-cols-3">
        {improvements.map((improvement, index) => (
          <article
            key={`${improvement}-${index}`}
            className="group rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-amber-50/40 !p-5 transition duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-900/[0.05]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 transition group-hover:bg-amber-500 group-hover:text-white">
                <AlertTriangle size={19} />
              </div>
              <span className="text-xs font-extrabold tracking-wider text-amber-600">
                STEP {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-900">
              Improvement {index + 1}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{improvement}</p>

            <div className="mt-4 flex items-center gap-2 border-t border-amber-100 !pt-3 text-xs font-semibold text-amber-800">
              <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              Suggested action
            </div>
          </article>
        ))}
      </div>

      <div className="!px-5 !pb-5 sm:!px-7 sm:!pb-7">
        <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 !p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
            <Lightbulb size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-950">Turn feedback into progress</h3>
            <p className="mt-1 text-sm leading-6 text-amber-900/80">
              Prioritize relevant suggestions, update your resume with accurate
              information, and analyze it again to compare your progress.
            </p>
          </div>
          <CheckCircle2 size={18} className="mt-1 hidden shrink-0 text-amber-700 sm:block" />
        </div>
      </div>
    </section>
  );
};

export default ImprovementsSection;

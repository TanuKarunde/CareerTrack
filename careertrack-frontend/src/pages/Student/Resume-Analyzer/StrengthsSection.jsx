
import {
  CheckCircle2,
  Sparkles,
  Award,
  TrendingUp,
  Star,
} from "lucide-react";

const StrengthsSection = ({ report }) => {
  if (!report) return null;

  const rawStrengths = report.strengths ?? report.resumeStrengths ?? [];

  const strengths = Array.isArray(rawStrengths)
    ? rawStrengths
        .map((item) =>
          typeof item === "string"
            ? item
            : item?.description || item?.message || item?.title || ""
        )
        .filter(Boolean)
    : typeof rawStrengths === "string"
      ? rawStrengths
          .split(/\n/)
          .map((item) => item.replace(/^[-*•\d.)\s]+/, "").trim())
          .filter(Boolean)
      : [];

  if (strengths.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-[26px] border border-emerald-200/80 bg-white shadow-sm">
      <div className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-teal-50 !px-5 !py-6 sm:!px-7">
        <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-emerald-200/30 blur-2xl" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-600/20">
            <Award size={23} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                Your resume strengths
              </h2>
              <span className="rounded-full bg-emerald-100 !px-2.5 !py-1 text-[10px] font-bold text-emerald-800">
                WHAT'S WORKING
              </span>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Build on the qualities that already make your profile stand out.
            </p>
          </div>

          <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm sm:flex">
            <Sparkles size={21} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 !p-5 sm:grid-cols-2 sm:!p-7 xl:grid-cols-3">
        {strengths.map((strength, index) => (
          <article
            key={`${strength}-${index}`}
            className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 !p-5 transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/[0.05]"
          >
            <div className="absolute right-0 top-0 rounded-bl-2xl bg-emerald-50 !px-3 !py-2 text-[10px] font-extrabold tracking-wider text-emerald-700">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
              <CheckCircle2 size={21} />
            </div>

            <p className="mt-4 pr-3 text-sm leading-6 text-slate-700">
              {strength}
            </p>

            <div className="mt-4 flex items-center gap-1.5 border-t border-emerald-100 !pt-3 text-[11px] font-semibold text-emerald-700">
              <Star size={13} />
              Identified strength
            </div>
          </article>
        ))}
      </div>

      <div className="!px-5 !pb-5 sm:!px-7 sm:!pb-7">
        <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 !p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950">
              Make your strengths work harder
            </h3>
            <p className="mt-1 text-sm leading-6 text-emerald-900/80">
              Support these strengths with specific examples, relevant skills,
              and measurable outcomes wherever possible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrengthsSection;

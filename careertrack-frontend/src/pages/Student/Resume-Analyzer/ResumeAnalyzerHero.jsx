
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileSearch,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

const ResumeAnalyzerHero = ({ hasReport, onNewAnalysis }) => {
  return (
    <section className="relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#211044] via-violet-800 to-indigo-700 !p-6 text-white shadow-2xl shadow-violet-950/15 sm:!p-9 lg:!p-10">
      <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />

      <div className="grid items-center gap-9 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-1.5 text-xs font-bold tracking-wider text-violet-100 backdrop-blur">
            <Sparkles size={14} />
            CAREER INTELLIGENCE
          </div>

          <h1 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Your next opportunity
            <span className="mt-1 block bg-gradient-to-r from-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
              starts with insight.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-violet-100/85 sm:text-base">
            Discover your resume score, understand your strengths, identify
            missing skills, and find relevant jobs — all in one place.
          </p>

          <div className="mt-7 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: CheckCircle2, label: "ATS compatibility" },
              { icon: Target, label: "Job matching" },
              { icon: TrendingUp, label: "Actionable insights" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] !p-3 text-xs font-medium text-white/90"
              >
                <Icon size={17} className="shrink-0 text-emerald-300" />
                {label}
              </div>
            ))}
          </div>

          {hasReport && (
            <button
              type="button"
              onClick={onNewAnalysis}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white !px-5 !py-3 text-sm font-bold text-violet-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-50"
            >
              Analyze another resume
              <ArrowRight size={17} />
            </button>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-5 rounded-full bg-violet-400/20 blur-2xl" />

          <div className="relative rounded-[26px] border border-white/20 bg-white/10 !p-4 shadow-2xl backdrop-blur-xl sm:!p-5">
            <div className="flex items-center gap-3 border-b border-white/15 !pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <FileSearch size={23} />
              </div>
              <div>
                <p className="text-sm font-bold">Resume insights</p>
                <p className="mt-1 text-xs text-violet-100/70">
                  Your career, more clearly
                </p>
              </div>
              <Sparkles size={18} className="ml-auto text-amber-200" />
            </div>

            <div className="mt-5 rounded-2xl bg-white !p-4 text-slate-900 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700">
                  <BrainCircuit size={29} />
                  <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Know your potential</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Understand your skills and discover your next step.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  { label: "Skills profile", width: "82%" },
                  { label: "ATS readiness", width: "68%" },
                  { label: "Job relevance", width: "76%" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1.5 flex justify-between text-[11px] font-medium text-slate-500">
                      <span>{item.label}</span>
                      <span>Resume insight</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 !p-4">
                <Target size={20} className="text-violet-200" />
                <p className="mt-3 text-sm font-semibold">ATS insights</p>
                <p className="mt-1 text-xs text-violet-100/70">
                  Resume readability
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 !p-4">
                <Sparkles size={20} className="text-amber-200" />
                <p className="mt-3 text-sm font-semibold">Job discovery</p>
                <p className="mt-1 text-xs text-violet-100/70">
                  Relevant opportunities
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -right-2 top-1/3 hidden rounded-xl border border-white/20 bg-white !px-3 !py-2.5 text-slate-800 shadow-xl sm:block">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-emerald-500" />
              <span className="text-xs font-bold">Insights that move you forward</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeAnalyzerHero;

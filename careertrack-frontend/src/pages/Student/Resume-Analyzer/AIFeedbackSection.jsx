
import { useState } from "react";
import {
  Bot,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  MessageSquareText,
  CheckCircle2,
} from "lucide-react";

const AIFeedbackSection = ({ report }) => {
  const [expanded, setExpanded] = useState(false);

  const feedback =
    report?.aiFeedback ??
    report?.feedback ??
    report?.summary ??
    report?.overallFeedback ??
    report?.analysisSummary ??
    "";

  const text =
    typeof feedback === "string"
      ? feedback
      : feedback?.summary ?? feedback?.message ?? feedback?.feedback ?? "";

  const lines = String(text)
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s•*\-]+\s*/, "").trim())
    .filter(Boolean);

  const visibleLines = expanded ? lines : lines.slice(0, 5);
  const hasMore = lines.length > 5;

  return (
    <section className="overflow-hidden rounded-[26px] border border-violet-200/80 bg-white shadow-sm">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#211044] via-violet-800 to-indigo-700 !px-5 !py-6 text-white sm:!px-7">
        <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-fuchsia-300/20 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/3 h-20 w-20 rounded-full bg-indigo-300/20 blur-2xl" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner backdrop-blur">
            <Bot size={26} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-extrabold tracking-tight">AI resume feedback</h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 !px-2.5 !py-1 text-[10px] font-bold tracking-wide">
                <Sparkles size={11} />
                AI INSIGHTS
              </span>
            </div>
            <p className="mt-1 text-sm text-violet-100/80">
              Personalized guidance for your next career move.
            </p>
          </div>
          <Sparkles size={22} className="hidden shrink-0 text-amber-200 sm:block" />
        </div>
      </div>

      <div className="!p-5 sm:!p-7">
        {lines.length > 0 ? (
          <>
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 !p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-500 shadow-sm">
                <Lightbulb size={21} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Your personal improvement guide
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Turn these insights into clear, practical resume improvements.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {visibleLines.map((line, index) => (
                <article
                  key={`${line}-${index}`}
                  className="group flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white !p-4 transition hover:border-violet-200 hover:bg-violet-50/40"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xs font-extrabold text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <p className="flex-1 !pt-1 text-sm leading-6 text-slate-700">
                    {line}
                  </p>
                  <CheckCircle2 size={17} className="mt-1 hidden shrink-0 text-violet-400 sm:block" />
                </article>
              ))}
            </div>

            {hasMore && (
              <button
                type="button"
                onClick={() => setExpanded((previous) => !previous)}
                aria-expanded={expanded}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 !px-4 !py-3 text-sm font-bold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100 sm:w-auto"
              >
                {expanded ? (
                  <>Show less <ChevronUp size={17} /></>
                ) : (
                  <>Read full feedback <ChevronDown size={17} /></>
                )}
              </button>
            )}

            <div className="mt-6 flex items-center gap-2 border-t border-slate-100 !pt-4 text-xs leading-5 text-slate-400">
              <MessageSquareText size={15} className="shrink-0" />
              AI-generated suggestions · Review before updating your resume
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-violet-200 bg-gradient-to-b from-violet-50/70 to-white !px-5 !py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-md shadow-violet-900/5">
              <Sparkles size={25} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">
              Your insights are waiting
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Analyze your resume to receive personalized guidance for
              improving your job readiness.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AIFeedbackSection;

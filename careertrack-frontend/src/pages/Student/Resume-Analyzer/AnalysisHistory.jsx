
import { useCallback, useEffect, useState } from "react";
import {
  History,
  FileText,
  CalendarDays,
  ChevronRight,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  TrendingUp,
  Trash2,
  CheckCircle2,
  Sparkles,
  Clock3,
} from "lucide-react";

import {
  getResumeAnalysisHistory,
  deleteResumeAnalysisReport,
  deleteResumeAnalysisHistory,
} from "../../../services/resumeAnalyzerService";

const formatDate = (value) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getScoreColor = (score) => {
  if (score >= 80) return "text-emerald-700 bg-emerald-50";
  if (score >= 60) return "text-blue-700 bg-blue-50";
  if (score >= 40) return "text-amber-700 bg-amber-50";
  return "text-red-700 bg-red-50";
};

const AnalysisHistory = ({ onSelectAnalysis, refreshKey = 0 }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getResumeAnalysisHistory();

      const items = Array.isArray(response)
        ? response
        : response?.content ??
          response?.history ??
          response?.analyses ??
          response?.data ??
          [];

      setHistory(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err.message || "Unable to load analysis history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory, refreshKey]);

  const handleDeleteOne = async (event, item) => {
    event.stopPropagation();
    const analysisId = item.id ?? item.analysisId;
    if (!analysisId) return;

    const confirmed = window.confirm(
      `Delete "${item.resumeName || "this resume analysis"}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(analysisId);
      setActionError("");
      setSuccessMessage("");
      await deleteResumeAnalysisReport(analysisId);

      setHistory((previous) =>
        previous.filter((entry) => (entry.id ?? entry.analysisId) !== analysisId)
      );
      setSuccessMessage("Analysis report deleted successfully.");
    } catch (err) {
      setActionError(err.message || "Could not delete this report.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    if (history.length === 0 || deletingAll) return;

    const confirmed = window.confirm(
      `Delete all ${history.length} resume analysis reports? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeletingAll(true);
      setActionError("");
      setSuccessMessage("");
      await deleteResumeAnalysisHistory();
      setHistory([]);
      setSuccessMessage("All analysis history has been deleted.");
    } catch (err) {
      setActionError(err.message || "Could not clear analysis history.");
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-white to-violet-50/60 !px-5 !py-6 sm:!px-7">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/20">
            <History size={23} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                Analysis history
              </h2>
              <span className="rounded-full bg-violet-100 !px-2.5 !py-1 text-[10px] font-bold text-violet-700">
                {history.length} REPORT{history.length === 1 ? "" : "S"}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Revisit your previous evaluations and track your progress.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={loading || deletingAll || deletingId !== null}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white !px-3 !py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deletingAll ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
              <span>{deletingAll ? "Clearing..." : "Clear history"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={loadHistory}
            disabled={loading || deletingAll || deletingId !== null}
            aria-label="Refresh analysis history"
            className="rounded-xl border border-slate-200 bg-white !p-2.5 text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <RefreshCw size={18} />
            )}
          </button>
        </div>
      </div>

      <div className="!p-5 sm:!p-7">
        {actionError && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 !p-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 !p-3 text-sm text-emerald-700">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center !py-12 text-slate-500">
            <LoaderCircle size={30} className="animate-spin text-violet-600" />
            <p className="mt-3 text-sm">Loading your analysis history...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 !p-5">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-600" />
              <div>
                <p className="text-sm font-bold text-red-800">Could not load history</p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={loadHistory}
                  className="mt-3 text-sm font-bold text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-violet-200 bg-gradient-to-b from-violet-50/70 to-white !px-5 !py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-md shadow-violet-900/5">
              <FileText size={27} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">Your story starts here</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Your completed resume analyses will appear here so you can revisit
              reports and monitor your progress.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white !px-3 !py-1.5 text-xs font-semibold text-violet-700 ring-1 ring-violet-100">
              <Sparkles size={13} /> Ready for your first analysis
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => {
              const analysisId = item.id ?? item.analysisId;
              const score = Math.max(0, Math.min(100, Number(item.overallScore) || 0));
              const isDeleting = deletingId === analysisId;

              return (
                <article
                  key={analysisId ?? index}
                  className="group flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white !p-3 transition hover:border-violet-200 hover:bg-violet-50/30 hover:shadow-sm sm:gap-4 sm:!p-4"
                >
                  <button
                    type="button"
                    onClick={() => onSelectAnalysis?.(analysisId, item)}
                    disabled={!analysisId || !onSelectAnalysis || isDeleting}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left disabled:cursor-default sm:gap-4"
                  >
                    <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700 sm:flex">
                      <FileText size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-slate-900">
                        {item.resumeName || "Resume analysis"}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          {formatDate(item.analyzedAt ?? item.createdAt ?? item.analysisDate)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <TrendingUp size={14} />
                          ATS: {Number(item.atsScore) || 0}/100
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                      <span className={`rounded-xl !px-2.5 !py-2 text-xs font-extrabold sm:!px-3 sm:text-sm ${getScoreColor(score)}`}>
                        {score}/100
                      </span>
                      <ChevronRight size={19} className="hidden text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-600 sm:block" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={(event) => handleDeleteOne(event, item)}
                    disabled={!analysisId || isDeleting || deletingAll || deletingId !== null}
                    aria-label={`Delete ${item.resumeName || "resume analysis"}`}
                    title="Delete this report"
                    className="shrink-0 rounded-xl !p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <LoaderCircle size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </article>
              );
            })}
          </div>
        )}

        {!loading && !error && history.length > 0 && (
          <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
            <Clock3 size={14} />
            Select a report to reopen its full analysis.
          </div>
        )}
      </div>
    </section>
  );
};

export default AnalysisHistory;

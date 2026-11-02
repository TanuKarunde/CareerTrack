
import { useCallback, useState } from "react";
import {
  AlertCircle,
  FileSearch,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

import ResumeUploadSection from "./ResumeUploadSection";
import OverallScoreCard from "./OverallScoreCard";
import ScoreBreakdown from "./ScoreBreakdown";
import JobMatchSection from "./JobMatchSection";
import StrengthsSection from "./StrengthsSection";
import ImprovementsSection from "./ImprovementsSection";
import AIFeedbackSection from "./AIFeedbackSection";
import AnalysisHistory from "./AnalysisHistory";

import {
  analyzeResume,
  getResumeAnalysisReport,
} from "../../../services/resumeAnalyzerService";
import UserNavbar from "../Navbar/UserNavbar";
import Sidebar from "../../../components/Sidebar/Sidebar";

const ResumeAnalyzer = () => {
  const [source, setSource] = useState("PROFILE");
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const handleSourceChange = (nextSource) => {
    setSource(nextSource);
    setFile(null);
    setError("");
    setSuccess("");
  };

  const handleFileChange = (event) => {
    const selectedFile = event?.target?.files?.[0] ?? null;
    setError("");
    setSuccess("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!/\.(pdf|doc|docx)$/i.test(selectedFile.name)) {
      setFile(null);
      setError("Please upload a PDF, DOC, or DOCX resume.");
      if (event.target) event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setError("Resume size must be 5 MB or smaller.");
      if (event.target) event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleAnalyze = async (event) => {
    event?.preventDefault?.();
    setError("");
    setSuccess("");

    if (source === "UPLOAD" && !file) {
      setError("Please select a resume file before analyzing.");
      return;
    }

    try {
      setLoading(true);
      const result = await analyzeResume({
        file: source === "UPLOAD" ? file : null,
      });

      setReport(result);
      setSuccess("Resume analysis completed successfully.");
      setHistoryRefreshKey((previous) => previous + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to analyze your resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnalysis = useCallback(async (analysisId) => {
    if (!analysisId) return;
    setError("");
    setSuccess("");

    try {
      setReportLoading(true);
      const result = await getResumeAnalysisReport(analysisId);
      setReport(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load the selected analysis."
      );
    } finally {
      setReportLoading(false);
    }
  }, []);

  const handleNewAnalysis = () => {
    setReport(null);
    setFile(null);
    setSource("PROFILE");
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen bg-[#f7f7fc]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <UserNavbar />

        <main className="flex-1 !px-4 !py-6 sm:!px-6 lg:!px-8">
          <div className="mx-auto w-full max-w-7xl space-y-7">
            <header className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#211044] via-violet-800 to-indigo-700 !p-6 text-white shadow-xl shadow-violet-950/10 sm:!p-8 lg:!p-10">
              <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-300/20 blur-3xl" />

              <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
                <div className="max-w-2xl">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-1.5 text-xs font-bold tracking-wide text-violet-100 backdrop-blur">
                    <Sparkles size={15} />
                    CAREER INTELLIGENCE STUDIO
                  </div>

                  <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                    Your resume,
                    <span className="block text-violet-200">
                      upgraded by insight.
                    </span>
                  </h1>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-violet-100/85 sm:text-base">
                    Understand your strengths, uncover skill gaps, evaluate
                    ATS compatibility, and discover jobs that fit your profile.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {[
                      { icon: ShieldCheck, label: "ATS insights" },
                      { icon: Zap, label: "Smart job matching" },
                      { icon: Sparkles, label: "Personalized feedback" },
                    ].map(({ icon: Icon, label }) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 !px-3 !py-2 text-xs font-medium text-white/90"
                      >
                        <Icon size={15} className="text-violet-200" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 !p-4 backdrop-blur-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                    <FileSearch size={25} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Resume Analyzer</p>
                    <p className="mt-1 text-xs text-violet-100/75">
                      Turn your experience into opportunity
                    </p>
                  </div>
                  {report && (
                    <button
                      type="button"
                      onClick={handleNewAnalysis}
                      className="ml-2 inline-flex items-center gap-2 rounded-xl bg-white !px-3 !py-2 text-xs font-bold text-violet-800 transition hover:bg-violet-50"
                    >
                      <RotateCcw size={14} />
                      New
                    </button>
                  )}
                </div>
              </div>
            </header>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 !p-4 text-red-800"
              >
                <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-600" />
                <p className="text-sm leading-6">{error}</p>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 !p-4 text-sm text-emerald-800"
              >
                <ShieldCheck size={19} className="shrink-0" />
                {success}
              </div>
            )}

            {!report && (
              <ResumeUploadSection
                source={source}
                file={file}
                loading={loading}
                onSourceChange={handleSourceChange}
                onFileChange={handleFileChange}
                onSubmit={handleAnalyze}
              />
            )}

            {reportLoading && (
              <div className="flex items-center justify-center gap-3 rounded-3xl border border-violet-100 bg-white !p-10 shadow-sm">
                <LoaderCircle size={24} className="animate-spin text-violet-600" />
                <p className="text-sm font-medium text-slate-600">
                  Loading your previous analysis...
                </p>
              </div>
            )}

            {report && !reportLoading && (
              <div className="space-y-7">
                <OverallScoreCard report={report} />
                <ScoreBreakdown report={report} />
                <JobMatchSection report={report} />
                <StrengthsSection report={report} />
                <ImprovementsSection report={report} />
                <AIFeedbackSection report={report} />
              </div>
            )}

            <AnalysisHistory
              refreshKey={historyRefreshKey}
              onSelectAnalysis={handleSelectAnalysis}
            />

            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white !p-4 shadow-sm">
              <div className="rounded-xl bg-violet-50 !p-2 text-violet-600">
                <FileSearch size={19} />
              </div>
              <p className="pt-1 text-xs leading-5 text-slate-500">
                Resume scores and job recommendations are estimates based on
                available resume information and job listings. A high match
                score does not guarantee an interview or selection.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;


import { useRef } from "react";
import {
  Upload,
  FileText,
  UserRound,
  Sparkles,
  LoaderCircle,
  X,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  FileCheck2,
} from "lucide-react";

const ResumeUploadSection = ({
  source,
  file,
  loading,
  onSourceChange,
  onFileChange,
  onSubmit,
}) => {
  const fileInputRef = useRef(null);

  const handleRemoveFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileChange({ target: { files: [] } });
  };

  const sources = [
    {
      id: "PROFILE",
      title: "Profile resume",
      description: "Use the resume saved in your student profile.",
      icon: UserRound,
      badge: "QUICK START",
    },
    {
      id: "UPLOAD",
      title: "Upload a resume",
      description: "Choose a different resume from your computer.",
      icon: Upload,
      badge: "CUSTOM FILE",
    },
  ];

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-lg hover:shadow-violet-950/[0.04]">
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-50 via-white to-indigo-50 !px-5 !py-6 sm:!px-8">
        <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-violet-200/30 blur-2xl" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20">
            <FileSearchIcon />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                Build your resume report
              </h2>
              <span className="rounded-full bg-violet-100 !px-2.5 !py-1 text-[10px] font-bold tracking-wide text-violet-700">
                AI POWERED
              </span>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Start with a resume. Get a clearer picture of your career potential.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-7 !p-5 sm:!p-8">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="text-sm font-bold text-slate-800">
              01 <span className="ml-2 text-slate-500">Choose your source</span>
            </label>
            <span className="text-xs text-slate-400">Select one option</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sources.map(({ id, title, description, icon: Icon, badge }) => {
              const selected = source === id;

              return (
                <button
                  key={id}
                  type="button"
                  disabled={loading}
                  onClick={() => onSourceChange(id)}
                  aria-pressed={selected}
                  className={`group relative overflow-hidden rounded-2xl border !p-5 text-left transition duration-200 ${
                    selected
                      ? "border-violet-500 bg-gradient-to-br from-violet-50 to-indigo-50/70 ring-2 ring-violet-100 shadow-md shadow-violet-900/5"
                      : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {selected && (
                    <div className="absolute right-0 top-0 rounded-bl-xl bg-violet-600 !px-3 !py-1.5 text-[10px] font-bold tracking-wide text-white">
                      SELECTED
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
                        selected
                          ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/20"
                          : "bg-slate-100 text-slate-600 group-hover:bg-violet-100 group-hover:text-violet-700"
                      }`}
                    >
                      <Icon size={22} />
                    </div>
                    {selected && (
                      <CheckCircle2 size={21} className="mt-1 text-violet-600" />
                    )}
                  </div>

                  <p className="mt-5 text-base font-bold text-slate-900">
                    {title}
                  </p>
                  <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">
                    {description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400">
                      {badge}
                    </span>
                    <ArrowRight
                      size={17}
                      className={`transition ${
                        selected
                          ? "translate-x-0 text-violet-600"
                          : "-translate-x-1 text-slate-300 group-hover:translate-x-0 group-hover:text-violet-600"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {source === "UPLOAD" && (
          <div>
            <label className="mb-3 block text-sm font-bold text-slate-800">
              02 <span className="ml-2 text-slate-500">Add your resume file</span>
            </label>

            {!file ? (
              <button
                type="button"
                disabled={loading}
                onClick={() => fileInputRef.current?.click()}
                className="group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-200 bg-gradient-to-b from-violet-50/70 to-white !px-5 !py-10 text-center transition hover:border-violet-400 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-md shadow-violet-900/5 transition group-hover:-translate-y-1 group-hover:shadow-lg">
                  <Upload size={26} />
                </div>
                <p className="mt-4 text-sm font-bold text-slate-800">
                  Drop into your next career move
                </p>
                <p className="mt-1 text-sm text-violet-700">
                  Click here to browse files
                </p>
                <p className="mt-3 rounded-full bg-white !px-3 !py-1.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
                  PDF, DOC, DOCX · Maximum 5 MB
                </p>
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white !p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <FileCheck2 size={23} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-800">
                    {file.name}
                  </p>
                  <p className="mt-1 text-xs text-emerald-700">
                    Ready to analyze · {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleRemoveFile}
                  aria-label="Remove selected resume"
                  className="rounded-xl !p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={onFileChange}
              className="hidden"
              disabled={loading}
            />
          </div>
        )}

        <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 !p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
            <Sparkles size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900">
              What your analysis includes
            </h3>
            <p className="mt-1 text-xs leading-6 text-slate-600">
              Resume scoring, ATS compatibility, strengths, improvement
              suggestions, skill comparison, and recommendations from active
              CareerTrack job listings.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-100 !pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={17} className="shrink-0 text-emerald-600" />
            <span>Review AI recommendations before editing your resume.</span>
          </div>

          <button
            type="submit"
            disabled={loading || (source === "UPLOAD" && !file)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 !px-6 !py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto"
          >
            {loading ? (
              <>
                <LoaderCircle size={19} className="animate-spin" />
                Analyzing resume...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Analyze my resume
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

const FileSearchIcon = () => <FileText size={24} />;

export default ResumeUploadSection;

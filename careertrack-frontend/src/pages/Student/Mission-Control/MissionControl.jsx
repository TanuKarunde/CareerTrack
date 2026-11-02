
import { useCallback, useEffect, useState } from "react";
import {
  Sparkles,
  Target,
  RefreshCw,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";



import MissionCard from "./MissionCard";
import MissionStats from "./MissionStats";
import MissionAssessment from "./MissionAssessment";

import {
  generateMissions,
  getMissions,
  startAssessment,
} from "../../../services/missionService";
import Sidebar from "../../../components/Sidebar/Sidebar";
import UserNavbar from "../Navbar/UserNavbar";

const MissionControl = ({ jobId = 1 }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [startingId, setStartingId] = useState(null);
  const [activeAssessment, setActiveAssessment] = useState(null);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [missionToStart, setMissionToStart] = useState(null);
  const [questionCount, setQuestionCount] = useState(50);

  const loadMissions = useCallback(async () => {
    try {
      setError("");

      const data = await getMissions(jobId);
      setMissions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load missions.");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError("");
      setNotice("");

      await generateMissions(jobId);
      await loadMissions();

      setNotice("Your missions have been generated successfully.");
    } catch (err) {
      setError(err.message || "Unable to generate missions.");
    } finally {
      setGenerating(false);
    }
  };

  const handleStart = (mission) => {
    setError("");
    setNotice("");
    setMissionToStart(mission);
    setQuestionCount(50);
  };

  const confirmStartAssessment = async () => {
    if (!missionToStart) return;

    try {
      setStartingId(missionToStart.id);
      setError("");

      const assessment = await startAssessment(
        missionToStart.id,
        questionCount
      );

      setActiveAssessment({
        ...assessment,
        title: missionToStart.title,
      });

      setMissionToStart(null);
      await loadMissions();
    } catch (err) {
      setError(err.message || "Unable to start this assessment.");
    } finally {
      setStartingId(null);
    }
  };

  const handleAssessmentSubmitted = async (result) => {
    await loadMissions();

    setNotice(
      result.passed
        ? `Assessment passed! You scored ${result.score}/${result.totalMarks} and earned ${result.xpAwarded} XP.`
        : `You scored ${result.score}/${result.totalMarks}. Review the topics and try again.`
    );
  };

  const filteredMissions = missions.filter((mission) => {
    if (filter === "PENDING") {
      return mission.status === "PENDING";
    }

    if (filter === "COMPLETED") {
      return mission.status === "COMPLETED";
    }

    return true;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Application */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Top Navbar */}
        <UserNavbar />

        {/* Main Content */}
        <main className="flex-1 !px-4 !py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl space-y-7">

            {/* Page Heading */}
            <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-600 !p-6 text-white shadow-lg sm:p-8">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-100">
                    <Sparkles size={17} />
                    CAREERTRACK MISSION CONTROL
                  </div>

                  <h1 className="text-3xl font-bold sm:text-4xl">
                    Your career, one mission at a time.
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-violet-100 sm:text-base">
                    Turn your job-readiness gaps into actionable tasks.
                    Complete missions, earn XP, and build job-ready skills.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generating || loading}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white !px-5 !py-3 font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-60"
                >
                  {generating ? (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Sparkles size={18} />
                  )}

                  {generating ? "Generating..." : "Generate Missions"}
                </button>
              </div>
            </section>

            {/* Error Alert */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 !p-4 text-sm text-red-700"
              >
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <div className="flex-1">{error}</div>

                <button
                  type="button"
                  onClick={loadMissions}
                  className="font-semibold underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Success Alert */}
            {notice && !error && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 !p-4 text-sm text-emerald-800"
              >
                {notice}
              </div>
            )}

            {/* Mission Statistics */}
            <MissionStats missions={missions} />

            {/* Mission List */}
            <section>
              <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <Target
                      className="text-violet-600"
                      size={23}
                    />
                    Your missions
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Complete a task to earn its XP reward.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadMissions}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white !px-4 !py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>

              {/* Filters */}
              <div className="mb-5 flex flex-wrap gap-2">
                {[
                  { label: "All missions", value: "ALL" },
                  { label: "Pending", value: "PENDING" },
                  { label: "Completed", value: "COMPLETED" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    className={`rounded-full !px-4 !py-2 text-sm font-medium transition ${
                      filter === item.value
                        ? "bg-violet-600 text-white shadow-sm"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex min-h-64 items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white text-gray-600">
                  <LoaderCircle
                    className="animate-spin text-violet-600"
                    size={22}
                  />
                  Loading your missions...
                </div>
              ) : filteredMissions.length === 0 ? (
                /* Empty State */
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white !px-6 !py-14 text-center">
                  <Target
                    size={40}
                    className="mx-auto text-violet-400"
                  />

                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {missions.length === 0
                      ? "No missions yet"
                      : "No missions in this filter"}
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                    {missions.length === 0
                      ? "Generate personalized missions based on your job-readiness report."
                      : "Try another filter to see your missions."}
                  </p>

                  {missions.length === 0 && (
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={generating}
                      className="mt-5 rounded-xl bg-violet-600 !px-5 !py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
                    >
                      {generating
                        ? "Generating..."
                        : "Generate my missions"}
                    </button>
                  )}
                </div>
              ) : (
                /* Mission Cards */
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {filteredMissions.map((mission) => (
                    <MissionCard
                      key={mission.id}
                      mission={mission}
                      onStart={handleStart}
                      starting={startingId === mission.id}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* Assessment Length Modal */}
      {missionToStart && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-gray-950/60 !p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="assessment-modal-title"
            className="w-full max-w-md rounded-2xl bg-white !p-6 shadow-2xl"
          >
            <h2
              id="assessment-modal-title"
              className="text-xl font-bold text-gray-900"
            >
              Choose assessment length
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {missionToStart.title}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[50, 100].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`rounded-xl border !p-4 text-left transition ${
                    questionCount === count
                      ? "border-violet-600 bg-violet-50 ring-2 ring-violet-200"
                      : "border-gray-200 hover:border-violet-300"
                  }`}
                >
                  <span className="block text-2xl font-bold text-gray-900">
                    {count}
                  </span>

                  <span className="mt-1 block text-sm text-gray-600">
                    Questions
                  </span>

                  <span className="mt-1 block text-xs text-gray-500">
                    {count} marks · {count} minutes
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setMissionToStart(null)}
                disabled={startingId !== null}
                className="flex-1 rounded-xl border border-gray-200 !px-4 !py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmStartAssessment}
                disabled={startingId !== null}
                className="flex-1 rounded-xl bg-violet-600 !px-4 !py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {startingId !== null
                  ? "Starting..."
                  : "Start assessment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Assessment */}
      {activeAssessment && (
        <MissionAssessment
          assessment={activeAssessment}
          onClose={() => setActiveAssessment(null)}
          onSubmitted={handleAssessmentSubmitted}
        />
      )}
    </div>
  );
};

export default MissionControl;

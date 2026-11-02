
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Trophy,
} from "lucide-react";

import { useNavigate } from "react-router-dom";



import TopicCard from "../../../components/InterviewPrep/TopicCard";
import InterviewPrepConfigModal from "../../../components/InterviewPrep/InterviewPrepConfigModal";

import {
  getInterviewPrepTopics,
  startInterviewPrep,
} from "../../../services/interviewPrepService";
import Sidebar from "../../../components/Sidebar/Sidebar";
import UserNavbar from "../Navbar/UserNavbar";

const InterviewPrep = () => {
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInterviewPrepTopics();

      setTopics(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Interview Prep topics error:", error);

      setError("Unable to load Interview Prep categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterviewPrep = async (config) => {
    try {
      setError("");

      const response = await startInterviewPrep(config);

      console.log("Interview Prep started:", response);

      navigate(
        `/student/interview-prep/session/${response.sessionId}`
      );
    } catch (error) {
      console.error("Unable to start Interview Prep:", error);

      setError(
        error.message || "Unable to start your interview practice."
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Application */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Top Navbar */}
        <UserNavbar />

        {/* Page Content */}
        <main className="flex-1 !px-4 !py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">

            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-purple-600"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            {/* Hero Section */}
            <section className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-violet-500 !p-6 text-white shadow-lg sm:p-8 md:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-5">

                {/* Icon */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 sm:h-16 sm:w-16">
                  <Sparkles size={30} />
                </div>

                {/* Heading and Actions */}
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl font-bold sm:text-4xl">
                    AI Interview Prep
                  </h1>

                  <p className="mt-3 max-w-2xl leading-7 text-purple-100">
                    Practice aptitude, technical, coding, HR and
                    behavioral interviews with AI-generated questions
                    based on the skills you choose.
                  </p>

                  {/* Scoreboard Button */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/student/interview-prep/scoreboard")
                    }
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white !px-4 !py-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-purple-50"
                  >
                    <Trophy size={18} />
                    View Scoreboard
                  </button>
                </div>
              </div>
            </section>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 !px-5 !py-4 text-sm text-red-600"
              >
                <p>{error}</p>

                <button
                  type="button"
                  onClick={loadTopics}
                  className="shrink-0 font-semibold underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Categories Heading */}
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Choose Interview Category
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                Select a category and choose the skills you want
                to practice.
              </p>
            </section>

            {/* Loading State */}
            {loading ? (
              <div className="rounded-2xl border border-gray-200 bg-white !p-12 text-center text-gray-500">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600" />

                Loading Interview Prep categories...
              </div>
            ) : topics.length === 0 ? (
              /* Empty State */
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white !px-6 !py-14 text-center">
                <Sparkles
                  size={38}
                  className="mx-auto text-purple-400"
                />

                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  No categories available
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Interview preparation categories could not be found.
                </p>

                <button
                  type="button"
                  onClick={loadTopics}
                  className="mt-5 rounded-xl bg-violet-600 !px-5 !py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  Reload Categories
                </button>
              </div>
            ) : (
              /* Interview Category Cards */
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onSelect={setSelectedTopic}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Configuration Modal */}
      {selectedTopic && (
        <InterviewPrepConfigModal
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
          onStart={handleStartInterviewPrep}
        />
      )}
    </div>
  );
};

export default InterviewPrep;

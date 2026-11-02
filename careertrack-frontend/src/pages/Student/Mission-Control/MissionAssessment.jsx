import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock3,
  CheckCircle2,
  XCircle,
  LoaderCircle,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  Flag,
  CircleHelp,
} from "lucide-react";
import { submitAssessment } from "../../../services/missionService";

const formatTime = (seconds) => {
  const safe = Math.max(0, seconds);
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(
    safe % 60
  ).padStart(2, "0")}`;
};

function ResultGauge({ percentage }) {
  const value = Math.max(0, Math.min(100, percentage || 0));
  const radius = 78;
  const circumference = Math.PI * radius;
  const dash = (value / 100) * circumference;

  return (
    <div className="mx-auto w-full max-w-xs text-center">
      <svg viewBox="0 0 200 115" className="w-full">
        <path
          d="M 22 100 A 78 78 0 0 1 178 100"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 22 100 A 78 78 0 0 1 178 100"
          fill="none"
          stroke={value >= 70 ? "#16a34a" : "#f59e0b"}
          strokeWidth="16"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${value} ${100 - value}`}
        />
        <text
          x="100"
          y="79"
          textAnchor="middle"
          fontSize="29"
          fontWeight="700"
          fill="#111827"
        >
          {value.toFixed(0)}%
        </text>
        <text
          x="100"
          y="101"
          textAnchor="middle"
          fontSize="10"
          fill="#6b7280"
        >
          SCORE
        </text>
      </svg>
    </div>
  );
}

export default function MissionAssessment({
  assessment,
  onClose,
  onSubmitted,
}) {
  const questions = assessment.questions || [];
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(
    assessment.durationSeconds
  );
  const [submitting, setSubmitting] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const timeoutSubmitted = useRef(false);

  const currentQuestion = questions[currentIndex];

  const attemptedCount = questions.filter(
    (q) => Boolean(answers[q.questionId])
  ).length;
  const skippedCount = questions.length - attemptedCount;
  const reviewCount = Object.values(review).filter(Boolean).length;

  const groupedQuestions = useMemo(() => {
    const groups = {};

    questions.forEach((question, index) => {
      const topic = question.topic || "General";
      if (!groups[topic]) groups[topic] = [];
      groups[topic].push({ question, index });
    });

    return groups;
  }, [questions]);

  const handleSubmit = async () => {
    if (submitting || result) return;

    try {
      setSubmitting(true);
      setError("");

      const answerList = questions.map((question) => ({
        questionId: question.questionId,
        selectedOption: answers[question.questionId] || "",
      }));

      const data = await submitAssessment(
        assessment.missionId,
        answerList
      );

      setResult(data);
      setConfirmSubmit(false);
      await onSubmitted?.(data);
    } catch (err) {
      setError(err.message || "Unable to submit assessment.");
      setConfirmSubmit(false);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (result || secondsLeft <= 0) return;

    const timerId = setInterval(() => {
      setSecondsLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(timerId);
  }, [result, secondsLeft]);

  useEffect(() => {
    if (
      secondsLeft === 0 &&
      !result &&
      !submitting &&
      !timeoutSubmitted.current
    ) {
      timeoutSubmitted.current = true;
      handleSubmit();
    }
    // The ref prevents repeated timeout submissions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, result, submitting]);

  if (!currentQuestion && !result) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-gray-950/60 !p-4">
        <div className="rounded-xl bg-white !p-6">
          No assessment questions were returned.
          <button onClick={onClose} className="ml-4 text-violet-700">
            Close
          </button>
        </div>
      </div>
    );
  }

  const answered = (question) => Boolean(answers[question.questionId]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/70 !p-2 sm:p-5">
      <div className="mx-auto min-h-[95vh] max-w-7xl overflow-hidden rounded-2xl bg-gray-50 shadow-2xl">
        <header className="sticky top-0 z-50 flex items-center justify-between gap-4 rounded-t-2xl bg-gradient-to-r from-violet-700 to-indigo-600 !p-4 text-white shadow-md sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-200">
              CareerTrack Assessment
            </p>
            <h1 className="mt-1 text-lg font-bold sm:text-2xl">
              {assessment.title}
            </h1>
            <p className="mt-1 text-sm text-violet-100">
              {questions.length} questions · {questions.length} marks
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!result && (
              <div
                className={`flex items-center gap-2 rounded-lg !px-3 !py-2 text-sm font-bold ${
                  secondsLeft < 300 ? "bg-red-500" : "bg-white/15"
                }`}
              >
                <Clock3 size={17} />
                {formatTime(secondsLeft)}
              </div>
            )}
            <button
              onClick={onClose}
              aria-label="Close assessment"
              className="rounded-lg !p-2 hover:bg-white/15"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="grid min-h-[75vh] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
          {!result && (
            <aside className="border-b border-gray-200 bg-white !p-4 lg:sticky lg:top-[100px] lg:h-[calc(100vh-100px)] lg:overflow-y-auto lg:self-start lg:border-b-0 lg:border-r">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-emerald-50 !p-2">
                  <p className="text-xl font-bold text-emerald-700">
                    {attemptedCount}
                  </p>
                  <p className="text-xs text-gray-600">Attempted</p>
                </div>
                <div className="rounded-lg bg-gray-100 !p-2">
                  <p className="text-xl font-bold text-gray-700">
                    {skippedCount}
                  </p>
                  <p className="text-xs text-gray-600">Skipped</p>
                </div>
                <div className="rounded-lg bg-amber-50 !p-2">
                  <p className="text-xl font-bold text-amber-700">
                    {reviewCount}
                  </p>
                  <p className="text-xs text-gray-600">Review</p>
                </div>
              </div>

              <div className="mt-5 space-y-5">
                {Object.entries(groupedQuestions).map(([topic, items]) => (
                  <section key={topic}>
                    <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                      {topic}
                    </h2>

                    <div className="grid grid-cols-5 gap-2">
                      {items.map(({ question, index }) => {
                        const isCurrent = index === currentIndex;
                        const isAnswered = answered(question);
                        const isReview = Boolean(review[question.questionId]);

                        return (
                          <button
                            key={question.questionId}
                            type="button"
                            title={`${index + 1}. ${question.topic || "General"}`}
                            onClick={() => setCurrentIndex(index)}
                            className={`relative flex h-9 items-center justify-center rounded-lg border text-sm font-semibold ${
                              isCurrent
                                ? "border-violet-700 bg-violet-700 text-white ring-2 ring-violet-200"
                                : isReview
                                ? "border-amber-400 bg-amber-100 text-amber-900"
                                : isAnswered
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-gray-200 bg-gray-100 text-gray-700 hover:border-violet-300"
                            }`}
                          >
                            {index + 1}
                            {isReview && (
                              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-white bg-amber-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </aside>
          )}

          <main className="min-w-0 !p-4 sm:p-7 lg:h-[calc(100vh-100px)] lg:overflow-y-auto">
            {result ? (
              <section className="mx-auto max-w-2xl rounded-2xl bg-white !p-5 text-center shadow-sm sm:p-8">
                {result.passed ? (
                  <CheckCircle2
                    size={48}
                    className="mx-auto text-emerald-600"
                  />
                ) : (
                  <XCircle size={48} className="mx-auto text-amber-500" />
                )}

                <h2 className="mt-3 text-2xl font-bold text-gray-900">
                  {result.passed ? "Assessment passed!" : "Keep practising"}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {result.message}
                </p>

                <div className="mt-6">
                  <ResultGauge percentage={result.percentage} />
                  <p className="font-semibold text-gray-800">
                    {result.score} out of {result.totalMarks} marks
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <ResultCard
                    label="Correct answers"
                    value={result.correctCount ?? "—"}
                    color="text-emerald-700"
                  />
                  <ResultCard
                    label="Wrong answers"
                    value={result.wrongCount ?? "—"}
                    color="text-red-700"
                  />
                  <ResultCard
                    label="Skipped"
                    value={result.skippedCount ?? "—"}
                    color="text-gray-700"
                  />
                  <ResultCard
                    label="Attempted"
                    value={result.attemptedCount ?? "—"}
                    color="text-violet-700"
                  />
                  <ResultCard
                    label="Time taken"
                    value={formatTime(result.timeTakenSeconds)}
                    color="text-gray-800"
                  />
                  <ResultCard
                    label="XP earned"
                    value={result.xpAwarded}
                    color="text-amber-700"
                  />
                </div>

                <button
                  onClick={onClose}
                  className="mt-7 rounded-xl bg-violet-600 !px-5 !py-3 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Back to missions
                </button>
              </section>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-violet-50 !px-3 !py-1 text-xs font-bold text-violet-700">
                    {currentQuestion.topic || "General"}
                  </span>
                  <span className="text-sm font-semibold text-gray-500">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-violet-600 transition-all"
                    style={{
                      width: `${
                        ((currentIndex + 1) / questions.length) * 100
                      }%`,
                    }}
                  />
                </div>

                <section className="flex h-[500px] mt-5 flex-col rounded-2xl border border-gray-200 bg-white !p-5 shadow-sm sm:p-7">
                  <h2 className="text-lg font-bold leading-7 text-gray-900 sm:text-xl">
                    <span className="!mr-2 text-violet-700">
                      Q{currentIndex + 1}.    
                    </span>
                    {currentQuestion.question}
                  </h2>

                  <div className="mt-6 space-y-3">
                    {currentQuestion.options.map((option) => {
                      const key = option.trim().charAt(0).toUpperCase();
                      const selected =
                        answers[currentQuestion.questionId] === key;

                      return (
                        <label
                          key={option}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border !p-4 transition ${
                            selected
                              ? "border-violet-500 bg-violet-50"
                              : "border-gray-200 hover:border-violet-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.questionId}`}
                            checked={selected}
                            onChange={() =>
                              setAnswers((previous) => ({
                                ...previous,
                                [currentQuestion.questionId]: key,
                              }))
                            }
                            disabled={submitting || secondsLeft <= 0}
                            className="mt-1 accent-violet-600"
                          />
                          <span className="text-sm leading-6 text-gray-800">
                            {option}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </section>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() =>
                      setCurrentIndex((index) => Math.max(0, index - 1))
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white !px-4 !py-3 text-sm font-semibold disabled:opacity-40"
                  >
                    <ChevronLeft size={17} /> Previous
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setReview((previous) => ({
                        ...previous,
                        [currentQuestion.questionId]:
                          !previous[currentQuestion.questionId],
                      }))
                    }
                    className={`inline-flex items-center gap-2 rounded-xl border !px-4 !py-3 text-sm font-semibold ${
                      review[currentQuestion.questionId]
                        ? "border-amber-300 bg-amber-50 text-amber-800"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    <Flag size={16} />
                    {review[currentQuestion.questionId]
                      ? "Remove review"
                      : "Mark for review"}
                  </button>

                  {currentIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentIndex((index) =>
                          Math.min(questions.length - 1, index + 1)
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-violet-600 !px-4 !py-3 text-sm font-semibold text-white hover:bg-violet-700"
                    >
                      Next <ChevronRight size={17} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmSubmit(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-violet-600 !px-4 !py-3 text-sm font-semibold text-white hover:bg-violet-700"
                    >
                      <Send size={16} /> Submit assessment
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setConfirmSubmit(true)}
                  className="mt-5 w-full rounded-xl border border-violet-200 bg-white !px-4 !py-3 text-sm font-semibold text-violet-700 hover:bg-violet-50"
                >
                  Review and submit
                </button>
              </>
            )}

            {error && (
              <div role="alert" className="mt-4 rounded-lg bg-red-50 !p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </main>
        </div>
      </div>

      {confirmSubmit && !result && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-gray-950/60 !p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="w-full max-w-md rounded-2xl bg-white !p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <CircleHelp className="text-violet-600" size={27} />
              <h2 id="confirm-title" className="text-lg font-bold text-gray-900">
                Confirm submission
              </h2>
            </div>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Are you sure you want to submit? You cannot change your answers
              after submission.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <ResultCard label="Attempted" value={attemptedCount} />
              <ResultCard label="Skipped" value={skippedCount} />
              <ResultCard label="Review" value={reviewCount} />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setConfirmSubmit(false)}
                className="flex-1 rounded-xl border border-gray-200 !px-4 !py-3 text-sm font-semibold text-gray-700"
              >
                Go back
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-violet-600 !px-4 !py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {submitting ? (
                  <LoaderCircle size={17} className="mx-auto animate-spin" />
                ) : (
                  "Confirm submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ label, value, color = "text-gray-900" }) {
  return (
    <div className="rounded-xl bg-gray-50 !p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
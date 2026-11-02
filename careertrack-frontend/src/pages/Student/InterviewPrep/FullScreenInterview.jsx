
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    BrainCircuit,
    Check,
    CheckCircle2,
    Circle,
    Clock3,
    Code2,
    FileText,
    Lightbulb,
    LoaderCircle,
    MessageCircle,
    RefreshCw,
    Sparkles,
    Target,
    Trophy,
    XCircle,
} from "lucide-react";

import QuestionCard from "../../../components/InterviewPrep/QuestionCard";

import {
    completeInterviewPrep,
    getInterviewPrepQuestions,
    getInterviewPrepResult,
} from "../../../services/interviewPrepService";

const FullScreenInterview = ({ sessionId: sessionIdProp }) => {
    const { sessionId: routeSessionId } = useParams();
    const navigate = useNavigate();

    const sessionId = sessionIdProp || routeSessionId;

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [draftAnswers, setDraftAnswers] = useState({});

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    const currentQuestion = questions[currentIndex];
    const questionType = currentQuestion?.questionType?.toUpperCase();
    const isMCQ = questionType === "MCQ";

    const currentQuestionId =
        currentQuestion?.id ?? currentQuestion?.questionId;

    const currentDraft =
        currentQuestionId != null
            ? draftAnswers[currentQuestionId] ?? ""
            : "";

    const totalQuestions = questions.length;
    const currentNumber = currentIndex + 1;

    // Count answers currently filled in by the student.
    const answeredCount = questions.filter((question) => {
        const id = question.id ?? question.questionId;

        return String(draftAnswers[id] ?? "").trim().length > 0;
    }).length;

    const progress = totalQuestions
        ? Math.round((answeredCount / totalQuestions) * 100)
        : 0;

    const currentQuestionAnswered =
        String(currentDraft).trim().length > 0;

    // Load questions and restore any answers returned by the API.
    const loadQuestions = useCallback(async () => {
        if (!sessionId) {
            setError(
                "Interview session ID is missing. Please open a valid interview session."
            );
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await getInterviewPrepQuestions(sessionId);

            const list = Array.isArray(response)
                ? response
                : Array.isArray(response?.questions)
                    ? response.questions
                    : Array.isArray(response?.data)
                        ? response.data
                        : Array.isArray(response?.data?.questions)
                            ? response.data.questions
                            : Array.isArray(response?.content)
                                ? response.content
                                : [];

            if (!list.length) {
                setQuestions([]);
                setError(
                    "No questions were returned for this interview session."
                );
                return;
            }

            setQuestions(list);

            const restoredAnswers = {};

            list.forEach((question) => {
                const id = question.id ?? question.questionId;

                const savedAnswer =
                    question.submittedAnswer ??
                    question.userAnswer ??
                    question.answer;

                if (
                    id != null &&
                    savedAnswer != null &&
                    String(savedAnswer).trim() !== ""
                ) {
                    restoredAnswers[id] = savedAnswer;
                }
            });

            setDraftAnswers((previous) => ({
                ...restoredAnswers,
                ...previous,
            }));
        } catch (err) {
            console.error("Failed to load interview questions:", err);

            setError(
                err?.message ||
                "Unable to load your interview questions. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        loadQuestions();
    }, [loadQuestions]);

    // Keep answers as editable drafts until final submission.
    const handleAnswerChange = (value) => {
        if (
            currentQuestionId == null ||
            submitting ||
            completing
        ) {
            return;
        }

        setDraftAnswers((previous) => ({
            ...previous,
            [currentQuestionId]: value,
        }));

        setError("");
    };

    const getQuestionStatus = (question) => {
        const id = question.id ?? question.questionId;

        if (String(draftAnswers[id] ?? "").trim() !== "") {
            return "answered";
        }

        return "pending";
    };

    const goToQuestion = (index) => {
        if (submitting || completing) return;

        setCurrentIndex(
            Math.max(0, Math.min(totalQuestions - 1, index))
        );

        setError("");
    };

    // Submit all answers together from the final button.
    
const handleSubmitAllAnswers = async () => {
    if (
        !sessionId ||
        !totalQuestions ||
        completing ||
        submitting
    ) {
        return;
    }

    setCompleting(true);
    setError("");

    try {
        const answers = {};

questions.forEach((question) => {
    const questionId = question.id ?? question.questionId;

    answers[questionId] = String(
        draftAnswers[questionId] ?? ""
    ).trim();
});

await completeInterviewPrep(sessionId, answers);

        try {
            const response = await getInterviewPrepResult(sessionId);
            setResult(response?.data ?? response);
        } catch (resultError) {
            console.error(
                "Could not load interview result:",
                resultError
            );

            setResult({ completed: true });
        }
    } catch (err) {
        console.error("Failed to submit interview answers:", err);

        setError(
            err?.response?.data?.message ||
            err?.message ||
            "Unable to submit your answers. Please try again."
        );
    } finally {
        setCompleting(false);
    }
};


    const questionTip =
        questionType === "MCQ"
            ? "Read every option carefully. Eliminate incorrect choices before selecting your answer."
            : questionType === "CODING"
                ? "Explain your approach step by step. Consider edge cases, readability and time complexity."
                : questionType === "BEHAVIORAL" || questionType === "HR"
                    ? "Structure your response clearly. Use a real example and explain the result."
                    : "Take a moment to understand the question, then explain your reasoning clearly.";

    const questionIcon =
        questionType === "CODING"
            ? <Code2 size={19} />
            : questionType === "MCQ"
                ? <Target size={19} />
                : questionType === "HR" || questionType === "BEHAVIORAL"
                    ? <MessageCircle size={19} />
                    : <FileText size={19} />;

    // Loading screen.
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F7F5FC] !p-6">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
                        <LoaderCircle
                            size={30}
                            className="animate-spin text-violet-600"
                        />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-900">
                        Preparing your interview
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Loading your personalized questions...
                    </p>
                </div>
            </div>
        );
    }

    // Error screen.
    if (error && questions.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F7F5FC] !p-6">
                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white !p-8 text-center shadow-xl">
                    <XCircle
                        size={32}
                        className="mx-auto text-rose-500"
                    />

                    <h2 className="mt-5 text-xl font-bold text-slate-900">
                        Unable to open interview
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadQuestions}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 !px-5 !py-3 text-sm font-semibold text-white hover:bg-violet-700"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mt-3 block w-full rounded-xl !px-5 !py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    // Completion screen.
    if (result) {
        const score =
            result?.score ??
            result?.totalScore ??
            result?.percentage ??
            null;

        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F7F5FC] !p-6">
                <div className="w-full max-w-xl rounded-[2rem] border border-violet-100 bg-white !p-8 text-center shadow-xl sm:p-12">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                        <Trophy size={36} />
                    </div>

                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                        Interview completed
                    </p>

                    <h1 className="mt-3 text-3xl font-black text-slate-900">
                        Great work!
                    </h1>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                        You have completed your interview session. Review
                        your performance and use the feedback to improve.
                    </p>

                    {score != null && (
                        <div className="mx-auto mt-8 max-w-xs rounded-2xl bg-violet-50 !p-6">
                            <p className="text-sm font-medium text-violet-700">
                                Your result
                            </p>

                            <p className="mt-2 text-4xl font-black text-violet-800">
                                {score}
                                {result?.percentage != null ? "%" : ""}
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/student/interview-prep/${sessionId}/result`
                            )
                        }
                        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 !px-6 !py-4 text-sm font-bold text-white shadow-lg hover:shadow-xl"
                    >
                        View interview results
                        <ArrowRight size={18} />
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mt-3 w-full rounded-xl !px-6 !py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        Back to preparation
                    </button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) return null;

    return (
        <div className="flex min-h-screen flex-col bg-[#F7F5FC] text-slate-800 lg:h-screen lg:overflow-hidden">

            {/* HEADER */}
            <header className="relative z-20 shrink-0 border-b border-violet-100 bg-white">
                <div className="flex min-h-[76px] items-center justify-between gap-3 !px-4 !py-3 sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            title="Exit interview"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                        >
                            <ArrowLeft size={19} />
                        </button>

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200">
                            <BrainCircuit size={23} />
                        </div>

                        <div className="min-w-0">
                            <h1 className="truncate text-base font-black text-slate-900 sm:text-lg">
                                CareerTrack<span className="text-violet-600">.</span>
                            </h1>

                            <p className="truncate text-xs text-slate-500">
                                AI Interview Arena
                            </p>
                        </div>
                    </div>

                    <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 !px-3 !py-2 sm:flex">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-emerald-700">
                            Session active
                        </span>
                    </div>

                    <div className="shrink-0 text-right">
                        <p className="text-xs text-slate-500">Question</p>

                        <p className="text-base font-black text-slate-900">
                            {String(currentNumber).padStart(2, "0")}
                            <span className="mx-1 text-slate-300">/</span>
                            <span className="text-slate-500">
                                {String(totalQuestions).padStart(2, "0")}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="h-1 w-full bg-violet-50">
                    <div
                        className="h-full bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </header>

            {/* MAIN: 30% LEFT / 70% RIGHT */}
            <main className="mx-auto grid w-full max-w-[2000px] flex-1 grid-cols-1 gap-4 !p-3 sm:p-5 lg:min-h-0 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:gap-5 lg:overflow-hidden lg:!p-6 xl:gap-6 xl:p-7">

                {/* LEFT PANEL — QUESTION NAVIGATOR */}
                <aside className="hide-scrollbar flex min-w-0 flex-col gap-3 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-2">

                    <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-white bg-white shadow-sm lg:h-[520px] lg:shrink-0">
                        {/* Navigator header */}
                        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-600 !p-5 text-white sm:p-6">
                            <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

                            <div className="relative flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                                    <Target size={23} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200">
                                        YOUR SESSION
                                    </p>

                                    <h2 className="mt-1 text-lg font-black">
                                        Question Navigator
                                    </h2>
                                </div>
                            </div>

                            <div className="relative mt-5 flex items-end justify-between gap-2">
                                <div>
                                    <p className="text-3xl font-black">
                                        {answeredCount}
                                        <span className="text-lg text-violet-200">
                                            {" "}/ {totalQuestions}
                                        </span>
                                    </p>

                                    <p className="mt-1 text-xs text-violet-100">
                                        Answers completed
                                    </p>
                                </div>

                                <span className="rounded-xl border border-white/20 bg-white/10 !px-3 !py-2 text-sm font-black">
                                    {progress}%
                                </span>
                            </div>

                            <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-white/20">
                                <div
                                    className="h-full rounded-full bg-white transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Independently scrollable question list */}
                        <div className="hide-scrollbar min-h-0 flex-1 !p-3 sm:p-4 lg:overflow-y-auto lg:overscroll-contain">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">
                                        All questions
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Select a number to navigate.
                                    </p>
                                </div>

                                <span className="rounded-xl bg-violet-50 !px-3 !py-2 text-sm font-black text-violet-700">
                                    {totalQuestions}
                                </span>
                            </div>

                            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-4">
                                {questions.map((question, index) => {
                                    const status = getQuestionStatus(question);
                                    const active = index === currentIndex;

                                    return (
                                        <button
                                            key={
                                                question.id ??
                                                question.questionId ??
                                                index
                                            }
                                            type="button"
                                            onClick={() => goToQuestion(index)}
                                            disabled={submitting || completing}
                                            aria-label={`Go to question ${index + 1}`}
                                            aria-current={active ? "step" : undefined}
                                            className={`relative flex aspect-square items-center justify-center rounded-xl border text-sm font-bold transition-all duration-200 ${
                                                active
                                                    ? "border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-200 ring-4 ring-violet-100"
                                                    : status === "answered"
                                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300"
                                                        : "border-slate-200 bg-white text-slate-500 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                                            } disabled:cursor-not-allowed`}
                                        >
                                            {String(index + 1).padStart(2, "0")}

                                            {status === "answered" && !active && (
                                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white">
                                                    <Check size={9} strokeWidth={4} />
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                                {[
                                    {
                                        label: "Answered",
                                        color: "bg-emerald-500",
                                    },
                                    {
                                        label: "Not answered",
                                        color: "bg-slate-300",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center gap-2"
                                    >
                                        <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                                        <span className="text-xs font-medium text-slate-500">
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Interview coach */}
                    <section className="shrink-0 rounded-2xl border border-white bg-white !p-4 shadow-sm">
                        <div className="relative">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                                    <Sparkles size={20} />
                                </div>

                                <div>
                                    <h2 className="text-sm font-black text-slate-900">
                                        Interview Coach
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Tips for this question
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 !p-3">
                                <div className="flex items-center gap-2 text-violet-700">
                                    <Lightbulb size={17} />
                                    <span className="text-xs font-black uppercase tracking-wider">
                                        Quick tip
                                    </span>
                                </div>

                                <p className="mt-3 text-sm leading-6 text-slate-700">
                                    {questionTip}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Session reminder */}
                    <section className="shrink-0 rounded-2xl border border-slate-200/80 bg-white !p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                <Clock3 size={18} />
                            </div>

                            <div>
                                <p className="text-xs font-black text-slate-800">
                                    Work at your own pace
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Your answers stay editable until you submit
                                    the complete interview.
                                </p>
                            </div>
                        </div>
                    </section>
                </aside>

                {/* RIGHT PANEL — QUESTION CARD */}
                <section className="hide-scrollbar flex min-w-0 flex-col gap-4 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pl-2">

                    {/* Current question heading */}
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white bg-white !px-4 !py-3 shadow-sm sm:px-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                                {questionIcon}
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    YOUR CHALLENGE
                                </p>

                                <p className="text-sm font-bold text-slate-900">
                                    Question {currentNumber} of {totalQuestions}
                                </p>
                            </div>
                        </div>

                        <div
                            className={`inline-flex items-center gap-2 rounded-xl !px-3 !py-2 text-xs font-bold ${
                                currentQuestionAnswered
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-600"
                            }`}
                        >
                            {currentQuestionAnswered ? (
                                <CheckCircle2 size={15} />
                            ) : (
                                <Circle size={15} />
                            )}

                            {currentQuestionAnswered
                                ? "Answer saved in draft"
                                : "Awaiting answer"}
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 !p-4 text-sm text-rose-700"
                        >
                            <XCircle size={18} className="mt-0.5 shrink-0" />
                            <p className="flex-1">{error}</p>

                            <button
                                type="button"
                                onClick={() => setError("")}
                                aria-label="Dismiss error"
                            >
                                <XCircle size={17} />
                            </button>
                        </div>
                    )}

                    {/* Question card */}
                    <div className="relative min-w-0 flex-1">
                        <div className="absolute -left-2 top-10 hidden h-24 w-1 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500 lg:block" />

                        <QuestionCard
    question={currentQuestion}
    selectedAnswer={isMCQ ? currentDraft : undefined}
    answer={isMCQ ? "" : currentDraft}
    onAnswerChange={handleAnswerChange}
    onSubmit={handleSubmitAllAnswers}
    submitting={completing}
    disabled={submitting || completing}
    showSubmitButton={false}
/>
                    </div>

                    {/* Previous / Next / Submit All */}
<div className="flex flex-col gap-3 rounded-2xl border border-violet-100 bg-white !p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
    <div className="flex items-center gap-2 text-xs text-slate-500">
        <Sparkles size={16} className="shrink-0 text-violet-500" />

        <span>
            {answeredCount}/{totalQuestions} questions answered
        </span>
    </div>

    <div className="flex flex-wrap gap-2">
        <button
            type="button"
            disabled={currentIndex === 0 || completing}
            onClick={() => goToQuestion(currentIndex - 1)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 !px-4 !py-3 text-sm font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
        >
            <ArrowLeft size={16} />
            Previous
        </button>

        {currentIndex < totalQuestions - 1 ? (
            <button
                type="button"
                disabled={completing}
                onClick={() => goToQuestion(currentIndex + 1)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 !px-4 !py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
                {currentQuestionAnswered ? "Save & Next" : "Skip & Next"}
                <ArrowRight size={16} />
            </button>
        ) : (
            <button
                type="button"
                disabled={completing || submitting}
                onClick={handleSubmitAllAnswers}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 !px-4 !py-3 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            >
                {completing ? (
                    <>
                        <LoaderCircle
                            size={16}
                            className="animate-spin"
                        />
                        Submitting all...
                    </>
                ) : (
                    <>
                        Submit All Answers
                        <CheckCircle2 size={16} />
                    </>
                )}
            </button>
        )}
    </div>
</div>

                    {/* Question insights */}
                    <section className="rounded-2xl border border-white bg-white !p-4 shadow-sm sm:p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                                <BrainCircuit size={20} />
                            </div>

                            <div>
                                <h3 className="text-sm font-black text-slate-900">
                                    Question insights
                                </h3>

                                <p className="text-xs text-slate-500">
                                    Understand your current challenge
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {[
                                {
                                    label: "Question type",
                                    value: questionType || "General",
                                },
                                {
                                    label: "Difficulty",
                                    value: currentQuestion.difficulty || "Standard",
                                },
                                {
                                    label: "Skill",
                                    value: currentQuestion.skill || "General skills",
                                },
                                {
                                    label: "Maximum marks",
                                    value: currentQuestion.maxScore ?? "—",
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 !p-3"
                                >
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        {item.label}
                                    </p>

                                    <p className="mt-2 break-words text-sm font-bold text-slate-800">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* One final submission button, available on the last question */}
                    {currentIndex === totalQuestions - 1 && (
                        <button
                            type="button"
                            disabled={completing || submitting}
                            onClick={handleSubmitAllAnswers}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 !px-5 !py-4 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {completing ? (
                                <>
                                    <LoaderCircle size={18} className="animate-spin" />
                                    Submitting all answers...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={18} />
                                    Submit All Answers ({answeredCount}/{totalQuestions})
                                </>
                            )}
                        </button>
                    )}
                </section>
            </main>
        </div>
    );
};

export default FullScreenInterview;


import {
    CheckCircle2,
    Circle,
    Code2,
    FileText,
    HelpCircle,
    MessageSquare,
    Users,
    Sparkles,
    Send,
    LoaderCircle,
    Target,
    ArrowUpRight,
    ShieldCheck,
} from "lucide-react";

const QuestionCard = ({
    question,
    selectedAnswer,
    answer,
    onAnswerChange,
    onSubmit,
    submitting = false,
    disabled = false,
    showSubmitButton = true,
}) => {
    if (!question) return null;

    const questionType = question.questionType?.toUpperCase();
    const isMcq = questionType === "MCQ";

    const hasAnswer = isMcq
        ? Boolean(selectedAnswer)
        : Boolean(answer?.trim());

    const getQuestionIcon = () => {
        switch (questionType) {
            case "CODING":
                return <Code2 size={19} />;
            case "HR":
                return <MessageSquare size={19} />;
            case "BEHAVIORAL":
                return <Users size={19} />;
            case "MCQ":
                return <HelpCircle size={19} />;
            default:
                return <FileText size={19} />;
        }
    };

    const getDifficultyStyle = () => {
        switch (question.difficulty?.toUpperCase()) {
            case "EASY":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "MEDIUM":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "HARD":
                return "bg-rose-50 text-rose-700 border-rose-200";
            default:
                return "bg-orange-50 text-orange-700 border-orange-200";
        }
    };

    const handleChange = (value) => {
        if (onAnswerChange) {
            onAnswerChange(value);
        }
    };

    return (
        <article className="relative overflow-hidden rounded-[26px] border border-violet-100/90 bg-white shadow-[0_12px_45px_-25px_rgba(91,33,182,0.3)]">

            {/* Gradient accent */}
            <div className="h-1.5 bg-gradient-to-r from-violet-700 via-purple-500 to-indigo-500" />

            {/* QUESTION HEADER */}
            <header className="relative overflow-hidden border-b border-violet-100/80 bg-gradient-to-br from-[#F6F1FF] via-white to-[#F2F3FF] !px-5 !py-6 sm:px-7 sm:py-7">

                <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-violet-200/30 blur-3xl" />

                <div className="relative">

                    <div className="flex flex-wrap items-center justify-between gap-3">

                        <div className="inline-flex items-center gap-2.5 rounded-2xl border border-violet-100 bg-white/90 !px-3 !py-2 shadow-sm">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200">
                                {getQuestionIcon()}
                            </span>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                    Challenge type
                                </p>
                                <p className="mt-0.5 text-sm font-extrabold text-violet-800">
                                    {questionType || "QUESTION"}
                                </p>
                            </div>
                        </div>

                        {question.maxScore !== undefined && (
                            <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white/90 !px-3 !py-2.5 shadow-sm">
                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <Target size={17} />
                                </span>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Maximum
                                    </p>
                                    <p className="text-sm font-extrabold text-emerald-700">
                                        {question.maxScore} marks
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {(question.skill || question.difficulty) && (
                        <div className="mt-5 flex flex-wrap items-center gap-2">
                            {question.skill && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 !px-3 !py-1.5 text-xs font-bold text-blue-700">
                                    <Code2 size={13} />
                                    {question.skill}
                                </span>
                            )}

                            {question.difficulty && (
                                <span
                                    className={`inline-flex items-center rounded-full border !px-3 !py-1.5 text-xs font-bold ${getDifficultyStyle()}`}
                                >
                                    {question.difficulty} difficulty
                                </span>
                            )}
                        </div>
                    )}

                    {/* Main question */}
                    <div className="mt-7 flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
                            <span className="text-lg font-black">Q</span>
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="h-1 w-5 rounded-full bg-violet-500" />
                                <p className="text-[10px] font-extrabold uppercase tracking-[0.19em] text-violet-600">
                                    Interview question
                                </p>
                            </div>

                            <h2 className="break-words text-xl font-extrabold leading-8 tracking-tight text-slate-900 sm:text-2xl sm:leading-9">
                                {question.question}
                            </h2>

                            <p className="mt-3 text-xs leading-5 text-slate-500">
                                Read carefully, think through your approach,
                                and choose or write your best answer.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* ANSWER WORKSPACE */}
            <section className="!px-5 !py-6 sm:px-7 sm:py-7">

                {isMcq ? (
                    <div>

                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-base font-extrabold text-slate-900">
                                    Choose your answer
                                </h3>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Select one option from the choices below.
                                </p>
                            </div>

                            <span className="shrink-0 rounded-xl bg-violet-50 !px-3 !py-2 text-xs font-bold text-violet-700">
                                {question.options?.length || 0} options
                            </span>
                        </div>

                        <div className="space-y-3">
                            {question.options?.map((option, index) => {
                                const isSelected = selectedAnswer === option;

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => handleChange(option)}
                                        aria-pressed={isSelected}
                                        className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border !p-4 text-left transition-all duration-200 sm:gap-4 sm:p-5 ${
                                            isSelected
                                                ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100 shadow-sm"
                                                : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/40"
                                        } ${
                                            disabled
                                                ? "cursor-not-allowed opacity-75"
                                                : "cursor-pointer"
                                        }`}
                                    >
                                        {isSelected && (
                                            <span className="absolute bottom-0 left-0 top-0 w-1 bg-violet-600" />
                                        )}

                                        <span
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold transition-all ${
                                                isSelected
                                                    ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                                                    : "bg-slate-100 text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-700"
                                            }`}
                                        >
                                            {String.fromCharCode(65 + index)}
                                        </span>

                                        <span
                                            className={`min-w-0 flex-1 break-words text-sm font-semibold leading-6 sm:text-base ${
                                                isSelected
                                                    ? "text-violet-950"
                                                    : "text-slate-700"
                                            }`}
                                        >
                                            {option}
                                        </span>

                                        {isSelected ? (
                                            <CheckCircle2
                                                size={22}
                                                className="shrink-0 text-violet-600"
                                            />
                                        ) : (
                                            <Circle
                                                size={21}
                                                className="shrink-0 text-slate-300 transition-colors group-hover:text-violet-400"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {hasAnswer && (
                            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 !px-4 !py-3">
                                <CheckCircle2
                                    size={17}
                                    className="shrink-0 text-emerald-600"
                                />
                                <p className="text-xs font-semibold text-emerald-700">
                                    Option selected. You can change it before final submission.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>

                        {/* Editor header */}
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                                    {questionType === "CODING" ? (
                                        <Code2 size={21} />
                                    ) : (
                                        <MessageSquare size={21} />
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900">
                                        Your answer
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Express your thinking clearly.
                                    </p>
                                </div>
                            </div>

                            <span className="hidden items-center gap-1.5 rounded-xl bg-violet-50 !px-3 !py-2 text-xs font-bold text-violet-700 sm:inline-flex">
                                <Sparkles size={14} />
                                Smart evaluation
                            </span>
                        </div>

                        {/* Text editor */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#FAF9FD] transition-all duration-200 focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">

                            <div className="flex items-center justify-between border-b border-slate-200/80 bg-white !px-4 !py-3">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-rose-400" />
                                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                </div>

                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {questionType === "CODING"
                                        ? "Solution editor"
                                        : "Response editor"}
                                </span>
                            </div>

                            <textarea
                                value={answer || ""}
                                onChange={(e) => handleChange(e.target.value)}
                                disabled={disabled}
                                rows={9}
                                placeholder={
                                    questionType === "CODING"
                                        ? "// Write your solution or explain your approach..."
                                        : "Start typing your answer here...\n\nExplain your reasoning and include examples where relevant."
                                }
                                className="min-h-[220px] w-full resize-y bg-transparent !px-4 !py-5 text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 sm:min-h-[280px] sm:px-5"
                            />

                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 bg-white !px-4 !py-3 sm:px-5">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Sparkles
                                        size={15}
                                        className="text-violet-500"
                                    />
                                    AI-powered answer evaluation
                                </div>

                                <span className="rounded-lg bg-slate-100 !px-2.5 !py-1.5 text-xs font-bold text-slate-500">
                                    {(answer || "").length} characters
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 !p-4">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600">
                                <HelpCircle size={17} />
                            </span>

                            <div>
                                <p className="text-xs font-bold text-blue-900">
                                    Interview tip
                                </p>
                                <p className="mt-1 text-xs leading-5 text-blue-800/80">
                                    {questionType === "CODING"
                                        ? "Explain your approach, consider edge cases, and mention time or space complexity where relevant."
                                        : questionType === "BEHAVIORAL" || questionType === "HR"
                                            ? "Use a clear example, describe your actions, and explain the outcome."
                                            : "Organize your answer into clear points and support your reasoning with relevant examples."}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* SUBMISSION FOOTER */}
            <footer className="border-t border-slate-100 bg-gradient-to-r from-slate-50 to-violet-50/50 !px-5 !py-5 sm:px-7">

                <div className="flex flex-col gap-4">

                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                hasAnswer
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-amber-100 text-amber-600"
                            }`}
                        >
                            {hasAnswer ? (
                                <CheckCircle2 size={20} />
                            ) : (
                                <FileText size={19} />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-extrabold text-slate-800">
                                {hasAnswer
                                    ? "Answer added"
                                    : "Question not answered"}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                {hasAnswer
                                    ? showSubmitButton
                                        ? "Submit your response when you're satisfied."
                                        : "Your answer is kept in the session and included in the final submission."
                                    : showSubmitButton
                                        ? "You can select an option or write a response before submitting."
                                        : "You can skip this question. It will be included as an empty answer when you submit the interview."}
                            </p>
                        </div>

                        <ShieldCheck
                            size={22}
                            className="hidden shrink-0 text-violet-400 sm:block"
                        />
                    </div>

                    {showSubmitButton && (
                        <>
                            <button
                                type="button"
                                onClick={onSubmit}
                                disabled={disabled || submitting || !hasAnswer}
                                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-violet-600 to-indigo-600 !px-6 !py-4 text-sm font-extrabold text-white shadow-lg shadow-violet-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-200 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                            >
                                {submitting ? (
                                    <>
                                        <LoaderCircle
                                            size={19}
                                            className="animate-spin"
                                        />
                                        Evaluating answer...
                                    </>
                                ) : (
                                    <>
                                        <Send
                                            size={18}
                                            className="transition-transform group-hover:translate-x-0.5"
                                        />
                                        Submit answer
                                        <ArrowUpRight
                                            size={17}
                                            className="ml-auto opacity-80"
                                        />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-[11px] leading-5 text-slate-400">
                                {isMcq
                                    ? "Your selected option will be submitted for evaluation."
                                    : "Make sure your response is complete before submitting."}
                            </p>
                        </>
                    )}

                </div>
            </footer>
        </article>
    );
};

export default QuestionCard;

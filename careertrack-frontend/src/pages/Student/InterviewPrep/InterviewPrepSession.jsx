import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Clock,
    Loader2,
    Sparkles
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getInterviewPrepQuestions,
    submitInterviewPrepAnswer,
    completeInterviewPrep
} from "../../../services/interviewPrepService";
import AnswerFeedback from "../../../components/InterviewPrep/AnswerFeedback";
import QuestionCard from "../../../components/InterviewPrep/QuestionCard";

const InterviewPrepSession = () => {

    const navigate = useNavigate();
    const { sessionId } = useParams();

    const [questions, setQuestions] = useState([]);

    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [answer, setAnswer] = useState("");

const [answers, setAnswers] = useState({});

    const [loading, setLoading] =
        useState(true);

    const [completing, setCompleting] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {

        loadQuestions();

    }, [sessionId]);

    const loadQuestions = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getInterviewPrepQuestions(
                    sessionId
                );

            setQuestions(data);

        } catch (error) {

            console.error(
                "Interview Prep questions error:",
                error
            );

            setError(
                "Unable to load interview questions."
            );

        } finally {

            setLoading(false);

        }
    };

    const currentQuestion =
        questions[currentIndex];

    const progress =
        questions.length > 0
            ? ((currentIndex + 1) / questions.length) * 100
            : 0;

    const handleNext = () => {

    if (!answer.trim()) {
        setError("Please answer this question before continuing.");
        return;
    }

    const updatedAnswers = {
        ...answers,
        [currentQuestion.id]: answer
    };

    setAnswers(updatedAnswers);
    setError("");

    if (currentIndex < questions.length - 1) {

        setCurrentIndex((prev) => prev + 1);
        setAnswer("");

    } else {

        handleComplete(updatedAnswers);
    }
};

    const handleComplete = async (allAnswers) => {

    try {

        setCompleting(true);
        setError("");

        console.log("ALL ANSWERS:", allAnswers);

        await completeInterviewPrep(
            sessionId,
            allAnswers
        );

        navigate(
            `/student/interview-prep/result/${sessionId}`
        );

    } catch (error) {

        console.error(
            "Complete Interview Prep error:",
            error
        );

        setError(
            error?.message ||
            "Unable to complete Interview Prep."
        );

    } finally {

        setCompleting(false);
    }
};

    if (loading) {

        return (
            <div className="
                min-h-screen
                bg-[#f8f9ff]
                flex
                items-center
                justify-center
            ">

                <div className="
                    text-center
                    text-gray-500
                ">

                    <Loader2
                        size={32}
                        className="
                            animate-spin
                            mx-auto
                            mb-3
                            text-purple-600
                        "
                    />

                    Loading your AI interview...

                </div>

            </div>
        );
    }

    if (!questions.length) {

        return (
            <div className="
                min-h-screen
                bg-[#f8f9ff]
                flex
                items-center
                justify-center
                !p-6
            ">

                <div className="
                    bg-white
                    rounded-2xl
                    !p-8
                    text-center
                    shadow-sm
                    border
                    border-gray-200
                    max-w-md
                    w-full
                ">

                    <h2 className="
                        text-xl
                        font-bold
                        text-gray-900
                        mb-2
                    ">
                        No Questions Found
                    </h2>

                    <p className="
                        text-gray-500
                        mb-6
                    ">
                        We couldn't find questions for
                        this Interview Prep session.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/student/interview-prep"
                            )
                        }
                        className="
                            !px-5
                            !py-3
                            rounded-xl
                            bg-purple-600
                            text-white
                            font-medium
                            hover:bg-purple-700
                        "
                    >
                        Back to Interview Prep
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="
            min-h-screen
            bg-[#f8f9ff]
            p-6
        ">

            <div className="
                max-w-4xl
                mx-auto
            ">

                {/* Top navigation */}

                <div className="
                    flex
                    items-center
                    justify-between
                    mb-6
                ">

                    <button
                        onClick={() =>
                            navigate(
                                "/student/interview-prep"
                            )
                        }
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-600
                            hover:text-purple-600
                        "
                    >

                        <ArrowLeft size={18} />

                        Exit Interview Prep

                    </button>

                    <div className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-gray-500
                    ">

                        <Clock size={17} />

                        AI Interview Session

                    </div>

                </div>

                {/* Progress */}

                <div className="
                    bg-white
                    rounded-2xl
                    border
                    border-gray-200
                    !p-5
                    mb-6
                ">

                    <div className="
                        flex
                        items-center
                        justify-between
                        mb-3
                    ">

                        <span className="
                            text-sm
                            font-medium
                            text-gray-700
                        ">
                            Question {currentIndex + 1}
                            {" "}
                            of
                            {" "}
                            {questions.length}
                        </span>

                        <span className="
                            text-sm
                            font-semibold
                            text-purple-600
                        ">
                            {Math.round(progress)}%
                        </span>

                    </div>

                    <div className="
                        h-2
                        bg-gray-100
                        rounded-full
                        overflow-hidden
                    ">

                        <div
                            className="
                                h-full
                                bg-purple-600
                                rounded-full
                                transition-all
                                duration-300
                            "
                            style={{
                                width: `${progress}%`
                            }}
                        />

                    </div>

                </div>

                {/* Error */}

                {error && (

                    <div className="
                        mb-6
                        !px-5
                        !py-4
                        rounded-xl
                        bg-red-50
                        border
                        border-red-200
                        text-red-600
                        text-sm
                    ">
                        {error}
                    </div>

                )}

                {/* Question */}

                <div className="
                    bg-white
                    rounded-3xl
                    border
                    border-gray-200
                    shadow-sm
                    overflow-hidden
                ">

                    <QuestionCard
    question={currentQuestion}
    selectedAnswer={answer}
    answer={answer}
    onAnswerChange={setAnswer}
/>

<div className="!p-6 border-t border-gray-100">

    <button
        type="button"
        onClick={handleNext}
        disabled={completing}
        className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            !py-3.5
            rounded-xl
            bg-purple-600
            text-white
            font-semibold
            hover:bg-purple-700
            disabled:opacity-50
            disabled:cursor-not-allowed
        "
    >
        {completing
            ? "Submitting..."
            : currentIndex < questions.length - 1
                ? "Next Question"
                : "Submit Interview"}
    </button>

</div>

                </div>

                {/* AI indicator */}

                <div className="
                    mt-5
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-xs
                    text-gray-400
                ">

                    <Sparkles size={14} />

                    Questions and evaluation are
                    powered by AI.

                </div>

            </div>

        </div>
    );
};

export default InterviewPrepSession;
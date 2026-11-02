import {
    CheckCircle,
    Lightbulb,
    MessageSquare,
    Target,
    XCircle
} from "lucide-react";

const AnswerFeedback = ({ evaluation }) => {

    if (!evaluation) {
        return null;
    }

    const score = Number(evaluation.score ?? 0);

    const maxScore = 10;

    const percentage = Math.min(
        100,
        Math.max(0, (score / maxScore) * 100)
    );

    return (
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <MessageSquare
                            size={20}
                            className="text-purple-600"
                        />
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900">
                            AI Answer Feedback
                        </h3>

                        <p className="text-sm text-gray-500">
                            Here's how your answer was evaluated
                        </p>
                    </div>

                </div>

                {/* Score */}
                <div className="text-right">

                    <div className="text-2xl font-bold text-purple-600">
                        {score}/{maxScore}
                    </div>

                    <div className="text-xs text-gray-500">
                        Score
                    </div>

                </div>

            </div>

            {/* Score Progress */}
            <div className="px-6 pt-5">

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">

                    <div
                        className="h-full bg-purple-600 rounded-full transition-all duration-500"
                        style={{
                            width: `${percentage}%`
                        }}
                    />

                </div>

            </div>

            {/* Feedback */}
            <div className="p-6 space-y-5">

                {evaluation.feedback && (
                    <div className="flex gap-4">

                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <MessageSquare
                                size={18}
                                className="text-blue-600"
                            />
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                                Feedback
                            </h4>

                            <p className="text-gray-600 leading-relaxed">
                                {evaluation.feedback}
                            </p>
                        </div>

                    </div>
                )}

                {evaluation.idealAnswer && (
                    <div className="flex gap-4">

                        <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                            <CheckCircle
                                size={18}
                                className="text-green-600"
                            />
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                                Ideal Answer
                            </h4>

                            <p className="text-gray-600 leading-relaxed">
                                {evaluation.idealAnswer}
                            </p>
                        </div>

                    </div>
                )}

                {evaluation.missingPoints && (
                    <div className="flex gap-4">

                        <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                            <Target
                                size={18}
                                className="text-orange-600"
                            />
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                                Missing Points
                            </h4>

                            <p className="text-gray-600 leading-relaxed">
                                {evaluation.missingPoints}
                            </p>
                        </div>

                    </div>
                )}

            </div>

            {/* Bottom Tip */}
            <div className="px-6 py-4 bg-purple-50 border-t border-purple-100 flex gap-3">

                <Lightbulb
                    size={19}
                    className="text-purple-600 shrink-0 mt-0.5"
                />

                <p className="text-sm text-purple-800">
                    Review the feedback and improve your answer before
                    moving to the next question.
                </p>

            </div>

        </div>
    );
};

export default AnswerFeedback;
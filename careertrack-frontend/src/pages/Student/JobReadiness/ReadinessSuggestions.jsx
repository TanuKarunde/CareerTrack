import {
    Lightbulb,
    CheckCircle2,
    Sparkles
} from "lucide-react";

const ReadinessSuggestions = ({ report }) => {

    const suggestions = report?.suggestions ?? [];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white !p-6 shadow-sm">

            {/* Header */}
            <div className="mb-5 flex items-start gap-3">

                <div className="rounded-xl bg-amber-100 !p-3">
                    <Lightbulb
                        size={24}
                        className="text-amber-600"
                    />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        Personalized Recommendations
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Take these steps to improve your job readiness.
                    </p>
                </div>

            </div>

            {/* Suggestions */}
            {suggestions.length > 0 ? (
                <div className="space-y-3">

                    {suggestions.map((suggestion, index) => (
                        <div
                            key={`${index}-${suggestion}`}
                            className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 !p-4 transition hover:border-purple-200 hover:bg-purple-50"
                        >
                            <div className="mt-0.5 shrink-0 rounded-full bg-purple-100 !p-1.5">
                                <CheckCircle2
                                    size={16}
                                    className="text-purple-700"
                                />
                            </div>

                            <div className="flex-1">
                                <p className="text-sm leading-6 text-gray-700">
                                    {suggestion}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>
            ) : (
                <div className="rounded-xl border border-green-100 bg-green-50 !p-5 text-center">

                    <Sparkles
                        size={28}
                        className="mx-auto mb-2 text-green-600"
                    />

                    <h3 className="font-semibold text-green-800">
                        You're making progress!
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-green-700">
                        There are no specific recommendations in this report.
                        Continue practising and updating your profile.
                    </p>

                </div>
            )}

            {/* Footer */}
            <p className="mt-5 text-xs leading-5 text-gray-400">
                Recommendations are based on the latest readiness report
                returned by CareerTrack.
            </p>

        </div>
    );
};

export default ReadinessSuggestions;

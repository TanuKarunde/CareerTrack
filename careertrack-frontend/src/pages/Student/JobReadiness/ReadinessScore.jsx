import { Target, TrendingUp } from "lucide-react";

const ReadinessScore = ({ score = 0 }) => {

    const readinessScore = Math.min(
        100,
        Math.max(0, Number(score) || 0)
    );

    const getReadinessStatus = () => {
        if (readinessScore >= 80) {
            return {
                title: "Excellent Readiness",
                description: "Your profile looks well aligned with this job.",
                color: "text-green-700",
                barColor: "bg-green-500",
                bgColor: "bg-green-50"
            };
        }

        if (readinessScore >= 60) {
            return {
                title: "Good Progress",
                description: "You're on the right track. Improve your remaining gaps.",
                color: "text-purple-700",
                barColor: "bg-purple-600",
                bgColor: "bg-purple-50"
            };
        }

        if (readinessScore >= 40) {
            return {
                title: "Needs Improvement",
                description: "Focus on missing skills and strengthening your profile.",
                color: "text-amber-700",
                barColor: "bg-amber-500",
                bgColor: "bg-amber-50"
            };
        }

        return {
            title: "Keep Building",
            description: "Develop relevant skills and projects to improve your score.",
            color: "text-red-700",
            barColor: "bg-red-500",
            bgColor: "bg-red-50"
        };
    };

    const status = getReadinessStatus();

    return (
        <div className="rounded-2xl border border-gray-200 bg-white !p-6 shadow-sm">

            {/* Header */}
            <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-purple-100 !p-3">
                    <Target className="text-purple-700" size={24} />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        Job Readiness Score
                    </h2>

                    <p className="text-sm text-gray-500">
                        See how well your profile matches this job
                    </p>
                </div>
            </div>

            {/* Score */}
            <div className="mb-5 flex items-center justify-between gap-4">

                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold text-gray-900">
                            {readinessScore}
                        </span>

                        <span className="text-lg font-medium text-gray-400">
                            / 100
                        </span>
                    </div>

                    <p className={`mt-2 text-sm font-semibold ${status.color}`}>
                        {status.title}
                    </p>
                </div>

                <div className={`rounded-full !p-4 ${status.bgColor}`}>
                    <TrendingUp
                        size={30}
                        className={status.color}
                    />
                </div>

            </div>

            {/* Progress bar */}
            <div
                className="mb-3 h-3 w-full overflow-hidden rounded-full bg-gray-100"
                role="progressbar"
                aria-label="Job readiness score"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={readinessScore}
            >
                <div
                    className={`h-full rounded-full transition-all duration-700 ${status.barColor}`}
                    style={{ width: `${readinessScore}%` }}
                />
            </div>

            {/* Description */}
            <p className="text-sm leading-6 text-gray-600">
                {status.description}
            </p>

            <p className="mt-3 text-xs text-gray-400">
                This score measures alignment with the job requirements.
                It is not a guarantee of selection.
            </p>

        </div>
    );
};

export default ReadinessScore;

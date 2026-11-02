
import {
    Code2,
    FolderKanban,
    UserRound,
    ClipboardCheck,
    BriefcaseBusiness,
    BookOpen
} from "lucide-react";

const ReadinessBreakdown = ({ report }) => {
    const breakdown = [
        {
            title: "Skill Match",
            score: report?.skillMatchScore,
            icon: Code2,
            color: "text-purple-700",
            bgColor: "bg-purple-100",
            barColor: "bg-purple-600",
            description: "How your skills match the job requirements"
        },
        {
            title: "Experience",
            score: report?.experienceScore,
            icon: BriefcaseBusiness,
            color: "text-indigo-700",
            bgColor: "bg-indigo-100",
            barColor: "bg-indigo-600",
            description: "Relevant work experience or fresher suitability"
        },
        {
            title: "Projects",
            score: report?.projectScore,
            icon: FolderKanban,
            color: "text-blue-700",
            bgColor: "bg-blue-100",
            barColor: "bg-blue-600",
            description: "Projects demonstrating relevant skills"
        },
        {
            title: "Education",
            score: report?.educationScore,
            icon: BookOpen,
            color: "text-amber-700",
            bgColor: "bg-amber-100",
            barColor: "bg-amber-500",
            description: "Completeness of your education details"
        },
        {
            title: "Profile",
            score: report?.profileScore,
            icon: UserRound,
            color: "text-green-700",
            bgColor: "bg-green-100",
            barColor: "bg-green-600",
            description: "Completeness of your student profile"
        },
        {
            title: "About / Bio",
            score: report?.aboutScore,
            icon: ClipboardCheck,
            color: "text-pink-700",
            bgColor: "bg-pink-100",
            barColor: "bg-pink-600",
            description: "Quality and completeness of your introduction"
        }
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white !p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                    Score Breakdown
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Understand how your readiness score is calculated.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {breakdown.map((item) => {
                    const Icon = item.icon;

                    const score = Math.min(
                        100,
                        Math.max(0, Number(item.score) || 0)
                    );

                    return (
                        <div
                            key={item.title}
                            className="rounded-xl border border-gray-100 bg-gray-50 !p-4"
                        >
                            <div className="mb-3 flex items-start gap-3">
                                <div className={`rounded-lg !p-2 ${item.bgColor}`}>
                                    <Icon
                                        size={20}
                                        className={item.color}
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-gray-800">
                                        {item.title}
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    Score
                                </span>

                                <span className="text-lg font-bold text-gray-900">
                                    {score}
                                    <span className="ml-1 text-xs font-medium text-gray-400">
                                        / 100
                                    </span>
                                </span>
                            </div>

                            <div
                                className="h-2 overflow-hidden rounded-full bg-gray-200"
                                role="progressbar"
                                aria-label={`${item.title} score`}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={score}
                            >
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                                    style={{ width: `${score}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ReadinessBreakdown;

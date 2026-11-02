import { useState } from "react";
import { BriefcaseBusiness, AlertCircle } from "lucide-react";
import ReadinessActions from "./ReadinessActions";
import ReadinessScore from "./ReadinessScore";
import ReadinessBreakdown from "./ReadinessBreakdown";
import SkillGapAnalysis from "./SkillGapAnalysis";
import ReadinessSuggestions from "./ReadinessSuggestions";



const JobReadinessCard = ({ jobId, jobTitle }) => {

    const [report, setReport] = useState(null);
    const [error, setError] = useState("");

    const handleReportLoaded = (data) => {
        setReport(data);
        setError("");
    };

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex items-start gap-3">

                <div className="rounded-xl bg-purple-100 !p-3">
                    <BriefcaseBusiness
                        size={26}
                        className="text-purple-700"
                    />
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Job Readiness Analyzer
                    </h1>

                    <p className="mt-1 text-sm leading-6 text-gray-500">
                        Understand how well your profile matches a job
                        and identify areas for improvement.
                    </p>

                    {jobTitle && (
                        <p className="mt-2 text-sm font-semibold text-purple-700">
                            Analyzing: {jobTitle}
                        </p>
                    )}

                </div>

            </div>

            {/* Action Buttons */}
            <div className="rounded-2xl border border-gray-200 bg-white !p-5 shadow-sm">
                <h2 className="mb-2 font-semibold text-gray-900">
                    Analyze Your Profile
                </h2>

                <p className="mb-4 text-sm leading-6 text-gray-500">
                    Calculate your readiness using your current profile,
                    projects, and the selected job's requirements.
                </p>

                <ReadinessActions
                    jobId={jobId}
                    onReportLoaded={handleReportLoaded}
                />
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 !p-4">
                    <AlertCircle
                        size={20}
                        className="mt-0.5 text-red-600"
                    />

                    <p className="text-sm text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {/* Readiness Results */}
            {report ? (
                <>
                    <ReadinessScore
                        score={report.readinessScore}
                    />

                    <ReadinessBreakdown
                        report={report}
                    />

                    <SkillGapAnalysis
                        report={report}
                    />

                    <ReadinessSuggestions
                        report={report}
                    />
                </>
            ) : (
                <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 !px-6 !py-12 text-center">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
                        <BriefcaseBusiness
                            size={26}
                            className="text-purple-700"
                        />
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900">
                        Your readiness report will appear here
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                        Click "Check My Readiness" to calculate your score,
                        view matching skills, identify skill gaps, and get
                        personalized recommendations.
                    </p>

                </div>
            )}

        </div>
    );
};

export default JobReadinessCard;

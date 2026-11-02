import { useState } from "react";
import { Target, RefreshCw, FileText } from "lucide-react";
import { calculateReadiness, getReadiness } from "../../../services/readinessService";


const ReadinessActions = ({ jobId, onReportLoaded }) => {

    const [loading, setLoading] = useState(false);
    const [action, setAction] = useState("");
    const [error, setError] = useState("");

    const handleAction = async (type) => {
        if (!jobId) {
            setError("Job ID is missing.");
            return;
        }

        setLoading(true);
        setAction(type);
        setError("");

        try {
            let report;

            if (type === "calculate") {
                report = await calculateReadiness(jobId);
            } else {
                report = await getReadiness(jobId);
            }

            onReportLoaded?.(report);

        } catch (err) {
            setError(
                err.message ||
                (type === "calculate"
                    ? "Unable to calculate readiness."
                    : "Unable to load saved report.")
            );
        } finally {
            setLoading(false);
            setAction("");
        }
    };

    return (
        <div className="space-y-3">

            <div className="flex flex-wrap gap-3">

                <button
                    type="button"
                    onClick={() => handleAction("calculate")}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 !px-5 !py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading && action === "calculate" ? (
                        <RefreshCw size={17} className="animate-spin" />
                    ) : (
                        <Target size={17} />
                    )}

                    {loading && action === "calculate"
                        ? "Analyzing..."
                        : "Check My Readiness"}
                </button>

                <button
                    type="button"
                    onClick={() => handleAction("saved")}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white !px-5 !py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading && action === "saved" ? (
                        <RefreshCw size={17} className="animate-spin" />
                    ) : (
                        <FileText size={17} />
                    )}

                    {loading && action === "saved"
                        ? "Loading Report..."
                        : "View Saved Report"}
                </button>

            </div>

            {error && (
                <p
                    role="alert"
                    className="rounded-lg border border-red-100 bg-red-50 !p-3 text-sm text-red-700"
                >
                    {error}
                </p>
            )}

        </div>
    );
};

export default ReadinessActions;
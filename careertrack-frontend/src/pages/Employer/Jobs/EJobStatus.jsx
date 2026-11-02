
import { useState } from "react";
import { CheckCircle2, PauseCircle, LoaderCircle } from "lucide-react";
import { updateJobStatus } from "../../../services/employerService";

const EJobStatus = ({ job, onStatusChange }) => {
    const [loading, setLoading] = useState(false);

    const isActive =
        job?.active === true ||
        job?.active === "true";

    const handleStatusChange = async () => {
        if (loading) return;

        try {
            setLoading(true);

            const updatedJob = await updateJobStatus(
                job.id,
                !isActive
            );

            onStatusChange?.(updatedJob);
        } catch (err) {
            console.error("Status update error:", err);
            alert(err?.message || "Failed to update job status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleStatusChange}
            disabled={loading}
            aria-label={`Change job status from ${isActive ? "active" : "paused"}`}
            className={`
                inline-flex min-w-[105px] items-center justify-center gap-2
                !px-4 !py-2 rounded-full
                text-xs font-bold border transition-all duration-200
                shadow-sm hover:shadow-md
                ${
                    isActive
                        ? `
                            bg-gradient-to-r from-emerald-50 to-teal-50
                            text-emerald-700 border-emerald-200
                            hover:from-emerald-100 hover:to-teal-100
                        `
                        : `
                            bg-gradient-to-r from-orange-50 to-amber-50
                            text-orange-700 border-orange-200
                            hover:from-orange-100 hover:to-amber-100
                        `
                }
                ${
                    loading
                        ? "opacity-60 cursor-not-allowed"
                        : "active:scale-95"
                }
            `}
        >
            {loading ? (
                <LoaderCircle size={14} className="animate-spin" />
            ) : isActive ? (
                <CheckCircle2 size={14} />
            ) : (
                <PauseCircle size={14} />
            )}

            {loading
                ? "Updating..."
                : isActive
                    ? "Active"
                    : "Paused"}
        </button>
    );
};

export default EJobStatus;

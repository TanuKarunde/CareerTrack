
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Download,
    FileText,
    LoaderCircle,
} from "lucide-react";

import {
    downloadApplicationResume,
    viewApplicationResume,
} from "../../../services/employerService";

const ResumeViewer = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [resumeUrl, setResumeUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        let objectUrl = "";

        const loadResume = async () => {
            try {
                setLoading(true);
                setError("");
                setResumeUrl("");

                objectUrl = await viewApplicationResume(applicationId);

                if (cancelled) {
                    URL.revokeObjectURL(objectUrl);
                    return;
                }

                setResumeUrl(objectUrl);
            } catch (err) {
                console.error("Error loading resume:", err);

                if (!cancelled) {
                    setError(
                        err.message || "Unable to load resume."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadResume();

        return () => {
            cancelled = true;

            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [applicationId]);

    const handleDownload = async () => {
        try {
            setDownloading(true);
            setError("");

            await downloadApplicationResume(
                applicationId,
                "resume.pdf"
            );
        } catch (err) {
            console.error("Error downloading resume:", err);
            setError(
                err.message || "Unable to download resume."
            );
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F6FF] p-4 md:p-8">
            <div className="mx-auto max-w-8xl">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between rounded-2xl border border-purple-100 bg-white !p-5 shadow-sm">
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="gap-3 !p-3 text-purple-700 transition hover:bg-purple-50"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-purple-100 !p-3 text-purple-700">
                                <FileText size={22} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Resume Viewer
                                </h1>

                                <p className="text-sm text-gray-500">
                                    Application ID: {applicationId}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleDownload}
                        disabled={downloading || loading || !!error}
                        className="flex items-center gap-2 rounded-xl bg-purple-600 !px-5 !py-3 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {downloading ? (
                            <LoaderCircle
                                size={18}
                                className="animate-spin"
                            />
                        ) : (
                            <Download size={18} />
                        )}

                        {downloading
                            ? "Downloading..."
                            : "Download Resume"}
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white shadow-sm">
                        <LoaderCircle
                            size={36}
                            className="mb-4 animate-spin text-purple-600"
                        />

                        <p className="font-medium text-gray-700">
                            Loading resume...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-200 bg-white !p-8 text-center shadow-sm">
                        <p className="font-semibold text-red-600">
                            Unable to open resume
                        </p>

                        <p className="mt-2 text-sm text-gray-600">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="mt-5 rounded-xl bg-purple-600 !px-5 !py-3 font-medium text-white hover:bg-purple-700"
                        >
                            Go Back
                        </button>
                    </div>
                )}

                {/* Resume */}
                {!loading && !error && resumeUrl && (
                    <div className="overflow-hidden bg-white shadow-sm">
                        <iframe
                            src={resumeUrl}
                            title="Applicant Resume"
                            className="h-screen min-h-[600px] w-full"
                            style={{ border: "none" }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeViewer;

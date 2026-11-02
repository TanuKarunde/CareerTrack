
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    BriefcaseBusiness,
    CircleAlert,
    RefreshCw,
    Sparkles,
} from "lucide-react";

import EditJobForm from "./EditJobForm";
import {
    getJobById,
    updateJob,
} from "../../../services/jobService";

import Sidebar from "../../../components/Sidebar/Sidebar";
import EmployerNavbar from "../ENavbar/EmployerNavbar";

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadJob = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getJobById(id);

                if (active) {
                    setJob(data);
                }
            } catch (err) {
                console.error("Error fetching job:", err);

                if (active) {
                    setError(
                        err?.message ||
                        "Unable to load job details."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadJob();

        return () => {
            active = false;
        };
    }, [id]);

    const fetchJob = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getJobById(id);
            setJob(data);
        } catch (err) {
            console.error("Error fetching job:", err);
            setError(err?.message || "Unable to load job details.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            setError("");

            const updatedJob = await updateJob(id, formData);

            if (updatedJob) {
                setJob(updatedJob);
            } else {
                setJob((previous) => ({
                    ...previous,
                    ...formData,
                }));
            }

            return true;
        } catch (err) {
            console.error("Error updating job:", err);
            setError(err?.message || "Unable to update job.");
            return false;
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f5ff] flex items-center justify-center !p-6">
                <div className="w-full max-w-sm rounded-3xl border border-purple-100 bg-white !p-9 text-center shadow-xl shadow-purple-100/50">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                        <RefreshCw size={28} className="animate-spin" />
                    </div>

                    <h2 className="text-lg font-bold text-gray-900">
                        Preparing your workspace
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Loading your job posting details...
                    </p>

                    <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-purple-50">
                        <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-violet-400" />
                    </div>
                </div>
            </div>
        );
    }

    if (error && !job) {
        return (
            <div className="min-h-screen bg-[#f7f5ff] flex items-center justify-center !p-6">
                <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white !p-8 text-center shadow-xl shadow-red-100/30">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <CircleAlert size={30} />
                    </div>

                    <h2 className="text-xl font-bold text-gray-900">
                        We couldn't load this job
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-red-500">
                        {error}
                    </p>

                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                        <button
                            type="button"
                            onClick={fetchJob}
                            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 !px-5 !py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/employer/jobs")}
                            className="rounded-xl border border-gray-200 bg-white !px-5 !py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                            Back to Jobs
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f5ff]">
            <div className="grid min-h-screen grid-cols-1 md:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)]">
                <aside className="sticky top-0 z-30 hidden h-screen md:block">
                    <Sidebar />
                </aside>

                <main className="min-w-0">
                    <EmployerNavbar />

                    <div className="mx-auto max-w-[1600px] !px-4 !py-5 sm:!px-6 lg:!px-8 lg:!py-8">

                        {/* Hero */}
                        <section className="relative mb-7 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#32106b] via-purple-700 to-violet-500 !p-6 text-white shadow-xl shadow-purple-200/60 sm:!p-8">
                            <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
                            <div className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-fuchsia-300/15 blur-2xl" />

                            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                                <div className="max-w-2xl">
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-1.5 text-xs font-semibold text-purple-100 backdrop-blur">
                                        <Sparkles size={14} />
                                        EMPLOYER WORKSPACE
                                    </div>

                                    <h1 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                                        Refine your next opportunity.
                                    </h1>

                                    <p className="mt-3 max-w-xl text-sm leading-6 text-purple-100 sm:text-base">
                                        Update the role, fine-tune the requirements, and make sure your posting attracts the right candidates.
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 !p-4 backdrop-blur-md lg:max-w-[280px]">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-purple-700 shadow-sm">
                                        <BriefcaseBusiness size={23} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-purple-100">
                                            Currently editing
                                        </p>
                                        <p
                                            title={job?.title || "Untitled job"}
                                            className="mt-1 truncate text-sm font-bold text-white"
                                        >
                                            {job?.title || "Untitled job"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {error && (
                            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 !p-4 text-sm text-red-700">
                                <CircleAlert size={19} className="mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-semibold">
                                        Update couldn't be completed
                                    </p>
                                    <p className="mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        <EditJobForm
                            key={String(id)}
                            initialData={job}
                            onSubmit={handleSubmit}
                            loading={saving}
                        />

                        <p className="mt-6 text-center text-xs text-gray-400">
                            CareerTrack · Make every opportunity count.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EditJob;

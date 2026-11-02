
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Bell, ChevronDown } from "lucide-react";

import { getApplicationById } from "../../../services/applicationService";
import { getJobById } from "../../../services/jobService";

import ApplicationHeader from "./ApplicationHeader";
import ApplicationInformation from "./ApplicationInformation";
import ApplicationTimeline from "./ApplicationTimeline";
import JobDetailCard from "./JobDetailCard";
import Sidebar from "../../../components/Sidebar/Sidebar";

const ApplicationDetails = () => {
    const { id } = useParams();

    const [application, setApplication] = useState(null);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadApplicationDetails = async () => {
            if (!id) {
                setError("Application ID is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const applicationData = await getApplicationById(id);

                if (cancelled) return;

                setApplication(applicationData);

                if (applicationData?.jobId) {
                    const jobData = await getJobById(applicationData.jobId);

                    if (cancelled) return;
                    setJob(jobData);
                } else if (applicationData?.job) {
                    setJob(applicationData.job);
                } else {
                    setJob(null);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("Failed to load application details:", err);
                    setError(
                        err?.message || "Unable to load application details."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadApplicationDetails();

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F6FC] flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-11 w-11 rounded-2xl bg-purple-100 flex items-center justify-center animate-pulse">
                        <div className="h-4 w-4 rounded-full bg-purple-600" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-gray-500">
                        Preparing your application details...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="min-h-screen bg-[#F7F6FC] flex items-center justify-center !p-5">
                <div className="max-w-md w-full rounded-3xl border border-purple-100 bg-white !p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                        <ArrowLeft size={25} />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-gray-900">
                        {error ? "Unable to load application" : "Application not found"}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        {error || "We couldn't find the requested application."}
                    </p>

                    <Link
                        to="/student/applications"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 !px-5 !py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                    >
                        <ArrowLeft size={17} />
                        Back to Applications
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F6FC] lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
            {/* Sidebar */}
            <aside className="relative z-20">
                <div className="lg:sticky lg:top-0 lg:h-screen">
                    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>
            </aside>

            {/* Main content */}
            <main className="min-w-0 !px-4 !py-5 sm:px-6 lg:px-8 lg:py-7 xl:px-10">
                <div className="mx-auto max-w-[1450px]">
                    {/* Top navigation */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <Link
                            to="/student/applications"
                            className="group inline-flex items-center gap-3 text-sm font-semibold text-gray-700 transition hover:text-purple-700"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-100 bg-white shadow-sm transition group-hover:border-purple-300 group-hover:bg-purple-50">
                                <ArrowLeft size={18} />
                            </span>
                            Back to Applications
                        </Link>

                    </div>

                    {/* Application overview + progress */}
                    <section className="mb-6">
                        <ApplicationHeader application={application} />
                        <div className="mt-5">
                            <ApplicationTimeline application={application} />
                        </div>
                    </section>

                    {/* Job details + application information */}
                    <section className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(310px,1fr)]">
                        <JobDetailCard job={job} />
                        <ApplicationInformation
                            application={application}
                            job={job}
                        />
                    </section>

                    <footer className="py-7 text-center text-xs text-gray-400">
                        CareerTrack · Every application brings you one step closer.
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default ApplicationDetails;

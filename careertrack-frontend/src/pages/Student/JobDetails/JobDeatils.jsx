
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Target, Sparkles, FileText, ClipboardCheck } from "lucide-react";

import {
    getCompanyByEmployer,
    getJobById
} from "../../../services/jobService";

import JobHeader from "./JobHeader";
import JobDescription from "./JobDescription";
import JobRequirements from "./JobRequirements";
import ComponyInfo from "./ComponyInfo";
import Sidebar from "../../../components/Sidebar/Sidebar";
import UserNavbar from "../Navbar/UserNavbar";
import ReadinessDrawer from "../JobReadiness/ReadinessDrawer";

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("description");
    const [isOpen, setIsOpen] = useState(false);
    const [isReadinessOpen, setIsReadinessOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("careertrack_token");

        setIsLoggedIn(Boolean(token && token !== "null" && token !== "undefined"));
    }, []);

    const handleBack = () => {
        navigate(isLoggedIn ? "/student/jobs" : "/");
    };

    useEffect(() => {
        let cancelled = false;

        const fetchJob = async () => {
            if (!id) {
                setError("Job ID is missing");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data = await getJobById(id);
                if (cancelled) return;

                setJob(data);

                if (data?.employerId) {
                    try {
                        const companyData = await getCompanyByEmployer(data.employerId);
                        if (!cancelled) setCompany(companyData);
                    } catch (companyError) {
                        console.error("Failed to load company:", companyError);
                    }
                }
            } catch (err) {
                console.error("Failed to load job:", err);
                if (!cancelled) {
                    setError(err?.message || "Unable to load job details");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchJob();
        return () => { cancelled = true; };
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F8F7FF]">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600" />
                    <p className="mt-4 text-sm font-medium text-slate-500">Preparing job details...</p>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F7FF] !p-6 text-center">
                <div className="rounded-2xl bg-white !p-8 shadow-lg shadow-purple-100">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                        <FileText size={26} />
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-[#202044]">
                        {error ? "Couldn't load this job" : "Job not found"}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">{error || "This job may no longer be available."}</p>
                    <button
                        type="button"
                        onClick={handleBack}
                        className="mt-6 rounded-xl bg-[#5841D8] !px-5 !py-3 text-sm font-bold text-white transition hover:bg-[#4935C0]"
                    >
                        {isLoggedIn ? "Back to Jobs" : "Back to Home"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F7FF]">
            {isLoggedIn && (
                <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[250px] lg:block">
                    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                </aside>
            )}

            <div className={`min-h-screen min-w-0 ${isLoggedIn ? "lg:!ml-[250px]" : "w-full"}`}>
                {isLoggedIn && (
                    <header className="sticky top-0 z-30 border-b border-purple-100/80 bg-white/90 shadow-sm backdrop-blur-xl">
                        <UserNavbar />
                    </header>
                )}

                <main className="mx-auto w-full max-w-[1600px] !px-4 !py-5 sm:!px-6 lg:!px-8 lg:!py-7">

                    <div className="overflow-hidden rounded-3xl border border-[#EAE6FA] bg-white shadow-[0_10px_45px_rgba(55,38,120,0.06)]">
                        <JobHeader job={job} />

                        {isLoggedIn && (
                            <div className="border-b border-purple-100 bg-gradient-to-r from-[#FAF8FF] to-white !px-6 !py-4 md:!px-8">
                                <button
                                    type="button"
                                    onClick={() => setIsReadinessOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5141D9] to-[#A344D0] !px-5 !py-3 text-sm font-bold text-white shadow-md shadow-purple-100 transition hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    <Target size={18} />
                                    Check My Job Readiness
                                    <Sparkles size={15} />
                                </button>
                                <p className="mt-2 text-xs text-slate-500">
                                    Review your readiness score and identify areas to improve before applying.
                                </p>
                            </div>
                        )}

                        <div className="!px-5 md:!px-8">
                            <div className="flex gap-6 overflow-x-auto border-b border-[#EAE6FA] sm:gap-9">
                                {[
                                    { id: "description", label: "Job Description", icon: <FileText size={16} /> },
                                    { id: "requirements", label: "Requirements", icon: <ClipboardCheck size={16} /> }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative inline-flex shrink-0 items-center gap-2 !py-4 text-sm font-bold transition ${
                                            activeTab === tab.id
                                                ? "text-[#5841D8]"
                                                : "text-slate-500 hover:text-purple-700"
                                        }`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <span className="absolute bottom-[-1px] left-0 right-0 h-[3px] rounded-t-full bg-gradient-to-r from-[#5841D8] to-[#A344D0]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid min-w-0 grid-cols-1 gap-5 !p-4 md:!p-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-7 xl:!p-7">
                            <div className="min-w-0 rounded-2xl bg-white">
                                {activeTab === "description" && (
                                    <JobDescription
                                        description={job.description}
                                        responsibilities={job.responsibilities}
                                        skills={job.skills}
                                    />
                                )}
                                {activeTab === "requirements" && (
                                    <JobRequirements job={job} />
                                )}
                            </div>

                            <div className="min-w-0">
                                <ComponyInfo company={company} job={job} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <ReadinessDrawer
                isOpen={isReadinessOpen}
                onClose={() => setIsReadinessOpen(false)}
                jobId={id}
            />
        </div>
    );
};

export default JobDetails;

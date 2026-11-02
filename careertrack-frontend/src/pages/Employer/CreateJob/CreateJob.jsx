
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    BriefcaseBusiness,
    CheckCircle2,
    Sparkles,
    WandSparkles
} from "lucide-react";

import { createJob } from "../../../services/employerService";
import JobForm from "./JobForm";
import Sidebar from "../../../components/Sidebar/Sidebar";
import EmployerNavbar from "../ENavbar/EmployerNavbar";

const CreateJob = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        compony: "",
        description: "",
        location: "",
        jobtype: "FULL_TIME",
        experienceLevel: "",
        salaryMin: "",
        salaryMax: "",
        skills: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        if (
            !formData.title.trim() ||
            !formData.compony.trim() ||
            !formData.description.trim() ||
            !formData.location.trim()
        ) {
            setError(
                "Please complete the job title, company, location and description."
            );
            return;
        }

        if (
            formData.salaryMin !== "" &&
            formData.salaryMax !== "" &&
            Number(formData.salaryMin) > Number(formData.salaryMax)
        ) {
            setError("Maximum salary must be greater than or equal to minimum salary.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                title: formData.title.trim(),
                compony: formData.compony.trim(),
                description: formData.description.trim(),
                location: formData.location.trim(),
                jobtype: formData.jobtype,
                experienceLevel: formData.experienceLevel.trim(),
                skills: formData.skills.trim(),
                salaryMin:
                    formData.salaryMin === ""
                        ? null
                        : Number(formData.salaryMin),
                salaryMax:
                    formData.salaryMax === ""
                        ? null
                        : Number(formData.salaryMax)
            };

            await createJob(payload);

            setSuccess("Your job has been created successfully!");

            setTimeout(() => {
                navigate("/employer/jobs");
            }, 1000);
        } catch (err) {
            console.error("Create job error:", err);
            setError(err?.message || "Unable to create job. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f6ff] text-gray-800">
            <div className="grid min-h-screen grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)]">
                {/* SIDEBAR */}
                <aside className="relative z-30 hidden h-screen md:sticky md:top-0 md:block">
                    <Sidebar
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                </aside>

                {/* MAIN CONTENT */}
                <main className="min-w-0">
                    {/* Navbar stays within the content column */}
                    <div className="sticky top-0 z-20">
                        <EmployerNavbar />
                    </div>

                    <div className="mx-auto w-full max-w-[1450px] !px-4 !py-6 sm:!px-6 lg:!px-9 lg:!py-8">

                        {/* HERO */}
                        <section className="relative mb-7 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#392078] via-[#6438bb] to-[#8c5cf6] !p-6 text-white shadow-xl shadow-purple-200/60 sm:!p-8 lg:!p-10">
                            <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
                            <div className="pointer-events-none absolute -bottom-24 right-40 h-52 w-52 rounded-full bg-fuchsia-400/20 blur-3xl" />

                            <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
                                <div className="max-w-2xl">
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-1.5 text-xs font-semibold tracking-wide text-purple-50 backdrop-blur-sm">
                                        <Sparkles size={14} />
                                        CAREERTRACK RECRUITING STUDIO
                                    </div>

                                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-[42px]">
                                        Create your next
                                        <span className="block text-purple-200">
                                            great opportunity.
                                        </span>
                                    </h1>

                                    <p className="mt-3 max-w-xl text-sm leading-6 text-purple-100 sm:text-base">
                                        Build a clear, compelling job post and connect with candidates who fit your team.
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 self-start rounded-2xl border border-white/20 bg-white/10 !p-4 backdrop-blur-md lg:min-w-[220px] lg:self-auto">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-purple-700 shadow-lg">
                                        <WandSparkles size={23} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Your hiring workspace</p>
                                        <p className="mt-1 text-xs text-purple-100">
                                            Plan · Review · Publish
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FORM INTRO */}
                        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                            <div>
                                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-600">
                                    New job posting
                                </p>
                                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                    Let's build your job post
                                </h2>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                                    Fill in the details step by step. You can review the complete listing before publishing.
                                </p>
                            </div>

                            <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-purple-100 bg-white !px-4 !py-3 shadow-sm">
                                <BriefcaseBusiness size={17} className="text-purple-600" />
                                <span className="text-sm font-semibold text-gray-700">
                                    Job creation
                                </span>
                            </div>
                        </div>

                        {/* ALERTS */}
                        {error && (
                            <div
                                role="alert"
                                className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 !p-4 text-sm text-red-700"
                            >
                                <span className="mt-0.5">
                                    <CheckCircle2 size={18} className="rotate-45" />
                                </span>
                                <div>
                                    <p className="font-bold">Unable to continue</p>
                                    <p className="mt-1 leading-5">{error}</p>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div
                                role="status"
                                className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 !p-4 text-sm text-emerald-700"
                            >
                                <CheckCircle2 size={19} />
                                <div>
                                    <p className="font-bold">Job created!</p>
                                    <p className="mt-1">{success}</p>
                                </div>
                            </div>
                        )}

                        <JobForm
                            formData={formData}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            loading={loading}
                        />

                        <p className="mt-6 text-center text-xs text-gray-400">
                            CareerTrack · Helping you find the right talent
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CreateJob;

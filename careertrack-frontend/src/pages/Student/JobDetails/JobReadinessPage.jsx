
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Target, Sparkles } from "lucide-react";

import JobReadinessCard from "../JobReadiness/JobReadinessCard";
import UserNavbar from "../Navbar/UserNavbar";
import Sidebar from "../../../components/Sidebar/Sidebar";

const JobReadinessPage = () => {
    const { jobId } = useParams();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8F7FF]">
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[250px] lg:block">
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            </aside>

            <div className="min-h-screen min-w-0 lg:!ml-[250px]">
                <header className="sticky top-0 z-30 border-b border-purple-100/80 bg-white/90 shadow-sm backdrop-blur-xl">
                    <UserNavbar />
                </header>

                <main className="!px-4 !py-6 sm:!px-6 lg:!px-8 lg:!py-8">
                    <div className="mx-auto w-full max-w-6xl">
                        <div className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-br from-[#30205F] via-[#5841D8] to-[#947AF0] !px-6 !py-7 text-white shadow-xl shadow-purple-100 md:!px-8">
                            <div className="absolute -right-8 -top-14 h-48 w-48 rounded-full bg-white/10" />
                            <div className="absolute bottom-[-70px] right-1/3 h-40 w-40 rounded-full bg-pink-300/20 blur-2xl" />
                            <div className="relative flex items-center gap-4">
                                <div className="rounded-2xl bg-white/15 !p-3.5">
                                    <Target size={28} />
                                </div>
                                <div>
                                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-100">
                                        <Sparkles size={14} /> CareerTrack Analysis
                                    </p>
                                    <h1 className="mt-2 text-2xl font-extrabold md:text-3xl">
                                        Your Job Readiness
                                    </h1>
                                    <p className="mt-2 max-w-xl text-sm leading-6 text-purple-100">
                                        Understand your strengths, discover skill gaps, and prepare with a focused action plan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <JobReadinessCard
                            jobId={jobId}
                            jobTitle="Job Readiness Analysis"
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default JobReadinessPage;

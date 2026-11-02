import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Search,
    MapPin,
    BriefcaseBusiness,
    ArrowRight,
} from "lucide-react";

import { getJobs, searchJobs } from "../../services/jobService";

const SearchJobs = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const keyword = searchParams.get("keyword") || "";
    const location = searchParams.get("location") || "";


    // ==========================================
    // LOAD SEARCHED JOBS
    // ==========================================

    useEffect(() => {

        const loadJobs = async () => {

            try {

                setLoading(true);

                let data = [];

                // Search by keyword
                if (keyword) {

                    data = await searchJobs(keyword);

                } else {

                    // Only location was searched
                    data = await getJobs();

                }

                let results = Array.isArray(data)
                    ? data
                    : [];


                // ==========================================
                // FILTER BY LOCATION
                // ==========================================

                if (location) {

                    const locationText =
                        location.toLowerCase().trim();

                    results = results.filter((job) =>
                        (job?.location || "")
                            .toLowerCase()
                            .includes(locationText)
                    );
                }


                setJobs(results);

            } catch (error) {

                console.error(
                    "Error loading searched jobs:",
                    error
                );

                setJobs([]);

            } finally {

                setLoading(false);

            }
        };


        loadJobs();

    }, [keyword, location]);


    // ==========================================
    // VIEW JOB
    // ==========================================

    const handleViewJob = (jobId) => {

        navigate(`/jobs/${jobId}`);

    };


    return (

        <div className="min-h-screen bg-[#faf8ff]">

            {/* ======================================
                HEADER
            ====================================== */}

            <div className="border-b border-slate-200 bg-white">

                <div className="mx-auto max-w-7xl !px-6 !py-10">

                    <h1 className="text-3xl font-bold text-slate-900">
                        Search Results
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Jobs matching your search
                    </p>


                    {/* SEARCH SUMMARY */}

                    <div className="mt-6 flex flex-wrap gap-3">

                        {keyword && (

                            <div className="flex items-center gap-2 rounded-lg bg-purple-50 !px-4 !py-2 text-sm text-purple-700">

                                <Search size={16} />

                                <span>
                                    {keyword}
                                </span>

                            </div>

                        )}


                        {location && (

                            <div className="flex items-center gap-2 rounded-lg bg-purple-50 !px-4 !py-2 text-sm text-purple-700">

                                <MapPin size={16} />

                                <span>
                                    {location}
                                </span>

                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* ======================================
                JOB RESULTS
            ====================================== */}

            <main className="mx-auto w-full !px-6 !py-10">


                {/* LOADING */}

                {loading && (

                    <div className="!py-16 text-center">

                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />

                        <p className="mt-4 text-sm text-slate-500">
                            Searching jobs...
                        </p>

                    </div>

                )}


                {/* NO JOBS */}

                {!loading && jobs.length === 0 && (

                    <div className="rounded-2xl border border-slate-200 bg-white !px-6 !py-16 text-center">

                        <BriefcaseBusiness
                            size={42}
                            className="mx-auto text-slate-300"
                        />

                        <h2 className="mt-4 text-lg font-semibold text-slate-800">
                            No jobs found
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            No jobs match your search criteria.
                        </p>

                    </div>

                )}


                {/* JOBS */}

                {!loading && jobs.length > 0 && (

                    <>

                        <div className="mb-6">

                            <h2 className="text-xl font-bold text-slate-900">
                                Available Jobs
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {jobs.length} job
                                {jobs.length !== 1 ? "s" : ""} found
                            </p>

                        </div>


                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                            {jobs.map((job) => (

                                <div
                                    key={job.id}
                                    className="rounded-2xl border border-slate-200 bg-white !p-5 shadow-[0_6px_20px_rgba(15,23,42,0.2)] transition hover:-translate-y-1 hover:shadow-md"
                                >

                                    {/* ICON */}

                                    <div className="flex items-start justify-between p-6">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">

                                            <BriefcaseBusiness
                                                size={22}
                                                className="text-purple-600"
                                            />

                                        </div>
                                    </div>


                                    {/* TITLE */}

                                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                                        {job.title}
                                    </h3>


                                    {/* COMPANY */}

                                    <p className="mt-1 text-sm font-medium text-purple-600">
                                        {job.company || "Company"}
                                    </p>


                                    {/* LOCATION */}

                                    <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">

                                        

                                        <span className="flex items-center">
                                            <MapPin size={16} />
                                            {job.location || "Location not specified"}
                                        </span>

                                        <BriefcaseBusiness size={16} />

                                        <span className="flex items-center">
                                            {job.jobtype || "Job type not specified"}
                                        </span>

                                        <span className="flex items-center">
                                        {job.experienceLevel && (

                                        <p>

                                            Experience:{" "}

                                            <span className="font-medium text-slate-600">
                                                {job.experienceLevel}
                                            </span>

                                        </p>

                                    )}
                                    </span>

                                    </div>

                                    {/* SKILLS */}

                                    {job.skills && (

                                        <div className="mt-4 flex flex-wrap gap-2">

                                            {job.skills
                                                .split(",")
                                                .slice(0, 4)
                                                .map((skill, index) => (

                                                    <span
                                                        key={index}
                                                        className="rounded-full bg-purple-100 !px-2.5 !py-1 text-xs text-slate-600"
                                                    >
                                                        {skill.trim()}
                                                    </span>

                                                ))}

                                        </div>

                                    )}


                                    {/* SALARY */}

                                    {(job.salaryMin || job.salaryMax) && (

                                        <p className="mt-4 text-sm font-semibold text-slate-800">

                                            ₹
                                            {job.salaryMin
                                                ? Number(job.salaryMin).toLocaleString("en-IN")
                                                : "—"}

                                            {" - "}

                                            ₹
                                            {job.salaryMax
                                                ? Number(job.salaryMax).toLocaleString("en-IN")
                                                : "—"} LPA

                                        </p>

                                    )}


                                    {/* VIEW JOB */}

                                    <button
                                        onClick={() =>
                                            handleViewJob(job.id)
                                        }
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 !px-4 !py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
                                    >

                                        View Job

                                        <ArrowRight size={16} />

                                    </button>

                                </div>

                            ))}

                        </div>

                    </>

                )}

            </main>

        </div>

    );
};

export default SearchJobs;
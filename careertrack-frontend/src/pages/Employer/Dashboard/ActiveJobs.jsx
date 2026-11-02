import { BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActiveJobs = ({ jobs = [] }) => {


const navigate = useNavigate();


return (

    <div
        className="
            bg-white
            border
            border-purple-100
            rounded-2xl
            !p-6
            shadow-sm
        "
    >

        {/* HEADER */}

        <div className="flex items-center justify-between">

            <div>

                <h2 className="text-lg font-semibold text-gray-900">
                    Active Jobs
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Your current active job postings
                </p>

            </div>


            <button
                onClick={() => navigate("/employer/jobs")}
                className="
                    text-sm
                    font-medium
                    text-purple-600
                    hover:text-purple-700
                "
            >
                View All
            </button>

        </div>


        {/* JOBS */}

        <div className="mt-5 space-y-3">

            {!Array.isArray(jobs) || jobs.length === 0 ? (

                <div className="!py-8 text-center">

                    <BriefcaseBusiness
                        size={30}
                        className="mx-auto text-gray-300"
                    />

                    <p className="text-sm text-gray-500 mt-2">
                        No active jobs
                    </p>

                </div>

            ) : (

                jobs.slice(0, 4).map((job) => (

                    <div
                        key={job.id}
                        className="
                            !p-4
                            rounded-xl
                            bg-gray-50
                            border
                            border-gray-100
                            hover:border-purple-200
                            transition
                        "
                    >

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    w-10
                                    h-10
                                    rounded-lg
                                    bg-purple-100
                                    flex
                                    items-center
                                    justify-center
                                    text-purple-600
                                "
                            >
                                <BriefcaseBusiness size={18} />
                            </div>


                            <div className="min-w-0">

                                <h3
                                    className="
                                        font-medium
                                        text-gray-900
                                        truncate
                                    "
                                >
                                    {job?.title || "Untitled Job"}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    {job?.location || "Location not specified"}
                                </p>

                            </div>

                        </div>

                    </div>

                ))

            )}

        </div>

    </div>
);


};

export default ActiveJobs;

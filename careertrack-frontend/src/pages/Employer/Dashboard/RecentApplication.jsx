import {
UserRound,
Clock3
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const RecentApplications = ({ applications = [] }) => {

const navigate = useNavigate();


const getName = (application) => {

    return (
        application?.name ||
        application?.candidateName ||
        application?.applicantName ||
        application?.user?.name ||
        "Applicant"
    );

};


const getJobTitle = (application) => {

    return (
        application?.jobTitle ||
        application?.appliedFor ||
        application?.job?.title ||
        "Job Application"
    );

};


const getStatus = (application) => {

    return (
        application?.status ||
        application?.applicationStatus ||
        "APPLIED"
    );

};


const getDate = (application) => {

    const date =
        application?.appliedAt ||
        application?.applicationDate ||
        application?.createdAt;

    if (!date) {
        return "Recently";
    }

    const d = new Date(date);

    if (isNaN(d.getTime())) {
        return "Recently";
    }

    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
    });

};


const getInitials = (name) => {

    if (!name) {
        return "AP";
    }

    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

};


const getStatusStyle = (status) => {

    const normalized =
        String(status).toUpperCase();


    if (normalized === "SHORTLISTED") {

        return "bg-green-50 text-green-600 border-green-100";

    }


    if (normalized === "INTERVIEW") {

        return "bg-orange-50 text-orange-600 border-orange-100";

    }


    if (normalized === "SELECTED") {

        return "bg-emerald-50 text-emerald-600 border-emerald-100";

    }


    if (normalized === "REJECTED") {

        return "bg-red-50 text-red-600 border-red-100";

    }


    return "bg-purple-50 text-purple-600 border-purple-100";

};


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
                    Recent Applications
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Latest candidates who applied
                </p>

            </div>


            <button
                onClick={() =>
                    navigate("/employer/applicants")
                }
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


        {/* APPLICATIONS */}

        <div className="mt-5 space-y-3">

            {!Array.isArray(applications) ||
            applications.length === 0 ? (

                <div className="!py-8 text-center">

                    <UserRound
                        size={30}
                        className="mx-auto text-gray-300"
                    />

                    <p className="text-sm text-gray-500 mt-2">
                        No recent applications
                    </p>

                </div>

            ) : (

                applications
                    .slice(0, 4)
                    .map((application, index) => {

                        const name =
                            getName(application);

                        const status =
                            getStatus(application);


                        return (

                            <div
                                key={
                                    application?.applicationId ||
                                    application?.id ||
                                    index
                                }
                                className="
                                    !p-4
                                    rounded-xl
                                    bg-gray-50
                                    border
                                    border-gray-100
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                    "
                                >

                                    {/* CANDIDATE */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            min-w-0
                                        "
                                    >

                                        <div
                                            className="
                                                w-10
                                                h-10
                                                rounded-full
                                                bg-purple-100
                                                flex
                                                items-center
                                                justify-center
                                                text-purple-600
                                                text-xs
                                                font-bold
                                                flex-shrink-0
                                            "
                                        >
                                            {getInitials(name)}
                                        </div>


                                        <div className="min-w-0">

                                            <h3
                                                className="
                                                    font-medium
                                                    text-gray-900
                                                    truncate
                                                "
                                            >
                                                {name}
                                            </h3>


                                            <p
                                                className="
                                                    text-sm
                                                    text-gray-500
                                                    truncate
                                                "
                                            >
                                                {getJobTitle(application)}
                                            </p>


                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1
                                                    mt-1
                                                "
                                            >

                                                <Clock3
                                                    size={11}
                                                    className="text-gray-400"
                                                />

                                                <span className="text-xs text-gray-400">
                                                    {getDate(application)}
                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    {/* STATUS */}

                                    <span
                                        className={`
                                            px-3
                                            py-1
                                            rounded-full
                                            border
                                            text-xs
                                            font-medium
                                            flex-shrink-0
                                            ${getStatusStyle(status)}
                                        `}
                                    >
                                        {status}
                                    </span>

                                </div>

                            </div>

                        );

                    })

            )}

        </div>

    </div>
);

};

export default RecentApplications;

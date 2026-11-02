import {
    BriefcaseBusiness,
    ChevronRight,
    MapPin,
} from "lucide-react";

import ApplicationStatus from "./ApplicationStatus";
import { Link } from "react-router-dom";

const ApplicationCard = ({ application }) => {

    const job = application?.job;

    const formatDate = (date) => {
        if (!date) return "Date not available";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatJobType = (jobType) => {
        if (!jobType) return "";

        return jobType
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    return (
        <Link
            to={`/student/applications/${application.id}`}
            className="
                grid grid-cols-1
                md:grid-cols-[2.2fr_1.5fr_1.3fr_1.2fr_30px]
                items-center
                gap-4 md:gap-0
                !px-5 !py-5
                border-b border-gray-300 
                hover:bg-purple-50/100
                transition 
            "
        >

            {/* ========================= */}
            {/* JOB TITLE                  */}
            {/* ========================= */}

            <div className="flex items-center gap-4 min-w-0">

                {/* Job Icon */}
                <div className="min-w-0">

                    <h2 className="
                        text-base
                        font-semibold
                        text-gray-900
                        truncate
                    ">
                        {job?.title || "Job Title"}
                    </h2>

                    <div className="
                        flex items-center
                        gap-1
                        mt-2
                        text-sm
                        text-gray-500
                    ">
                        <MapPin
                            size={14}
                            className="shrink-0"
                        />

                        <span className="truncate">
                            {job?.location || "Location not specified"}
                        </span>

                        {job?.jobType && (
                            <>
                                <span>,</span>

                                <span className="truncate">
                                    {formatJobType(job.jobType)}
                                </span>
                            </>
                        )}
                    </div>

                </div>

            </div>


            {/* ========================= */}
            {/* COMPANY                    */}
            {/* ========================= */}

            <div className="flex items-center gap-3 min-w-0">

                <CompanyLogo
                    logo={job?.logo}
                    company={job?.company}
                />

                <span className="
                    text-base
                    font-medium
                    text-gray-800
                    truncate
                ">
                    {job?.company || "Company"}
                </span>

            </div>


            {/* ========================= */}
            {/* APPLIED ON                 */}
            {/* ========================= */}

            <div className="text-sm text-gray-600">

                {formatDate(application?.appliedAt)}

            </div>


            {/* ========================= */}
            {/* STATUS                     */}
            {/* ========================= */}

            <div>

                <ApplicationStatus
                    status={application?.status}
                />

            </div>


            {/* ========================= */}
            {/* ARROW                      */}
            {/* ========================= */}

            <div className="
                hidden md:flex
                justify-end
            ">
                <ChevronRight
                    size={20}
                    className="text-gray-400"
                />
            </div>

        </Link>
    );
};


/* ================================= */
/* COMPANY LOGO                      */
/* ================================= */

const CompanyLogo = ({ logo, company }) => {

    const fallbackLetter =
        company?.charAt(0)?.toUpperCase() || "C";

    return (
        <div className="
            w-10 h-10
            rounded-lg
            bg-purple-50
            border border-purple-100
            flex items-center justify-center
            overflow-hidden
            shrink-0
        ">

            {logo ? (
                <img
                    src={`http://localhost:8080${logo}`}
                    alt={`${company || "Company"} logo`}
                    className="
                        w-full
                        h-full
                        object-contain
                        p-1
                    "
                    onError={(e) => {
                        e.currentTarget.style.display = "none";

                        const fallback =
                            e.currentTarget.parentElement
                                .querySelector(".logo-fallback");

                        if (fallback) {
                            fallback.classList.remove("hidden");
                        }
                    }}
                />
            ) : null}

            <span
                className={`
                    logo-fallback
                    text-sm
                    font-bold
                    text-purple-600
                    ${logo ? "hidden" : ""}
                `}
            >
                {fallbackLetter}
            </span>

        </div>
    );
};

export default ApplicationCard;
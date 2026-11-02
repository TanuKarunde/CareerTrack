
import {
    BriefcaseBusiness,
    CalendarDays,
    MapPin,
    Sparkles
} from "lucide-react";

import ApplicationDetailStatus from "./ApplicatinDetailStatus";

const formatDate = (date) => {
    if (!date) return "Date not available";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Date not available";

    return parsed.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
};

const ApplicationHeader = ({ application }) => {
    if (!application) return null;

    const jobTitle =
        application.job?.title ||
        application.jobTitle ||
        application.title ||
        "Job Title";

    const company =
        application.job?.company ||
        application.job?.compony ||
        application.company ||
        application.compony ||
        "Company";

    const logo =
        application.job?.logo ||
        application.logo ||
        null;

    const logoUrl = logo
        ? (logo.startsWith("http") ? logo : `http://localhost:8080${logo}`)
        : null;

    const location =
        application.job?.location ||
        application.location ||
        "";

    const jobType =
        application.job?.jobType ||
        application.job?.jobtype ||
        application.jobType ||
        application.jobtype ||
        "";

    return (
        <div className="relative isolate overflow-hidden rounded-[28px] border border-purple-100 bg-white shadow-[0_8px_35px_rgba(76,29,149,0.05)]">
            {/* Decorative background */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-white via-white to-[#F0E9FF]" />
            <div className="pointer-events-none absolute -right-10 -top-20 -z-10 h-64 w-64 rounded-full bg-purple-100/70 blur-3xl" />
            <div className="pointer-events-none absolute right-[23%] top-8 -z-10 h-28 w-28 rounded-full border-[20px] border-purple-100/40" />

            <div className="relative !p-5 sm:p-7 lg:p-8">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                        {/* Logo */}
                        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden bg-white shadow-[0_5px_18px_rgba(109,40,217,0.09)] sm:h-[88px] sm:w-[88px]">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={`${company} logo`}
                                    className="h-full w-full object-contain p-2"
                                    onError={(event) => {
                                        event.currentTarget.style.display = "none";
                                    }}
                                />
                            ) : (
                                <span className="text-3xl font-extrabold text-purple-600">
                                    {company.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div className="min-w-0 pt-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="break-words text-2xl font-extrabold tracking-tight text-[#211936] sm:text-3xl">
                                    {company}
                                </h1>
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                                    <Sparkles size={12} />
                                </span>
                            </div>

                            <p className="mt-1 text-base font-semibold text-gray-700 sm:text-lg">
                                {jobTitle}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-500">
                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays size={16} className="text-purple-600" />
                                    Applied {formatDate(application.appliedAt)}
                                </span>

                                {location && (
                                    <span className="inline-flex items-center gap-2">
                                        <MapPin size={16} className="text-purple-600" />
                                        {location}
                                    </span>
                                )}

                                {jobType && (
                                    <span className="inline-flex items-center gap-2">
                                        <BriefcaseBusiness size={16} className="text-purple-600" />
                                        {jobType.replaceAll("_", " ")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center xl:self-start">
                        <ApplicationDetailStatus status={application.status} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationHeader;

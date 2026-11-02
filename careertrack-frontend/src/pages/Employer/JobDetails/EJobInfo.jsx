import {
    Briefcase,
    MapPin,
    User,
    IndianRupee,
    Sparkles,
} from "lucide-react";

const EJobInfo = ({ job }) => {
    const jobType =
        job.jobtype || job.jobType || "Not specified";

    const experience =
        job.experiencelevel ||
        job.experienceLevel ||
        "Not specified";

    const location = job.location || "Not specified";

    const salaryMin = Number(job.salaryMin || 0).toLocaleString(
        "en-IN"
    );

    const salaryMax = Number(job.salaryMax || 0).toLocaleString(
        "en-IN"
    );

    const details = [
        {
            label: "Location",
            value: location,
            Icon: MapPin,
            iconColor: "text-purple-600",
            iconBg: "bg-purple-100",
            tileBg: "bg-gradient-to-br from-purple-50 to-violet-100/70",
            border: "border-purple-100",
        },
        {
            label: "Job Type",
            value: jobType,
            Icon: Briefcase,
            iconColor: "text-cyan-600",
            iconBg: "bg-cyan-100",
            tileBg: "bg-gradient-to-br from-cyan-50 to-sky-100/70",
            border: "border-cyan-100",
        },
        {
            label: "Experience Level",
            value: experience,
            Icon: User,
            iconColor: "text-pink-600",
            iconBg: "bg-pink-100",
            tileBg: "bg-gradient-to-br from-pink-50 to-rose-100/70",
            border: "border-pink-100",
        },
        {
            label: "Salary Range",
            value: `₹${salaryMin} - ₹${salaryMax}`,
            Icon: IndianRupee,
            iconColor: "text-emerald-600",
            iconBg: "bg-emerald-100",
            tileBg: "bg-gradient-to-br from-emerald-50 to-teal-100/70",
            border: "border-emerald-100",
        },
    ];

    return (
        <section className="relative overflow-hidden bg-white border border-purple-100 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300">

            {/* Decorative background */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />

            {/* Heading */}
            <div className="relative flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-500 text-white shadow-md shadow-purple-200">
                    <Briefcase size={21} />
                </div>

                <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Job Information
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Everything you need to know
                    </p>
                </div>

                <div className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100">
                    <Sparkles
                        size={14}
                        className="text-purple-600"
                    />
                    <span className="text-xs font-semibold text-purple-700">
                        Job Overview
                    </span>
                </div>
            </div>

            {/* Information tiles */}
            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {details.map((item) => {
                    const Icon = item.Icon;

                    return (
                        <div
                            key={item.label}
                            className={`group relative min-w-0 overflow-hidden rounded-2xl border ${item.border} ${item.tileBg} p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
                        >
                            {/* Decorative circle */}
                            <div className="absolute -right-5 -bottom-7 w-20 h-20 rounded-full bg-white/40 group-hover:scale-125 transition-transform duration-500" />

                            <div className="relative flex items-start gap-3">
                                <div
                                    className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl ${item.iconBg} ${item.iconColor} shadow-sm`}
                                >
                                    <Icon size={19} strokeWidth={2.2} />
                                </div>

                                <div className="min-w-0 flex-1 pt-0.5">
                                    <p className="text-xs font-medium text-gray-500 mb-1.5">
                                        {item.label}
                                    </p>

                                    <p
                                        className="text-sm sm:text-base font-bold text-gray-800 break-words"
                                        title={item.value}
                                    >
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom accent */}
            <div className="relative mt-5 flex items-center gap-2 text-xs text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Review these details before proceeding with the job.
            </div>
        </section>
    );
};

export default EJobInfo;
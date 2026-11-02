
import {
    BriefcaseBusiness,
    Users,
    Star,
    UserRound
} from "lucide-react";


const EmployerStats = ({ dashboard = {} }) => {

    const stats = [

        {
            title: "Total Jobs",
            value: dashboard?.totalJobs ?? 0,
            icon: <BriefcaseBusiness size={20} />
        },

        {
            title: "Active Jobs",
            value: dashboard?.activeJobs ?? 0,
            icon: <BriefcaseBusiness size={20} />
        },

        {
            title: "Applications",
            value: dashboard?.totalApplications ?? 0,
            icon: <Users size={20} />
        },

        {
            title: "Shortlisted",
            value:
                dashboard?.shortListed ??
                dashboard?.shortlisted ??
                0,
            icon: <Star size={20} />
        }

    ];


    return (

        <div
            className="
                grid
                grid-cols-2
                lg:grid-cols-4
                gap-4
            "
        >

            {stats.map((stat) => (

                <div
                    key={stat.title}
                    className="
                        bg-white
                        border
                        border-purple-100
                        rounded-2xl
                        !p-5
                        shadow-sm
                        hover:shadow-md
                        transition
                        flex items-center gap-5
                    "
                >
                    <div>

                        {/* ICON */}

                        <div
                            className="
                            w-11
                            h-11
                            rounded-xl
                            bg-purple-50
                            flex
                            items-center
                            justify-center
                            text-purple-600
                        "
                        >
                            {stat.icon}
                        </div>
                    </div>

                    <div>
                        {/* VALUE */}

                        <h2
                            className="
                            text-3xl
                            font-bold
                            text-gray-900
                            mt-1
                        "
                        >
                            {stat.value}
                        </h2>

                        {/* TITLE */}

                        <p
                            className="
                            mt-4
                            text-sm
                            text-gray-500
                        "
                        >
                            {stat.title}
                        </p>



                    </div>

                </div>

            ))}

        </div>
    );
};


export default EmployerStats;


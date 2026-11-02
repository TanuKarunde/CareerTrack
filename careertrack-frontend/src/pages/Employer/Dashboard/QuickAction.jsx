const QuickAction = () => {

    const actions = [
        {
            title: "Create job",
            description: "Post a new Oportunity",
            link: "/employer/jobs/create"
        },
        {
            title: "Manage job",
            description: "View and manage your jobs",
            link: "/employer/jobs"
        },
        {
            title: "Applicants",
            description: "Review candidates",
            link: "/employer/applicants"
        },
        {
            title: "Compony Profile",
            description: "Update compony information",
            link: "/employer/companyprofile"
        }
    ];

    return(

        <div>

            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {actions.map((action) => (

                    <a href={action.link}
                    key={action.title}
                    className="bg-white border border-purple-100 rounded-2xl !p-5 hover:border-purple-300 hover:shadow-md transition" >

                        <h3 className="font-semibold text-gray-900">
                            {action.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                            {action.description}
                        </p>
                    </a>
                ))}
            </div>
        </div>
    )
}

export default QuickAction
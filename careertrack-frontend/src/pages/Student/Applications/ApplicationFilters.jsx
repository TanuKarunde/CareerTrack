
const ApplicationFilters = ({ filter, setFilter, applications = [] }) => {

    const getCount = (value) => {

        if (value === "ALL") {
            return applications.length;
        }

        return applications.filter(
            (application) =>
                application.status?.toUpperCase() === value
        ).length;
    };


    const filters = [
        {
            label: "All",
            value: "ALL"
        },
        {
            label: "Applied",
            value: "APPLIED"
        },
        {
            label: "Shortlisted",
            value: "SHORTLISTED"
        },
        {
            label: "Interview",
            value: "INTERVIEW"
        },
        {
            label: "Selected",
            value: "SELECTED"
        },
        {
            label: "Rejected",
            value: "REJECTED"
        }
    ];

    return (
        <div className="flex flex-wrap gap-9 bg-white !p-2 !mb-2">

            {filters.map((item) => (
                <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    className={`
                        !px-4
                        !py-2
                        flex
                        rounded-xl
                        text-sm
                        font-medium
                        transition
                        gap-2
                        ${
                            filter === item.value
                                ? "text-purple-600 underline underline-offset-9 decoration-2"
                                : "text-gray-600 hover:bg-purple-50"
                        }
                    `}
                >
                    <span>
                        {item.label} {getCount(item.value)}
                    </span>
                    
                </button>
            ))}

        </div>
    );
};

export default ApplicationFilters;


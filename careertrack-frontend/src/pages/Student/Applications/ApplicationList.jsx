import ApplicationCard from "./ApplicationCard";

const ApplicationList = ({ applications }) => {
    return (
        <div className="px-6 pb-6">

            {/* ========================= */}
            {/* TABLE HEADER               */}
            {/* ========================= */}

            <div
                className="
                    hidden md:grid
                    grid-cols-[2.2fr_1.5fr_1.3fr_1.2fr_30px]
                    items-center
                    bg-[#e8ecfa]
                    rounded-xl
                    !px-5 !py-4
                    text-sm
                    font-semibold
                    text-[#526080]
                "
            >
                <div>
                    Job Title
                </div>

                <div>
                    Company
                </div>

                <div>
                    Applied On
                </div>

                <div>
                    Status
                </div>

                {/* Arrow column */}
                <div></div>
            </div>

            {/* ========================= */}
            {/* APPLICATION ROWS           */}
            {/* ========================= */}

            <div>
                {applications.map((application) => (
                    <ApplicationCard
                        key={application.id}
                        application={application}
                    />
                ))}
            </div>

        </div>
    );
};

export default ApplicationList;
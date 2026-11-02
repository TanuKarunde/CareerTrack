
const WelcomeBanner = ({ employerName }) => {

    return (

        <div
            className="
                !p-6
                md:p-8
            "
        >

            <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back, {employerName}! 👋
            </h1>

            <p className="mt-2 text-gray-500">
                Manage your jobs and find the right candidate for your company.
            </p>

        </div>
    );
};


export default WelcomeBanner;


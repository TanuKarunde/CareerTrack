const NoApplications = () => {

    return (
        <div className="
            mt-8
            bg-white
            border
            border-purple-100
            rounded-2xl
            p-12
            text-center
        ">

            <div className="
                mx-auto
                w-14
                h-14
                rounded-full
                bg-purple-50
                flex
                items-center
                justify-center
                text-2xl
            ">
                📋
            </div>


            <h2 className="
                mt-5
                text-xl
                font-semibold
                text-gray-900
            ">
                No applications yet
            </h2>


            <p className="
                mt-2
                text-gray-500
            ">
                Start applying to jobs and
                track your applications here.
            </p>

        </div>
    );
};

export default NoApplications;

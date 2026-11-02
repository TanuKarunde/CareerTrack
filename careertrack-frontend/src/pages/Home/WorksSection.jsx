import {
    UserPlus,
    Search,
    Send,
    TrendingUp,
    ArrowRight
} from "lucide-react";

const WorksSection = () => {

    const steps = [
        {
            number: "01",
            icon: UserPlus,
            title: "Create Profile",
            description: (
                <>
                    Build your profile and
                    <br />
                    showcase your skills.
                </>
            )
        },
        {
            number: "02",
            icon: Search,
            title: "Explore Jobs",
            description: (
                <>
                    Find opportunities that
                    <br />
                    match your goals.
                </>
            )
        },
        {
            number: "03",
            icon: Send,
            title: "Apply Easily",
            description: (
                <>
                    Submit your application
                    <br />
                    with one click.
                </>
            )
        },
        {
            number: "04",
            icon: TrendingUp,
            title: "Track Progress",
            description: (
                <>
                    Stay updated on your
                    <br />
                    applications and interviews.
                </>
            )
        }
    ];

    return (
        <section id="works" className="w-full bg-[#FAF7FF] !py-12 ">

            <div className="!mx-23">

            {/* Heading */}
            <div className="text-center !mb-10 mx-23">

                <h2 className="text-2xl md:text-3xl font-bold text-[#17205c]">
                    How It Works
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    Get started in just a few simple steps.
                </p>

            </div>

            {/* Steps */}
            <div className="max-w-auto px-6">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {steps.map((step, index) => {

                        const Icon = step.icon;

                        return (
                            <div
                                key={index}
                                className="relative flex flex-col items-center text-center"
                            >

                                {/* Number + Icon */}
                                <div className="relative flex items-center justify-center">

                                    {/* Number */}
                                    <div className="absolute -left-8 -top-2 w-7 h-7 rounded-full bg-purple-500 text-white text-[10px] font-semibold flex items-center justify-center">
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
                                        <Icon
                                            size={25}
                                            strokeWidth={1.8}
                                            className="text-purple-600"
                                        />
                                    </div>

                                </div>

                                {/* Title */}
                                <h3 className="mt-5 text-sm font-bold text-[#17205c]">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="mt-2 text-xs leading-5 text-gray-500">
                                    {step.description}
                                </p>

                                {/* Arrow */}
                                {index !== steps.length - 1 && (
                                    <ArrowRight
                                        size={19}
                                        strokeWidth={1.5}
                                        className="
                                            hidden md:block
                                            absolute
                                            -right-5
                                            top-5
                                            text-gray-400
                                        "
                                    />
                                )}

                            </div>
                        );
                    })}

                </div>

            </div>
            </div>

        </section>
    );
};

export default WorksSection;
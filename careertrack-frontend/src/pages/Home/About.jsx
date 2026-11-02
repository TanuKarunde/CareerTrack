import {
    Target,
    Eye,
    Heart,
    ArrowRight
} from "lucide-react";

import aboutImage from '../../assets/about-image.png'

const About = () => {

    return (
        <section id="about">

        <div className="min-h-screen bg-white text-[#17265B] !p-5 !pl-25">


            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="
                w-7xl
                !px-5
                !py-12
            ">


                {/* =================================================
                    ABOUT HERO
                ================================================= */}

                <section className="
                    grid
                    grid-cols-[2fr_2fr]
                    items-center
                ">


                    {/* LEFT */}

                    <div className="w-150">

                        <h1 className="
                            text-3xl
                            md:text-4xl
                            font-bold
                            text-[#17265B]
                        ">
                            About CareerTrack
                        </h1>


                        <p className="
                            mt-2
                            text-base
                            text-[#5841D8]
                            font-medium
                        ">
                            Connecting talent with opportunity
                        </p>


                        <p className="
                            mt-6
                            max-w-[680px]
                            text-sm
                            md:text-[15px]
                            leading-7
                            text-[#626A83]
                        ">
                            CareerTrack is a job placement platform
                            designed to help students find the right
                            career opportunities, build their skills
                            and achieve their goals. We bridge the gap
                            between talented students and employers
                            by making the placement journey simple,
                            organized and accessible.
                        </p>


                        <p className="
                            mt-4
                            max-w-[680px]
                            text-sm
                            md:text-[15px]
                            leading-7
                            text-[#626A83]
                        ">
                            Our platform brings job opportunities,
                            interview preparation, applications and
                            career resources together in one place,
                            helping students move confidently from
                            preparation to placement.
                        </p>

                    </div>


                    {/* RIGHT IMAGE */}

                    <div className="
                        h-[500px]
                        w-[600px]
                        rounded-2xl 
                        justify-center
                    ">

                        <img
                            src={aboutImage}
                            alt="CareerTrack"
                            className="
                            h-full
                            w-full
                               object-contains
                               bg-pink-600
                            "
                        />

                    </div>

                </section>


                {/* =================================================
                    MISSION / VISION / VALUES
                ================================================= */}

                <section className="
                    !mt-20
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-10
                ">


                    {/* =================================================
                        MISSION
                    ================================================= */}

                    <div className="
                        border
                        border-[#E4E1F0]
                        rounded-xl
                        !p-6
                        bg-purple-50
                        shadow-[0_2px_8px_rgba(40,25,100,0.04)]
                        flex flex-col items-center text-center
                    ">

                        <div className="
                            w-11
                            h-11
                            rounded-full
                            bg-[#F0EEFF]
                            text-[#5841D8]
                            flex
                            items-center
                            justify-center
                        ">

                            <Target size={21} />

                        </div>


                        <h2 className="
                            mt-5
                            text-base
                            font-bold
                            text-[#17265B]
                        ">
                            Our Mission
                        </h2>


                        <p className="
                            mt-3
                            text-sm
                            leading-6
                            text-[#68708A]
                        ">
                            To make career growth accessible to
                            every student by providing the right
                            opportunities, resources and guidance.
                        </p>

                    </div>


                    {/* =================================================
                        VISION
                    ================================================= */}

                    <div className="
                        bg-purple-50
                        border
                        border-[#E4E1F0]
                        rounded-xl
                        !p-6
                        shadow-[0_2px_8px_rgba(40,25,100,0.04)]
                        flex flex-col items-center text-center
                    ">

                        <div className="
                            w-11
                            h-11
                            rounded-full
                            bg-[#F0EEFF]
                            text-[#5841D8]
                            flex
                            items-center
                            justify-center
                        ">

                            <Eye size={21} />

                        </div>


                        <h2 className="
                            mt-5
                            text-base
                            font-bold
                            text-[#17265B]
                        ">
                            Our Vision
                        </h2>


                        <p className="
                            mt-3
                            text-sm
                            leading-6
                            text-[#68708A]
                        ">
                            To be the most trusted career platform
                            for students and help every learner
                            build a successful future.
                        </p>

                    </div>


                    {/* =================================================
                        VALUES
                    ================================================= */}

                    <div className="
                        bg-purple-50
                        border
                        border-[#E4E1F0]
                        rounded-xl
                        !p-6
                        shadow-[0_2px_8px_rgba(40,25,100,0.04)]
                        flex flex-col items-center text-center
                    ">

                        <div className="
                            w-11
                            h-11
                            rounded-full
                            bg-[#F0EEFF]
                            text-[#5841D8]
                            flex
                            items-center
                            justify-center
                        ">

                            <Heart size={21} />

                        </div>


                        <h2 className="
                            mt-5
                            text-base
                            font-bold
                            text-[#17265B]
                        ">
                            Our Values
                        </h2>


                        <p className="
                            mt-3
                            text-sm
                            leading-6
                            text-[#68708A]
                        ">
                            Integrity, innovation and impact guide
                            everything we build. We believe in
                            creating meaningful opportunities and
                            supporting continuous learning.
                        </p>

                    </div>

                </section>

            </main>

        </div>
        </section>
    );
};

export default About;
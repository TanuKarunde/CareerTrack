import {
  Target,
  ArrowRight,
} from "lucide-react";

const CareerCTASection = () => {
  return (
    <section className="w-full bg-white !py-5">

      <div className="!mx-auto max-w-7xl !px-4 sm:px-6 lg:px-8">

        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            bg-gradient-to-r
            from-purple-400
            via-purple-600
            to-purple-700
            !px-6
            !py-7
            sm:px-10
            sm:py-8
          "
        >

          {/* Decorative circle */}

          <div
            className="
              absolute
              -left-12
              -top-12
              h-32
              w-32
              rounded-full
              bg-white/10
            "
          />

          <div
            className="
              absolute
              -bottom-20
              right-20
              h-40
              w-40
              rounded-full
              bg-white/10
            "
          />

          <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">

            {/* Left icon */}

            <div
              className="
                hidden
                h-20
                w-20
                flex-shrink-0
                items-center
                justify-center
                rounded-full
                bg-white/20
                md:flex
              "
            >
              <Target
                size={43}
                strokeWidth={1.5}
                className="text-white"
              />
            </div>

            {/* Center content */}

            <div className="text-center md:flex-1">

              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Your career journey starts here.
              </h2>

              <p className="mt-2 text-sm text-purple-100">
                Join CareerTrack today and take the next step towards your dream career.
              </p>

              <button
                onClick={() => {
                  window.location.href = "/register";
                }}
                className="
                  !mt-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-white
                  !px-5
                  !py-2.5
                  text-xs
                  font-semibold
                  text-purple-600
                  shadow-sm
                  transition
                  hover:bg-purple-50
                "
              >
                Create Your Account
                <ArrowRight size={14} />
              </button>

            </div>

            {/* Right text */}

            <div className="hidden w-32 text-right md:block">

              <p className="rotate-[-8deg] text-sm font-medium leading-5 text-white">
                Better
                <br />
                Opportunities
                <br />
                Brighter Future
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default CareerCTASection;
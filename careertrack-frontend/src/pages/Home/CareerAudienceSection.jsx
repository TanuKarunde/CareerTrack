import {
  GraduationCap,
  Building2,
  CheckCircle2,
  ArrowRight,
  Users,
} from "lucide-react";

const CareerAudienceSection = () => {
  const studentPoints = [
    "Build your profile",
    "Discover job opportunities",
    "Apply online",
    "Track your applications",
  ];

  const employerPoints = [
    "Post jobs",
    "Find qualified candidates",
    "Manage applications",
    "Track hiring progress",
  ];

  return (
    <section className="w-full bg-white !py-10">

      <div className="!mx-auto max-w-7xl !px-4 sm:px-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-2">

          {/* =====================================================
              STUDENT CARD
          ===================================================== */}

          <div
            className="
              relative
              min-h-[255px]
              overflow-hidden
              rounded-2xl
              bg-[#f5f3ff]
              border
              border-purple-100
              !p-7
              sm:p-8
            "
          >

            {/* Content */}

            <div className="relative z-10 max-w-[65%]">

              {/* Icon */}

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-purple-400
                "
              >
                <GraduationCap
                  size={23}
                  className="text-gray-900"
                />
              </div>

              {/* Heading */}

              <h2 className="!mt-4 text-xl font-bold text-[#17205c]">
                For Students
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Kickstart your career with the right opportunities.
              </p>

              {/* Points */}

              <div className="!mt-4 space-y-2">

                {studentPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2
                      size={15}
                      className="flex-shrink-0 text-purple-700"
                    />

                    <span className="text-xs text-slate-800">
                      {point}
                    </span>
                  </div>
                ))}

              </div>

              {/* Button */}

              <button
                onClick={() => {
                  window.location.href = "/register";
                }}
                className="
                  !mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-purple-700
                  !px-4
                  !py-2.5
                  text-xs
                  font-semibold
                  text-white
                  transition
                  hover:bg-purple-900
                "
              >
                Start as Student
                <ArrowRight size={14} />
              </button>

            </div>

            {/* Illustration */}

            <div
              className="
                absolute
                bottom-0
                right-5
                hidden
                sm:block
              "
            >
              <div
                className="
                  flex
                  h-36
                  w-32
                  items-end
                  justify-center
                  rounded-t-full
                  bg-purple-100/70
                "
              >
                <GraduationCap
                  size={80}
                  strokeWidth={1}
                  className="!mb-5 text-purple-400"
                />
              </div>
            </div>

          </div>


          {/* =====================================================
              EMPLOYER CARD
          ===================================================== */}

          <div
            className="
              relative
              min-h-[255px]
              overflow-hidden
              rounded-2xl
              bg-[#f5f3ff]
              border
              border-purple-100
              !p-7
              sm:p-8
            "
          >

            {/* Content */}

            <div className="relative z-10 max-w-[65%]">

              {/* Icon */}

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-purple-400
                "
              >
                <Building2
                  size={23}
                  className="text-gray-900"
                />
              </div>

              {/* Heading */}

              <h2 className="!mt-4 text-xl font-bold text-[#17205c]">
                For Employers
              </h2>

              <p className="!mt-1 text-sm text-slate-600">
                Find the right talent for your team.
              </p>

              {/* Points */}

              <div className="!mt-4 space-y-2">

                {employerPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2
                      size={15}
                      className="flex-shrink-0 text-purple-500"
                    />

                    <span className="text-xs text-slate-700">
                      {point}
                    </span>
                  </div>
                ))}

              </div>

              {/* Button */}

              <button
                onClick={() => {
                  window.location.href = "/register";
                }}
                className="
                  !mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-purple-600
                  !px-4
                  !py-2.5
                  text-xs
                  font-semibold
                  text-white
                  transition
                  hover:bg-purple-700
                "
              >
                Hire Talent
                <ArrowRight size={14} />
              </button>

            </div>

            {/* Illustration */}

            <div
              className="
                absolute
                bottom-0
                right-5
                hidden
                sm:block
              "
            >
              <div
                className="
                  flex
                  h-36
                  w-32
                  items-end
                  justify-center
                  rounded-t-full
                  bg-purple-100/70
                "
              >
                <Users
                  size={82}
                  strokeWidth={1}
                  className="mb-5 text-purple-400"
                />
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default CareerAudienceSection;
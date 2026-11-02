import {
  Search,
  FileText,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Find Jobs",
    description: (
      <>
        Discover relevant job opportunities
        <br />
        that match your skills and interests.
      </>
    ),
  },
  {
    icon: FileText,
    title: "Track Applications",
    description: (
      <>
        Keep everything organized
        <br />
        in one place.
      </>
    ),
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description: (
      <>
        Prepare, learn new skills and
        <br />
        achieve your goals.
      </>
    ),
  },
];

function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-white !py-14"
    >
      <div className="mx-auto max-w-auto !px-4 sm:px-6 lg:px-8 !mx-23">

        {/* Heading */}
        <div className="mx-auto max-w-auto text-center">

          <h2 className="text-2xl font-bold text-[#17205c] sm:text-3xl">
            Why CareerTrack?
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Everything you need for a successful career journey.
          </p>

        </div>

        {/* Features */}
        <div className="mt-10 grid gap-10 sm:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  flex
                  flex-col
                  items-center
                  text-center
                "
              >

                {/* Icon */}
                <div
                  className="
                    flex
                    h-14
                    w-14
                    rounded-full
                    items-center
                    justify-center
                    bg-purple-100
                  "
                >
                  <Icon
                    size={27}
                    strokeWidth={1.8}
                    className="text-purple-600"
                  />
                </div>

                {/* Title */}
                <h3 className="mt-4 text-base font-bold text-[#17205c]">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-5 text-slate-500">
                  {feature.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default FeaturesSection;
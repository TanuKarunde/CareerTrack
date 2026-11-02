
import { useMemo } from "react";
import {
  Sun,
  Sunrise,
  Moon,
  Sparkles,
  ArrowUpRight,
  Compass,
} from "lucide-react";

const WelcomeBanner = ({ studentname }) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return { text: "Good morning", Icon: Sunrise };
    }

    if (hour < 17) {
      return { text: "Good afternoon", Icon: Sun };
    }

    return { text: "Good evening", Icon: Moon };
  }, []);

  const GreetingIcon = greeting.Icon;

  return (
    <section className="group relative isolate overflow-hidden rounded-[30px] border border-violet-100/70 bg-gradient-to-br from-white via-violet-50/80 to-fuchsia-50/80 !p-5 shadow-[0_12px_40px_-28px_rgba(109,40,217,0.35)] sm:!p-7 xl:!p-8">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl transition duration-700 group-hover:bg-fuchsia-200/50" />
      <div className="pointer-events-none absolute -bottom-24 right-1/3 -z-10 h-48 w-48 rounded-full bg-fuchsia-100/60 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 !px-3 !py-2 text-xs font-bold text-violet-700 shadow-sm">
            <GreetingIcon size={16} />
            <span>{greeting.text}</span>
            <Sparkles size={14} className="text-fuchsia-500" />
          </div>

          <h1 className="mt-4 break-words text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl xl:text-[42px]">
            Welcome back,
            <span className="block bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500 bg-clip-text !text-transparent">
              {studentname}!
            </span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Your next opportunity starts here. Keep learning, keep preparing,
            and let every small step move you closer to your dream career.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="/student/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 !px-4 !py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Explore opportunities
              <ArrowUpRight size={16} />
            </a>

            <a
              href="/student/profile"
              className="inline-flex items-center gap-2 rounded-xl border border-violet-100 bg-white/80 !px-4 !py-3 text-sm font-bold text-violet-700 transition hover:border-violet-200 hover:bg-white"
            >
              Update profile
            </a>
          </div>
        </div>

        <div className="relative hidden w-full max-w-[245px] shrink-0 lg:block">
          <div className="relative overflow-hidden rounded-[26px] border border-white bg-white/80 !p-5 shadow-xl shadow-violet-100/70 backdrop-blur-sm transition duration-500 group-hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
              <Compass size={24} />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
              Your next chapter
            </p>
            <h2 className="mt-2 text-xl font-black leading-7 text-slate-900">
              Learn. Prepare. Grow.
            </h2>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Stay consistent and keep moving toward your goals.
            </p>

            <div className="mt-5 flex items-center gap-1.5">
              <span className="h-1.5 flex-1 rounded-full bg-violet-600" />
              <span className="h-1.5 flex-1 rounded-full bg-fuchsia-400" />
              <span className="h-1.5 flex-1 rounded-full bg-violet-100" />
              <span className="h-1.5 flex-1 rounded-full bg-violet-100" />
            </div>
          </div>

          <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white bg-fuchsia-100 text-fuchsia-600 shadow-md transition duration-500 group-hover:rotate-12">
            <Sparkles size={18} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeBanner;

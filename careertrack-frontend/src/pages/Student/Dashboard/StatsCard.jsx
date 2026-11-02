
import { ArrowUpRight } from "lucide-react";

const themes = {
  violet: {
    icon: "bg-violet-100 text-violet-700",
    card: "from-violet-50/90 via-white to-white",
    border: "hover:border-violet-300",
    arrow: "text-violet-600",
    glow: "bg-violet-200/50",
    label: "text-violet-700",
  },
  emerald: {
    icon: "bg-emerald-100 text-emerald-700",
    card: "from-emerald-50/90 via-white to-white",
    border: "hover:border-emerald-300",
    arrow: "text-emerald-600",
    glow: "bg-emerald-200/50",
    label: "text-emerald-700",
  },
  blue: {
    icon: "bg-blue-100 text-blue-700",
    card: "from-blue-50/90 via-white to-white",
    border: "hover:border-blue-300",
    arrow: "text-blue-600",
    glow: "bg-blue-200/50",
    label: "text-blue-700",
  },
  amber: {
    icon: "bg-amber-100 text-amber-700",
    card: "from-amber-50/90 via-white to-white",
    border: "hover:border-amber-300",
    arrow: "text-amber-600",
    glow: "bg-amber-200/50",
    label: "text-amber-700",
  },
};

const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  theme = "violet",
}) => {
  const style = themes[theme] || themes.violet;

  return (
    <div
      className={`group relative flex min-h-[150px] items-center overflow-hidden rounded-[26px] border border-violet-100/80 bg-gradient-to-br ${style.card} !p-4 shadow-[0_8px_28px_-22px_rgba(109,40,217,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100/70 sm:!p-5 ${style.border}`}
    >
      <div
        className={`pointer-events-none absolute -bottom-10 -right-8 h-28 w-28 rounded-full ${style.glow} blur-2xl transition-transform duration-500 group-hover:scale-150`}
      />

      <div className="pointer-events-none absolute right-4 top-4 h-14 w-14 rounded-full border border-white/80 transition-transform duration-500 group-hover:scale-125" />

      <div className="relative z-10 grid w-full grid-cols-[52px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[58px_minmax(0,1fr)] sm:gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.icon} shadow-sm ring-1 ring-white transition duration-300 group-hover:rotate-3 group-hover:scale-110 sm:h-14 sm:w-14`}
        >
          <Icon size={25} strokeWidth={2.1} />
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-1.5">
            <p className="text-xs font-bold leading-5 text-slate-500 sm:text-sm">
              {title}
            </p>
            <ArrowUpRight
              size={17}
              className={`shrink-0 ${style.arrow} opacity-60 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100`}
            />
          </div>

          <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-[34px]">
            {value}
          </h2>

          <p className="mt-1 text-[11px] leading-5 text-slate-500 sm:text-xs">
            {description}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-5 right-5 h-[3px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-transform duration-300 group-hover:scale-x-100" />
    </div>
  );
};

export default StatsCard;

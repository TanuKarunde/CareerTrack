
import {
    Brain,
    Code2,
    Users,
    MessageCircle,
    Video,
    FileText,
    ArrowUpRight,
    Sparkles,
    ChevronRight,
} from "lucide-react";

const topicStyles = {
    Aptitude: {
        icon: Brain,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-700",
        accent: "from-amber-500 to-orange-500",
        glow: "bg-amber-200/40",
        badge: "Reasoning",
        number: "01",
    },
    Technical: {
        icon: Code2,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-700",
        accent: "from-blue-500 to-indigo-500",
        glow: "bg-blue-200/40",
        badge: "Core concepts",
        number: "02",
    },
    Coding: {
        icon: Code2,
        iconBg: "bg-violet-100",
        iconColor: "text-violet-700",
        accent: "from-violet-600 to-indigo-600",
        glow: "bg-violet-200/40",
        badge: "Problem solving",
        number: "03",
    },
    HR: {
        icon: FileText,
        iconBg: "bg-rose-100",
        iconColor: "text-rose-700",
        accent: "from-rose-500 to-pink-500",
        glow: "bg-rose-200/40",
        badge: "Career readiness",
        number: "04",
    },
    Behavioral: {
        icon: Users,
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-700",
        accent: "from-emerald-500 to-teal-500",
        glow: "bg-emerald-200/40",
        badge: "Real scenarios",
        number: "05",
    },
    "Mock Interview": {
        icon: Video,
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-700",
        accent: "from-indigo-500 to-purple-600",
        glow: "bg-indigo-200/40",
        badge: "Interview simulation",
        number: "06",
    },
};

const defaultStyle = {
    icon: MessageCircle,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-700",
    accent: "from-violet-600 to-indigo-600",
    glow: "bg-violet-200/40",
    badge: "Skill practice",
    number: "07",
};

const TopicCard = ({ topic, onSelect }) => {
    const style = topicStyles[topic.name] || defaultStyle;
    const Icon = style.icon;

    return (
        <button
            type="button"
            onClick={() => onSelect(topic)}
            aria-label={`Start ${topic.name} practice`}
            className="
                group relative flex h-full w-full min-w-0
                flex-col overflow-hidden rounded-[26px]
                border border-slate-200/80 bg-white text-left
                shadow-[0_5px_25px_-18px_rgba(76,29,149,0.3)]
                transition-all duration-300
                hover:-translate-y-1.5
                hover:border-violet-200
                hover:shadow-[0_20px_45px_-22px_rgba(91,33,182,0.3)]
                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-violet-200
            "
        >
            {/* Top accent */}
            <div
                className={`h-1.5 w-full bg-gradient-to-r ${style.accent}`}
            />

            {/* Decorative glow */}
            <div
                className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-100 ${style.glow} opacity-50`}
            />

            <div className="relative flex flex-1 flex-col !p-5 sm:p-6">

                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                    <div
                        className={`flex h-14 w-14 items-center justify-center rounded-[18px] transition-all duration-300 group-hover:scale-105 group-hover:rotate-[-3deg] ${style.iconBg} ${style.iconColor}`}
                    >
                        <Icon size={27} strokeWidth={1.9} />
                    </div>

                    <span className="rounded-xl border border-slate-100 bg-slate-50 !px-3 !py-2 text-xs font-extrabold tracking-wider text-slate-400 transition-colors group-hover:border-violet-100 group-hover:bg-violet-50 group-hover:text-violet-600">
                        {style.number}
                    </span>
                </div>

                {/* Badge */}
                <div className="mt-5 flex items-center gap-1.5">
                    <Sparkles
                        size={13}
                        className={style.iconColor}
                    />

                    <span className={`text-[10px] font-extrabold uppercase tracking-[0.14em] ${style.iconColor}`}>
                        {style.badge}
                    </span>
                </div>

                {/* Title */}
                <h3 className="mt-2 break-words text-xl font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-violet-800">
                    {topic.name}
                </h3>

                {/* Description */}
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                    {topic.description ||
                        "Practice with AI-powered questions and build confidence for your next interview."}
                </p>

                {/* Divider */}
                <div className="my-5 h-px w-full bg-slate-100 transition-colors group-hover:bg-violet-100" />

                {/* CTA */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:translate-x-0.5 ${style.accent}`}>
                            <ArrowUpRight size={18} />
                        </span>

                        <div className="min-w-0">
                            <p className="text-sm font-extrabold text-slate-800 transition-colors group-hover:text-violet-700">
                                Start practice
                            </p>

                            <p className="mt-0.5 text-[11px] text-slate-400">
                                Improve your skills
                            </p>
                        </div>
                    </div>

                    <ChevronRight
                        size={19}
                        className="shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-violet-600"
                    />
                </div>
            </div>
        </button>
    );
};

export default TopicCard;

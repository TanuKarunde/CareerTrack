
import {
  CheckCircle2,
  Clock3,
  Trophy,
  LoaderCircle,
  Code2,
  FolderKanban,
  UserRound,
  MessageSquare,
  BookOpen,
  Target,
  LockKeyhole,
} from "lucide-react";

const typeConfig = {
  PROJECT: { label: "Project", icon: FolderKanban },
  CODING: { label: "Coding", icon: Code2 },
  PROFILE: { label: "Profile", icon: UserRound },
  INTERVIEW: { label: "Interview Prep", icon: MessageSquare },
  SKILL: { label: "Skill Development", icon: BookOpen },
};

const MissionCard = ({ mission, onStart, starting }) => {
  const isCompleted = mission.status === "COMPLETED";

  const config = typeConfig[mission.missionType] || {
    label: mission.missionType || "Mission",
    icon: Target,
  };

  const Icon = config.icon;

  // These mission types currently have the quiz endpoint implemented.
  const supportsAssessment = ["INTERVIEW", "CODING"].includes(
    mission.missionType
  );

  return (
    <article
      className={`rounded-2xl border bg-white !p-5 shadow-sm transition ${
        isCompleted
          ? "border-emerald-200"
          : "border-gray-200 hover:border-violet-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`rounded-xl !p-3 ${
              isCompleted
                ? "bg-emerald-100 text-emerald-700"
                : "bg-violet-100 text-violet-700"
            }`}
          >
            <Icon size={22} />
          </div>

          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wide text-violet-700">
              {config.label}
            </span>

            <h3 className="mt-1 text-base font-bold text-gray-900">
              {mission.title}
            </h3>
          </div>
        </div>

        {isCompleted && (
          <CheckCircle2
            className="shrink-0 text-emerald-600"
            size={23}
          />
        )}
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-600">
        {mission.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {mission.targetSkill && (
          <span className="rounded-full bg-violet-50 !px-3 !py-1 text-xs font-medium text-violet-700">
            {mission.targetSkill}
          </span>
        )}

        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 !px-3 !py-1 text-xs text-gray-600">
          <Clock3 size={13} />
          {mission.estimatedMinutes} min
        </span>

        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 !px-3 !py-1 text-xs font-semibold text-amber-700">
          <Trophy size={13} />
          {mission.xpReward} XP
        </span>
      </div>

      {isCompleted ? (
        <div className="mt-5 rounded-xl bg-emerald-50 !px-4 !py-3 text-sm font-medium text-emerald-700">
          Mission completed
          {mission.completedAt && (
            <span className="mt-1 block text-xs font-normal">
              {new Date(mission.completedAt).toLocaleString()}
            </span>
          )}

          {mission.score != null && mission.totalMarks != null && (
            <span className="mt-1 block text-xs font-normal">
              Assessment score: {mission.score}/{mission.totalMarks}
            </span>
          )}
        </div>
      ) : supportsAssessment ? (
        <button
          type="button"
          onClick={() => onStart(mission)}
          disabled={starting}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 !px-4 !py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {starting ? (
            <>
              <LoaderCircle size={17} className="animate-spin" />
              Starting...
            </>
          ) : (
            <>
              <Target size={17} />
              {mission.status === "IN_PROGRESS"
                ? "Resume Assessment"
                : "Start Assessment"}
            </>
          )}
        </button>
      ) : (
        <div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 !px-4 !py-3 text-sm text-amber-800">
          <LockKeyhole size={17} className="mt-0.5 shrink-0" />
          <span>
            Assignment workflow is not connected yet for this mission type.
          </span>
        </div>
      )}
    </article>
  );
};

export default MissionCard;

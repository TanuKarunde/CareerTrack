
import { CheckCircle2, Clock3, Trophy, Target } from "lucide-react";

const MissionStats = ({ missions }) => {
  const completedMissions = missions.filter(
    (mission) => mission.status === "COMPLETED"
  );

  const earnedXP = completedMissions.reduce(
    (total, mission) => total + (mission.xpReward || 0),
    0
  );

  const totalXP = missions.reduce(
    (total, mission) => total + (mission.xpReward || 0),
    0
  );

  const totalMinutes = missions
    .filter((mission) => mission.status !== "COMPLETED")
    .reduce(
      (total, mission) => total + (mission.estimatedMinutes || 0),
      0
    );

  const progress = missions.length
    ? Math.round((completedMissions.length / missions.length) * 100)
    : 0;

  const stats = [
    {
      label: "Missions Completed",
      value: `${completedMissions.length}/${missions.length}`,
      icon: CheckCircle2,
    },
    {
      label: "XP Earned",
      value: earnedXP,
      icon: Trophy,
    },
    {
      label: "XP Available",
      value: totalXP - earnedXP,
      icon: Target,
    },
    {
      label: "Time Remaining",
      value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
      icon: Clock3,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-gray-200 bg-white !p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{label}</p>
              <Icon size={20} className="text-violet-600" />
            </div>

            <p className="mt-3 text-2xl font-bold text-gray-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white !p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900">
              Your mission progress
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Complete missions to earn XP and build job-ready skills.
            </p>
          </div>

          <span className="font-bold text-violet-700">
            {progress}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-violet-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MissionStats;

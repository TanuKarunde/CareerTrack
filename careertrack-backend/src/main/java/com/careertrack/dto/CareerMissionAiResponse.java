
package com.careertrack.dto;

import java.util.List;

public class CareerMissionAiResponse {

    private List<MissionItem> missions;

    public List<MissionItem> getMissions() {
        return missions;
    }

    public void setMissions(List<MissionItem> missions) {
        this.missions = missions;
    }

    public static class MissionItem {

        private String title;
        private String description;
        private String missionType;
        private String targetSkill;
        private Integer estimatedMinutes;
        private Integer xpReward;

        public String getTitle() { return title; }
        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }
        public void setDescription(String description) {
            this.description = description;
        }

        public String getMissionType() {
            return missionType;
        }
        public void setMissionType(String missionType) {
            this.missionType = missionType;
        }

        public String getTargetSkill() {
            return targetSkill;
        }
        public void setTargetSkill(String targetSkill) {
            this.targetSkill = targetSkill;
        }

        public Integer getEstimatedMinutes() {
            return estimatedMinutes;
        }
        public void setEstimatedMinutes(Integer minutes) {
            this.estimatedMinutes = minutes;
        }

        public Integer getXpReward() { return xpReward; }
        public void setXpReward(Integer xpReward) {
            this.xpReward = xpReward;
        }
    }
}

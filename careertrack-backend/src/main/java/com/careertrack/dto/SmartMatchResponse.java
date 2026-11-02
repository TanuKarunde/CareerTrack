
package com.careertrack.dto;

import java.util.ArrayList;
import java.util.List;

public class SmartMatchResponse {

    private Long applicationId;
    private Long studentId;
    private String studentName;
    private String email;
    private String jobTitle;
    private String applicationStatus;

    private Integer matchScore;
    private Integer readinessScore;
    private Integer resumeScore;
    private Integer resumeJobMatchScore;

    private List<String> matchedSkills = new ArrayList<>();
    private List<String> missingSkills = new ArrayList<>();
    private List<String> matchReasons = new ArrayList<>();

    private boolean readinessReportAvailable;
    private boolean resumeAnalysisAvailable;

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getApplicationStatus() {
        return applicationStatus;
    }

    public void setApplicationStatus(String applicationStatus) {
        this.applicationStatus = applicationStatus;
    }

    public Integer getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Integer matchScore) {
        this.matchScore = matchScore;
    }

    public Integer getReadinessScore() {
        return readinessScore;
    }

    public void setReadinessScore(Integer readinessScore) {
        this.readinessScore = readinessScore;
    }

    public Integer getResumeScore() {
        return resumeScore;
    }

    public void setResumeScore(Integer resumeScore) {
        this.resumeScore = resumeScore;
    }

    public Integer getResumeJobMatchScore() {
        return resumeJobMatchScore;
    }

    public void setResumeJobMatchScore(Integer resumeJobMatchScore) {
        this.resumeJobMatchScore = resumeJobMatchScore;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getMatchReasons() {
        return matchReasons;
    }

    public void setMatchReasons(List<String> matchReasons) {
        this.matchReasons = matchReasons;
    }

    public boolean isReadinessReportAvailable() {
        return readinessReportAvailable;
    }

    public void setReadinessReportAvailable(
            boolean readinessReportAvailable) {
        this.readinessReportAvailable = readinessReportAvailable;
    }

    public boolean isResumeAnalysisAvailable() {
        return resumeAnalysisAvailable;
    }

    public void setResumeAnalysisAvailable(
            boolean resumeAnalysisAvailable) {
        this.resumeAnalysisAvailable = resumeAnalysisAvailable;
    }
}

package com.careertrack.dto;

import java.util.List;

public class StudentdashboardResponse {

    private String name;

    private Long totalApplications;
    private Long shortlisted;
    private Long interviews;
    private Long selected;

    private List<ApplicationResponse> recentApplications;

    private List<?> upcommingInterviews;
    private List<?> recommendedJobs;

    public StudentdashboardResponse() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(Long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public Long getShortlisted() {
        return shortlisted;
    }

    public void setShortlisted(Long shortlisted) {
        this.shortlisted = shortlisted;
    }

    public Long getInterviews() {
        return interviews;
    }

    public void setInterviews(Long interviews) {
        this.interviews = interviews;
    }

    public Long getSelected() {
        return selected;
    }

    public void setSelected(Long selected) {
        this.selected = selected;
    }

    public List<ApplicationResponse> getRecentApplications() {
        return recentApplications;
    }

    public void setRecentApplications(
            List<ApplicationResponse> recentApplications) {
        this.recentApplications = recentApplications;
    }

    public List<?> getUpcommingInterviews() {
        return upcommingInterviews;
    }

    public void setUpcommingInterviews(
            List<?> upcommingInterviews) {
        this.upcommingInterviews = upcommingInterviews;
    }

    public List<?> getRecommendedJobs() {
        return recommendedJobs;
    }

    public void setRecommendedJobs(
            List<?> recommendedJobs) {
        this.recommendedJobs = recommendedJobs;
    }
}
package com.careertrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class JobRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Company name required")
    private String company;

    @NotBlank(message = "Job description is required")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Job type is required")
    private String jobtype;

    @NotBlank(message = "Experience level is required")
    private String experienceLevel;

    @NotBlank(message = "Skills are required")
    private String skills;

    @NotNull(message = "Minimum salary is required")
    private Double salaryMin;

    @NotNull(message = "Maximum salary is required")
    private Double salaryMax;


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getJobtype() {
        return jobtype;
    }

    public void setJobtype(String jobtype) {
        this.jobtype = jobtype;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public Double getSalaryMin() {
        return salaryMin;
    }

    public void setSalaryMin(Double salaryMin) {
        this.salaryMin = salaryMin;
    }

    public Double getSalaryMax() {
        return salaryMax;
    }

    public void setSalaryMax(Double salaryMax) {
        this.salaryMax = salaryMax;
    }
}
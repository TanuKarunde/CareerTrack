package com.careertrack.dto;

import java.time.LocalDateTime;

import com.careertrack.entity.Job;

public class JobResponce {

    private Long id;
    private String title;
    private String company;
    private String description;
    private String location;
    private String jobtype;
    private String experienceLevel;
    private String skills;
    private Double salaryMin;
    private Double salaryMax;
    private LocalDateTime createdAt;
    private boolean active;

    private Long employerId;
    private String employerName;

    private String logo;

    public JobResponce(Job job) {

        this.id = job.getId();
        this.title = job.getTitle();
        this.company = job.getCompany();
        this.description = job.getDescription();
        this.location = job.getLocation();
        this.jobtype = job.getJobType();
        this.experienceLevel = job.getExperienceLevel();
        this.skills = job.getSkills();
        this.salaryMin = job.getSalaryMin();
        this.salaryMax = job.getSalaryMax();
        this.createdAt = job.getCreateAt();
        this.active = job.isActive();

        if (job.getEmployer() != null) {
            this.employerId = job.getEmployer().getId();
            this.employerName = job.getEmployer().getName();
        }
    }

    public JobResponce(Job job, String logo) {
        this(job);
        this.logo = logo;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getCompany() {
        return company;
    }

    public String getDescription() {
        return description;
    }

    public String getLocation() {
        return location;
    }

    public String getJobtype() {
        return jobtype;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public String getSkills() {
        return skills;
    }

    public Double getSalaryMin() {
        return salaryMin;
    }

    public Double getSalaryMax() {
        return salaryMax;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public boolean isActive() {
        return active;
    }

    public Long getEmployerId() {
        return employerId;
    }

    public String getEmployerName() {
        return employerName;
    }

    public String getLogo() {
        return logo;
    }
}
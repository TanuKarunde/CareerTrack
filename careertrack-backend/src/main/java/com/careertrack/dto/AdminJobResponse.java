
package com.careertrack.dto;

import java.time.LocalDateTime;

import com.careertrack.entity.Job;
import com.careertrack.entity.User;

public class AdminJobResponse {

    private long id;
    private String title;
    private String company;
    private String description;
    private String location;
    private String jobType;
    private String experienceLevel;
    private String skills;
    private Double salaryMin;
    private Double salaryMax;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private boolean active;

    private Long employerId;
    private String employerName;
    private String employerEmail;

    public AdminJobResponse(Job job) {
        this.id = job.getId();
        this.title = job.getTitle();
        this.company = job.getCompany();
        this.description = job.getDescription();
        this.location = job.getLocation();
        this.jobType = job.getJobType();
        this.experienceLevel = job.getExperienceLevel();
        this.skills = job.getSkills();
        this.salaryMin = job.getSalaryMin();
        this.salaryMax = job.getSalaryMax();
        this.createAt = job.getCreateAt();
        this.updateAt = job.getUpdateAt();
        this.active = job.isActive();

        User employer = job.getEmployer();

        if (employer != null) {
            this.employerId = employer.getId();
            this.employerName = employer.getName();
            this.employerEmail = employer.getEmail();
        }
    }

    public long getId() { return id; }
    public String getTitle() { return title; }
    public String getCompany() { return company; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public String getJobType() { return jobType; }
    public String getExperienceLevel() { return experienceLevel; }
    public String getSkills() { return skills; }
    public Double getSalaryMin() { return salaryMin; }
    public Double getSalaryMax() { return salaryMax; }
    public LocalDateTime getCreateAt() { return createAt; }
    public LocalDateTime getUpdateAt() { return updateAt; }
    public boolean isActive() { return active; }
    public Long getEmployerId() { return employerId; }
    public String getEmployerName() { return employerName; }
    public String getEmployerEmail() { return employerEmail; }
}

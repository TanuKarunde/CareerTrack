package com.careertrack.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String title;

    // Keep existing database column name to avoid database migration
    @Column(name = "compony", nullable = false)
    private String company;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String jobType;

    @Column(nullable = false)
    private String experienceLevel;

    @Column(nullable = false)
    private String skills;

    private Double salaryMin;

    private Double salaryMax;

    private LocalDateTime createAt;

    private LocalDateTime updateAt;

    @Column(nullable = false)
    private boolean active = true;

    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    @JsonIgnore
    private User employer;

    @PrePersist
    protected void onCreate() {
        createAt = LocalDateTime.now();
        updateAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updateAt = LocalDateTime.now();
    }

    public long getId() {
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

    public String getJobType() {
        return jobType;
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

    public LocalDateTime getCreateAt() {
        return createAt;
    }

    public LocalDateTime getUpdateAt() {
        return updateAt;
    }

    public boolean isActive() {
        return active;
    }

    public User getEmployer() {
        return employer;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public void setSalaryMin(Double salaryMin) {
        this.salaryMin = salaryMin;
    }

    public void setSalaryMax(Double salaryMax) {
        this.salaryMax = salaryMax;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void setEmployer(User employer) {
        this.employer = employer;
    }
}

package com.careertrack.dto;

import java.util.List;

public class StudentProfileResponse {

    // =========================
    // PROFILE
    // =========================
    private Long id;
    private Long userId;
    private String name;
    private String email;

    private String phone;
    private String dateOfBirth;
    private String gender;
    private String location;
    private String bio;

    // =========================
    // EDUCATION
    // =========================
    private String college;
    private String degree;
    private String branch;
    private Integer graduationYear;
    private Double cgpa;

    // =========================
    // SKILLS
    // =========================
    private String skills;
    
    private List<ExperienceResponse> experiences;
    private String languages;

    // =========================
    // SOCIAL & PORTFOLIO
    // =========================
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private boolean hasResume;
    private String resumeName;
    private String resumeType;

    // =========================
    // CAREER PREFERENCES
    // =========================
    private String preferredJobRole;
    private String preferredLocation;

    // =========================
    // PROFILE IMAGE
    // =========================
    private boolean hasProfileImage;

    // =========================
    // PROJECTS
    // =========================
    private List<StudentProjectResponse> projects;

    // =========================
    // CERTIFICATIONS
    // =========================
    private List<StudentCertificationResponse> certifications;

    public StudentProfileResponse() {
    }

    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    // Education

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(Integer graduationYear) {
        this.graduationYear = graduationYear;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    // Skills

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }
    
    public List<ExperienceResponse> getExperiences() {
        return experiences;
    }

    public void setExperiences(List<ExperienceResponse> experiences) {
        this.experiences = experiences;
    }

	public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

    // Social

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }
    
    public boolean isHasResume() {
        return hasResume;
    }

    public void setHasResume(boolean hasResume) {
        this.hasResume = hasResume;
    }

    public String getResumeName() {
        return resumeName;
    }

    public void setResumeName(String resumeName) {
        this.resumeName = resumeName;
    }

    public String getResumeType() {
        return resumeType;
    }

    public void setResumeType(String resumeType) {
        this.resumeType = resumeType;
    }

    // Career Preferences

    public String getPreferredJobRole() {
        return preferredJobRole;
    }

    public void setPreferredJobRole(String preferredJobRole) {
        this.preferredJobRole = preferredJobRole;
    }

    public String getPreferredLocation() {
        return preferredLocation;
    }

    public void setPreferredLocation(String preferredLocation) {
        this.preferredLocation = preferredLocation;
    }

    // Profile Image

    public boolean isHasProfileImage() {
        return hasProfileImage;
    }

    public void setHasProfileImage(boolean hasProfileImage) {
        this.hasProfileImage = hasProfileImage;
    }

    // Projects

    public List<StudentProjectResponse> getProjects() {
        return projects;
    }

    public void setProjects(List<StudentProjectResponse> projects) {
        this.projects = projects;
    }

    // Certifications

    public List<StudentCertificationResponse> getCertifications() {
        return certifications;
    }

    public void setCertifications(
            List<StudentCertificationResponse> certifications) {
        this.certifications = certifications;
    }
}


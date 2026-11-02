
package com.careertrack.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 */
public class StudentProfileRequest {

    // =========================
    // PROFILE INFORMATION
    // =========================
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
    
    private List<ExperienceRequest> experiences = new ArrayList<>();
    private String languages;
    // =========================
    // SOCIAL & PORTFOLIO
    // =========================
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;

    // =========================
    // CAREER PREFERENCES
    // =========================
    private String preferredJobRole;
    private String preferredLocation;

    // =========================
    // PROJECTS
    // =========================
    private List<StudentProjectRequest> projects;

    // =========================
    // CERTIFICATIONS
    // =========================
    private List<StudentCertificationRequest> certifications;

    public StudentProfileRequest() {
    }

    // Profile Information
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

	public List<ExperienceRequest> getExperiences() {
		return experiences;
	}

	public void setExperiences(List<ExperienceRequest> experiences) {
		this.experiences = experiences;
	}

	public String getLanguages() {
		return languages;
	}

	public void setLanguages(String languages) {
		this.languages = languages;
	}

	// Social & Portfolio
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

    // Projects
    public List<StudentProjectRequest> getProjects() {
        return projects;
    }

    public void setProjects(List<StudentProjectRequest> projects) {
        this.projects = projects;
    }

    // Certifications
    public List<StudentCertificationRequest> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<StudentCertificationRequest> certifications) {
        this.certifications = certifications;
    }
}


package com.careertrack.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.careertrack.entity.Application;
import com.careertrack.entity.Experience;
import com.careertrack.entity.StudentProfile;

public class ApplicantResponse {

    // Application
    private Long applicationId;
    private String status;
    private LocalDateTime appliedAt;

    // Student
    private Long studentId;
    private String studentName;
    private String email;

    // Personal information
    private String phone;
    private String dateOfBirth;
    private String gender;
    private String location;
    private String bio;

    // Education
    private String college;
    private String degree;
    private String branch;
    private Integer graduationYear;
    private Double cgpa;

    // Skills
    private String skills;
    
    private List<Experience> experience;
    private String languages;

    // Social / Portfolio
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;

    // Career preferences
    private String preferredJobRole;
    private String preferredLocation;

    // Profile image information
    private boolean hasProfileImage;
    
 // employer applicant Resume information
    private boolean hasResume;
    private String resumeName;
    
    // profile Resume 
    private boolean hasProfileResume;
	private String profileResumeName;

    // Job
    private Long jobId;
    private String jobTitle;
    private String compony;
    private String jobLocation;
	

    public ApplicantResponse() {
    }

    public ApplicantResponse(
            Application application,
            StudentProfile profile
    ) {

        // -----------------------------
        // APPLICATION
        // -----------------------------
        this.applicationId = application.getId();
        this.status = application.getStatus().name();
        this.appliedAt = application.getAppliedAt();

        // -----------------------------
        // STUDENT
        // -----------------------------
        this.studentId = application.getStudent().getId();
        this.studentName = application.getStudent().getName();
        this.email = application.getStudent().getEmail();

        // -----------------------------
        // PROFILE
        // -----------------------------
        if (profile != null) {

            this.phone = profile.getPhone();
            this.dateOfBirth = profile.getDateOfBirth();
            this.gender = profile.getGender();
            this.location = profile.getLocation();
            this.bio = profile.getBio();

            this.college = profile.getCollege();
            this.degree = profile.getDegree();
            this.branch = profile.getBranch();
            this.graduationYear = profile.getGraduationYear();
            this.cgpa = profile.getCgpa();

            this.skills = profile.getSkills();
            
            this.experience = profile.getExperiences();
            this.languages = profile.getLanguages();

            this.githubUrl = profile.getGithubUrl();
            this.linkedinUrl = profile.getLinkedinUrl();
            this.portfolioUrl = profile.getPortfolioUrl();

            this.preferredJobRole = profile.getPreferredJobRole();
            this.preferredLocation = profile.getPreferredLocation();

            this.hasProfileImage =
                    profile.getProfileImage() != null &&
                    profile.getProfileImage().length > 0;
                    
                 // Student Profile ka latest resume
                    this.hasProfileResume =
                            profile.getResume() != null &&
                            profile.getResume().length > 0;

                    this.profileResumeName = profile.getResumeName();


                    // Is job application ke saath submit kiya gaya resume
                    this.hasResume =
                            application.getResume() != null &&
                            application.getResume().length > 0;

                    this.resumeName = application.getResumeName();
        }
        
        

        // -----------------------------
        // JOB
        // -----------------------------
        this.jobId = application.getJob().getId();
        this.jobTitle = application.getJob().getTitle();
        this.compony = application.getJob().getCompany();
        this.jobLocation = application.getJob().getLocation();
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
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

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }
    
    public List<Experience> getExperience() {
		return experience;
	}

	public void setExperience(List<Experience> experience) {
		this.experience = experience;
	}

	public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

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

    public boolean isHasProfileImage() {
        return hasProfileImage;
    }

    public void setHasProfileImage(boolean hasProfileImage) {
        this.hasProfileImage = hasProfileImage;
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

    public boolean isHasProfileResume() {
		return hasProfileResume;
	}

	public void setHasProfileResume(boolean hasProfileResume) {
		this.hasProfileResume = hasProfileResume;
	}

	public String getProfileResumeName() {
		return profileResumeName;
	}

	public void setProfileResumeName(String profileResumeName) {
		this.profileResumeName = profileResumeName;
	}

	public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompony() {
        return compony;
    }

    public void setCompony(String compony) {
        this.compony = compony;
    }

    public String getJobLocation() {
        return jobLocation;
    }

    public void setJobLocation(String jobLocation) {
        this.jobLocation = jobLocation;
    }
}
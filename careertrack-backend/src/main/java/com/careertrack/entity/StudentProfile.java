package com.careertrack.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // -----------------------------------------------------
    // USER
    // -----------------------------------------------------

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // -----------------------------------------------------
    // PERSONAL INFORMATION
    // -----------------------------------------------------

    private String phone;

    private String dateOfBirth;

    private String gender;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String bio;

    // -----------------------------------------------------
    // EDUCATION
    // -----------------------------------------------------

    private String college;

    private String degree;

    private String branch;

    private Integer graduationYear;

    private Double cgpa;

    // -----------------------------------------------------
    // SKILLS
    // -----------------------------------------------------

    @Column(columnDefinition = "TEXT")
    private String skills;
    
 // -----------------------------------------------------
 // EXPERIENCE
 // -----------------------------------------------------

    @OneToMany(
    	    mappedBy = "studentProfile",
    	    cascade = CascadeType.ALL,
    	    orphanRemoval = true
    	)
    	private List<Experience> experiences = new ArrayList<>();

 // -----------------------------------------------------
 // LANGUAGES
 // -----------------------------------------------------

 @Column(columnDefinition = "TEXT")
 private String languages;

    // -----------------------------------------------------
    // SOCIAL / PORTFOLIO
    // -----------------------------------------------------

    private String githubUrl;

    private String linkedinUrl;

    private String portfolioUrl;
    
 // -----------------------------------------------------
 // RESUME
 // -----------------------------------------------------

 @Lob
 @Column(name = "resume", columnDefinition = "LONGBLOB")
 private byte[] resume;

 @Column(name = "resume_name")
 private String resumeName;

 @Column(name = "resume_type")
 private String resumeType;

    // -----------------------------------------------------
    // CAREER PREFERENCES
    // -----------------------------------------------------

    private String preferredJobRole;

    private String preferredLocation;

    // -----------------------------------------------------
    // PROFILE IMAGE
    // -----------------------------------------------------

    @Lob
    @Column(name = "profile_image", columnDefinition = "LONGBLOB")
    private byte[] profileImage;

    @Column(name = "profile_image_type")
    private String profileImageType;

    // -----------------------------------------------------
    // CONSTRUCTORS
    // -----------------------------------------------------

    public StudentProfile() {
    }

    // -----------------------------------------------------
    // GETTERS AND SETTERS
    // -----------------------------------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
    
    public List<Experience> getExperiences() {
        return experiences;
    }

    public void setExperiences(List<Experience> experiences) {
        this.experiences.clear();

        if (experiences != null) {
            for (Experience experience : experiences) {
                addExperience(experience);
            }
        }
    }

    public void addExperience(Experience experience) {
        experiences.add(experience);
        experience.setStudentProfile(this);
    }

    public void removeExperience(Experience experience) {
        experiences.remove(experience);
        experience.setStudentProfile(null);
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
    
    public byte[] getResume() {
        return resume;
    }

    public void setResume(byte[] resume) {
        this.resume = resume;
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

    public byte[] getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(byte[] profileImage) {
        this.profileImage = profileImage;
    }

    public String getProfileImageType() {
        return profileImageType;
    }

    public void setProfileImageType(String profileImageType) {
        this.profileImageType = profileImageType;
    }
}
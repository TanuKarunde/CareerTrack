package com.careertrack.dto;

import java.time.LocalDateTime;

import com.careertrack.entity.Company;
import com.careertrack.entity.CompanyVerificationStatus;

public class AdminCompanyResponse {

    private Long id;
    private String name;
    private String tagline;
    private String website;
    private String industry;
    private Integer founded;
    private String headquarters;
    private String about;

    private Long createdById;
    private String createdByName;
    private String createdByEmail;

    private CompanyVerificationStatus verificationStatus;
    private String verificationNote;
    private LocalDateTime createdAt;

    public AdminCompanyResponse(Company company) {
        this.id = company.getId();
        this.name = company.getName();
        this.tagline = company.getTagline();
        this.website = company.getWebsite();
        this.industry = company.getIndustry();
        this.founded = company.getFounded();
        this.headquarters = company.getHeadquarters();
        this.about = company.getAbout();

        if (company.getCreatedBy() != null) {
            this.createdById = company.getCreatedBy().getId();
            this.createdByName = company.getCreatedBy().getName();
            this.createdByEmail = company.getCreatedBy().getEmail();
        }

        this.verificationStatus = company.getVerificationStatus();
        this.verificationNote = company.getVerificationNote();
        this.createdAt = company.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getTagline() {
        return tagline;
    }

    public String getWebsite() {
        return website;
    }

    public String getIndustry() {
        return industry;
    }

    public Integer getFounded() {
        return founded;
    }

    public String getHeadquarters() {
        return headquarters;
    }

    public String getAbout() {
        return about;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public String getCreatedByEmail() {
        return createdByEmail;
    }

    public CompanyVerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public String getVerificationNote() {
        return verificationNote;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
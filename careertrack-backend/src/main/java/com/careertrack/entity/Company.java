package com.careertrack.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(
    name = "companies",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_company_website",
            columnNames = "website"
        )
    }
)
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String tagline;

    @Column(nullable = false, unique = true)
    private String website;

    private String industry;

    private Integer founded;

    private String headquarters;

    @Column(columnDefinition = "TEXT")
    private String about;

    @JsonIgnore
    @Lob
    @Column(name = "logo", columnDefinition = "LONGBLOB")
    private byte[] logo;

    @Column(name = "logo_type")
    private String logoType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false)
    private CompanyVerificationStatus verificationStatus =
            CompanyVerificationStatus.PENDING;

    @Column(name = "verification_note", columnDefinition = "TEXT")
    private String verificationNote;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Company() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTagline() {
        return tagline;
    }

    public void setTagline(String tagline) {
        this.tagline = tagline;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public Integer getFounded() {
        return founded;
    }

    public void setFounded(Integer founded) {
        this.founded = founded;
    }

    public String getHeadquarters() {
        return headquarters;
    }

    public void setHeadquarters(String headquarters) {
        this.headquarters = headquarters;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public byte[] getLogo() {
        return logo;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoType() {
        return logoType;
    }

    public void setLogoType(String logoType) {
        this.logoType = logoType;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public CompanyVerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(
            CompanyVerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getVerificationNote() {
        return verificationNote;
    }

    public void setVerificationNote(String verificationNote) {
        this.verificationNote = verificationNote;
    }
}

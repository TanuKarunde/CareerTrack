package com.careertrack.dto;

public class CompanyProfileResponse {

    private Long id;
    private String name;
    private String tagline;
    private String website;
    private String industry;
    private Integer founded;
    private String headquarters;
    private String about;
    private String logoUrl;

    public CompanyProfileResponse() {
    }

    public CompanyProfileResponse(
            Long id,
            String name,
            String tagline,
            String website,
            String industry,
            Integer founded,
            String headquarters,
            String about,
            String logoUrl) {

        this.id = id;
        this.name = name;
        this.tagline = tagline;
        this.website = website;
        this.industry = industry;
        this.founded = founded;
        this.headquarters = headquarters;
        this.about = about;
        this.logoUrl = logoUrl;
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

    public String getLogoUrl() {
        return logoUrl;
    }
}
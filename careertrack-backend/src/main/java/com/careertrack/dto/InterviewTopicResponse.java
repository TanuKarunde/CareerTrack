package com.careertrack.dto;

public class InterviewTopicResponse {

    private Long id;

    private String name;

    private String description;

    private String icon;

    public InterviewTopicResponse() {
    }

    public InterviewTopicResponse(
            Long id,
            String name,
            String description,
            String icon) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getIcon() {
        return icon;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
package com.careertrack.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "interview_topics")
public class InterviewTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    private String icon;

    @Column(nullable = false)
    private boolean active = true;

    public InterviewTopic() {
    }

    public InterviewTopic(String name, String description, String icon) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.active = true;
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

    public boolean isActive() {
        return active;
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

    public void setActive(boolean active) {
        this.active = active;
    }
}
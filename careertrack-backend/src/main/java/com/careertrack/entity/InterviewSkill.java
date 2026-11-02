package com.careertrack.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "interview_skills")
public class InterviewSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private InterviewTopic topic;

    public InterviewSkill() {
    }

    public InterviewSkill(String name, String description, InterviewTopic topic) {
        this.name = name;
        this.description = description;
        this.topic = topic;
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

    public boolean isActive() {
        return active;
    }

    public InterviewTopic getTopic() {
        return topic;
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

    public void setActive(boolean active) {
        this.active = active;
    }

    public void setTopic(InterviewTopic topic) {
        this.topic = topic;
    }
}
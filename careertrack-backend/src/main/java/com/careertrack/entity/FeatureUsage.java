
package com.careertrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "feature_usage",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_feature_usage_email",
            columnNames = "user_email"
        )
    }
)
public class FeatureUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false, unique = true)
    private String userEmail;

    @Column(name = "interview_uses", nullable = false)
    private int interviewUses = 0;

    @Column(name = "resume_uses", nullable = false)
    private int resumeUses = 0;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public int getInterviewUses() {
        return interviewUses;
    }

    public void setInterviewUses(int interviewUses) {
        this.interviewUses = interviewUses;
    }

    public int getResumeUses() {
        return resumeUses;
    }

    public void setResumeUses(int resumeUses) {
        this.resumeUses = resumeUses;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}

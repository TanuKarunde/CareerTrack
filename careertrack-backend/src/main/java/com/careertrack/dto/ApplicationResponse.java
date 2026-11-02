package com.careertrack.dto;

import java.time.LocalDateTime;

import com.careertrack.entity.Application;
import com.careertrack.entity.ApplicationStatus;

public class ApplicationResponse {

    private long id;

    private JobResponce job;

    private Long studentId;
    private String studentName;

    private ApplicationStatus status;

    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    public ApplicationResponse() {
    }

    public ApplicationResponse(Application application) {

        this.id = application.getId();

        this.job = new JobResponce(application.getJob());

        this.studentId = application.getStudent().getId();
        this.studentName = application.getStudent().getName();

        this.status = application.getStatus();

        this.appliedAt = application.getAppliedAt();
        this.updatedAt = application.getUpdatedAt();
    }

    public ApplicationResponse(Application application, String companyLogo) {

        this.id = application.getId();

        this.job = new JobResponce(
                application.getJob(),
                companyLogo
        );

        this.studentId = application.getStudent().getId();
        this.studentName = application.getStudent().getName();

        this.status = application.getStatus();

        this.appliedAt = application.getAppliedAt();
        this.updatedAt = application.getUpdatedAt();
    }

    public long getId() {
        return id;
    }

    public JobResponce getJob() {
        return job;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
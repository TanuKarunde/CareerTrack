package com.careertrack.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.*;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate interviewDate;

    private LocalTime interviewTime;

    private String meetingLink;

    @Column(length = 1000)
    private String notes;

    @Enumerated(EnumType.STRING)
    private InterviewStatus status = InterviewStatus.SCHEDULED;

    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;
    
    @Column(nullable = false)
    private boolean reminder24HoursSent = false;

    @Column(nullable = false)
    private boolean reminder1HourSent = false;

    public Interview() {
    }

    public Long getId() {
        return id;
    }

    public LocalDate getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(LocalDate interviewDate) {
        this.interviewDate = interviewDate;
    }

    public LocalTime getInterviewTime() {
        return interviewTime;
    }

    public void setInterviewTime(LocalTime interviewTime) {
        this.interviewTime = interviewTime;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public InterviewStatus getStatus() {
        return status;
    }

    public void setStatus(InterviewStatus status) {
        this.status = status;
    }

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }
    
    public boolean isReminder24HoursSent() {
        return reminder24HoursSent;
    }

    public void setReminder24HoursSent(boolean reminder24HoursSent) {
        this.reminder24HoursSent = reminder24HoursSent;
    }

    public boolean isReminder1HourSent() {
        return reminder1HourSent;
    }

    public void setReminder1HourSent(boolean reminder1HourSent) {
        this.reminder1HourSent = reminder1HourSent;
    }
}
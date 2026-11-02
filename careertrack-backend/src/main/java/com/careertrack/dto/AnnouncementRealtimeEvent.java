package com.careertrack.dto;

import java.time.LocalDateTime;

import com.careertrack.entity.Announcement;
import com.careertrack.entity.AnnouncementAudience;

public class AnnouncementRealtimeEvent {

    private String action;
    private Long id;
    private String title;
    private String message;
    private AnnouncementAudience audience;
    private LocalDateTime publishedAt;

    public AnnouncementRealtimeEvent() {
    }

    public AnnouncementRealtimeEvent(
            String action,
            Announcement announcement) {

        this.action = action;
        this.id = announcement.getId();
        this.title = announcement.getTitle();
        this.message = announcement.getMessage();
        this.audience = announcement.getAudience();
        this.publishedAt = announcement.getPublishedAt();
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public AnnouncementAudience getAudience() {
        return audience;
    }

    public void setAudience(AnnouncementAudience audience) {
        this.audience = audience;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }
}

package com.careertrack.dto;

import java.time.LocalDateTime;

public class AnnouncementReadResponse {

    private Long announcementId;
    private boolean read;
    private LocalDateTime readAt;

    public AnnouncementReadResponse() {
    }

    public AnnouncementReadResponse(
            Long announcementId,
            boolean read,
            LocalDateTime readAt) {
        this.announcementId = announcementId;
        this.read = read;
        this.readAt = readAt;
    }

    public Long getAnnouncementId() {
        return announcementId;
    }

    public void setAnnouncementId(Long announcementId) {
        this.announcementId = announcementId;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }
}

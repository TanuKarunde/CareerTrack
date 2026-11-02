
package com.careertrack.dto;

import java.time.LocalDateTime;

import com.careertrack.entity.Notification;

public record NotificationResponse(
    Long id,
    String type,
    String title,
    String message,
    Long referenceId,
    String referenceType,
    boolean read,
    LocalDateTime createdAt
) {
    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(
            n.getId(),
            n.getType(),
            n.getTitle(),
            n.getMessage(),
            n.getReferenceId(),
            n.getReferenceType(),
            n.isRead(),
            n.getCreatedAt()
        );
    }
}

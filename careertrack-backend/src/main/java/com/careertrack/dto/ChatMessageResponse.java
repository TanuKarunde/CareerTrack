
package com.careertrack.dto;

import java.time.LocalDateTime;

public class ChatMessageResponse {

    private Long id;
    private Long conversationId;
    private Long senderId;
    private String senderName;
    private String content;
    private LocalDateTime createdAt;
    private boolean delivered;
    private boolean read;

    public ChatMessageResponse(
            Long id,
            Long conversationId,
            Long senderId,
            String senderName,
            String content,
            LocalDateTime createdAt,
            boolean delivered,
            boolean read) {

        this.id = id;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.content = content;
        this.createdAt = createdAt;
        this.delivered = delivered;
        this.read = read;
    }

    public Long getId() {
        return id;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public boolean isDelivered() {
        return delivered;
    }

    public boolean isRead() {
        return read;
    }
}

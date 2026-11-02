
package com.careertrack.dto;

import java.time.LocalDateTime;

public class ChatConversationResponse {

    private Long id;
    private StudentChatUserResponse otherStudent;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private long unreadCount;

    public ChatConversationResponse(
            Long id,
            StudentChatUserResponse otherStudent,
            String lastMessage,
            LocalDateTime lastMessageAt,
            long unreadCount) {
        this.id = id;
        this.otherStudent = otherStudent;
        this.lastMessage = lastMessage;
        this.lastMessageAt = lastMessageAt;
        this.unreadCount = unreadCount;
    }

    public Long getId() {
        return id;
    }

    public StudentChatUserResponse getOtherStudent() {
        return otherStudent;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public LocalDateTime getLastMessageAt() {
        return lastMessageAt;
    }

    public long getUnreadCount() {
        return unreadCount;
    }
}

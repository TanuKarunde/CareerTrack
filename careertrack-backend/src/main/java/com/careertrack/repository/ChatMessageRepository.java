package com.careertrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.careertrack.entity.ChatMessage;

public interface ChatMessageRepository
        extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByConversation_IdOrderByCreatedAtAsc(
            Long conversationId);

    Optional<ChatMessage> findFirstByConversation_IdOrderByCreatedAtDesc(
            Long conversationId);

    // Count unread messages received by the current student.
    @Query(value = """
            SELECT COUNT(*)
            FROM chat_messages
            WHERE conversation_id = :conversationId
              AND sender_id <> :currentUserId
              AND is_read = 0
            """, nativeQuery = true)
    long countUnreadMessages(
            @Param("conversationId") Long conversationId,
            @Param("currentUserId") Long currentUserId);

    // Mark incoming messages as read.
    @Modifying
    @Query(value = """
            UPDATE chat_messages
            SET is_read = 1
            WHERE conversation_id = :conversationId
              AND sender_id <> :currentUserId
              AND is_read = 0
            """, nativeQuery = true)
    int markMessagesAsRead(
            @Param("conversationId") Long conversationId,
            @Param("currentUserId") Long currentUserId);
}
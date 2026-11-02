
package com.careertrack.service;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.careertrack.dto.ChatConversationResponse;
import com.careertrack.dto.ChatMessageRequest;
import com.careertrack.dto.ChatMessageResponse;
import com.careertrack.dto.StudentChatUserResponse;
import com.careertrack.entity.ChatConversation;
import com.careertrack.entity.ChatMessage;
import com.careertrack.entity.Role;
import com.careertrack.entity.User;
import com.careertrack.repository.ChatConversationRepository;
import com.careertrack.repository.ChatMessageRepository;
import com.careertrack.repository.UserRepository;

@Service
public class ChatService {

    private final ChatConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;

    public ChatService(
            ChatConversationRepository conversationRepository,
            ChatMessageRepository messageRepository,
            UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<User> getStudents(Long currentUserId) {
        requireStudent(currentUserId);

        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.STUDENT)
                .filter(user -> !user.getId().equals(currentUserId))
                .toList();
    }

    @Transactional
    public ChatConversation getOrCreateConversation(
            Long currentUserId, Long otherUserId) {

        if (currentUserId.equals(otherUserId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot start a chat with yourself");
        }

        User currentUser = requireStudent(currentUserId);
        User otherUser = requireStudent(otherUserId);

        Long firstId = Math.min(currentUserId, otherUserId);
        Long secondId = Math.max(currentUserId, otherUserId);

        return conversationRepository
                .findByParticipantOne_IdAndParticipantTwo_Id(firstId, secondId)
                .orElseGet(() -> {
                    ChatConversation conversation = new ChatConversation();

                    conversation.setParticipantOne(
                            currentUser.getId().equals(firstId)
                                    ? currentUser : otherUser);

                    conversation.setParticipantTwo(
                            currentUser.getId().equals(secondId)
                                    ? currentUser : otherUser);

                    return conversationRepository.save(conversation);
                });
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessages(
            Long currentUserId, Long conversationId) {

        requireParticipant(currentUserId, conversationId);

        return messageRepository
                .findByConversation_IdOrderByCreatedAtAsc(conversationId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ChatMessageResponse sendMessage(
            Long currentUserId,
            Long conversationId,
            ChatMessageRequest request) {

        User sender = requireStudent(currentUserId);
        ChatConversation conversation =
                requireParticipant(currentUserId, conversationId);

        String content = request.getContent().trim();

        if (content.isEmpty() || content.length() > 2000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Message must contain between 1 and 2000 characters");
        }

        ChatMessage message = new ChatMessage();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(content);

        ChatMessage saved = messageRepository.save(message);

        conversationRepository.save(conversation);

        return toResponse(saved);
    }

    private User requireStudent(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() != Role.STUDENT) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only students can use student messaging");
        }

        return user;
    }

    private ChatConversation requireParticipant(
            Long userId, Long conversationId) {

        ChatConversation conversation =
                conversationRepository.findById(conversationId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Conversation not found"));

        boolean participant =
                conversation.getParticipantOne().getId().equals(userId)
                || conversation.getParticipantTwo().getId().equals(userId);

        if (!participant) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have access to this conversation");
        }

        requireStudent(userId);

        return conversation;
    }

    private ChatMessageResponse toResponse(ChatMessage message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getConversation().getId(),
                message.getSender().getId(),
                message.getSender().getName(),
                message.getContent(),
                message.getCreatedAt(),
                message.isDelivered(),
                message.isRead()
        );
    }
    

@Transactional(readOnly = true)
public List<StudentChatUserResponse> getStudentDirectory(
        Long currentUserId) {

    return getStudents(currentUserId).stream()
            .map(this::toStudentResponse)
            .toList();
}

@Transactional(readOnly = true)
public List<ChatConversationResponse> getConversationList(
        Long currentUserId) {

    requireStudent(currentUserId);

    return conversationRepository
            .findAllByParticipantId(currentUserId)
            .stream()
            .sorted(Comparator.comparing(
                    ChatConversation::getUpdatedAt,
                    Comparator.nullsLast(Comparator.reverseOrder())))
            .map(conversation -> {
                User otherStudent =
                        conversation.getParticipantOne().getId()
                                .equals(currentUserId)
                        ? conversation.getParticipantTwo()
                        : conversation.getParticipantOne();

                ChatMessage latestMessage =
                        messageRepository
                                .findFirstByConversation_IdOrderByCreatedAtDesc(
                                        conversation.getId())
                                .orElse(null);

                long unreadCount =
                        messageRepository.countUnreadMessages(
                                conversation.getId(), currentUserId);

                return new ChatConversationResponse(
                        conversation.getId(),
                        toStudentResponse(otherStudent),
                        latestMessage == null
                                ? null : latestMessage.getContent(),
                        latestMessage == null
                                ? conversation.getCreatedAt()
                                : latestMessage.getCreatedAt(),
                        unreadCount);
            })
            .toList();
}

private StudentChatUserResponse toStudentResponse(User user) {
    return new StudentChatUserResponse(
            user.getId(),
            user.getName(),
            user.getDesignation(),
            user.getLocation(),
            user.getBio(),
            user.getProfileImage() != null
                    && user.getProfileImage().length > 0);
}

@Transactional
public void markMessagesAsRead(Long currentUserId, Long conversationId) {

    // Verify that the current student belongs to this conversation.
    requireParticipant(currentUserId, conversationId);

    // Mark only messages received from the other student as read.
    messageRepository.markMessagesAsRead(conversationId, currentUserId);
}


@Transactional
public void markMessageAsDelivered(
        Long currentUserId,
        Long conversationId,
        Long messageId) {

    requireParticipant(currentUserId, conversationId);

    ChatMessage message = messageRepository.findById(messageId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Message not found"));

    if (!Objects.equals(
            message.getConversation().getId(), conversationId)) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Message does not belong to this conversation");
    }

    // Only the recipient can acknowledge delivery.
    if (Objects.equals(message.getSender().getId(), currentUserId)) {
        return;
    }

    message.setDelivered(true);
    messageRepository.save(message);
}


}

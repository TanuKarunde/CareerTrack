
package com.careertrack.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.careertrack.dto.ChatConversationResponse;
import com.careertrack.dto.ChatMessageRequest;
import com.careertrack.dto.ChatMessageResponse;
import com.careertrack.dto.StudentChatUserResponse;
import com.careertrack.entity.ChatConversation;
import com.careertrack.entity.User;
import com.careertrack.repository.UserRepository;
import com.careertrack.service.ChatService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/chat")
@Validated
public class ChatController {

    private final ChatService chatService;
    private final UserRepository userRepository;

    public ChatController(
            ChatService chatService,
            UserRepository userRepository) {
        this.chatService = chatService;
        this.userRepository = userRepository;
    }

    private Long getCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED,
                    "Please log in");
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new org.springframework.web.server.ResponseStatusException(
                                org.springframework.http.HttpStatus.UNAUTHORIZED,
                                "Authenticated user not found"));

        return user.getId();
    }


@GetMapping("/students")
public List<StudentChatUserResponse> getStudents(
        Authentication authentication) {
    return chatService.getStudentDirectory(
            getCurrentUserId(authentication));
}

@GetMapping("/conversations")
public List<ChatConversationResponse> getConversations(
        Authentication authentication) {
    return chatService.getConversationList(
            getCurrentUserId(authentication));
}


@PostMapping("/conversations/{otherUserId}")
public ChatConversationResponse createConversation(
        @PathVariable Long otherUserId,
        Authentication authentication) {

    Long currentUserId = getCurrentUserId(authentication);

    ChatConversation conversation =
            chatService.getOrCreateConversation(
                    currentUserId, otherUserId);

    return chatService.getConversationList(currentUserId)
            .stream()
            .filter(item -> item.getId().equals(conversation.getId()))
            .findFirst()
            .orElseThrow(() -> new IllegalStateException(
                    "Conversation could not be loaded"));
}

    @GetMapping("/conversations/{conversationId}/messages")
    public List<ChatMessageResponse> getMessages(
            @PathVariable Long conversationId,
            Authentication authentication) {

        return chatService.getMessages(
                getCurrentUserId(authentication), conversationId);
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public ChatMessageResponse sendMessage(
            @PathVariable Long conversationId,
            @Valid @RequestBody ChatMessageRequest request,
            Authentication authentication) {

        return chatService.sendMessage(
                getCurrentUserId(authentication), conversationId, request);
    }
    
    @PatchMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Void> markMessagesAsRead(
            @PathVariable Long conversationId,
            Authentication authentication) {

        Long currentUserId = getCurrentUserId(authentication);

        chatService.markMessagesAsRead(currentUserId, conversationId);

        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/conversations/{conversationId}/messages/{messageId}/delivered")
    public ResponseEntity<Void> markMessageAsDelivered(
            @PathVariable Long conversationId,
            @PathVariable Long messageId,
            Authentication authentication) {

        Long currentUserId = getCurrentUserId(authentication);

        chatService.markMessageAsDelivered(
                currentUserId, conversationId, messageId);

        return ResponseEntity.noContent().build();
    }
}

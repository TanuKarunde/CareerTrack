
package com.careertrack.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.careertrack.dto.ChatMessageRequest;
import com.careertrack.dto.ChatMessageResponse;
import com.careertrack.dto.ChatWebSocketRequest;
import com.careertrack.entity.ChatConversation;
import com.careertrack.entity.User;
import com.careertrack.repository.ChatConversationRepository;
import com.careertrack.repository.UserRepository;
import com.careertrack.service.ChatService;

@Controller
public class ChatWebSocketController {

    private final ChatService chatService;
    private final UserRepository userRepository;
    private final ChatConversationRepository conversationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(
            ChatService chatService,
            UserRepository userRepository,
            ChatConversationRepository conversationRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    @Transactional
    public void sendMessage(
            ChatWebSocketRequest request,
            Principal principal) {

        if (principal == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Please log in");
        }

        User sender = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Authenticated user not found"));

        ChatMessageRequest messageRequest = new ChatMessageRequest();
        messageRequest.setContent(request.getContent());

        ChatMessageResponse savedMessage = chatService.sendMessage(
                sender.getId(),
                request.getConversationId(),
                messageRequest);

        ChatConversation conversation =
                conversationRepository.findById(request.getConversationId())
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Conversation not found"));

        User participantOne = conversation.getParticipantOne();
        User participantTwo = conversation.getParticipantTwo();

        User recipient = participantOne.getId().equals(sender.getId())
                ? participantTwo : participantOne;

        // Private delivery to both participants.
        messagingTemplate.convertAndSendToUser(
                sender.getEmail(),
                "/queue/chat",
                savedMessage);

        messagingTemplate.convertAndSendToUser(
                recipient.getEmail(),
                "/queue/chat",
                savedMessage);
    }
}

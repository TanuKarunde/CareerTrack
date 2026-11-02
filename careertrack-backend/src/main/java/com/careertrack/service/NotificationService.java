
package com.careertrack.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careertrack.dto.NotificationResponse;
import com.careertrack.entity.Notification;
import com.careertrack.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(
            NotificationRepository repository,
            SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public NotificationResponse create(
            String recipientEmail,
            String recipientRole,
            String type,
            String title,
            String message,
            Long referenceId,
            String referenceType) {

        Notification n = new Notification();
        n.setRecipientEmail(recipientEmail);
        n.setRecipientRole(recipientRole);
        n.setType(type);
        n.setTitle(title);
        n.setMessage(message);
        n.setReferenceId(referenceId);
        n.setReferenceType(referenceType);

        // Save first so the notification survives a disconnect.
        Notification saved = repository.save(n);
        NotificationResponse response =
            NotificationResponse.from(saved);

        // Push to the authenticated user's private STOMP queue.
        messagingTemplate.convertAndSendToUser(
            recipientEmail,
            "/queue/notifications",
            response
        );

        return response;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(
            String email, int page, int size) {

        int safePage = Math.max(page, 0);
        int safeSize = Math.max(1, Math.min(size, 50));

        return repository
            .findByRecipientEmailOrderByCreatedAtDesc(
                email, PageRequest.of(safePage, safeSize))
            .stream()
            .map(NotificationResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String email) {
        return repository.countByRecipientEmailAndReadFalse(email);
    }

    @Transactional
    public void markRead(Long id, String email) {
        Notification n = repository
            .findByIdAndRecipientEmail(id, email)
            .orElseThrow(() ->
                new AccessDeniedException(
                    "Notification not found or access denied"));

        n.setRead(true);
    }

    @Transactional
    public void markAllRead(String email) {
        List<Notification> notifications =
            repository.findByRecipientEmailAndReadFalse(email);

        notifications.forEach(n -> n.setRead(true));
    }

    @Transactional
    public void delete(Long id, String email) {
        Notification n = repository
            .findByIdAndRecipientEmail(id, email)
            .orElseThrow(() ->
                new AccessDeniedException(
                    "Notification not found or access denied"));

        repository.delete(n);
    }
}

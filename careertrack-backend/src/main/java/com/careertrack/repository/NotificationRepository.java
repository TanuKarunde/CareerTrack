
package com.careertrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.Notification;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(
        String recipientEmail,
        Pageable pageable
    );

    long countByRecipientEmailAndReadFalse(String recipientEmail);

    Optional<Notification> findByIdAndRecipientEmail(
        Long id,
        String recipientEmail
    );

    List<Notification> findByRecipientEmailAndReadFalse(
        String recipientEmail
    );
}


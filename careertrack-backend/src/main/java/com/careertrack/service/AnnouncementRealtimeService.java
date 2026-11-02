
package com.careertrack.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.careertrack.dto.AnnouncementRealtimeEvent;
import com.careertrack.entity.Announcement;
import com.careertrack.entity.AnnouncementAudience;

@Service
public class AnnouncementRealtimeService {

    private static final String STUDENT_DESTINATION =
            "/queue/announcements.student";

    private static final String EMPLOYER_DESTINATION =
            "/queue/announcements.employer";

    private final SimpMessagingTemplate messagingTemplate;

    public AnnouncementRealtimeService(
            SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publishEvent(
            String action,
            Announcement announcement) {

        // Create a snapshot now so later entity changes do not
        // alter the event that will be delivered.
        AnnouncementRealtimeEvent event =
                new AnnouncementRealtimeEvent(action, announcement);

        AnnouncementAudience audience = event.getAudience();

        Runnable delivery = () -> sendEvent(event, audience);

        // If called inside a transaction, deliver only after commit.
        // If the transaction rolls back, afterCommit() never runs.
        if (TransactionSynchronizationManager.isSynchronizationActive()
                && TransactionSynchronizationManager
                        .isActualTransactionActive()) {

            TransactionSynchronizationManager.registerSynchronization(
                    new TransactionSynchronization() {
                        @Override
                        public void afterCommit() {
                            delivery.run();
                        }
                    });

        } else {
            // Supports calls made without an active transaction.
            delivery.run();
        }
    }

    private void sendEvent(
            AnnouncementRealtimeEvent event,
            AnnouncementAudience audience) {

        if (audience == AnnouncementAudience.ALL
                || audience == AnnouncementAudience.STUDENT) {

            messagingTemplate.convertAndSend(
                    STUDENT_DESTINATION, event);
        }

        if (audience == AnnouncementAudience.ALL
                || audience == AnnouncementAudience.EMPLOYER) {

            messagingTemplate.convertAndSend(
                    EMPLOYER_DESTINATION, event);
        }
    }
}

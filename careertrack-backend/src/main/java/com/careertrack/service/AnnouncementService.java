
package com.careertrack.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careertrack.entity.Announcement;
import com.careertrack.entity.AnnouncementAudience;
import com.careertrack.entity.AnnouncementStatus;
import com.careertrack.repository.AnnouncementRepository;

@Service
@Transactional
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementRealtimeService realtimeService;

    public AnnouncementService(
            AnnouncementRepository announcementRepository,
            AnnouncementRealtimeService realtimeService) {
        this.announcementRepository = announcementRepository;
        this.realtimeService = realtimeService;
    }

    @Transactional(readOnly = true)
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public Announcement getAnnouncementById(Long id) {
        return announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Announcement not found with id: " + id));
    }

    public Announcement createAnnouncement(
            Announcement announcement,
            String adminEmail) {

        validateAnnouncement(announcement);

        announcement.setId(null);
        announcement.setCreatedBy(adminEmail);
        announcement.setStatus(AnnouncementStatus.DRAFT);
        announcement.setPublishedAt(null);

        return announcementRepository.save(announcement);
    }

    public Announcement updateAnnouncement(
            Long id,
            Announcement request) {

        validateAnnouncement(request);

        Announcement existing = getAnnouncementById(id);

        boolean wasPublished =
                existing.getStatus() == AnnouncementStatus.PUBLISHED;

        AnnouncementAudience previousAudience =
                existing.getAudience();

        existing.setTitle(request.getTitle().trim());
        existing.setMessage(request.getMessage().trim());
        existing.setAudience(request.getAudience());

        Announcement saved = announcementRepository.save(existing);

        if (wasPublished) {
            // Remove from audiences that no longer qualify.
            if (previousAudience != saved.getAudience()) {
                Announcement removalEvent = copyForPreviousAudience(
                        saved, previousAudience);

                realtimeService.publishEvent("UNPUBLISHED", removalEvent);
            }

            // Update current intended audience.
            realtimeService.publishEvent("UPDATED", saved);
        }

        return saved;
    }

    public Announcement publishAnnouncement(Long id) {
        Announcement announcement = getAnnouncementById(id);

        if (announcement.getStatus() != AnnouncementStatus.PUBLISHED) {
            announcement.setStatus(AnnouncementStatus.PUBLISHED);
            announcement.setPublishedAt(LocalDateTime.now());

            Announcement saved = announcementRepository.save(announcement);
            realtimeService.publishEvent("PUBLISHED", saved);

            return saved;
        }

        return announcement;
    }

    public Announcement unpublishAnnouncement(Long id) {
        Announcement announcement = getAnnouncementById(id);

        if (announcement.getStatus() == AnnouncementStatus.PUBLISHED) {
            // Send removal while the old audience is still known.
            realtimeService.publishEvent("UNPUBLISHED", announcement);
        }

        announcement.setStatus(AnnouncementStatus.DRAFT);
        announcement.setPublishedAt(null);

        return announcementRepository.save(announcement);
    }

    public void deleteAnnouncement(Long id) {
        Announcement announcement = getAnnouncementById(id);

        if (announcement.getStatus() == AnnouncementStatus.PUBLISHED) {
            realtimeService.publishEvent("DELETED", announcement);
        }

        announcementRepository.delete(announcement);
    }

    @Transactional(readOnly = true)
    public long getTotalAnnouncements() {
        return announcementRepository.count();
    }

    @Transactional(readOnly = true)
    public long getPublishedAnnouncements() {
        return announcementRepository.countByStatus(
                AnnouncementStatus.PUBLISHED);
    }

    @Transactional(readOnly = true)
    public long getDraftAnnouncements() {
        return announcementRepository.countByStatus(
                AnnouncementStatus.DRAFT);
    }

    private Announcement copyForPreviousAudience(
            Announcement source,
            AnnouncementAudience previousAudience) {

        Announcement copy = new Announcement();
        copy.setId(source.getId());
        copy.setTitle(source.getTitle());
        copy.setMessage(source.getMessage());
        copy.setAudience(previousAudience);
        copy.setStatus(source.getStatus());
        copy.setCreatedBy(source.getCreatedBy());
        copy.setCreatedAt(source.getCreatedAt());
        copy.setUpdatedAt(source.getUpdatedAt());
        copy.setPublishedAt(source.getPublishedAt());

        return copy;
    }

    private void validateAnnouncement(Announcement announcement) {
        if (announcement == null) {
            throw new IllegalArgumentException(
                    "Announcement data is required");
        }

        if (announcement.getTitle() == null
                || announcement.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Announcement title is required");
        }

        if (announcement.getTitle().trim().length() > 150) {
            throw new IllegalArgumentException(
                    "Announcement title cannot exceed 150 characters");
        }

        if (announcement.getMessage() == null
                || announcement.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Announcement message is required");
        }

        if (announcement.getAudience() == null) {
            throw new IllegalArgumentException(
                    "Announcement audience is required");
        }
    }
}


package com.careertrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.careertrack.entity.Announcement;
import com.careertrack.entity.AnnouncementAudience;
import com.careertrack.entity.AnnouncementStatus;

@Repository
public interface AnnouncementRepository
        extends JpaRepository<Announcement, Long> {

    // Fetch announcements by publication status
    List<Announcement> findByStatusOrderByCreatedAtDesc(
            AnnouncementStatus status);

    // Fetch announcements for a specific audience
    List<Announcement> findByAudienceAndStatusOrderByPublishedAtDesc(
            AnnouncementAudience audience,
            AnnouncementStatus status);

    // Fetch all announcements, newest first
    List<Announcement> findAllByOrderByCreatedAtDesc();

    // Count announcements by status
    long countByStatus(AnnouncementStatus status);

    // Count announcements for a specific audience
    long countByAudience(AnnouncementAudience audience);
}

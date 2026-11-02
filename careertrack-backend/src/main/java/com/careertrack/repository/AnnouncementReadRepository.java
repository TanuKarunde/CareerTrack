
package com.careertrack.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.careertrack.entity.AnnouncementRead;

@Repository
public interface AnnouncementReadRepository
        extends JpaRepository<AnnouncementRead, Long> {

    // Check whether a particular user has read an announcement.
    Optional<AnnouncementRead> findByAnnouncement_IdAndUser_Id(
            Long announcementId,
            Long userId);

    // Get read records for a user across selected announcements.
    List<AnnouncementRead> findByUser_IdAndAnnouncement_IdIn(
            Long userId,
            Collection<Long> announcementIds);

    // Get all read records belonging to a user.
    List<AnnouncementRead> findByUser_IdOrderByReadAtDesc(
            Long userId);

    // Count all announcement read records belonging to a user.
    long countByUser_Id(Long userId);
}

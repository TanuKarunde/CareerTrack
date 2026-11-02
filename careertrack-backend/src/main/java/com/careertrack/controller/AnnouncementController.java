
package com.careertrack.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.careertrack.entity.Announcement;
import com.careertrack.entity.AnnouncementAudience;
import com.careertrack.entity.AnnouncementStatus;
import com.careertrack.repository.AnnouncementRepository;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementController(
            AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    // Announcements visible to students
    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public List<Announcement> getStudentAnnouncements() {
        return announcementRepository
                .findByStatusOrderByCreatedAtDesc(
                        AnnouncementStatus.PUBLISHED)
                .stream()
                .filter(announcement ->
                        announcement.getAudience()
                                == AnnouncementAudience.ALL
                        || announcement.getAudience()
                                == AnnouncementAudience.STUDENT)
                .toList();
    }

    // Announcements visible to employers
    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public List<Announcement> getEmployerAnnouncements() {
        return announcementRepository
                .findByStatusOrderByCreatedAtDesc(
                        AnnouncementStatus.PUBLISHED)
                .stream()
                .filter(announcement ->
                        announcement.getAudience()
                                == AnnouncementAudience.ALL
                        || announcement.getAudience()
                                == AnnouncementAudience.EMPLOYER)
                .toList();
    }
}

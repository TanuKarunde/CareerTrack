
package com.careertrack.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careertrack.dto.AnnouncementReadResponse;
import com.careertrack.entity.Announcement;
import com.careertrack.entity.AnnouncementRead;
import com.careertrack.entity.User;
import com.careertrack.repository.AnnouncementReadRepository;
import com.careertrack.repository.AnnouncementRepository;
import com.careertrack.repository.UserRepository;

@Service
public class AnnouncementReadService {

    private final AnnouncementReadRepository readRepository;
    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    public AnnouncementReadService(
            AnnouncementReadRepository readRepository,
            AnnouncementRepository announcementRepository,
            UserRepository userRepository) {
        this.readRepository = readRepository;
        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public AnnouncementRead markAsRead(
            Long announcementId,
            String userEmail) {

        User user = getUserByEmail(userEmail);

        Announcement announcement = announcementRepository
                .findById(announcementId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Announcement not found: " + announcementId));

        Optional<AnnouncementRead> existing =
                readRepository.findByAnnouncement_IdAndUser_Id(
                        announcementId, user.getId());

        if (existing.isPresent()) {
            return existing.get();
        }

        AnnouncementRead read = new AnnouncementRead(
                announcement,
                user,
                LocalDateTime.now());

        return readRepository.save(read);
    }

    @Transactional(readOnly = true)
    public boolean hasRead(
            Long announcementId,
            String userEmail) {

        User user = getUserByEmail(userEmail);

        return readRepository
                .findByAnnouncement_IdAndUser_Id(
                        announcementId, user.getId())
                .isPresent();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found: " + email));
    }
    
    @Transactional(readOnly = true)
    public AnnouncementReadResponse getReadStatus(
            Long announcementId,
            String userEmail) {

        User user = getUserByEmail(userEmail);

        if (!announcementRepository.existsById(announcementId)) {
            throw new IllegalArgumentException(
                    "Announcement not found: " + announcementId);
        }

        return readRepository
                .findByAnnouncement_IdAndUser_Id(
                        announcementId, user.getId())
                .map(record -> new AnnouncementReadResponse(
                        announcementId, true, record.getReadAt()))
                .orElseGet(() -> new AnnouncementReadResponse(
                        announcementId, false, null));
    }
    
    @Transactional(readOnly = true)
    public java.util.Map<Long, AnnouncementReadResponse> getReadStatuses(
            String userEmail) {

        User user = getUserByEmail(userEmail);

        return readRepository.findByUser_IdOrderByReadAtDesc(user.getId())
                .stream()
                .collect(java.util.stream.Collectors.toMap(
                        record -> record.getAnnouncement().getId(),
                        record -> new AnnouncementReadResponse(
                                record.getAnnouncement().getId(),
                                true,
                                record.getReadAt())
                ));
    }
    

@Transactional
public int markAllAsRead(String userEmail) {

    User user = getUserByEmail(userEmail);

    java.util.List<Announcement> announcements =
            announcementRepository.findByStatusOrderByCreatedAtDesc(
                    com.careertrack.entity.AnnouncementStatus.PUBLISHED);

    int markedCount = 0;

    for (Announcement announcement : announcements) {

        boolean matchesAudience =
                announcement.getAudience()
                        == com.careertrack.entity.AnnouncementAudience.ALL
                || (user.getRole().name().equals("STUDENT")
                        && announcement.getAudience()
                                == com.careertrack.entity.AnnouncementAudience.STUDENT)
                || (user.getRole().name().equals("EMPLOYER")
                        && announcement.getAudience()
                                == com.careertrack.entity.AnnouncementAudience.EMPLOYER);

        if (!matchesAudience) {
            continue;
        }

        boolean alreadyRead = readRepository
                .findByAnnouncement_IdAndUser_Id(
                        announcement.getId(),
                        user.getId())
                .isPresent();

        if (!alreadyRead) {
            AnnouncementRead record = new AnnouncementRead(
                    announcement,
                    user,
                    LocalDateTime.now());

            readRepository.save(record);
            markedCount++;
        }
    }

    return markedCount;
}

}

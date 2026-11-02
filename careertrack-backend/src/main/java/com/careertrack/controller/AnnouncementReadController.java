
package com.careertrack.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.careertrack.dto.AnnouncementReadResponse;
import com.careertrack.entity.AnnouncementRead;
import com.careertrack.repository.AnnouncementReadRepository;
import com.careertrack.service.AnnouncementReadService;

@RestController
@RequestMapping("/api/announcements")
@PreAuthorize("hasAnyRole('STUDENT', 'EMPLOYER')")
public class AnnouncementReadController {

    private final AnnouncementReadService readService;
    private final AnnouncementReadRepository readRepository;

    public AnnouncementReadController(
            AnnouncementReadService readService,
            AnnouncementReadRepository readRepository) {
        this.readService = readService;
        this.readRepository = readRepository;
    }

    @PutMapping("/{announcementId}/read")
    public ResponseEntity<AnnouncementReadResponse> markAsRead(
            @PathVariable Long announcementId,
            Authentication authentication) {

        AnnouncementRead record = readService.markAsRead(
                announcementId,
                authentication.getName());

        return ResponseEntity.ok(
                new AnnouncementReadResponse(
                        announcementId,
                        true,
                        record.getReadAt()));
    }

    @GetMapping("/{announcementId}/read-status")
    public ResponseEntity<AnnouncementReadResponse> getReadStatus(
            @PathVariable Long announcementId,
            Authentication authentication) {

        return ResponseEntity.ok(
                readService.getReadStatus(
                        announcementId, authentication.getName()));
    }

    @GetMapping("/read-statuses")
    public ResponseEntity<java.util.Map<Long, AnnouncementReadResponse>>
            getReadStatuses(Authentication authentication) {

        return ResponseEntity.ok(
                readService.getReadStatuses(authentication.getName()));
    }
    

@PutMapping("/read-all")
public ResponseEntity<java.util.Map<String, Object>> markAllAsRead(
        Authentication authentication) {

    int markedCount = readService.markAllAsRead(
            authentication.getName());

    return ResponseEntity.ok(
            java.util.Map.of(
                    "message", "Announcements marked as read",
                    "markedCount", markedCount
            )
    );
}

}

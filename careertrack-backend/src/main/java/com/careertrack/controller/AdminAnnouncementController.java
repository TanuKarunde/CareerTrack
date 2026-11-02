
package com.careertrack.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.careertrack.entity.Announcement;
import com.careertrack.service.AnnouncementService;

@RestController
@RequestMapping("/api/admin/announcements")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnnouncementController {

    private final AnnouncementService announcementService;

    public AdminAnnouncementController(
            AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    // Get all announcements
    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        return ResponseEntity.ok(
                announcementService.getAllAnnouncements());
    }

    // Get announcement by ID
    @GetMapping("/{id}")
    public ResponseEntity<Announcement> getAnnouncementById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                announcementService.getAnnouncementById(id));
    }

    // Create a draft
    @PostMapping
    public ResponseEntity<Announcement> createAnnouncement(
            @RequestBody Announcement announcement,
            Authentication authentication) {

        Announcement created =
                announcementService.createAnnouncement(
                        announcement,
                        authentication.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Edit an announcement
    @PutMapping("/{id}")
    public ResponseEntity<Announcement> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody Announcement announcement) {

        return ResponseEntity.ok(
                announcementService.updateAnnouncement(id, announcement));
    }

    // Publish an announcement
    @PatchMapping("/{id}/publish")
    public ResponseEntity<Announcement> publishAnnouncement(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                announcementService.publishAnnouncement(id));
    }

    // Unpublish an announcement
    @PatchMapping("/{id}/unpublish")
    public ResponseEntity<Announcement> unpublishAnnouncement(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                announcementService.unpublishAnnouncement(id));
    }

    // Delete an announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAnnouncement(
            @PathVariable Long id) {

        announcementService.deleteAnnouncement(id);

        Map<String, String> response = new LinkedHashMap<>();
        response.put("message", "Announcement deleted successfully");

        return ResponseEntity.ok(response);
    }

    // Announcement summary counts
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Long>> getSummary() {

        Map<String, Long> summary = new LinkedHashMap<>();

        summary.put("total",
                announcementService.getTotalAnnouncements());

        summary.put("published",
                announcementService.getPublishedAnnouncements());

        summary.put("drafts",
                announcementService.getDraftAnnouncements());

        return ResponseEntity.ok(summary);
    }
}

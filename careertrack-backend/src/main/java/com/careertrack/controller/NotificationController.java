
package com.careertrack.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.careertrack.dto.NotificationResponse;
import com.careertrack.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    public List<NotificationResponse> getMine(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return service.getMyNotifications(
            principal.getName(), page, size);
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount(Principal principal) {
        return Map.of(
            "count",
            service.getUnreadCount(principal.getName())
        );
    }

    @PatchMapping("/{id}/read")
    public Map<String, String> markRead(
            @PathVariable Long id,
            Principal principal) {

        service.markRead(id, principal.getName());
        return Map.of("message", "Notification marked as read");
    }

    @PatchMapping("/read-all")
    public Map<String, String> markAllRead(Principal principal) {
        service.markAllRead(principal.getName());
        return Map.of("message", "All notifications marked as read");
    }

    @DeleteMapping("/{id}")
    public Map<String, String> delete(
            @PathVariable Long id,
            Principal principal) {

        service.delete(id, principal.getName());
        return Map.of("message", "Notification deleted");
    }
    

@PostMapping("/test")
public NotificationResponse sendTestNotification(Principal principal) {

    return service.create(
            principal.getName(),
            "EMPLOYER",
            "TEST",
            "Test notification",
            "Your CareerTrack real-time notifications are working!",
            null,
            null
    );
}

}

package com.example.maintenance.controller;

import com.example.maintenance.model.Notification;
import com.example.maintenance.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // GET /api/notifications/user/{userId}
    @GetMapping("/user/{userId}")
    public List<Notification> getNotificationsByUser(@PathVariable Long userId) {
        return notificationService.getByUser(userId);
    }

    // GET /api/notifications/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        return notificationService.getByUser(id).stream()
                .filter(n -> n.getNotificationId().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/notifications
    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Notification saved = notificationService.create(
                notification.getUserId(),
                notification.getRequestId(),
                notification.getMessage()
        );
        return ResponseEntity.ok(saved);
    }

    // POST /api/notifications/{id}/read
    @PostMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markRead(id));
    }

    // POST /api/notifications/read-all/{userId}
    @PostMapping("/read-all/{userId}")
    public ResponseEntity<String> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllRead(userId);
        return ResponseEntity.ok("All notifications marked as read for user " + userId);
    }
}

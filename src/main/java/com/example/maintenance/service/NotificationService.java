package com.example.maintenance.service;

import com.example.maintenance.model.Notification;
import com.example.maintenance.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification create(Long userId, Long requestId, String message) {
        Notification notification = new Notification(null, userId, requestId, message);
        return notificationRepository.save(notification);
    }

    public List<Notification> getByUser(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    public Notification markRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
        notification.setReadStatus(true);
        return notificationRepository.save(notification);
    }

    public void markAllRead(Long userId) {
        List<Notification> userNotifications = notificationRepository.findByUserId(userId);
        for (Notification n : userNotifications) {
            n.setReadStatus(true);
            notificationRepository.save(n);
        }
    }
}

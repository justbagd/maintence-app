package com.example.maintenance.repository;

import com.example.maintenance.model.Notification;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class NotificationRepository {

    private final List<Notification> notifications = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public NotificationRepository() {
    }

    public List<Notification> findByUserId(Long userId) {
        List<Notification> result = new ArrayList<>();
        for (Notification n : notifications) {
            if (n.getUserId().equals(userId)) result.add(n);
        }
        return result;
    }

    public Optional<Notification> findById(Long id) {
        return notifications.stream().filter(n -> n.getNotificationId().equals(id)).findFirst();
    }

    public Notification save(Notification notification) {
        if (notification.getNotificationId() == null) {
            notification.setNotificationId(idCounter.getAndIncrement());
            notifications.add(notification);
        } else {
            for (int i = 0; i < notifications.size(); i++) {
                if (notifications.get(i).getNotificationId().equals(notification.getNotificationId())) {
                    notifications.set(i, notification);
                    return notification;
                }
            }
            notifications.add(notification);
        }
        return notification;
    }
}

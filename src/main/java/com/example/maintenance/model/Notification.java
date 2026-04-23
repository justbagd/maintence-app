package com.example.maintenance.model;

import java.time.LocalDateTime;

public class Notification {

    private Long notificationId;
    private Long userId;
    private Long requestId;    // nullable
    private String message;
    private LocalDateTime timestamp;
    private boolean readStatus;

    public Notification() {}

    public Notification(Long notificationId, Long userId, Long requestId, String message) {
        this.notificationId = notificationId;
        this.userId = userId;
        this.requestId = requestId;
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.readStatus = false;
    }

    public Long getNotificationId() { return notificationId; }
    public void setNotificationId(Long notificationId) { this.notificationId = notificationId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public boolean isReadStatus() { return readStatus; }
    public void setReadStatus(boolean readStatus) { this.readStatus = readStatus; }
}

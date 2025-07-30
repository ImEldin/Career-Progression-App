package com.team5.career_progression_app.dto;

import com.team5.career_progression_app.model.Notification;
import com.team5.career_progression_app.model.NotificationType;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class NotificationDTO {
    private Integer id;
    private String message;
    private LocalDateTime createdAt;
    private boolean read;
    private UserDTO recipient;
    private NotificationType type;
    private String title;

    public NotificationDTO(Notification notification) {
        this.id = notification.getId();
        this.message = notification.getMessage();
        this.createdAt = notification.getCreatedAt();
        this.read = notification.isRead();
        this.recipient = new UserDTO(notification.getRecipient());
        this.type = notification.getType();
        this.title = notification.getTitle();
    }
}

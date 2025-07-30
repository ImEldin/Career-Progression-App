package com.team5.career_progression_app.exception;

public class NotificationNotFoundException extends RuntimeException {
    public NotificationNotFoundException(String message) {
        super(message);
    }

    public NotificationNotFoundException(Integer id) {
        super("Notification with ID " + id + " not found.");
    }
}

package com.team5.career_progression_app.model;

public enum NotificationEventType {
    ROLE_CHANGED("Role changed"),
    ROLE_DELETED("Role deleted"),
    TASK_DELETED("Task deleted"),
    TASK_RECEIVED("Task received"),
    TASK_FINISHED("Task finished"),
    FEEDBACK_RECEIVED("Feedback received"),
    TASK_CHANGED("Task changed"),
    PROMOTION("Promotion"),
    ERROR("Error"),
    ALERT("Alert");

    private final String description;

    NotificationEventType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
} 
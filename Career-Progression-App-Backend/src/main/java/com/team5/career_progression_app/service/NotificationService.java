package com.team5.career_progression_app.service;

import com.team5.career_progression_app.dto.NotificationFilterCountDTO;
import com.team5.career_progression_app.dto.NotificationDTO;
import com.team5.career_progression_app.dto.PaginatedResponse;
import com.team5.career_progression_app.exception.NotificationNotFoundException;
import com.team5.career_progression_app.model.Notification;
import com.team5.career_progression_app.model.NotificationFilter;
import com.team5.career_progression_app.model.NotificationType;
import com.team5.career_progression_app.model.NotificationEventType;
import com.team5.career_progression_app.model.User;
import com.team5.career_progression_app.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public PaginatedResponse<NotificationDTO> getAllForUser(Integer userId, NotificationFilter filter, int page, int size) {
        List<Notification> notifications = fetchFilteredNotifications(userId, filter);
        sortNotifications(notifications);
        return paginateNotifications(notifications, page, size);
    }

    private List<Notification> fetchFilteredNotifications(Integer userId, NotificationFilter filter) {
        if (filter == null || filter == NotificationFilter.ALL) {
            return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        } else if (filter == NotificationFilter.UNREAD) {
            return notificationRepository.findByRecipientIdAndReadFalseOrderByCreatedAtDesc(userId);
        } else {
            NotificationType type = NotificationType.valueOf(filter.name());
            return notificationRepository.findByRecipientIdAndTypeOrderByCreatedAtDesc(userId, type);
        }
    }
    
    private void sortNotifications(List<Notification> notifications) {
        notifications.sort((n1, n2) -> {
            if (!n1.isRead() && n2.isRead()) return -1;
            if (n1.isRead() && !n2.isRead()) return 1;
            return n2.getCreatedAt().compareTo(n1.getCreatedAt());
        });
    }
    
    private PaginatedResponse<NotificationDTO> paginateNotifications(List<Notification> notifications, int page, int size) {
        int totalCount = notifications.size();
        int totalPages = (int) Math.ceil((double) totalCount / size);
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, totalCount);
    
        List<NotificationDTO> paginatedData = notifications.subList(startIndex, endIndex)
                .stream()
                .map(NotificationDTO::new)
                .collect(Collectors.toList());
    
        return new PaginatedResponse<>(paginatedData, totalCount, page, size, totalPages);
    }
    

    public List<NotificationFilter> getAvailableFilters(Integer userId) {
        List<NotificationFilter> filters = new ArrayList<>();
        filters.add(NotificationFilter.ALL);
        filters.add(NotificationFilter.UNREAD);

        for (NotificationType type : NotificationType.values()) {
            filters.add(NotificationFilter.valueOf(type.name()));
        }

        return filters;
    }

    public Integer getUnreadCount(Integer userId) {
        return notificationRepository.countByRecipientIdAndReadFalse(userId);
    }

    public List<NotificationFilterCountDTO> getFilterCounts(Integer userId) {
        List<NotificationFilterCountDTO> filterCounts = new ArrayList<>();
        filterCounts.add(new NotificationFilterCountDTO(NotificationFilter.ALL.name(), notificationRepository.countByRecipientId(userId)));
        filterCounts.add(new NotificationFilterCountDTO(NotificationFilter.UNREAD.name(), notificationRepository.countByRecipientIdAndReadFalse(userId)));

        for (NotificationType type : NotificationType.values()) {
            int count = notificationRepository.countByRecipientIdAndType(userId, type);
            filterCounts.add(new NotificationFilterCountDTO(type.name(), count));
        }

        return filterCounts;
    }

    public void markAsRead(Integer notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new NotificationNotFoundException(notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
    

    public void markAllAsRead(Integer userId) {
        List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void notifyTaskReceived(User recipient, String taskName) {
        createNotification(recipient, "You have been assigned a new task: " + taskName + ".", NotificationEventType.TASK_RECEIVED.getDescription(), NotificationType.TASK);
    }

    public void notifyTaskFinished(User lead, String taskName) {
        createNotification(lead, "Task '" + taskName + "' has been marked as finished.", NotificationEventType.TASK_FINISHED.getDescription(), NotificationType.TASK);
    }

    public void notifyFeedbackReceived(User recipient, String feedbackSummary) {
        createNotification(recipient, "You have received new feedback: '" + feedbackSummary + "'.", NotificationEventType.FEEDBACK_RECEIVED.getDescription(), NotificationType.FEEDBACK);
    }

    public void notifyTaskChanged(User recipient, String taskName) {
        createNotification(recipient, "Task '" + taskName + "' has been updated. Check the details for changes.", NotificationEventType.TASK_CHANGED.getDescription(), NotificationType.TASK);
    }

    public void notifyPromotionReceived(User recipient, String newPosition) {
        createNotification(recipient, "Congratulations! You have been promoted to " + newPosition + ".", NotificationEventType.PROMOTION.getDescription(), NotificationType.PROMOTION);
    }

    public void notifyError(User recipient, String errorDetails) {
        createNotification(recipient, "An error occurred: " + errorDetails, NotificationEventType.ERROR.getDescription(), NotificationType.ERROR);
    }

    public void notifyAlert(User recipient, String alertDetails) {
        createNotification(recipient, alertDetails, NotificationEventType.ALERT.getDescription(), NotificationType.ALERT);
    }

    public void notifyTaskDeleted(User recipient, String taskName, String progress) {
        createNotification(recipient, "Task '" + taskName + "' has been deleted. Your new progress is: " + progress + ".", NotificationEventType.TASK_DELETED.getDescription(), NotificationType.TASK);
    }

    public void notifyRoleChanged(User recipient, String roleName) {
        createNotification(recipient, "Your role has been changed to " + roleName + ".", NotificationEventType.ROLE_CHANGED.getDescription(), NotificationType.ALERT);
    }

    public void notifyRoleDeleted(User recipient, String roleName) {
        createNotification(recipient, "Your role '" + roleName + "' has been removed.", NotificationEventType.ROLE_DELETED.getDescription(), NotificationType.ALERT);
    }

    public void notifyEligibleForPromotion(User user) {
        createNotification(
            user,
            "Congratulations! You have completed all your tasks and are now eligible for a promotion. Your promotion request has been forwarded.",
            "Eligible for Promotion",
            NotificationType.PROMOTION
        );
    }

    public void notifyPromotionRequestToAdmin(User admin, User promotedUser) {
        createNotification(
            admin,
            "New promotion request: " + promotedUser.getFirstName() + " " + promotedUser.getLastName(),
            "Promotion Request",
            NotificationType.PROMOTION
        );
    }

    public void notifyTaskApproved(User recipient, String taskName, String reviewerName) {
        createNotification(
            recipient,
            "Your task '" + taskName + "' has been approved by " + reviewerName + ".",
            "Task approved",
            NotificationType.REVIEW
        );
    }

    public void notifyTaskRejected(User recipient, String taskName, String reviewerName, String comment) {
        String message = "Your task '" + taskName + "' has been rejected by " + reviewerName + ".";
        if (comment != null && !comment.trim().isEmpty()) {
            message += " Comment: " + comment;
        }
        createNotification(
            recipient,
            message,
            "Task rejected",
            NotificationType.REVIEW
          );
    }

    public void notifyPromotionApproved(User recipient, String message) {
        String notificationMessage = message != null && !message.trim().isEmpty() 
            ? message 
            : "Your promotion request has been approved!";
        createNotification(
            recipient,
            notificationMessage,
            "Promotion Approved",
            NotificationType.PROMOTION
        );
    }

    public void notifyPromotionRejected(User recipient, String message) {
        createNotification(
            recipient,
            message,
            "Promotion Rejected",
            NotificationType.PROMOTION
        );
    }

    private void createNotification(User recipient, String message, String title, NotificationType type) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setMessage(message);
        notification.setTitle(title);
        notification.setType(type);
        notificationRepository.save(notification);
    }
}

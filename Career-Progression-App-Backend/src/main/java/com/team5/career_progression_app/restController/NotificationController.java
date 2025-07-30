package com.team5.career_progression_app.restController;

import com.team5.career_progression_app.dto.ApiResponse;
import com.team5.career_progression_app.dto.NotificationFilterCountDTO;
import com.team5.career_progression_app.dto.NotificationDTO;
import com.team5.career_progression_app.dto.PaginatedResponse;
import com.team5.career_progression_app.model.NotificationFilter;
import com.team5.career_progression_app.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/{userId}")
    public ApiResponse<PaginatedResponse<NotificationDTO>> getNotifications(
            @PathVariable Integer userId,
            @RequestParam NotificationFilter filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PaginatedResponse<NotificationDTO> response = notificationService.getAllForUser(userId, filter, page, size);
        return new ApiResponse<>(true, "Notifications fetched successfully", response);
    }

    @GetMapping("/{userId}/filters")
    public ApiResponse<List<NotificationFilter>> getAvailableFilters(@PathVariable Integer userId) {
        List<NotificationFilter> filters = notificationService.getAvailableFilters(userId);
        return new ApiResponse<>(true, "Available filters fetched", filters);
    }

    @GetMapping("/{userId}/unread-count")
    public ApiResponse<Integer> getUnreadCount(@PathVariable Integer userId) {
        Integer count = notificationService.getUnreadCount(userId);
        return new ApiResponse<>(true, "Unread notification count fetched", count);
    }

    @GetMapping("/{userId}/filter-counts")
    public ApiResponse<List<NotificationFilterCountDTO>> getFilterCounts(@PathVariable Integer userId) {
        List<NotificationFilterCountDTO> filterCounts = notificationService.getFilterCounts(userId);
        return new ApiResponse<>(true, "Filter counts fetched", filterCounts);
    }

    @PostMapping("/{notificationId}/read")
    public ApiResponse<Void> markAsRead(@PathVariable Integer notificationId) {
        notificationService.markAsRead(notificationId);
        return new ApiResponse<>(true, "Notification marked as read.", null);
    }

    @PostMapping("/{userId}/mark-all-read")
    public ApiResponse<Void> markAllAsRead(@PathVariable Integer userId) {
        notificationService.markAllAsRead(userId);
        return new ApiResponse<>(true, "All notifications marked as read.", null);
    }
}
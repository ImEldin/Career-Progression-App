package com.team5.career_progression_app.restController;

import com.team5.career_progression_app.dto.*;
import com.team5.career_progression_app.model.Status;
import com.team5.career_progression_app.service.TaskService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/assigned-to/{userId}")
    public ApiResponse<PaginatedResponse<TaskDTO>> getTasksAssignedToUser(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PaginatedResponse<TaskDTO> response = taskService.getTasksByUserId(userId, page, size);
        return new ApiResponse<>(true, "Tasks fetched successfully", response);
    }


    @GetMapping("/user/{userId}/all")
    public ApiResponse<List<TaskDTO>> getAllTasksForUser(@PathVariable Integer userId) {
        List<TaskDTO> tasks = taskService.getAllTasksForUser(userId);
        return new ApiResponse<>(true, "All tasks fetched successfully", tasks);
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ApiResponse<List<TaskDTO>> getTasksForUserByStatus(
            @PathVariable Integer userId,
            @PathVariable String status) {
        
        Status taskStatus = Status.valueOf(status.toUpperCase());
        List<TaskDTO> tasks = taskService.getTasksForUserByStatus(userId, taskStatus);
        return new ApiResponse<>(true, "Tasks by status fetched successfully", tasks);
    }

    @PostMapping("/assign")
    public ResponseEntity<ApiResponse<String>> assignTaskToUsers(@RequestBody TaskAssignmentRequest request) {
        taskService.assignTaskToUsers(request);
        ApiResponse<String> response = new ApiResponse<>(true, "Tasks successfully assigned", "/tasks");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ApiResponse<PaginatedResponse<TaskDTO>> searchTasks(
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) String teamName,
            @RequestParam(required = false) Integer positionId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer templateId,
            @RequestParam(required = false) String searchQuery,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        TaskSearchRequest request = new TaskSearchRequest();
        request.setUserId(userId);
        request.setTeamName(teamName);
        request.setPositionId(positionId);
        request.setStatus(status);
        request.setTemplateId(templateId);
        request.setSearchQuery(searchQuery);

        PaginatedResponse<TaskDTO> response = taskService.searchTasks(request, page, size);
        return new ApiResponse<>(true, "Tasks fetched successfully", response);
    }

    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity<ApiResponse<String>> deleteTask(@PathVariable Integer taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task deleted successfully", null));
    }

    @GetMapping("/{taskId}")
    public ApiResponse<TaskDTO> getTaskDetails(@PathVariable Integer taskId) {
        TaskDTO task = taskService.getTaskDetails(taskId);
        return new ApiResponse<>(true, "Task details fetched successfully", task);
    }

    @PutMapping("/edit/{taskId}")
    public ResponseEntity<ApiResponse<TaskDTO>> updateTask(
            @PathVariable Integer taskId,
            @RequestBody TaskUpdateRequest request) {
        TaskDTO updatedTask = taskService.updateTask(taskId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Task updated successfully", updatedTask));
    }

    @GetMapping("/team-lead/{teamLeadId}/in-review")
    public ApiResponse<PaginatedResponse<TaskDTO>> getTasksInReviewForTeamLead(
            @PathVariable Integer teamLeadId,
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) String searchQuery,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PaginatedResponse<TaskDTO> response = taskService.getTasksInReviewForTeamLead(teamLeadId, userId, searchQuery, page, size);
        return new ApiResponse<>(true, "Tasks in review fetched successfully", response);
    }

    @PutMapping("/{taskId}/review")
    public ApiResponse<TaskDTO> reviewTask(
            @PathVariable Integer taskId,
            @RequestBody ReviewDTO reviewDTO,
            @RequestParam Integer reviewerId) {
        
        TaskDTO task = taskService.reviewTask(taskId, reviewDTO, reviewerId);
        return new ApiResponse<>(true, "Task reviewed successfully", task);
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<ApiResponse<TaskDTO>> updateTaskStatus(
            @PathVariable Integer taskId,
            @RequestBody TaskStatusUpdateRequest request) {
        TaskDTO updatedTask = taskService.updateTaskStatus(taskId, request.getStatus());
        return ResponseEntity.ok(new ApiResponse<>(true, "Task status updated successfully", updatedTask));
    }

    @GetMapping("/comments/user/{userId}")
    public ApiResponse<List<TaskCommentDTO>> getCommentsForUser(@PathVariable Integer userId) {
        List<TaskCommentDTO> comments = taskService.getCommentsForUser(userId);
        return new ApiResponse<>(true, "Comments fetched successfully", comments);
    }

}
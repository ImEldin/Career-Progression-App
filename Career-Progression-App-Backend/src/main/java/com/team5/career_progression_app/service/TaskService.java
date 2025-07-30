package com.team5.career_progression_app.service;

import com.team5.career_progression_app.dto.*;
import com.team5.career_progression_app.exception.InvalidRequestException;
import com.team5.career_progression_app.exception.ResourceNotFoundException;
import com.team5.career_progression_app.exception.DuplicateAssignmentException;
import com.team5.career_progression_app.model.*;
import com.team5.career_progression_app.repository.NotificationRepository;
import com.team5.career_progression_app.repository.TaskRepository;
import com.team5.career_progression_app.repository.TaskTemplateRepository;
import com.team5.career_progression_app.repository.UserRepository;
import com.team5.career_progression_app.repository.PromotionRequestRepository;
import com.team5.career_progression_app.repository.TaskCommentRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.team5.career_progression_app.model.Status;

import static com.team5.career_progression_app.model.Status.DONE;
import static com.team5.career_progression_app.model.Status.TODO;

@Service
@AllArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final TaskTemplateRepository taskTemplateRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;
    private final PromotionRequestRepository promotionRequestRepository;
    private final TaskCommentRepository taskCommentRepository;
    private final AIAnalysisService aiAnalysisService;

    public PaginatedResponse<TaskDTO> getTasksByUserId(Integer userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Task> taskPage = taskRepository.findByAssignedToId(userId, pageable);

        List<TaskDTO> tasks = taskPage.getContent()
                .stream()
                .map(TaskDTO::new)
                .collect(Collectors.toList());

        return new PaginatedResponse<>(tasks, (int) taskPage.getTotalElements(), taskPage.getNumber(), taskPage.getSize(), taskPage.getTotalPages());
    }

    public List<TaskDTO> getAllTasksForUser(Integer userId) {
        return taskRepository.findByAssignedToId(userId)
                .stream()
                .map(TaskDTO::new)
                .collect(Collectors.toList());
    }

    public List<TaskDTO> getTasksForUserByStatus(Integer userId, Status status) {
        return taskRepository.findByAssignedToIdAndStatus(userId, status)
                .stream()
                .map(TaskDTO::new)
                .collect(Collectors.toList());
    }

    public void assignTaskToUsers(TaskAssignmentRequest request) {
        Integer templateId = request.getTemplateId();
        String title = request.getTitle();
        String description = request.getDescription();
        List<Integer> userIds = request.getUserIds();

        TaskTemplate template = taskTemplateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + templateId));

        for (Integer userId : userIds) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            Task existingTask = taskRepository.findTaskByFilter(
                    userId, templateId
            );

            if (existingTask != null) {
                existingTask.setTitle(title != null ? title : template.getName());
                existingTask.setDescription(description != null ? description : template.getDescription());
                if(existingTask.getStatus() == Status.DONE){
                    existingTask.setStatus(Status.TODO);
                }
                taskRepository.save(existingTask);
            } else {
                Task task = new Task();
                task.setTitle(title != null ? title : template.getName());
                task.setDescription(description != null ? description : template.getDescription());
                task.setTemplate(template);
                task.setAssignedTo(user);
                task.setStatus(Status.TODO);
                taskRepository.save(task);

                notificationService.notifyTaskReceived(user, task.getTitle());
            }
        }
    }

    public PaginatedResponse<TaskDTO> searchTasks(TaskSearchRequest request, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Status status = request.getStatus() != null ?
                Status.valueOf(request.getStatus().toUpperCase()) : null;

        String searchQuery = request.getSearchQuery();
        String likePattern = searchQuery != null ? "%" + searchQuery.toLowerCase() + "%" : null;

        Page<Task> taskPage = taskRepository.searchTasks(
                request.getUserId(),
                status,
                request.getTemplateId(),
                searchQuery,
                likePattern,
                request.getTeamName(),
                request.getPositionId(),
                pageable
        );

        List<TaskDTO> tasks = taskPage.getContent()
                .stream()
                .map(TaskDTO::new)
                .collect(Collectors.toList());

        return new PaginatedResponse<>(
                tasks,
                (int) taskPage.getTotalElements(),
                taskPage.getNumber(),
                taskPage.getSize(),
                taskPage.getTotalPages()
        );
    }

    public void deleteTask(Integer taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        User assignedUser = task.getAssignedTo();

        List<Task> tasksBefore = taskRepository.findByAssignedToId(assignedUser.getId());
        int totalBefore = tasksBefore.size();
        long completedBefore = tasksBefore.stream()
                .filter(t -> t.getStatus() == DONE)
                .count();
        double progressBefore = totalBefore > 0 ? (double) completedBefore / totalBefore : 0.0;

        taskRepository.delete(task);

        List<Task> tasksAfter = taskRepository.findByAssignedToId(assignedUser.getId());
        int totalAfter = tasksAfter.size();
        long completedAfter = tasksAfter.stream()
                .filter(t -> t.getStatus() == DONE)
                .count();
        double progressAfter = totalAfter > 0 ? (double) completedAfter / totalAfter : 0.0;

        notificationService.notifyTaskDeleted(
            assignedUser,
            task.getTitle(),
            String.format("%.1f%%", progressAfter * 100)
        );
    }

    public TaskDTO getTaskDetails(Integer taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        return new TaskDTO(task);
    }

    public TaskDTO updateTask(Integer taskId, TaskUpdateRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        if (request.getTemplateId() == null || request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            throw new InvalidRequestException("Template ID and description are required");
        }

        TaskTemplate template = taskTemplateRepository.findById(request.getTemplateId())
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + request.getTemplateId()));

        Task existingTask = taskRepository.findTaskByFilter(task.getAssignedTo().getId(), request.getTemplateId());
        
        if (existingTask != null && !existingTask.getId().equals(taskId)) {
            existingTask.setTitle(task.getTitle());
            existingTask.setDescription(request.getDescription());
            if (existingTask.getStatus() == Status.DONE) {
                existingTask.setStatus(Status.TODO);
            }
            Task updatedTask = taskRepository.save(existingTask);
            
            taskRepository.delete(task);
            
            return new TaskDTO(updatedTask);
        } else {
            task.setTemplate(template);
            task.setDescription(request.getDescription());
            Task updatedTask = taskRepository.save(task);
            return new TaskDTO(updatedTask);
        }
    }

    public PaginatedResponse<TaskDTO> getTasksInReviewForTeamLead(Integer teamLeadId, Integer userId, String searchQuery, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        String likePattern = searchQuery != null ? "%" + searchQuery.toLowerCase() + "%" : null;
        
        Page<Task> taskPage = taskRepository.findTasksInReviewForTeamLead(teamLeadId, userId, searchQuery, likePattern, pageable);

        List<TaskDTO> tasks = taskPage.getContent()
                .stream()
                .map(TaskDTO::new)
                .collect(Collectors.toList());

        return new PaginatedResponse<>(tasks, (int) taskPage.getTotalElements(), taskPage.getNumber(), taskPage.getSize(), taskPage.getTotalPages());
    }

    @Transactional
    public TaskDTO reviewTask(Integer taskId, ReviewDTO reviewDTO, Integer reviewerId) {
        Task task = getTaskOrThrow(taskId);
        validateTaskStatus(task);
        User reviewer = getUserOrThrow(reviewerId);
        addReviewCommentIfPresent(task, reviewDTO, reviewer);
        
        String reviewerName = reviewer.getFirstName() + " " + reviewer.getLastName();
        User taskAssignee = task.getAssignedTo();
        
        if (reviewDTO.isApproved()) {
            task.setStatus(Status.DONE);
            handlePromotionIfEligible(task);
            notificationService.notifyTaskApproved(taskAssignee, task.getTitle(), reviewerName);
        } else {
            task.setStatus(Status.IN_PROGRESS);
            notificationService.notifyTaskRejected(taskAssignee, task.getTitle(), reviewerName, reviewDTO.getComment());
        }
        
        Task savedTask = taskRepository.save(task);
        return new TaskDTO(savedTask);
    }

    private Task getTaskOrThrow(Integer taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
    }

    private void validateTaskStatus(Task task) {
        if (task.getStatus() != Status.IN_REVIEW) {
            throw new InvalidRequestException("Task is not in review status");
        }
    }

    private User getUserOrThrow(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));
    }

    private void addReviewCommentIfPresent(Task task, ReviewDTO reviewDTO, User reviewer) {
        if (reviewDTO.getComment() != null && !reviewDTO.getComment().trim().isEmpty()) {
            TaskComment comment = new TaskComment();
            comment.setTask(task);
            comment.setUser(task.getAssignedTo());
            comment.setAuthor(reviewer);
            comment.setMessage(reviewDTO.getComment());
            task.getComments().add(comment);
            taskCommentRepository.save(comment);
        }
    }

    private void handlePromotionIfEligible(Task task) {
        List<Task> remainingTasks = taskRepository.findByAssignedToIdAndStatusNot(
                task.getAssignedTo().getId(), Status.DONE);
        if (remainingTasks.isEmpty()) {
            PromotionRequest promotionRequest = new PromotionRequest();
            promotionRequest.setUser(task.getAssignedTo());
            promotionRequest.setStatus(PromotionStatus.PENDING);
            promotionRequest.setMessage("User has completed all assigned tasks and is eligible for promotion");
            String aiReport = aiAnalysisService.generateAIAnalysisForUser(task.getAssignedTo().getId());
            promotionRequest.setAiReport(aiReport);
            promotionRequestRepository.save(promotionRequest);
            notificationService.notifyEligibleForPromotion(task.getAssignedTo());
            List<User> admins = userRepository.findByRoleName("ADMIN");
            if (!admins.isEmpty()) {
                User admin = admins.get(0);
                notificationService.notifyPromotionRequestToAdmin(admin, task.getAssignedTo());
            }
        }
    }

    public TaskDTO updateTaskStatus(Integer taskId, String statusStr) {
        if (statusStr == null) {
            throw new InvalidRequestException("Status must be provided");
        }
        Status status;
        try {
            status = Status.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidRequestException("Invalid status value. Allowed values: TODO, IN_PROGRESS, IN_REVIEW, DONE");
        }
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        task.setStatus(status);
        Task savedTask = taskRepository.save(task);
        return new TaskDTO(savedTask);
    }

    public List<TaskCommentDTO> getCommentsForUser(Integer userId) {
        return taskCommentRepository.findByUserId(userId)
                .stream()
                .map(TaskCommentDTO::new)
                .collect(java.util.stream.Collectors.toList());
    }


}
package com.team5.career_progression_app.service;

import com.team5.career_progression_app.dto.TaskCommentDTO;
import com.team5.career_progression_app.exception.ResourceNotFoundException;
import com.team5.career_progression_app.model.*;
import com.team5.career_progression_app.repository.PromotionRequestRepository;
import com.team5.career_progression_app.repository.TaskRepository;
import com.team5.career_progression_app.repository.TaskCommentRepository;
import com.team5.career_progression_app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIAnalysisService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final PromotionRequestRepository promotionRequestRepository;
    private final TaskCommentRepository taskCommentRepository;
    private final OpenAIService openAIService;

    public String generateAIAnalysisForUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        
        List<Task> tasks = taskRepository.findByAssignedToId(userId);
        List<TaskCommentDTO> taskComments = getCommentsForUser(userId);
        String lastPromotionDate = findLastPromotionDate(userId);
        
        String prompt = buildAnalysisPrompt(user, tasks, taskComments, lastPromotionDate);
        return openAIService.generateAnalysis(prompt);
    }

    private List<TaskCommentDTO> getCommentsForUser(Integer userId) {
        return taskCommentRepository.findByUserId(userId)
                .stream()
                .map(TaskCommentDTO::new)
                .collect(Collectors.toList());
    }

    private String findLastPromotionDate(Integer userId) {
        List<PromotionRequest> previousPromotions = promotionRequestRepository.findByUserId(userId);
        
        if (previousPromotions.isEmpty()) {
            return "Unknown";
        }
        
        previousPromotions.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return previousPromotions.size() > 1 ? 
               previousPromotions.get(1).getCreatedAt().toString() : 
               "Unknown";
    }

    private String buildAnalysisPrompt(User user, List<Task> tasks, List<TaskCommentDTO> taskComments, String lastPromotionDate) {
        StringBuilder prompt = new StringBuilder();
        
        appendHeader(prompt, user, lastPromotionDate);
        appendTasksSection(prompt, tasks);
        appendCommentsSection(prompt, taskComments);
        appendAnalysisInstructions(prompt);
        
        return prompt.toString();
    }

    private void appendHeader(StringBuilder prompt, User user, String lastPromotionDate) {
        prompt.append("Please analyze the following promotion request data and provide a comprehensive summary:\n\n");
        prompt.append("Employee: ").append(user.getFirstName())
               .append(" ").append(user.getLastName())
               .append(" (").append(user.getEmail()).append(")\n");
        prompt.append("Last Promotion Date: ").append(lastPromotionDate).append("\n\n");
    }

    private void appendTasksSection(StringBuilder prompt, List<Task> tasks) {
        prompt.append("TASKS COMPLETED:\n");
        
        Map<String, List<Task>> tasksBySkillType = tasks.stream()
                .collect(Collectors.groupingBy(this::extractSkillType));
        
        for (Map.Entry<String, List<Task>> entry : tasksBySkillType.entrySet()) {
            String skillType = entry.getKey();
            List<Task> skillTypeTasks = entry.getValue();
            
            prompt.append("\nSKILL TYPE: ").append(skillType).append(" (").append(skillTypeTasks.size()).append(" tasks)\n");
            for (Task task : skillTypeTasks) {
                appendTaskDetails(prompt, task);
            }
        }
    }

    private String extractSkillType(Task task) {
        if (task.getTemplate() != null && 
            task.getTemplate().getTemplateSkills() != null && 
            !task.getTemplate().getTemplateSkills().isEmpty()) {
            
            Skill skill = task.getTemplate().getTemplateSkills().get(0).getSkill();
            return skill.getSkillType() != null ? skill.getSkillType().getName() : "Unknown";
        }
        return "Unknown";
    }

    private void appendTaskDetails(StringBuilder prompt, Task task) {
        String skillType = extractSkillType(task);
        prompt.append("- ").append(task.getTitle()).append(" (").append(skillType).append(")\n");
        prompt.append("  Status: ").append(task.getStatus()).append("\n");
        prompt.append("  Started: ").append(task.getCreatedAt()).append("\n");
        prompt.append("  Completed: ").append(task.getUpdatedAt()).append("\n");
        prompt.append("  Description: ").append(task.getDescription()).append("\n\n");
    }

    private void appendCommentsSection(StringBuilder prompt, List<TaskCommentDTO> comments) {
        prompt.append("TASK COMMENTS:\n");
        for (TaskCommentDTO comment : comments) {
            appendCommentDetails(prompt, comment);
        }
    }

    private void appendCommentDetails(StringBuilder prompt, TaskCommentDTO comment) {
        prompt.append("- ").append(comment.getAuthorName())
               .append(" on task '").append(comment.getTaskTitle())
               .append("' (").append(comment.getCreatedAt()).append(")\n");
        prompt.append("  Comment: ").append(comment.getMessage()).append("\n\n");
    }

    private void appendAnalysisInstructions(StringBuilder prompt) {
        prompt.append("Please provide:\n");
        prompt.append("1. A summary of the employee's performance and progress\n");
        prompt.append("2. Analysis by skill type - which skill types the employee excels at and which ones need improvement\n");
        prompt.append("3. Any irregularities or concerns (e.g., tasks taking unusually long time for specific skill types)\n");
        prompt.append("4. Overall assessment for promotion consideration\n");
        prompt.append("5. Recommendations for areas of improvement, focusing on skill type balance\n");
    }
} 
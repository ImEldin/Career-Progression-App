package com.team5.career_progression_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PromotionAnalysisRequestDTO {
    private String userFirstName;
    private String userLastName;
    private String userEmail;
    private List<TaskAnalysisDTO> tasks;
    private List<TaskCommentAnalysisDTO> taskComments;
    private String lastPromotionDate;

    @Data
    @AllArgsConstructor
    public static class TaskAnalysisDTO {
        private String title;
        private String description;
        private String status;
        private String startedAt;
        private String completedAt;
        private String skillType;
    }

    @Data
    @AllArgsConstructor
    public static class TaskCommentAnalysisDTO {
        private String message;
        private String authorName;
        private String taskTitle;
        private String createdAt;
    }
} 
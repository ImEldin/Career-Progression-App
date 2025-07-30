package com.team5.career_progression_app.dto;

import com.team5.career_progression_app.model.PromotionRequest;
import com.team5.career_progression_app.model.PromotionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class PromotionRequestDetailsDTO {
    private Integer id;
    private PromotionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String message;
    private UserDTO user;
    private List<TaskDTO> tasks;
    private List<TaskCommentDTO> taskComments;
    private String aiAnalysis;
    private String aiReport;

    public PromotionRequestDetailsDTO(PromotionRequest promotionRequest) {
        this.id = promotionRequest.getId();
        this.status = promotionRequest.getStatus();
        this.createdAt = promotionRequest.getCreatedAt();
        this.updatedAt = promotionRequest.getUpdatedAt();
        this.message = promotionRequest.getMessage();
        this.user = new UserDTO(promotionRequest.getUser());
        this.aiReport = promotionRequest.getAiReport();
    }
} 
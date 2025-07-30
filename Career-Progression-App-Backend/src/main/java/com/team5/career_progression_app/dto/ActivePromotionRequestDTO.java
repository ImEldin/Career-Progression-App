package com.team5.career_progression_app.dto;

import com.team5.career_progression_app.model.PromotionRequest;
import com.team5.career_progression_app.model.PromotionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ActivePromotionRequestDTO {
    private Integer id;
    private PromotionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String message;
    private String aiReport;
    private UserDTO user;

    public ActivePromotionRequestDTO(PromotionRequest promotionRequest) {
        this.id = promotionRequest.getId();
        this.status = promotionRequest.getStatus();
        this.createdAt = promotionRequest.getCreatedAt();
        this.updatedAt = promotionRequest.getUpdatedAt();
        this.message = promotionRequest.getMessage();
        this.aiReport = promotionRequest.getAiReport();
        this.user = new UserDTO(promotionRequest.getUser());
    }
} 
package com.team5.career_progression_app.dto;

import com.team5.career_progression_app.model.PromotionRequest;
import com.team5.career_progression_app.model.PromotionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PromotionRequestDTO {
    private Integer id;
    private PromotionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer userId;
    private String message;
    private String ai_report;

    public PromotionRequestDTO(PromotionRequest req) {
        this(
            req.getId(),
            req.getStatus(),
            req.getCreatedAt(),
            req.getUpdatedAt(),
            req.getUser().getId(),
            req.getMessage(),
                req.getAiReport()
        );
    }
}
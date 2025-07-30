package com.team5.career_progression_app.dto;

import lombok.Data;

@Data
public class TaskSearchRequest {
    private Integer userId;
    private String teamName;
    private Integer positionId;
    private String status;
    private Integer templateId;
    private String searchQuery;
}

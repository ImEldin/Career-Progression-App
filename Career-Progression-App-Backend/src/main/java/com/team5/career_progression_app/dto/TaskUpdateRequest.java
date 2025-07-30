package com.team5.career_progression_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskUpdateRequest {
    private Integer templateId;
    private String description;
} 
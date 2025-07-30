package com.team5.career_progression_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskAssignmentRequest {
    private Integer templateId;
    private String title;
    private String description;
    private List<Integer> userIds;
}


package com.team5.career_progression_app.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AiGeneratedTemplateDTO {
    private String suggestedName;
    private String suggestedDescription;
    private String suggestedRequirements;
    private List<String> suggestedSkills;
} 
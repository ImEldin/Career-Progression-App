package com.team5.career_progression_app.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TemplateSkillCreateDTO {
    private Integer templateId;
    private Integer skillId;
    private String level;
} 
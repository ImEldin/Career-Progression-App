package com.team5.career_progression_app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TemplateDTO {

    private int id;
    @NotBlank(message = "Template name must not be empty")
    private String name;
    private String description;
    private String requirements;
    private List<Integer> skillIds;
    private List<TemplateSkillDTO> skills;
}

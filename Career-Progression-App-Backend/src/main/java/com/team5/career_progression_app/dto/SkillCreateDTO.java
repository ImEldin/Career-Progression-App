package com.team5.career_progression_app.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SkillCreateDTO {
    private String name;
    private Integer typeId;
    private List<Integer> tagIds;
} 
package com.team5.career_progression_app.dto;

import com.team5.career_progression_app.model.SkillType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SkillTypeDTO {
    private Integer id;
    private String name;

    public SkillTypeDTO(SkillType skillType) {
        this.id = skillType.getId();
        this.name = skillType.getName();
    }

    public SkillTypeDTO(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
}
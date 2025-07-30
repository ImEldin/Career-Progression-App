package com.team5.career_progression_app.dto;

import com.team5.career_progression_app.model.Skill;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class SkillDTO {
    private Integer id;
    private String name;
    private SkillTypeDTO type;
    private List<TagDTO> tags;

    public SkillDTO(Skill skill) {
        this.id = skill.getId();
        this.name = skill.getName();
        if (skill.getSkillType() != null) {
            this.type = new SkillTypeDTO(skill.getSkillType());
        }
        if (skill.getTags() != null) {
            this.tags = skill.getTags().stream()
                    .map(TagDTO::new)
                    .collect(Collectors.toList());
        }
    }
}
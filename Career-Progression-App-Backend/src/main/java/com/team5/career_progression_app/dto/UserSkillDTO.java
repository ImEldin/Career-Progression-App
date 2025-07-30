package com.team5.career_progression_app.dto;

import com.team5.career_progression_app.model.UserSkill;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSkillDTO {
    private Integer userId;
    private Integer skillId;
    private String name;
    private String level;
    private SkillTypeDTO type;
    private List<TagDTO> tags;

    public UserSkillDTO(UserSkill userSkill) {
        this.userId = userSkill.getUser().getId();
        this.skillId = userSkill.getSkill().getId();
        this.name = userSkill.getSkill().getName();
        this.level = userSkill.getLevel();
        this.type = new SkillTypeDTO(userSkill.getSkill().getSkillType());
        this.tags = userSkill.getSkill().getTags()
                .stream()
                .map(TagDTO::new)
                .toList();
    }
}
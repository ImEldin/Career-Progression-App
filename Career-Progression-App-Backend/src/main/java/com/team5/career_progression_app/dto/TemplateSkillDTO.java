package com.team5.career_progression_app.dto;

import com.team5.career_progression_app.model.TemplateSkill;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TemplateSkillDTO {
    private Integer id;
    private Integer templateId;
    private SkillDTO skill;
    private String level;

    public TemplateSkillDTO(TemplateSkill templateSkill) {
        this.id = templateSkill.getId();
        this.templateId = templateSkill.getTemplate().getId();
        this.skill = new SkillDTO(templateSkill.getSkill());
        this.level = templateSkill.getLevel();
    }
}
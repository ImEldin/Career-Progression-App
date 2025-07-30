package com.team5.career_progression_app.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "Skill")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "skill_type_id")
    private SkillType skillType;

    @ManyToMany
    @JoinTable(
        name = "SkillTag",
        joinColumns = @JoinColumn(name = "skill_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags;

    @OneToMany(mappedBy = "skill")
    private List<TemplateSkill> templateSkills;

    @OneToMany(mappedBy = "skill")
    private List<UserSkill> userSkills;

    public Skill(Integer id) {
        this.id = id;
    }
}
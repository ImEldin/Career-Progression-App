package com.team5.career_progression_app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "TemplateSkill")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TemplateSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "template_id", nullable = false)
    private TaskTemplate template;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private String level;
}
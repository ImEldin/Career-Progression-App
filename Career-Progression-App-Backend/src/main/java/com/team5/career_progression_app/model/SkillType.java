package com.team5.career_progression_app.model;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SkillType")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SkillType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "skillType")
    private List<Skill> skills;
}
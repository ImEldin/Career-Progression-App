package com.team5.career_progression_app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "UserSkill")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private String level;
}
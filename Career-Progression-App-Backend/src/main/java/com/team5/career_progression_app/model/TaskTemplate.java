package com.team5.career_progression_app.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "TaskTemplate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "task_requirements")
    private String taskRequirements;

    @OneToMany(mappedBy = "template")
    private List<Task> tasks;

    @OneToMany(mappedBy = "template")
    private List<TemplateSkill> templateSkills;

    @Override
    public String toString() {
        return "TaskTemplate{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", taskRequirements='" + taskRequirements + '\'' +
                '}';
    }

    public TaskTemplate(Integer id) {
        this.id = id;
    }
}
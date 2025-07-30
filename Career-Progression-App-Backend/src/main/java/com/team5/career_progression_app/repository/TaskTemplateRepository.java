package com.team5.career_progression_app.repository;

import com.team5.career_progression_app.model.TaskTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskTemplateRepository extends JpaRepository<TaskTemplate, Integer> {
}

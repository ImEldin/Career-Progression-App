package com.team5.career_progression_app.repository;

import com.team5.career_progression_app.model.SkillType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillTypeRepository extends JpaRepository<SkillType, Integer> {
    boolean existsByName(String name);
}
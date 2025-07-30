package com.team5.career_progression_app.repository;

import com.team5.career_progression_app.model.TemplateSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemplateSkillRepository extends JpaRepository<TemplateSkill, Integer> {
    List<TemplateSkill> findByTemplateId(Integer templateId);
    boolean existsByTemplateIdAndSkillId(Integer templateId, Integer skillId);
    @Modifying
    @Query("DELETE FROM TemplateSkill ts WHERE ts.template.id = :templateId")
    void deleteByTemplateId(Integer templateId);
    @Modifying
    @Query("DELETE FROM TemplateSkill ts WHERE ts.skill.id = :skillId")
    void deleteBySkillId(Integer skillId);
}
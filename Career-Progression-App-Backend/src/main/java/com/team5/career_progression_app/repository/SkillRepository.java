package com.team5.career_progression_app.repository;

import com.team5.career_progression_app.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Integer> {
    List<Skill> findBySkillTypeId(Integer skillTypeId);

    boolean existsByNameAndSkillTypeId(String name, Integer skillTypeId);

    @Query("""
                SELECT DISTINCT s
                FROM Skill s
                JOIN s.tags t
                WHERE t.id IN :tagIds
                  AND s.id <> :excludeId
            """)
    List<Skill> findAllByTagIdsAndExcludeSkill(List<Integer> tagIds, Integer excludeId);

}
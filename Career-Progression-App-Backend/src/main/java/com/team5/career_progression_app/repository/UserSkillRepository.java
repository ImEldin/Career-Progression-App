package com.team5.career_progression_app.repository;

import com.team5.career_progression_app.model.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Integer> {
    
    List<UserSkill> findByUserId(Integer userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserSkill us WHERE us.user.id = :userId")
    void deleteByUserId(@Param("userId") Integer userId);

    boolean existsByUserIdAndSkillId(Integer userId, Integer skillId);

    @Query("""
        SELECT us
        FROM UserSkill us
        WHERE us.skill.id IN :skillIds
        """)
    List<UserSkill> findAllBySkillIds(List<Integer> skillIds);

    @Query("""
        SELECT us
        FROM UserSkill us
        JOIN FETCH us.user
        LEFT JOIN FETCH us.user.role
        WHERE us.skill.id IN :skillIds
          AND us.level >= :level
        """)
    List<UserSkill> findDetailedBySkillIdsAndLevel(List<Integer> skillIds, String level);

    @Modifying
    @Query("DELETE FROM UserSkill us WHERE us.skill.id = :skillId")
    void deleteBySkillId(Integer skillId);

}

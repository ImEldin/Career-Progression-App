package com.team5.career_progression_app.repository;

import com.team5.career_progression_app.model.Team;
import com.team5.career_progression_app.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Integer> {
    @Query("""
        SELECT team.name FROM Team team
        """)
    List<String> getAllTeamNames();

    boolean existsByLeadIdAndMembershipsUser(Integer leadId, User user);
    
    @Query("SELECT t FROM Team t JOIN t.memberships m WHERE t.lead.id = :leadId AND m.user.id = :userId")
    List<Team> findTeamsWhereUserIsLeadAndMember(@Param("leadId") Integer leadId, @Param("userId") Integer userId);
}

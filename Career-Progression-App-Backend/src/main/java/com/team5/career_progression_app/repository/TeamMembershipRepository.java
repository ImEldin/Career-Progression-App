package com.team5.career_progression_app.repository;

import com.team5.career_progression_app.model.Team;
import com.team5.career_progression_app.model.TeamMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamMembershipRepository extends JpaRepository<TeamMembership, Integer> {
    @Query("SELECT tm FROM TeamMembership tm JOIN FETCH tm.user WHERE tm.team.id = :teamId")
    List<TeamMembership> findMembershipsWithUsersByTeamId(@Param("teamId") Integer teamId);

    @Query("SELECT tm FROM TeamMembership tm JOIN FETCH tm.team WHERE tm.user.id = :userId")
    List<TeamMembership> findMembershipsWithTeamsByUserId(@Param("userId") Integer userId);

    void deleteAllByTeam(Team team);

    boolean existsByUserIdAndTeamId(Integer userId, Integer teamId);
}

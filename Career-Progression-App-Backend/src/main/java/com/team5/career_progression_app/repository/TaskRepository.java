package com.team5.career_progression_app.repository;

import com.team5.career_progression_app.model.Status;
import com.team5.career_progression_app.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    Page<Task> findByAssignedToId(Integer userId, Pageable pageable);

    List<Task> findByAssignedToId(Integer userId);

    List<Task> findByAssignedToIdAndStatus(Integer userId, Status status);

    @Query("""
        SELECT DISTINCT task FROM Task task
        JOIN task.assignedTo assignedTo
        JOIN assignedTo.userPositions userPosition
        WHERE userPosition.position.id = :positionId
        """)
    Page<Task> findByPositionId(
            @Param("positionId") Integer positionId,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT task FROM Task task
        JOIN task.assignedTo assignedTo
        JOIN assignedTo.teamMemberships teamMembership
        WHERE teamMembership.team.name = :teamName
        """)
    Page<Task> findByTeamName(
            @Param("teamName") String teamName,
            Pageable pageable
    );

    @Query("""
        SELECT t FROM Task t
        WHERE (:teamName IS NULL OR EXISTS (
            SELECT tm FROM t.assignedTo.teamMemberships tm WHERE tm.team.name = :teamName))
        AND (:positionId IS NULL OR EXISTS (
            SELECT up FROM t.assignedTo.userPositions up WHERE up.position.id = :positionId))
        AND (:userId IS NULL OR t.assignedTo.id = :userId)
        AND (:status IS NULL OR t.status = :status)
        AND (:templateId IS NULL OR t.template.id = :templateId)
        AND (:searchQuery IS NULL OR LOWER(t.title) LIKE LOWER(:likePattern) 
            OR LOWER(t.description) LIKE LOWER(:likePattern))
        """)
    Page<Task> searchTasks(
            @Param("userId") Integer userId,
            @Param("status") Status status,
            @Param("templateId") Integer templateId,
            @Param("searchQuery") String searchQuery,
            @Param("likePattern") String likePattern,
            @Param("teamName") String teamName,
            @Param("positionId") Integer positionId,
            Pageable pageable
    );

    @Query("""
        SELECT t FROM Task t
        WHERE t.assignedTo.id = :userId
          AND t.template.id = :templateId
    """)
    Task findTaskByFilter(
        @Param("userId") Integer userId,
        @Param("templateId") Integer templateId
    );

    @Query("""
        SELECT DISTINCT task FROM Task task
        JOIN task.assignedTo assignedTo
        JOIN assignedTo.teamMemberships teamMembership
        JOIN teamMembership.team team
        WHERE team.lead.id = :teamLeadId
        AND task.status = 'IN_REVIEW'
        AND (:userId IS NULL OR task.assignedTo.id = :userId)
        AND (:searchQuery IS NULL OR LOWER(task.title) LIKE LOWER(:likePattern))
        """)
    Page<Task> findTasksInReviewForTeamLead(
            @Param("teamLeadId") Integer teamLeadId,
            @Param("userId") Integer userId,
            @Param("searchQuery") String searchQuery,
            @Param("likePattern") String likePattern,
            Pageable pageable
    );

    List<Task> findByAssignedToIdAndStatusNot(Integer userId, Status status);
}
package com.team5.career_progression_app.repository;

import com.team5.career_progression_app.model.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>, 
    JpaSpecificationExecutor<User> {
    @Query("""
        SELECT user FROM User user 
        WHERE LOWER(user.email) = LOWER(:email)
        """)
    Optional<User> findByEmailIgnoreCase(@Param("email") String email);
    
    List<User> findByActiveFalse();
    List<User> findByActiveTrue();

    @Query(
            value = """
        FROM User user
        WHERE (:active IS NULL OR user.active = :active)
        AND (:name IS NULL OR user.firstName = :name)
        """)
    List<User> filterUsers(Boolean active,String name);

    @Query("""
        SELECT DISTINCT user FROM User user 
        JOIN user.userPositions userPosition 
        WHERE userPosition.position.id IN :positionIds
        """)
    List<User> findByUserPositionsPositionIdIn(@Param("positionIds") List<Integer> positionIds);

    @Query("""
        SELECT DISTINCT user FROM User user 
        JOIN user.teamMemberships teamMembership 
        WHERE teamMembership.team.id IN :teamIds
        """)
    List<User> findUsersByTeamIds(@Param("teamIds") List<Integer> teamIds);

    @Query("""
        SELECT DISTINCT user FROM User user 
        LEFT JOIN user.userPositions userPosition 
        LEFT JOIN user.teamMemberships teamMembership 
        WHERE (:positionIds IS NULL OR userPosition.position.id IN :positionIds)
        AND (:teamIds IS NULL OR teamMembership.team.id IN :teamIds)
        """)
    List<User> findUsersByFilters(@Param("positionIds") List<Integer> positionIds, 
                                 @Param("teamIds") List<Integer> teamIds);

    List<User> findByRoleName(String roleName);
}

package com.team5.career_progression_app.repository;

import com.team5.career_progression_app.model.Role;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findByName(String name);

    @EntityGraph(attributePaths = {"rolePermissions", "rolePermissions.permission"})
    Optional<Role> findRoleByName(String name);



}

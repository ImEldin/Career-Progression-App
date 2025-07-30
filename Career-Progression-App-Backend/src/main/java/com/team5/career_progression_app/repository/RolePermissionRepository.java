package com.team5.career_progression_app.repository;

import com.team5.career_progression_app.model.Permission;
import com.team5.career_progression_app.model.Role;
import com.team5.career_progression_app.model.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Integer> {
    boolean existsByRoleAndPermission(Role role, Permission permission);
}

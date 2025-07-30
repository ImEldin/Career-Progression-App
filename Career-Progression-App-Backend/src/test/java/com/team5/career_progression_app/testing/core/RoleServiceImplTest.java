package com.team5.career_progression_app.testing.core;

import com.team5.career_progression_app.model.Permission;
import com.team5.career_progression_app.model.Role;
import com.team5.career_progression_app.model.RolePermission;
import com.team5.career_progression_app.repository.PermissionRepository;
import com.team5.career_progression_app.repository.RolePermissionRepository;
import com.team5.career_progression_app.repository.RoleRepository;
import com.team5.career_progression_app.service.RoleService;
import com.team5.career_progression_app.testing.SpringBootTestWithPostgres;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTestWithPostgres
public class RoleServiceImplTest {

    @Autowired
    private RoleService roleService;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PermissionRepository permissionRepository;
    @Autowired
    private RolePermissionRepository rolePermissionRepository;

    private void deletePermissionsForRole(Role role) {
        List<RolePermission> allPermissions = rolePermissionRepository.findAll();
        for (RolePermission rp : allPermissions) {
            if (rp.getRole().getId().equals(role.getId())) {
                rolePermissionRepository.delete(rp);
            }
        }
    }

    @Test
    void givenNewRoleAndPermissions_whenCreatingRole_thenRoleShouldBeCreatedWithGivenPermissions() {
        String permissionName1 = "TEST_PERMISSION_1";
        String permissionName2 = "TEST_PERMISSION_2";

        Permission newPermission1 = new Permission();
        newPermission1.setName(permissionName1);
        permissionRepository.save(newPermission1);

        Permission newPermission2 = new Permission();
        newPermission2.setName(permissionName2);
        permissionRepository.save(newPermission2);

        List<Permission> savedPermissions = permissionRepository.findByNameIn(List.of(permissionName1, permissionName2));
        assertThat(savedPermissions)
                .hasSize(2)
                .extracting(Permission::getName)
                .containsExactlyInAnyOrderElementsOf(List.of(permissionName1, permissionName2));

        String roleName = "TEST_ROLE";
        roleService.insertRole(roleName, List.of(permissionName1, permissionName2));
        Role createdRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new AssertionError("Role not created"));

        assertThat(createdRole).isNotNull();
        assertThat(createdRole.getId()).isNotNull();
        assertThat(createdRole.getName()).isEqualTo(roleName);

        Optional<Role> fromDb = roleRepository.findById(createdRole.getId());
        assertThat(fromDb).isPresent();
        assertThat(fromDb.get().getName()).isEqualTo(roleName);

        Role fetched = fromDb.get();

        Set<Permission> assignedPermissions = fetched.getPermissions();
        assertThat(assignedPermissions).hasSize(2);
        assertThat(assignedPermissions)
                .extracting(Permission::getName)
                .containsExactlyInAnyOrder(permissionName1, permissionName2);

        assertThat(rolePermissionRepository.existsByRoleAndPermission(createdRole, newPermission1)).isTrue();
        assertThat(rolePermissionRepository.existsByRoleAndPermission(createdRole, newPermission2)).isTrue();
    }

    @Test
    void givenExistingRoleWithPermissions_whenUpdatingNameAndPermissions_thenBothShouldBeUpdated() {
        String initialRoleName = "INITIAL_ROLE";
        String updatedRoleName = "UPDATED_ROLE";

        String initialPermissionName = "INITIAL_PERMISSION";
        String updatedPermissionName = "UPDATED_PERMISSION";

        Permission initialPermission = new Permission();
        initialPermission.setName(initialPermissionName);
        permissionRepository.save(initialPermission);

        roleService.insertRole(initialRoleName, List.of(initialPermissionName));
        Role createdRole = roleRepository.findByName(initialRoleName)
                .orElseThrow(() -> new AssertionError("Initial role not found"));

        createdRole.setName(updatedRoleName);
        roleRepository.save(createdRole);

        deletePermissionsForRole(createdRole);

        Permission updatedPermission = new Permission();
        updatedPermission.setName(updatedPermissionName);
        permissionRepository.save(updatedPermission);

        rolePermissionRepository.save(new RolePermission(null, createdRole, updatedPermission));

        Role updatedRole = roleRepository.findRoleByName(updatedRoleName).orElseThrow();

        assertThat(updatedRole.getPermissions())
                .extracting(Permission::getName)
                .containsExactly(updatedPermissionName);

        assertThat(rolePermissionRepository.existsByRoleAndPermission(updatedRole, initialPermission)).isFalse();
        assertThat(rolePermissionRepository.existsByRoleAndPermission(updatedRole, updatedPermission)).isTrue();
    }

    @Test
    void givenRoleWithPermissions_whenDeleted_thenRoleAndRolePermissionsShouldBeRemoved() {
        String roleName = "TO_DELETE";
        String permissionName = "DELETE_TEST_PERMISSION";

        Permission permission = new Permission();
        permission.setName(permissionName);
        permission = permissionRepository.save(permission);

        roleService.insertRole(roleName, List.of(permissionName));
        Role createdRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new AssertionError("Role not created"));

        deletePermissionsForRole(createdRole);

        roleRepository.delete(createdRole);

        assertThat(roleRepository.findById(createdRole.getId())).isNotPresent();
        assertThat(rolePermissionRepository.existsByRoleAndPermission(createdRole, permission)).isFalse();
    }

    @Test
    void givenNullRoleName_whenInsertingRole_thenExceptionShouldBeThrown() {
        assertThrows(DataIntegrityViolationException.class, () -> {
            roleService.insertRole(null, Collections.emptyList());
        });
    }
}

package com.team5.career_progression_app.service;

import com.team5.career_progression_app.dto.AllRolesPermissionsDTO;
import com.team5.career_progression_app.dto.ApiResponse;
import com.team5.career_progression_app.dto.PermissionDTO;
import com.team5.career_progression_app.dto.RoleDTO;
import com.team5.career_progression_app.dto.RolePermissionDTO;
import com.team5.career_progression_app.dto.RoleWithPermissionsDTO;
import com.team5.career_progression_app.exception.DuplicateAssignmentException;
import com.team5.career_progression_app.exception.ResourceNotFoundException;
import com.team5.career_progression_app.model.Permission;
import com.team5.career_progression_app.model.Role;
import com.team5.career_progression_app.model.RolePermission;
import com.team5.career_progression_app.repository.PermissionRepository;
import com.team5.career_progression_app.repository.RolePermissionRepository;
import com.team5.career_progression_app.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RolePermissionService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RolePermissionRepository rolePermissionRepository;

    public RolePermissionService(
            RoleRepository roleRepository,
            PermissionRepository permissionRepository,
            RolePermissionRepository rolePermissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.rolePermissionRepository = rolePermissionRepository;
    }

    public ApiResponse<AllRolesPermissionsDTO> getAllRolesAndPermissions() {
        List<Role> roles = roleRepository.findAll();
        List<Permission> permissions = permissionRepository.findAll();
        List<RolePermission> rolePermissions = rolePermissionRepository.findAll();

        List<RoleDTO> roleDTOs = roles.stream()
                .map(role -> new RoleDTO(role.getId(), role.getName(),role.getRolePermissions().stream().map(permission -> permission.getPermission().getName()).toList()))
                .collect(Collectors.toList());

        List<PermissionDTO> permissionDTOs = permissions.stream()
                .map(permission -> new PermissionDTO(permission.getId(), permission.getName()))
                .collect(Collectors.toList());

        List<RolePermissionDTO> rolePermissionDTOs = rolePermissions.stream()
                .map(rolePermission -> new RolePermissionDTO(
                        rolePermission.getId(),
                        new RoleDTO(rolePermission.getRole()),
                        new PermissionDTO(rolePermission.getPermission().getId(),
                                rolePermission.getPermission().getName())))
                .collect(Collectors.toList());

        AllRolesPermissionsDTO allRolesPermissionsDTO = new AllRolesPermissionsDTO(roleDTOs, permissionDTOs,
                rolePermissionDTOs);

        return new ApiResponse<>(true, "Fetched all roles and permissions", allRolesPermissionsDTO);
    }

    public ApiResponse<RoleWithPermissionsDTO> getRoleWithPermissions(Integer roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        List<Permission> permissions = role.getRolePermissions().stream()
                .map(RolePermission::getPermission)
                .collect(Collectors.toList());

        RoleWithPermissionsDTO roleWithPermissionsDTO = new RoleWithPermissionsDTO(
                new RoleDTO(role),
                permissions.stream()
                        .map(permission -> new PermissionDTO(permission.getId(), permission.getName()))
                        .collect(Collectors.toList()));

        return new ApiResponse<>(true, "Fetched role with permissions", roleWithPermissionsDTO);
    }

    public ApiResponse<RolePermissionDTO> assignPermissionToRole(Integer roleId, Integer permissionId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));

        boolean exists = rolePermissionRepository.existsByRoleAndPermission(role, permission);
        if (exists) {
            throw new DuplicateAssignmentException("Permission already assigned to this role");
        }

        RolePermission rolePermission = new RolePermission();
        rolePermission.setRole(role);
        rolePermission.setPermission(permission);
        rolePermissionRepository.save(rolePermission);

        RolePermissionDTO rolePermissionDTO = new RolePermissionDTO(
                rolePermission.getId(),
                new RoleDTO(role),
                new PermissionDTO(rolePermission.getPermission().getId(), rolePermission.getPermission().getName()));

        return new ApiResponse<>(true, "Permission assigned to role", rolePermissionDTO);
    }

    public ApiResponse<Void> removePermissionFromRole(Integer id) {
        RolePermission rolePermission = rolePermissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RolePermission not found"));

        rolePermissionRepository.delete(rolePermission);

        return new ApiResponse<>(true, "Permission removed from role", null);
    }
}

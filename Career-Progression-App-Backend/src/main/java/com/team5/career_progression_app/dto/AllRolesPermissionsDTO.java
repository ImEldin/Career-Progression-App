package com.team5.career_progression_app.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class AllRolesPermissionsDTO {
    private List<RoleDTO> roles;
    private List<PermissionDTO> permissions;
    private List<RolePermissionDTO> rolePermissions;
}

package com.team5.career_progression_app.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoleWithPermissionsDTO {
    private RoleDTO role;
    private List<PermissionDTO> permissions;
}

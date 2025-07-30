package com.team5.career_progression_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RolePermissionDTO {
    private Integer id;
    private RoleDTO role;
    private PermissionDTO permission;
}

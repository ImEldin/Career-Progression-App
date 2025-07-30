package com.team5.career_progression_app.dto;

import com.team5.career_progression_app.model.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleDTO {
    private Integer id;
    @NotBlank(message = "Role name must not be empty")
    private String name;
    private List<String> permissionNames;

    public RoleDTO(Role role) {
        this.id = role.getId();
        this.name = role.getName();
        this.permissionNames = role.getRolePermissions().stream().map(permission -> permission.getPermission().getName()).toList();
    }
}

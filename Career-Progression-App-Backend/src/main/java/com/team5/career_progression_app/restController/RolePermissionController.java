package com.team5.career_progression_app.restController;

import com.team5.career_progression_app.dto.AllRolesPermissionsDTO;
import com.team5.career_progression_app.dto.ApiResponse;
import com.team5.career_progression_app.dto.RolePermissionDTO;
import com.team5.career_progression_app.dto.RoleWithPermissionsDTO;
import com.team5.career_progression_app.service.RolePermissionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/role-permissions")
public class RolePermissionController {

    private final RolePermissionService rolePermissionService;

    public RolePermissionController(RolePermissionService rolePermissionService) {
        this.rolePermissionService = rolePermissionService;
    }

    @GetMapping
    public ApiResponse<AllRolesPermissionsDTO> getAllRolesAndPermissions() {
        return rolePermissionService.getAllRolesAndPermissions();
    }

    @GetMapping("/roles/{roleId}")
    public ApiResponse<RoleWithPermissionsDTO> getRoleWithPermissions(@PathVariable Integer roleId) {
        return rolePermissionService.getRoleWithPermissions(roleId);
    }

    @PostMapping
    public ApiResponse<RolePermissionDTO> assignPermissionToRole(
            @RequestParam Integer roleId,
            @RequestParam Integer permissionId) {
        return rolePermissionService.assignPermissionToRole(roleId, permissionId);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> removePermissionFromRole(@PathVariable Integer id) {
        return rolePermissionService.removePermissionFromRole(id);
    }
}

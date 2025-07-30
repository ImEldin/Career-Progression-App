package com.team5.career_progression_app.restController;

import com.team5.career_progression_app.dto.ApiResponse;
import com.team5.career_progression_app.dto.RoleDTO;
import com.team5.career_progression_app.service.RoleService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/role")
@AllArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping("/permissions")
    public List<String> getAllPermissions() {
        return roleService.getAllPermissionNames();
    }

    @PostMapping("/selectedPermissions")
    public ApiResponse<Void> getSelectedPermissions(@Valid @RequestBody RoleDTO request) {
        String roleName = request.getName();
        List<String> permissionsNames = request.getPermissionNames();
        roleService.insertRole(roleName, permissionsNames);
        return new ApiResponse<>(true, "Received permissions for role: " + roleName, null);
    }

    @GetMapping("/all")
    public ResponseEntity<List<RoleDTO>> getAllRolesWithPermissions() {
        List<RoleDTO> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> updateRole(
            @PathVariable Integer id,
            @RequestBody RoleDTO updatedRoleDTO
    ) {
        String roleName = updatedRoleDTO.getName().toUpperCase();

        if (roleName.equals("USER") || roleName.equals("ADMIN")) {
            ApiResponse<String> response = new ApiResponse<>(false, "Default roles USER and ADMIN cannot be modified.", null);
            return ResponseEntity.badRequest().body(response);
        }

        roleService.updateRole(id, updatedRoleDTO.getName(), updatedRoleDTO.getPermissionNames());
        ApiResponse<String> response = new ApiResponse<>(true, "Role updated successfully", null);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Integer id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok("Role deleted successfully.");
    }


}

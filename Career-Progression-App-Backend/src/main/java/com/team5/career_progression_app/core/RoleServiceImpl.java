package com.team5.career_progression_app.core;

import com.team5.career_progression_app.dto.RoleDTO;
import com.team5.career_progression_app.exception.InvalidRequestException;
import com.team5.career_progression_app.exception.ResourceNotFoundException;
import com.team5.career_progression_app.model.Role;
import com.team5.career_progression_app.model.Permission;
import com.team5.career_progression_app.model.RolePermission;
import com.team5.career_progression_app.model.User;
import com.team5.career_progression_app.repository.PermissionRepository;
import com.team5.career_progression_app.repository.RolePermissionRepository;
import com.team5.career_progression_app.repository.RoleRepository;
import com.team5.career_progression_app.repository.UserRepository;
import com.team5.career_progression_app.service.RoleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    public RoleRepository roleRepository;
    public PermissionRepository permissionRepository;
    public RolePermissionRepository rolePermissionRepository;
    public UserRepository userRepository;

    public RoleServiceImpl(PermissionRepository permissionRepository, RoleRepository roleRepository,
            RolePermissionRepository rolePermissionRepository) {
        this.permissionRepository = permissionRepository;
        this.roleRepository = roleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
    }

    @Override
    public List<String> getAllPermissionNames() {
        return permissionRepository.findAllPermissionNames();
    }

    private boolean isDefaultRole(Role role) {
        String roleName = role.getName();
        return roleName.equalsIgnoreCase("USER") || roleName.equalsIgnoreCase("ADMIN");
    }

    @Transactional
    @Override
    public void insertRole(String roleName, List<String> permissionNames) {

        Role role = new Role();
        role.setName(roleName);
        role = roleRepository.save(role);

        List<Permission> permissions = permissionRepository.findByNameIn(permissionNames);

        for (Permission permission : permissions) {
            RolePermission rp = new RolePermission();
            rp.setRole(role);
            rp.setPermission(permission);
            rolePermissionRepository.save(rp);
        }
    }

    public List<RoleDTO> getAllRoles() {
        List<Role> roles = roleRepository.findAll();

        return roles.stream().map(role -> {
            RoleDTO dto = new RoleDTO(role);

            return dto;
        }).toList();
    }

    @Transactional
    public void updateRole(Integer roleId, String newRoleName, List<String> newPermissionNames) {

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + roleId));

        if (isDefaultRole(role)) {
            throw new InvalidRequestException("Default roles USER and ADMIN cannot be modified.");
        }

        role.setName(newRoleName);
        roleRepository.save(role);

        rolePermissionRepository.deleteAll(role.getRolePermissions());
        role.getRolePermissions().clear();

        List<Permission> newPermissions = permissionRepository.findByNameIn(newPermissionNames);

        for (Permission permission : newPermissions) {
            RolePermission rolePermission = new RolePermission();
            rolePermission.setRole(role);
            rolePermission.setPermission(permission);
            rolePermissionRepository.save(rolePermission);
        }
    }

    public void deleteRole(Integer id) {
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new ResourceNotFoundException("Default USER role not found."));

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));

        if (isDefaultRole(role)) {
            throw new InvalidRequestException("Default roles USER and ADMIN cannot be deleted.");
        }

        rolePermissionRepository.deleteAll(role.getRolePermissions());

        for (User user : role.getUsersWithRole()) {
            user.setRole(userRole);
            userRepository.save(user);
        }

        roleRepository.delete(role);
    }

}
package com.team5.career_progression_app.service;

import com.team5.career_progression_app.dto.RoleDTO;

import java.util.List;

public interface RoleService {

    List<String> getAllPermissionNames();
    void insertRole(String roleName, List<String> permissionNames);
    public List<RoleDTO> getAllRoles();
    void updateRole(Integer id, String newName, List<String> permissionNames);
    public void deleteRole(Integer id);
}

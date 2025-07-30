package com.team5.career_progression_app.exception;

public class RoleNotFoundException extends RuntimeException {
    public RoleNotFoundException(String roleName) {
        super("Role not found: " + roleName);
    }
}
package com.team5.career_progression_app.exception;

public class ForbiddenRoleAssignmentException extends RuntimeException {
    public ForbiddenRoleAssignmentException(String roleName) {
        super("Assignment of role '" + roleName + "' is not allowed.");
    }
}

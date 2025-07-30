package com.team5.career_progression_app.exception;

public class UserAlreadyInTeamException extends RuntimeException {
    public UserAlreadyInTeamException(String message) {
        super(message);
    }
}
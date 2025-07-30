package com.team5.career_progression_app.exception;

public class UserAlreadyActiveException extends RuntimeException {
    public UserAlreadyActiveException(String message) {
        super(message);
    }
}
package com.team5.career_progression_app.exception;

public class SkillAlreadyExistsException extends RuntimeException {
    public SkillAlreadyExistsException(String message) {
        super(message);
    }
}
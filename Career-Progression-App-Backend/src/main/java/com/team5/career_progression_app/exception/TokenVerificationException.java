package com.team5.career_progression_app.exception;

public class TokenVerificationException extends RuntimeException {
    public TokenVerificationException(String message) {
        super(message);
    }

    public TokenVerificationException(String message, Throwable cause) {
        super(message, cause);
    }
}
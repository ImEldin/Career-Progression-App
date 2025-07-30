package com.team5.career_progression_app.exception;

public class UserNotFoundException extends RuntimeException {
  public UserNotFoundException(Integer userId) {
    super("User with ID " + userId + " not found.");
  }
}
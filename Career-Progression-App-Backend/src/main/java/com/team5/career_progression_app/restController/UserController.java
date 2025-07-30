package com.team5.career_progression_app.restController;

import com.team5.career_progression_app.dto.ApiResponse;
import com.team5.career_progression_app.dto.UserDTO;
import com.team5.career_progression_app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDTO> getUsers(
            @RequestParam(required = false) List<Integer> positionIds,
            @RequestParam(required = false) List<Integer> teamIds) {
        return userService.getUsers(positionIds, teamIds);
    }

    @GetMapping("/active")
    public List<UserDTO> getActiveUsers() {
        return userService.getActiveUsers();
    }

    @GetMapping("/inactive")
    public List<UserDTO> getInactiveUsers() {
        return userService.getInactiveUsers();
    }

    @GetMapping("/filter")
    public List<UserDTO> getUsersWithFilters(
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String name) {
        return userService.getUsersWithFilters(active, name);
    }

    @PostMapping("/activate/{id}")
    public ApiResponse<UserDTO> activateUser(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String token) {
        return userService.changeUserActivation(id, stripBearerToken(token), true);
    }

    @PostMapping("/deactivate/{id}")
    public ApiResponse<UserDTO> deactivateUser(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String token) {
        return userService.changeUserActivation(id, stripBearerToken(token), false);
    }

    private String stripBearerToken(String token) {
        return token.startsWith("Bearer ") ? token.substring(7) : token;
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Integer id, @RequestBody String newRoleName) {
        userService.updateUserRole(id, newRoleName.toUpperCase());
        return ResponseEntity.ok("User role updated successfully.");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Integer userId) {
        UserDTO userDTO = userService.getUserById(userId);
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/{userId}/feedback")
    public ResponseEntity<String> saveFeedback(@PathVariable Integer userId, @RequestBody String feedback) {
        String response = userService.saveFeedback(userId, feedback);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/role")
    public ResponseEntity<?> deleteUserRole(@PathVariable Integer id) {
        userService.deleteUserRoleAndDeactivate(id);
        return ResponseEntity.ok("User role removed, reset to USER, and user deactivated.");
    }
}

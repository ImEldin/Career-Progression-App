package com.team5.career_progression_app.service;

import com.team5.career_progression_app.dto.ApiResponse;
import com.team5.career_progression_app.dto.UserDTO;
import com.team5.career_progression_app.exception.*;
import com.team5.career_progression_app.model.Permission;
import com.team5.career_progression_app.model.Review;
import com.team5.career_progression_app.model.User;
import com.team5.career_progression_app.repository.PermissionRepository;
import com.team5.career_progression_app.repository.ReviewRepository;
import com.team5.career_progression_app.repository.UserRepository;
import com.team5.career_progression_app.model.Role;
import com.team5.career_progression_app.repository.RoleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;
    private final JwtService jwtService;
    private final ReviewRepository reviewRepository;
    private final RoleRepository roleRepository;
    private final NotificationService notificationService;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::new)
                .toList();
    }

    public List<UserDTO> getInactiveUsers() {
        return userRepository.findByActiveFalse().stream()
                .map(UserDTO::new)
                .toList();
    }

    public List<UserDTO> getActiveUsers() {
        return userRepository.findByActiveTrue().stream()
                .map(UserDTO::new)
                .toList();
    }

    private void checkManageUsersPermission(String token) {
        Permission manageUsersPermission = permissionRepository.findByNameIgnoreCase("MANAGE_USERS")
                .orElseThrow(() -> new ResourceNotFoundException("Permission 'MANAGE_USERS' not found"));

        List<Integer> userPermissionIds = jwtService.extractPermissionIds(token);

        if (!userPermissionIds.contains(manageUsersPermission.getId())) {
            throw new AccessDeniedException("Access Denied - Permission 'MANAGE_USERS' is required");
        }
    }

    private String toggleUserActivation(Integer userId, boolean activate, String token) {
        checkManageUsersPermission(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(activate);
        userRepository.save(user);

        return "User " + user.getEmail() + " has been successfully " + (activate ? "activated" : "deactivated");
    }

    public ApiResponse<UserDTO> changeUserActivation(Integer userId, String token, boolean activate) {
        String message = toggleUserActivation(userId, activate, token);
        User user = userRepository.findById(userId).orElseThrow();
        return new ApiResponse<>(true, message, new UserDTO(user));
    }

    public List<UserDTO> getUsersWithFilters(Boolean active, String name) {
        List<User> filteredUsers = userRepository.filterUsers(active, name);
        return filteredUsers.stream()
                .map(UserDTO::new)
                .toList();
    }

    public UserDTO getUserById(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return new UserDTO(user);
    }

    public String saveFeedback(Integer userId, String feedback) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review review = new Review();
        review.setFeedback(feedback);
        review.setUser(user);

        reviewRepository.save(review);

        return "Feedback saved successfully";
    }
  
    public List<UserDTO> getUsersByPositions(List<Integer> positionIds) {
        List<User> users = userRepository.findByUserPositionsPositionIdIn(positionIds);
        return users.stream().map(UserDTO::new).collect(Collectors.toList());
    }

    public List<UserDTO> getUsersByTeamIds(List<Integer> teamIds) {
        List<User> users = userRepository.findUsersByTeamIds(teamIds);
        return users.stream()
                .map(UserDTO::new)
                .toList();
    }

    public List<UserDTO> getUsers(List<Integer> positionIds, List<Integer> teamIds) {
        List<User> users = userRepository.findUsersByFilters(positionIds, teamIds);
        return users.stream()
                .map(UserDTO::new)
                .toList();
    }
    public void updateUserRole(Integer userId, String roleName) {
        if ("ADMIN".equalsIgnoreCase(roleName)) {
            throw new ForbiddenRoleAssignmentException(roleName);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->  new UserNotFoundException(userId));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RoleNotFoundException(roleName));

        user.setRole(role);
        notificationService.notifyRoleChanged(user, role.getName());
        userRepository.save(user);
    }

    public void deleteUserRoleAndDeactivate(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role defaultRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Default USER role not found"));

        user.setRole(defaultRole);
        user.setActive(false);
        userRepository.save(user);
    }
}
